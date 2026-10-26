"""
Training Script for BDANet Stage 2 (Building Damage Assessment)
Paper: "BDANet: Multiscale Convolutional Neural Network With Cross-Directional
Attention for Building Damage Assessment From Satellite Images", IEEE TGRS 2022.

Key features:
- Dual-branch Siamese network for pre- and post-disaster images
- Weight initialization transferred from Stage 1 localization model
- Multiscale Feature Fusion (MFF) and Cross-Directional Attention (CDA)
- Class-specific CutMix data augmentation for difficult damage levels
"""

import os
import time
import numpy as np
from dataset.dataset_loader import XBDDataset
from models.bdanet_model import BDANetStage1Localization, BDANetStage2Assessment
from models.losses import cross_entropy_loss, calculate_damage_metrics

def train_stage2(data_dir, stage1_weights_path=None, num_epochs=10, batch_size=4, lr=0.005, save_path=None):
    print("=" * 65)
    print("  BDANet Stage 2: Building Damage Assessment Training")
    print("=" * 65)
    
    train_dataset = XBDDataset(data_dir=data_dir, split="train", use_cutmix=True, cutmix_prob=0.6)
    test_dataset = XBDDataset(data_dir=data_dir, split="test", use_cutmix=False)
    
    # Initialize Stage 1 model to provide localization guidance & weights
    stage1_model = BDANetStage1Localization(in_channels=3, base_channels=24, seed=42)
    if stage1_weights_path and os.path.exists(stage1_weights_path):
        w = np.load(stage1_weights_path, allow_pickle=True).item()
        stage1_model.w_enc1 = w["w_enc1"]
        stage1_model.b_enc1 = w["b_enc1"]
        stage1_model.w_enc2 = w["w_enc2"]
        stage1_model.b_enc2 = w["b_enc2"]
        stage1_model.w_bottleneck = w["w_bottleneck"]
        stage1_model.b_bottleneck = w["b_bottleneck"]
        stage1_model.w_dec2 = w["w_dec2"]
        stage1_model.b_dec2 = w["b_dec2"]
        stage1_model.w_dec1 = w["w_dec1"]
        stage1_model.b_dec1 = w["b_dec1"]
        stage1_model.w_head = w["w_head"]
        stage1_model.b_head = w["b_head"]
        print("Loaded Stage 1 weights successfully.")
    
    # Initialize Stage 2 model and transfer weights
    stage2_model = BDANetStage2Assessment(in_channels=3, base_channels=24, num_classes=5, seed=42)
    stage2_model.load_stage1_weights(stage1_model)
    
    history = {
        "epoch": [],
        "train_loss": [],
        "val_f1_overall": [],
        "val_f1_building": [],
        "val_f1_damage": [],
        "val_no_dmg_f1": [],
        "val_minor_f1": [],
        "val_major_f1": [],
        "val_destroyed_f1": []
    }
    
    start_time = time.time()
    
    for epoch in range(1, num_epochs + 1):
        epoch_losses = []
        for batch in train_dataset.get_batch(batch_size=batch_size, shuffle=True):
            pre_imgs = batch["pre_images"]      # (B, 3, H, W)
            post_imgs = batch["post_images"]    # (B, 3, H, W)
            dmg_masks = batch["dmg_masks"]      # (B, H, W) 0..4
            
            # Stage 1 localization prediction
            _, loc_probs = stage1_model.forward(pre_imgs)
            
            # Stage 2 damage prediction guided by Stage 1
            dmg_probs, preds = stage2_model.forward(pre_imgs, post_imgs, stage1_loc_probs=loc_probs)
            
            # Loss computation
            loss = cross_entropy_loss(dmg_probs, dmg_masks)
            epoch_losses.append(loss)
            
            # Optimization step on damage classifier head
            for c in range(5):
                grad = (dmg_probs[:, c, :, :] - (dmg_masks == c).astype(np.float32)).mean()
                stage2_model.w_head[c] -= lr * grad
                
        avg_loss = np.mean(epoch_losses)
        
        # Validation on test set
        all_preds = []
        all_targets = []
        for test_batch in test_dataset.get_batch(batch_size=batch_size, shuffle=False):
            t_pre = test_batch["pre_images"]
            t_post = test_batch["post_images"]
            t_dmg = test_batch["dmg_masks"]
            
            _, t_loc_probs = stage1_model.forward(t_pre)
            _, t_preds = stage2_model.forward(t_pre, t_post, stage1_loc_probs=t_loc_probs)
            
            all_preds.append(t_preds)
            all_targets.append(t_dmg)
            
        all_preds_cat = np.concatenate(all_preds, axis=0)
        all_targets_cat = np.concatenate(all_targets, axis=0)
        
        val_metrics = calculate_damage_metrics(all_preds_cat, all_targets_cat)
        
        history["epoch"].append(epoch)
        history["train_loss"].append(float(avg_loss))
        history["val_f1_overall"].append(val_metrics["f1_overall"])
        history["val_f1_building"].append(val_metrics["f1_building"])
        history["val_f1_damage"].append(val_metrics["f1_damage"])
        history["val_no_dmg_f1"].append(val_metrics["no_damage_f1"])
        history["val_minor_f1"].append(val_metrics["minor_damage_f1"])
        history["val_major_f1"].append(val_metrics["major_damage_f1"])
        history["val_destroyed_f1"].append(val_metrics["destroyed_f1"])
        
        print(f"Epoch [{epoch:02d}/{num_epochs:02d}] | Loss: {avg_loss:.4f} | F1_s: {val_metrics['f1_overall']:.4f} | "
              f"F1_b: {val_metrics['f1_building']:.4f} | F1_d: {val_metrics['f1_damage']:.4f} | "
              f"NoDmg: {val_metrics['no_damage_f1']:.3f}, Min: {val_metrics['minor_damage_f1']:.3f}, "
              f"Maj: {val_metrics['major_damage_f1']:.3f}, Des: {val_metrics['destroyed_f1']:.3f}", flush=True)
              
    elapsed = time.time() - start_time
    print(f"Stage 2 training completed in {elapsed:.2f} seconds.", flush=True)
    
    if save_path:
        os.makedirs(os.path.dirname(save_path), exist_ok=True)
        weights = {
            "w_enc1": stage2_model.w_enc1, "b_enc1": stage2_model.b_enc1,
            "w_enc2": stage2_model.w_enc2, "b_enc2": stage2_model.b_enc2,
            "w_bottleneck": stage2_model.w_bottleneck, "b_bottleneck": stage2_model.b_bottleneck,
            "w_dec2": stage2_model.w_dec2, "b_dec2": stage2_model.b_dec2,
            "w_dec1": stage2_model.w_dec1, "b_dec1": stage2_model.b_dec1,
            "w_head": stage2_model.w_head, "b_head": stage2_model.b_head
        }
        np.save(save_path, weights)
        print(f"Stage 2 weights saved to: {save_path}")
        
    return stage2_model, history

if __name__ == "__main__":
    base_dir = os.path.dirname(os.path.abspath(__file__))
    data_dir = os.path.join(base_dir, "dataset", "data")
    s1_weights = os.path.join(base_dir, "models", "stage1_weights.npy")
    s2_weights = os.path.join(base_dir, "models", "stage2_weights.npy")
    train_stage2(data_dir=data_dir, stage1_weights_path=s1_weights, num_epochs=6, batch_size=4, save_path=s2_weights)
