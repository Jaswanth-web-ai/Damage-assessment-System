import os
import numpy as np
from PIL import Image, ImageDraw, ImageFont

data_dir = r"d:\DisasterAid\basepaper\dataset\data"
out_img_path = r"d:\DisasterAid\basepaper\dataset\dataset_sample_preview.png"

# Damage palette
PALETTE = {
    0: (15, 23, 42),      # Dark Slate Background
    1: (34, 197, 94),     # Emerald Green - No damage
    2: (234, 179, 8),     # Yellow - Minor damage
    3: (249, 115, 22),    # Orange - Major damage
    4: (239, 68, 68)      # Red - Destroyed
}

def colorize_damage(dmg_arr):
    h, w = dmg_arr.shape
    rgb = np.zeros((h, w, 3), dtype=np.uint8)
    for c, color in PALETTE.items():
        rgb[dmg_arr == c] = color
    return Image.fromarray(rgb)

samples_to_show = [
    ("Train #000", "train", "disaster_train_000"),
    ("Train #001", "train", "disaster_train_001"),
    ("Test #000", "test", "disaster_test_000"),
    ("Test #002", "test", "disaster_test_002"),
]

row_w = 256 * 4 + 50
row_h = 256 + 50
total_w = row_w
total_h = row_h * len(samples_to_show) + 80

canvas = Image.new("RGB", (total_w, total_h), (24, 24, 27))
draw = ImageDraw.Draw(canvas)

# Title
draw.text((25, 20), "Synthetic xBD Dataset - Sample Imagery & Ground Truth Masks Preview", fill=(255, 255, 255))
headers = ["Pre-Disaster Satellite", "Post-Disaster Satellite", "Building Footprint (Binary)", "Damage Tier Mask (5-Class)"]
for col_idx, h_text in enumerate(headers):
    draw.text((25 + col_idx * 266, 55), h_text, fill=(200, 200, 200))

for r_idx, (label, split, sample_id) in enumerate(samples_to_show):
    base_y = 90 + r_idx * row_h
    
    pre_path = os.path.join(data_dir, split, "images", f"{sample_id}_pre_disaster.png")
    post_path = os.path.join(data_dir, split, "images", f"{sample_id}_post_disaster.png")
    loc_path = os.path.join(data_dir, split, "targets", f"{sample_id}_target_loc.png")
    dmg_path = os.path.join(data_dir, split, "targets", f"{sample_id}_target_dmg.png")
    
    pre_img = Image.open(pre_path).convert("RGB")
    post_img = Image.open(post_path).convert("RGB")
    loc_img = Image.open(loc_path).convert("RGB")
    dmg_arr = np.array(Image.open(dmg_path))
    dmg_color = colorize_damage(dmg_arr)
    
    canvas.paste(pre_img, (25, base_y))
    canvas.paste(post_img, (25 + 266, base_y))
    canvas.paste(loc_img, (25 + 266 * 2, base_y))
    canvas.paste(dmg_color, (25 + 266 * 3, base_y))
    
    draw.text((25, base_y + 262), f"[{label}] ID: {sample_id}", fill=(160, 160, 160))

canvas.save(out_img_path)
print(f"Sample preview collage saved to: {out_img_path}")
