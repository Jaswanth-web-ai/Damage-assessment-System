"""
Synthetic xBD Dataset Generator for BDANet
Generates realistic pairs of pre-disaster and post-disaster satellite imagery,
along with building localization masks and 4-tier damage classification masks.

Classes:
0: Background
1: No damage (Green)
2: Minor damage (Light yellow)
3: Major damage (Orange)
4: Destroyed (Red)
"""

import os
import json
import random
import numpy as np
from PIL import Image, ImageDraw, ImageFilter

DAMAGE_COLORS = {
    0: (10, 10, 80),      # Dark Blue - Background
    1: (46, 180, 50),     # Green - No damage
    2: (240, 230, 120),   # Light Yellow - Minor damage
    3: (255, 140, 0),     # Orange - Major damage
    4: (220, 30, 30)      # Red - Destroyed
}

CLASS_NAMES = {
    0: "Background",
    1: "No damage",
    2: "Minor damage",
    3: "Major damage",
    4: "Destroyed"
}

def create_terrain_texture(width=256, height=256, rng=None):
    """Generate satellite-like terrain background (vegetation, soil, roads)."""
    if rng is None:
        rng = np.random.RandomState()
    
    # Base terrain green/earth tones
    base_color = rng.randint(40, 75)
    terrain = np.zeros((height, width, 3), dtype=np.uint8)
    terrain[:, :, 0] = base_color + rng.randint(-15, 15, (height, width))
    terrain[:, :, 1] = base_color + rng.randint(10, 35, (height, width))
    terrain[:, :, 2] = base_color - rng.randint(10, 25, (height, width))
    
    img = Image.fromarray(np.clip(terrain, 0, 255).astype(np.uint8))
    img = img.filter(ImageFilter.GaussianBlur(radius=2))
    draw = ImageDraw.Draw(img)
    
    # Draw roads
    num_roads = rng.randint(1, 3)
    for _ in range(num_roads):
        x1, y1 = rng.randint(0, width), 0
        x2, y2 = rng.randint(0, width), height
        road_color = (rng.randint(70, 95), rng.randint(70, 95), rng.randint(70, 95))
        draw.line([(x1, y1), (x2, y2)], fill=road_color, width=rng.randint(6, 12))
    
    return np.array(img)

def generate_sample_pair(width=256, height=256, num_buildings=12, seed=None):
    """
    Generate a paired pre-disaster image, post-disaster image, 
    localization mask (binary), and damage mask (5-class).
    """
    rng = np.random.RandomState(seed)
    random.seed(seed)
    
    # 1. Base Pre-disaster terrain
    pre_img_arr = create_terrain_texture(width, height, rng)
    post_img_arr = pre_img_arr.copy()
    
    # Slight lighting/seasonal change in post image
    post_img_arr = np.clip(post_img_arr.astype(np.int16) + rng.randint(-15, 15), 0, 255).astype(np.uint8)
    
    pre_img = Image.fromarray(pre_img_arr)
    post_img = Image.fromarray(post_img_arr)
    pre_draw = ImageDraw.Draw(pre_img)
    post_draw = ImageDraw.Draw(post_img)
    
    # Masks
    loc_mask = np.zeros((height, width), dtype=np.uint8)
    dmg_mask = np.zeros((height, width), dtype=np.uint8)
    
    buildings_info = []
    
    # Generate building polygons
    for b_idx in range(num_buildings):
        bw = rng.randint(18, 38)
        bh = rng.randint(18, 38)
        bx = rng.randint(10, width - bw - 10)
        by = rng.randint(10, height - bh - 10)
        
        # Determine damage level (biased towards realistic distribution)
        # Class 1: No damage (40%), Class 2: Minor (25%), Class 3: Major (20%), Class 4: Destroyed (15%)
        p = rng.rand()
        if p < 0.35:
            dmg_level = 1 # No damage
        elif p < 0.60:
            dmg_level = 2 # Minor damage
        elif p < 0.85:
            dmg_level = 3 # Major damage
        else:
            dmg_level = 4 # Destroyed
            
        roof_color = (rng.randint(160, 220), rng.randint(80, 140), rng.randint(60, 100))
        poly = [(bx, by), (bx + bw, by), (bx + bw, by + bh), (bx, by + bh)]
        
        # Pre-disaster: intact building
        pre_draw.polygon(poly, fill=roof_color, outline=(40, 40, 40))
        
        # Fill localization mask
        loc_mask[by:by+bh, bx:bx+bw] = 1
        dmg_mask[by:by+bh, bx:bx+bw] = dmg_level
        
        # Post-disaster appearance based on damage level
        if dmg_level == 1:
            # Undamaged: identical building with slight dust
            post_draw.polygon(poly, fill=roof_color, outline=(40, 40, 40))
        elif dmg_level == 2:
            # Minor damage: partial discoloration, roof cracks
            minor_roof = (roof_color[0] - 25, roof_color[1] - 20, roof_color[2] - 15)
            post_draw.polygon(poly, fill=minor_roof, outline=(50, 45, 40))
            # small crack / debris
            cx, cy = bx + bw//2, by + bh//2
            post_draw.line([(bx+4, by+4), (cx, cy), (bx+bw-4, by+bh-4)], fill=(40, 40, 40), width=2)
        elif dmg_level == 3:
            # Major damage: partial roof collapse, rubble
            post_draw.polygon(poly, fill=(110, 100, 90), outline=(30, 30, 30))
            # rubble patches
            rx, ry = bx + rng.randint(2, bw//2), by + rng.randint(2, bh//2)
            post_draw.rectangle([rx, ry, rx + bw//2, ry + bh//2], fill=(60, 50, 40))
        elif dmg_level == 4:
            # Destroyed: completely flattened, cratered/charred rubble
            post_draw.polygon(poly, fill=(65, 55, 50), outline=(20, 20, 20))
            post_draw.ellipse([bx+2, by+2, bx+bw-2, by+bh-2], fill=(45, 40, 35))
            
        buildings_info.append({
            "id": b_idx,
            "bbox": [bx, by, bw, bh],
            "damage_level": dmg_level,
            "damage_name": CLASS_NAMES[dmg_level]
        })
        
    return {
        "pre_image": np.array(pre_img),
        "post_image": np.array(post_img),
        "loc_mask": loc_mask,
        "dmg_mask": dmg_mask,
        "metadata": buildings_info
    }

def generate_dataset(output_dir, num_train=40, num_test=10, img_size=256):
    """Generate complete synthetic dataset split into train and test sets."""
    for split, count in [("train", num_train), ("test", num_test)]:
        img_dir = os.path.join(output_dir, split, "images")
        tgt_dir = os.path.join(output_dir, split, "targets")
        os.makedirs(img_dir, exist_ok=True)
        os.makedirs(tgt_dir, exist_ok=True)
        
        index_list = []
        for i in range(count):
            seed = 1000 + i if split == "train" else 5000 + i
            sample = generate_sample_pair(img_size, img_size, num_buildings=random.randint(8, 16), seed=seed)
            
            sample_id = f"disaster_{split}_{i:03d}"
            pre_path = os.path.join(img_dir, f"{sample_id}_pre_disaster.png")
            post_path = os.path.join(img_dir, f"{sample_id}_post_disaster.png")
            loc_path = os.path.join(tgt_dir, f"{sample_id}_target_loc.png")
            dmg_path = os.path.join(tgt_dir, f"{sample_id}_target_dmg.png")
            meta_path = os.path.join(tgt_dir, f"{sample_id}_meta.json")
            
            Image.fromarray(sample["pre_image"]).save(pre_path)
            Image.fromarray(sample["post_image"]).save(post_path)
            Image.fromarray(sample["loc_mask"] * 255).save(loc_path)
            Image.fromarray(sample["dmg_mask"]).save(dmg_path)
            
            with open(meta_path, "w") as f:
                json.dump(sample["metadata"], f, indent=2)
                
            index_list.append({
                "id": sample_id,
                "pre_image": os.path.relpath(pre_path, output_dir),
                "post_image": os.path.relpath(post_path, output_dir),
                "loc_target": os.path.relpath(loc_path, output_dir),
                "dmg_target": os.path.relpath(dmg_path, output_dir)
            })
            
        with open(os.path.join(output_dir, f"{split}_manifest.json"), "w") as f:
            json.dump(index_list, f, indent=2)
            
    print(f"Dataset generated successfully at: {output_dir}")
    print(f"Train samples: {num_train}, Test samples: {num_test}")

if __name__ == "__main__":
    out_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), "data")
    generate_dataset(out_dir, num_train=30, num_test=10, img_size=256)
