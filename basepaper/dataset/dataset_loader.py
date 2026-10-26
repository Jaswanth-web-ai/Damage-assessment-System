"""
Dataset Loader & Augmentation for BDANet
Supports synthetic and real xBD format with CutMix augmentation
specifically targeting minor and major damage classes as proposed in the base paper.
"""

import os
import json
import numpy as np
from PIL import Image

class XBDDataset:
    def __init__(self, data_dir, split="train", use_cutmix=True, cutmix_prob=0.5):
        self.data_dir = data_dir
        self.split = split
        self.use_cutmix = use_cutmix and (split == "train")
        self.cutmix_prob = cutmix_prob
        
        manifest_path = os.path.join(data_dir, f"{split}_manifest.json")
        if not os.path.exists(manifest_path):
            raise FileNotFoundError(f"Manifest not found: {manifest_path}. Please run synthetic_xbd.py first.")
            
        with open(manifest_path, "r") as f:
            self.samples = json.load(f)
            
        # Filter samples containing minor (2) or major (3) damage for Class-Specific CutMix
        self.difficult_sample_indices = []
        for idx, item in enumerate(self.samples):
            dmg_path = os.path.join(self.data_dir, item["dmg_target"])
            dmg_arr = np.array(Image.open(dmg_path))
            if 2 in dmg_arr or 3 in dmg_arr:
                self.difficult_sample_indices.append(idx)
                
        if not self.difficult_sample_indices:
            self.difficult_sample_indices = list(range(len(self.samples)))

    def __len__(self):
        return len(self.samples)

    def _load_single(self, index):
        item = self.samples[index]
        pre_path = os.path.join(self.data_dir, item["pre_image"])
        post_path = os.path.join(self.data_dir, item["post_image"])
        loc_path = os.path.join(self.data_dir, item["loc_target"])
        dmg_path = os.path.join(self.data_dir, item["dmg_target"])
        
        pre_img = np.array(Image.open(pre_path), dtype=np.float32) / 255.0
        post_img = np.array(Image.open(post_path), dtype=np.float32) / 255.0
        loc_mask = (np.array(Image.open(loc_path)) > 127).astype(np.int64)
        dmg_mask = np.array(Image.open(dmg_path), dtype=np.int64)
        
        # Format images: (C, H, W)
        pre_img = np.transpose(pre_img, (2, 0, 1))
        post_img = np.transpose(post_img, (2, 0, 1))
        
        return pre_img, post_img, loc_mask, dmg_mask

    def apply_cutmix(self, pre_a, post_a, loc_a, dmg_a):
        """
        Class-Specific CutMix as in BDANet Section III-D:
        Cuts a bounding box from a sample with difficult classes (minor/major damage)
        and pastes it onto sample A.
        """
        b_idx = np.random.choice(self.difficult_sample_indices)
        pre_b, post_b, loc_b, dmg_b = self._load_single(b_idx)
        
        _, H, W = pre_a.shape
        cut_w = np.random.randint(W // 4, W // 2)
        cut_h = np.random.randint(H // 4, H // 2)
        cx = np.random.randint(0, W - cut_w)
        cy = np.random.randint(0, H - cut_h)
        
        pre_out = pre_a.copy()
        post_out = post_a.copy()
        loc_out = loc_a.copy()
        dmg_out = dmg_a.copy()
        
        pre_out[:, cy:cy+cut_h, cx:cx+cut_w] = pre_b[:, cy:cy+cut_h, cx:cx+cut_w]
        post_out[:, cy:cy+cut_h, cx:cx+cut_w] = post_b[:, cy:cy+cut_h, cx:cx+cut_w]
        loc_out[cy:cy+cut_h, cx:cx+cut_w] = loc_b[cy:cy+cut_h, cx:cx+cut_w]
        dmg_out[cy:cy+cut_h, cx:cx+cut_w] = dmg_b[cy:cy+cut_h, cx:cx+cut_w]
        
        return pre_out, post_out, loc_out, dmg_out

    def get_sample(self, index):
        pre, post, loc, dmg = self._load_single(index)
        if self.use_cutmix and (np.random.rand() < self.cutmix_prob):
            pre, post, loc, dmg = self.apply_cutmix(pre, post, loc, dmg)
        return {
            "pre_image": pre,
            "post_image": post,
            "loc_mask": loc,
            "dmg_mask": dmg,
            "id": self.samples[index]["id"]
        }

    def get_batch(self, batch_size=4, shuffle=True):
        indices = np.arange(len(self))
        if shuffle:
            np.random.shuffle(indices)
            
        for i in range(0, len(self), batch_size):
            batch_idx = indices[i:i+batch_size]
            pre_list, post_list, loc_list, dmg_list = [], [], [], []
            for idx in batch_idx:
                s = self.get_sample(idx)
                pre_list.append(s["pre_image"])
                post_list.append(s["post_image"])
                loc_list.append(s["loc_mask"])
                dmg_list.append(s["dmg_mask"])
                
            yield {
                "pre_images": np.stack(pre_list, axis=0),
                "post_images": np.stack(post_list, axis=0),
                "loc_masks": np.stack(loc_list, axis=0),
                "dmg_masks": np.stack(dmg_list, axis=0)
            }
