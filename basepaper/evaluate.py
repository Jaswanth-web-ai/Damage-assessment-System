"""
Evaluation and Inference Script for BDANet
Computes complete quantitative metrics on test data and exports visual predictions
with the exact color mapping specified in the base paper.

Colors:
- Background: Dark Blue (10, 10, 80)
- No damage: Green (46, 180, 50)
- Minor damage: Light Yellow (240, 230, 120)
- Major damage: Orange (255, 140, 0)
- Destroyed: Red (220, 30, 30)
"""

import os
import json
import numpy as np
from PIL import Image
from dataset.dataset_loader import XBDDataset
from models.bdanet_model import BDANetStage1Localization, BDANetStage2Assessment
from models.losses import calculate_damage_metrics, calculate_confusion_matrix

DAMAGE_COLOR_PALETTE = {
    0: (10, 10, 80),      # Dark Blue - Background
    1: (46, 180, 50),     # Green - No damage
    2: (240, 230, 120),   # Light Yellow - Minor damage
    3: (255, 140, 0),     # Orange - Major damage
    4: (220, 30, 30)      # Red - Destroyed
}

def colorize_damage_map(mask):
    """Convert integer damage mask (H, W) to RGB image (H, W, 3) using paper color coding."""
    H, W = mask.shape
    rgb = np.zeros((H, W, 3), dtype=np.uint8)
    for c, color in DAMAGE_COLOR_PALETTE.items():
        rgb[mask == c] = color
    return rgb

def evaluate_model(data_dir, s1_weights_path, s2_weights_path, output_dir):
    print("=" * 65)
    print("  BDANet Test Evaluation & Visualization")
    print("=" * 65)
    
    test_dataset = XBDDataset(data_dir=data_dir, split="test", use_cutmix=False)
    
    # Initialize models
    s1_model = BDANetStage1Localization(in_channels=3, base_channels=24, seed=42)
    if os.path.exists(s1_weights_path):
        w1 = np.load(s1_weights_path, allow_pickle=True).item()
        for k in ["w_enc1", "b_enc1", "w_enc2", "b_enc2", "w_bottleneck", "b_bottleneck", "w_dec2", "b_dec2", "w_dec1", "b_dec1", "w_head", "b_head"]:
            setattr(s1_model, k, w1[k])
            
    s2_model = BDANetStage2Assessment(in_channels=3, base_channels=24, num_classes=5, seed=42)
    if os.path.exists(s2_weights_path):
        w2 = np.load(s2_weights_path, allow_pickle=True).item()
        for k in ["w_enc1", "b_enc1", "w_enc2", "b_enc2", "w_bottleneck", "b_bottleneck", "w_dec2", "b_dec2", "w_dec1", "b_dec1", "w_head", "b_head"]:
            setattr(s2_model, k, w2[k])
            
    pred_dir = os.path.join(output_dir, "predictions")
    os.makedirs(pred_dir, exist_ok=True)
    
    all_preds = []
    all_targets = []
    
    for i in range(len(test_dataset)):
        sample = test_dataset.get_sample(i)
        pre_img = sample["pre_image"][np.newaxis, ...]
        post_img = sample["post_image"][np.newaxis, ...]
        dmg_true = sample["dmg_mask"]
        sample_id = sample["id"]
        
        # Inference
        _, loc_probs = s1_model.forward(pre_img)
        _, dmg_pred = s2_model.forward(pre_img, post_img, stage1_loc_probs=loc_probs)
        
        pred_map = dmg_pred[0]
        all_preds.append(pred_map)
        all_targets.append(dmg_true)
        
        # Colorize and save visual comparison (Pre, Post, GT, Pred)
        pre_rgb = (np.transpose(sample["pre_image"], (1, 2, 0)) * 255).astype(np.uint8)
        post_rgb = (np.transpose(sample["post_image"], (1, 2, 0)) * 255).astype(np.uint8)
        gt_color = colorize_damage_map(dmg_true)
        pred_color = colorize_damage_map(pred_map)
        
        # Side-by-side composite
        H, W, _ = pre_rgb.shape
        composite = np.zeros((H, W * 4, 3), dtype=np.uint8)
        composite[:, 0:W] = pre_rgb
        composite[:, W:2*W] = post_rgb
        composite[:, 2*W:3*W] = gt_color
        composite[:, 3*W:4*W] = pred_color
        
        Image.fromarray(composite).save(os.path.join(pred_dir, f"{sample_id}_comparison.png"))
        Image.fromarray(pred_color).save(os.path.join(pred_dir, f"{sample_id}_prediction.png"))
        
    all_preds_cat = np.stack(all_preds, axis=0)
    all_targets_cat = np.stack(all_targets, axis=0)
    
    metrics = calculate_damage_metrics(all_preds_cat, all_targets_cat)
    cm = calculate_confusion_matrix(all_preds_cat, all_targets_cat)
    
    print("\n--- Test Set Evaluation Results ---")
    print(f"Overall F1 Score (F1_s) : {metrics['f1_overall']:.4f}")
    print(f"Building F1 Score (F1_b): {metrics['f1_building']:.4f}")
    print(f"Damage F1 Score (F1_d)  : {metrics['f1_damage']:.4f}")
    print(f"  - No Damage F1        : {metrics['no_damage_f1']:.4f}")
    print(f"  - Minor Damage F1     : {metrics['minor_damage_f1']:.4f}")
    print(f"  - Major Damage F1     : {metrics['major_damage_f1']:.4f}")
    print(f"  - Destroyed F1        : {metrics['destroyed_f1']:.4f}")
    
    return metrics, cm

if __name__ == "__main__":
    base_dir = os.path.dirname(os.path.abspath(__file__))
    data_dir = os.path.join(base_dir, "dataset", "data")
    s1_weights = os.path.join(base_dir, "models", "stage1_weights.npy")
    s2_weights = os.path.join(base_dir, "models", "stage2_weights.npy")
    out_dir = os.path.join(base_dir, "outputs")
    evaluate_model(data_dir, s1_weights, s2_weights, out_dir)
