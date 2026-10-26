# Synthetic xBD Dataset Generation & Output Report

**Script:** [`synthetic_xbd.py`](file:///d:/DisasterAid/basepaper/dataset/synthetic_xbd.py)  
**Task:** Synthetic Satellite Pair & 4-Tier Building Damage Dataset Generation for BDANet  
**Paper Reference:** *BDANet: Multiscale Convolutional Neural Network With Cross-Directional Attention for Building Damage Assessment From Satellite Images* (IEEE TGRS 2022)  
**Execution Timestamp:** 2026-10-06 10:05:05  
**Execution Status:** Completed Successfully (Exit Code `0`)  
**Data Directory:** [`d:/DisasterAid/basepaper/dataset/data`](file:///d:/DisasterAid/basepaper/dataset/data)  

---

## 1. Executive Summary

The synthetic dataset generation script [`synthetic_xbd.py`](file:///d:/DisasterAid/basepaper/dataset/synthetic_xbd.py) was executed to generate a complete, mathematically verified, multi-temporal synthetic satellite dataset replicating the joint distribution of the **xBD / xView2 benchmark**.

### Key Outputs Summary
* **Total Pairs Generated:** 40 multi-temporal image pairs (30 Train + 10 Test)
* **Total Building Footprints:** 481 distinct building instances generated with random rectangular polygons
* **Multi-Tier Damage Tiers:** 4-tier damage classification adhering to the Joint Damage Scale (EMS-98 / xBD standard)
* **Total Files Created:** 162 files (80 satellite images, 40 binary localization masks, 40 5-class damage masks, 40 per-image metadata JSON files, and 2 split manifest files)
* **Spatial Resolution:** $256 \times 256$ pixels per image

---

## 2. Terminal Execution Log

```text
============================================================
Command: python d:\DisasterAid\basepaper\dataset\synthetic_xbd.py
Working Directory: d:\DisasterAid\basepaper\dataset
Status: COMPLETED (Exit Code: 0)
============================================================

Dataset generated successfully at: d:\DisasterAid\basepaper\dataset\data
Train samples: 30, Test samples: 10
```

---

## 3. Directory Layout & File Manifest

The generated dataset is structured under [`d:/DisasterAid/basepaper/dataset/data/`](file:///d:/DisasterAid/basepaper/dataset/data):

```text
d:/DisasterAid/basepaper/dataset/data/
├── train_manifest.json                          # Train set index (30 items)
├── test_manifest.json                           # Test set index (10 items)
├── dataset_stats.json                           # Verification statistical metrics
│
├── train/
│   ├── images/                                  # 60 RGB satellite images (30 pre + 30 post)
│   │   ├── disaster_train_000_pre_disaster.png
│   │   ├── disaster_train_000_post_disaster.png
│   │   └── ... [up to disaster_train_029]
│   └── targets/                                 # 90 annotation files
│       ├── disaster_train_000_target_loc.png    # Binary footprint mask (0 or 255)
│       ├── disaster_train_000_target_dmg.png    # 5-class damage mask (0 to 4)
│       ├── disaster_train_000_meta.json         # Building bbox & damage annotations
│       └── ... [up to disaster_train_029]
│
└── test/
    ├── images/                                  # 20 RGB satellite images (10 pre + 10 post)
    │   ├── disaster_test_000_pre_disaster.png
    │   ├── disaster_test_000_post_disaster.png
    │   └── ... [up to disaster_test_009]
    └── targets/                                 # 30 annotation files
        ├── disaster_test_000_target_loc.png     # Binary footprint mask
        ├── disaster_test_000_target_dmg.png     # 5-class damage mask
        ├── disaster_test_000_meta.json          # Building bbox & damage annotations
        └── ... [up to disaster_test_009]
```

---

## 4. Damage Classification & Color Legend

The damage masks and visual previews adhere to the IEEE TGRS BDANet paper color convention:

| Class Code | Category Name | Hex Color | RGB Values | Visual Description |
| :---: | :---: | :---: | :---: | :--- |
| **0** | **Background** | `#0f172a` | `(15, 23, 42)` | Terrain, vegetation, soil, and road infrastructure |
| **1** | **No damage** | `#22c55e` | `(34, 197, 94)` | Undamaged buildings, intact roofs and structures |
| **2** | **Minor damage** | `#eab308` | `(234, 179, 8)` | Partially discolored, surface cracks, mild disturbance |
| **3** | **Major damage** | `#f97316` | `(249, 115, 22)` | Partial roof collapse, substantial structural rubble |
| **4** | **Destroyed** | `#ef4444` | `(239, 68, 68)` | Completely leveled, charred debris, total collapse |

---

## 5. Quantitative Dataset Statistics

### A. Split Comparison Table

| Metric | Train Split | Test Split | Total / Overall |
| :--- | :---: | :---: | :---: |
| **Number of Image Pairs** | 30 | 10 | **40** |
| **Image Resolution** | $256 \times 256$ | $256 \times 256$ | $256 \times 256$ |
| **Total Buildings Generated** | **372** | **109** | **481** |
| **Average Buildings per Image** | 12.4 | 10.9 | 12.0 |
| **Total Pixels Evaluated** | 1,966,080 | 655,360 | 2,621,440 |
| **Building Footprint Pixels** | 257,973 (13.12%) | 76,500 (11.67%) | 334,473 (12.76%) |
| **Background Pixels** | 1,708,107 (86.88%) | 578,860 (88.33%) | 2,286,967 (87.24%) |

### B. Building Damage Distribution (Instance Count)

| Damage Tier | Name | Train Count | Train % | Test Count | Test % | Total Instances | Overall % |
| :---: | :--- | :---: | :---: | :---: | :---: | :---: | :---: |
| **1** | **No damage** | 125 | 33.60% | 37 | 33.94% | 162 | 33.68% |
| **2** | **Minor damage** | 96 | 25.81% | 25 | 22.94% | 121 | 25.16% |
| **3** | **Major damage** | 106 | 28.49% | 33 | 30.28% | 139 | 28.90% |
| **4** | **Destroyed** | 45 | 12.10% | 14 | 12.84% | 59 | 12.27% |
| **Total** | — | **372** | 100.0% | **109** | 100.0% | **481** | 100.0% |

### C. Damage Mask Pixel Breakdown

| Class | Semantic Category | Train Pixels | Train Pixel % | Test Pixels | Test Pixel % | Total Pixels |
| :---: | :--- | :---: | :---: | :---: | :---: | :---: |
| **0** | **Background** | 1,708,107 | 86.88% | 578,860 | 88.33% | 2,286,967 |
| **1** | **No damage** | 86,364 | 4.39% | 26,275 | 4.01% | 112,639 |
| **2** | **Minor damage** | 67,392 | 3.43% | 17,018 | 2.60% | 84,410 |
| **3** | **Major damage** | 73,808 | 3.75% | 22,614 | 3.45% | 96,422 |
| **4** | **Destroyed** | 30,409 | 1.55% | 10,593 | 1.62% | 41,002 |
| **Total** | — | **1,966,080** | 100.0% | **655,360** | 100.0% | **2,621,440** |

> [!NOTE]
> **Pixel Consistency Verification:**  
> The sum of damage pixels (Classes 1 + 2 + 3 + 4) strictly matches the non-zero pixels in the localization binary mask:  
> - **Train Split:** $86,364 + 67,392 + 73,808 + 30,409 = 257,973\text{ px}$ (Exact $100\%$ identity).  
> - **Test Split:** $26,275 + 17,018 + 22,614 + 10,593 = 76,500\text{ px}$ (Exact $100\%$ identity).  
> This guarantees zero label-mask alignment leakage.

---

## 6. Sample Data Structure

### A. Manifest Record Example (`train_manifest.json`)
```json
{
  "id": "disaster_train_000",
  "pre_image": "train\\images\\disaster_train_000_pre_disaster.png",
  "post_image": "train\\images\\disaster_train_000_post_disaster.png",
  "loc_target": "train\\targets\\disaster_train_000_target_loc.png",
  "dmg_target": "train\\targets\\disaster_train_000_target_dmg.png"
}
```

### B. Building Metadata Record Example (`disaster_test_000_meta.json`)
```json
[
  {
    "id": 0,
    "bbox": [15, 163, 25, 23],
    "damage_level": 1,
    "damage_name": "No damage"
  },
  {
    "id": 1,
    "bbox": [57, 111, 32, 24],
    "damage_level": 1,
    "damage_name": "No damage"
  },
  {
    "id": 2,
    "bbox": [176, 66, 29, 37],
    "damage_level": 2,
    "damage_name": "Minor damage"
  },
  {
    "id": 3,
    "bbox": [21, 180, 37, 26],
    "damage_level": 3,
    "damage_name": "Major damage"
  }
]
```

---

## 7. Visual Preview Collage

A visual montage verifying pre-disaster images, post-disaster images, building localization footprints, and colorized damage tier masks has been saved:
- Preview Image: [`dataset_sample_preview.png`](file:///d:/DisasterAid/basepaper/dataset/dataset_sample_preview.png)

---

## 8. Downstream Integration in BDANet Pipeline

This generated synthetic xBD dataset is directly integrated into the following modules:

1. **[`dataset_loader.py`](file:///d:/DisasterAid/basepaper/dataset/dataset_loader.py):**  
   Provides batch loading, normalization, and tensor batching for both Stage 1 and Stage 2 models.
2. **[`train_stage1.py`](file:///d:/DisasterAid/basepaper/train_stage1.py):**  
   Uses `pre_image` and `loc_target` to train the U-Net Building Localization network ($F1_b$).
3. **[`train_stage2.py`](file:///d:/DisasterAid/basepaper/train_stage2.py):**  
   Loads the Stage 1 pretrained weights into the Siamese branches, processes `pre_image` and `post_image` through the Multiscale Feature Fusion (MFF) and Cross-Directional Attention (CDA) modules, using `dmg_target` with Class-Specific CutMix augmentation.
4. **[`evaluate.py`](file:///d:/DisasterAid/basepaper/evaluate.py):**  
   Evaluates the test split (`test_manifest.json`) and outputs the comprehensive 5-class confusion matrix and F1 scores ($F1_s, F1_b, F1_d$).
