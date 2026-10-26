import os
import json
import numpy as np
from PIL import Image

data_dir = r"d:\DisasterAid\basepaper\dataset\data"

print("=" * 60)
print("SYNTHETIC xBD DATASET VERIFICATION & STATISTICAL ANALYSIS")
print("=" * 60)

stats = {}

for split in ["train", "test"]:
    manifest_path = os.path.join(data_dir, f"{split}_manifest.json")
    with open(manifest_path) as f:
        manifest = json.load(f)
        
    total_buildings = 0
    building_damage_counts = {1: 0, 2: 0, 3: 0, 4: 0}
    damage_pixel_counts = {0: 0, 1: 0, 2: 0, 3: 0, 4: 0}
    loc_pixel_counts = {0: 0, 255: 0}
    
    img_shapes = set()
    
    for item in manifest:
        # Check images
        pre_p = os.path.join(data_dir, item["pre_image"])
        post_p = os.path.join(data_dir, item["post_image"])
        loc_p = os.path.join(data_dir, item["loc_target"])
        dmg_p = os.path.join(data_dir, item["dmg_target"])
        meta_p = os.path.join(data_dir, split, "targets", f"{item['id']}_meta.json")
        
        pre_img = Image.open(pre_p)
        post_img = Image.open(post_p)
        loc_img = Image.open(loc_p)
        dmg_img = Image.open(dmg_p)
        
        img_shapes.add(pre_img.size)
        img_shapes.add(post_img.size)
        img_shapes.add(loc_img.size)
        img_shapes.add(dmg_img.size)
        
        with open(meta_p) as mf:
            meta = json.load(mf)
        total_buildings += len(meta)
        for b in meta:
            building_damage_counts[b["damage_level"]] += 1
            
        dmg_arr = np.array(dmg_img)
        loc_arr = np.array(loc_img)
        
        for c in range(5):
            damage_pixel_counts[c] += int(np.sum(dmg_arr == c))
            
        loc_pixel_counts[0] += int(np.sum(loc_arr == 0))
        loc_pixel_counts[255] += int(np.sum(loc_arr == 255))
        
    stats[split] = {
        "num_samples": len(manifest),
        "shapes": list(img_shapes),
        "total_buildings": total_buildings,
        "avg_buildings_per_image": total_buildings / len(manifest),
        "building_damage_counts": building_damage_counts,
        "damage_pixel_counts": damage_pixel_counts,
        "loc_pixel_counts": loc_pixel_counts
    }
    
    print(f"\n[Split: {split.upper()}]")
    print(f"  - Sample count: {len(manifest)}")
    print(f"  - Image resolutions verified: {list(img_shapes)}")
    print(f"  - Total buildings generated: {total_buildings} (avg {total_buildings/len(manifest):.1f}/image)")
    print(f"  - Building breakdown by damage level:")
    for dl, count in building_damage_counts.items():
        name = ["No damage", "Minor damage", "Major damage", "Destroyed"][dl - 1]
        print(f"      Tier {dl} ({name}): {count} buildings ({count/total_buildings*100:.1f}%)")
    total_px = sum(damage_pixel_counts.values())
    print(f"  - Damage mask pixel breakdown:")
    tier_names = {0: "Background", 1: "No damage", 2: "Minor damage", 3: "Major damage", 4: "Destroyed"}
    for dl, px in damage_pixel_counts.items():
        print(f"      Class {dl} ({tier_names[dl]}): {px:,} px ({px/total_px*100:.2f}%)")
    print(f"  - Localization mask building pixels: {loc_pixel_counts[255]:,} px ({loc_pixel_counts[255]/total_px*100:.2f}%)")

with open(r"d:\DisasterAid\basepaper\dataset\data\dataset_stats.json", "w") as f:
    json.dump(stats, f, indent=2)
print("\nStats successfully exported to dataset_stats.json!")
