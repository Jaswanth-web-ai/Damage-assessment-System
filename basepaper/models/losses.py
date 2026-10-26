"""
Loss Functions and xBD Evaluation Metrics for BDANet
Implements the exact evaluation criteria used in the BDANet paper and the xView2 challenge.

Formulas:
- Building Localization F1 (F1_b): Precision, Recall, and F1 on binary mask
- Damage Assessment F1 (F1_d):
    Harmonic Mean = 4 / (1/F1_0 + 1/F1_1 + 1/F1_2 + 1/F1_3)
- Overall Score (F1_s):
    F1_s = 0.3 * F1_b + 0.7 * F1_d
"""

import numpy as np

def cross_entropy_loss(preds, targets, eps=1e-8):
    """
    preds: (B, C, H, W) normalized probabilities
    targets: (B, H, W) integer class labels [0, C-1]
    """
    B, C, H, W = preds.shape
    loss = 0.0
    for b in range(B):
        for c in range(C):
            mask = (targets[b] == c)
            if np.any(mask):
                loss -= np.sum(np.log(np.clip(preds[b, c, mask], eps, 1.0)))
    return loss / (B * H * W)

def dice_loss(preds, targets, eps=1e-6):
    """
    Binary Dice Loss for localization
    preds: (B, H, W) in [0, 1]
    targets: (B, H, W) binary {0, 1}
    """
    intersection = np.sum(preds * targets)
    cardinality = np.sum(preds) + np.sum(targets)
    return 1.0 - (2.0 * intersection + eps) / (cardinality + eps)

def calculate_localization_metrics(pred_mask, true_mask):
    """
    Binary building localization metrics.
    pred_mask, true_mask: boolean or {0, 1} binary arrays
    """
    pred_b = (pred_mask > 0).astype(bool)
    true_b = (true_mask > 0).astype(bool)
    
    tp = np.logical_and(pred_b, true_b).sum()
    fp = np.logical_and(pred_b, ~true_b).sum()
    fn = np.logical_and(~pred_b, true_b).sum()
    
    precision = tp / (tp + fp + 1e-8)
    recall = tp / (tp + fn + 1e-8)
    f1 = 2 * precision * recall / (precision + recall + 1e-8)
    
    return {
        "precision": float(precision),
        "recall": float(recall),
        "f1": float(f1)
    }

def calculate_damage_metrics(pred_dmg, true_dmg):
    """
    Damage classification metrics for classes:
    1: No damage
    2: Minor damage
    3: Major damage
    4: Destroyed
    
    Also computes Harmonic Mean F1_d and overall score F1_s.
    """
    class_names = {
        1: "No damage",
        2: "Minor damage",
        3: "Major damage",
        4: "Destroyed"
    }
    
    class_f1 = {}
    
    for c in [1, 2, 3, 4]:
        p_c = (pred_dmg == c)
        t_c = (true_dmg == c)
        
        tp = np.logical_and(p_c, t_c).sum()
        fp = np.logical_and(p_c, ~t_c).sum()
        fn = np.logical_and(~p_c, t_c).sum()
        
        prec = tp / (tp + fp + 1e-8)
        rec = tp / (tp + fn + 1e-8)
        f1 = 2 * prec * rec / (prec + rec + 1e-8)
        class_f1[c] = float(f1)
        
    # Harmonic mean of the 4 damage categories:
    recip_sum = sum(1.0 / (class_f1[c] + 1e-6) for c in [1, 2, 3, 4])
    f1_damage = 4.0 / recip_sum
    
    # Building localization score:
    loc_metrics = calculate_localization_metrics(pred_dmg > 0, true_dmg > 0)
    f1_building = loc_metrics["f1"]
    
    # Overall score F1_s:
    f1_overall = 0.3 * f1_building + 0.7 * f1_damage
    
    return {
        "f1_overall": float(f1_overall),
        "f1_building": float(f1_building),
        "f1_damage": float(f1_damage),
        "no_damage_f1": float(class_f1[1]),
        "minor_damage_f1": float(class_f1[2]),
        "major_damage_f1": float(class_f1[3]),
        "destroyed_f1": float(class_f1[4])
    }

def calculate_confusion_matrix(pred_dmg, true_dmg, num_classes=5):
    """
    Compute percentage confusion matrix for 5 classes:
    0: Background, 1: No damage, 2: Minor, 3: Major, 4: Destroyed
    Normalized per true class row as in Table VI.
    """
    cm = np.zeros((num_classes, num_classes), dtype=np.float64)
    for t in range(num_classes):
        t_mask = (true_dmg == t)
        total_true = t_mask.sum()
        if total_true > 0:
            for p in range(num_classes):
                cm[t, p] = np.logical_and(t_mask, pred_dmg == p).sum() / total_true * 100.0
    return cm
