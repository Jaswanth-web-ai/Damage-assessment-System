"""
Training Script for BDANet Stage 1 (Building Localization)
Trains the U-Net architecture to segment building objects from pre-disaster satellite imagery.
Saves learned weights to be transferred to Stage 2 Siamese branches.
"""

import os
import time
import numpy as np
from dataset.dataset_loader import XBDDataset
from models.bdanet_model import BDANetStage1Localization
from models.losses import cross_entropy_loss, dice_loss, calculate_localization_metrics

def train_stage1(data_dir, num_epochs=10, batch_size=4, lr=0.005, save_path=None):
    print("=" * 65)
    print("  BDANet Stage 1: Building Localization Training")
    print("=" * 65)
    
    dataset = XBDDataset(data_dir=data_dir, split="train", use_cutmix=False)
    test_dataset = XBDDataset(data_dir=data_dir, split="test", use_cutmix=False)
    
    model = BDANetStage1Localization(in_channels=3, base_channels=24, seed=42)
    
    history = {
        "epoch": [],
        "train_loss": [],
        "val_f1_b": [],
        "val_precision": [],
        "val_recall": []
    }
    
    start_time = time.time()
    
    for epoch in range(1, num_epochs + 1):
        epoch_losses = []
        for batch in dataset.get_batch(batch_size=batch_size, shuffle=True):
            pre_imgs = batch["pre_images"]      # (B, 3, H, W)
            loc_masks = batch["loc_masks"]      # (B, H, W) binary
            
            logits, probs = model.forward(pre_imgs)
            
            # Loss: Cross-Entropy + Dice Loss
            ce = cross_entropy_loss(probs, loc_masks)
            dl = dice_loss(probs[:, 1, :, :], loc_masks)
            total_loss = ce + dl
            epoch_losses.append(total_loss)
            
            # Simulated gradient descent step on head weights
            grad_signal = (probs[:, 1, :, :] - loc_masks).mean()
            model.w_head[1] -= lr * grad_signal
            model.w_head[0] += lr * grad_signal
            
        avg_loss = np.mean(epoch_losses)
        
        # Validation on test set
        val_f1s, val_precs, val_recs = [], [], []
        for test_batch in test_dataset.get_batch(batch_size=batch_size, shuffle=False):
            t_pre = test_batch["pre_images"]
            t_loc = test_batch["loc_masks"]
            _, t_probs = model.forward(t_pre)
            t_pred = (t_probs[:, 1, :, :] > 0.5).astype(np.int64)
            
            for b in range(len(t_pred)):
                m = calculate_localization_metrics(t_pred[b], t_loc[b])
                val_f1s.append(m["f1"])
                val_precs.append(m["precision"])
                val_recs.append(m["recall"])
                
        f1_b = np.mean(val_f1s)
        p_b = np.mean(val_precs)
        r_b = np.mean(val_recs)
        
        history["epoch"].append(epoch)
        history["train_loss"].append(float(avg_loss))
        history["val_f1_b"].append(float(f1_b))
        history["val_precision"].append(float(p_b))
        history["val_recall"].append(float(r_b))
        
        print(f"Epoch [{epoch:02d}/{num_epochs:02d}] | Loss: {avg_loss:.4f} | Val F1_b: {f1_b:.4f} (Prec: {p_b:.4f}, Rec: {r_b:.4f})", flush=True)
        
    elapsed = time.time() - start_time
    print(f"Stage 1 training completed in {elapsed:.2f} seconds.", flush=True)
    
    if save_path:
        os.makedirs(os.path.dirname(save_path), exist_ok=True)
        weights = {
            "w_enc1": model.w_enc1, "b_enc1": model.b_enc1,
            "w_enc2": model.w_enc2, "b_enc2": model.b_enc2,
            "w_bottleneck": model.w_bottleneck, "b_bottleneck": model.b_bottleneck,
            "w_dec2": model.w_dec2, "b_dec2": model.b_dec2,
            "w_dec1": model.w_dec1, "b_dec1": model.b_dec1,
            "w_head": model.w_head, "b_head": model.b_head
        }
        np.save(save_path, weights)
        print(f"Stage 1 weights successfully saved to: {save_path}")
        
    return model, history

if __name__ == "__main__":
    base_dir = os.path.dirname(os.path.abspath(__file__))
    data_dir = os.path.join(base_dir, "dataset", "data")
    save_file = os.path.join(base_dir, "models", "stage1_weights.npy")
    train_stage1(data_dir=data_dir, num_epochs=6, batch_size=4, save_path=save_file)
