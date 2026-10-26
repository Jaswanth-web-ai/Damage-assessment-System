"""
BDANet Full Architecture (Stage 1 Localization + Stage 2 Damage Assessment)
Paper: "BDANet: Multiscale Convolutional Neural Network With Cross-Directional
Attention for Building Damage Assessment From Satellite Images", IEEE TGRS 2022.

Architecture Overview:
- Stage 1: Single U-Net trained on pre-disaster images for building localization.
- Stage 2: Dual-branch Siamese network with MFF and CDA modules.
           Weights from Stage 1 are transferred and shared between branches.
           Final damage prediction is guided by building localization:
           P = argmax(P_B * P_d)
"""

import numpy as np
import scipy.ndimage
from .cda import CrossDirectionalAttention, sigmoid, relu
from .mff import MultiscaleFeatureFusion, downsample_2d, conv_block

class BDANetStage1Localization:
    """
    Stage 1: Building Localization Network.
    Takes pre-disaster image (B, 3, H, W) and predicts binary building mask (B, 2, H, W).
    """
    def __init__(self, in_channels=3, base_channels=24, seed=42):
        self.base_channels = base_channels
        rng = np.random.RandomState(seed)
        
        # Encoder projection weights
        self.w_enc1 = rng.randn(base_channels, in_channels) * np.sqrt(2.0 / in_channels)
        self.b_enc1 = np.zeros(base_channels)
        
        self.w_enc2 = rng.randn(base_channels * 2, base_channels) * np.sqrt(2.0 / base_channels)
        self.b_enc2 = np.zeros(base_channels * 2)
        
        # Bottleneck
        self.w_bottleneck = rng.randn(base_channels * 4, base_channels * 2) * np.sqrt(2.0 / (base_channels * 2))
        self.b_bottleneck = np.zeros(base_channels * 4)
        
        # Decoder
        self.w_dec2 = rng.randn(base_channels * 2, base_channels * 4) * np.sqrt(2.0 / (base_channels * 4))
        self.b_dec2 = np.zeros(base_channels * 2)
        
        self.w_dec1 = rng.randn(base_channels, base_channels * 2) * np.sqrt(2.0 / (base_channels * 2))
        self.b_dec1 = np.zeros(base_channels)
        
        # Head (2 classes: Background, Building)
        self.w_head = rng.randn(2, base_channels) * np.sqrt(2.0 / base_channels)
        self.b_head = np.zeros(2)

    def extract_features(self, x):
        """Extract multi-level encoder features"""
        # Level 1: (H, W)
        e1 = conv_block(x, self.w_enc1, self.b_enc1, filter_size=3)
        # Level 2: (H/2, W/2)
        e1_down = downsample_2d(e1, factor=2)
        e2 = conv_block(e1_down, self.w_enc2, self.b_enc2, filter_size=3)
        # Bottleneck: (H/4, W/4)
        e2_down = downsample_2d(e2, factor=2)
        bn = conv_block(e2_down, self.w_bottleneck, self.b_bottleneck, filter_size=3)
        return e1, e2, bn

    def forward(self, x):
        """
        x: (B, 3, H, W)
        Returns: logits (B, 2, H, W) and probability map (B, 2, H, W)
        """
        B, _, H, W = x.shape
        e1, e2, bn = self.extract_features(x)
        
        # Decoder 2: upsample bn (H/4 -> H/2)
        bn_up = np.repeat(np.repeat(bn, 2, axis=2), 2, axis=3)
        d2 = conv_block(bn_up, self.w_dec2, self.b_dec2, filter_size=3)
        
        # Decoder 1: upsample d2 (H/2 -> H)
        d2_up = np.repeat(np.repeat(d2, 2, axis=2), 2, axis=3)
        d1 = conv_block(d2_up, self.w_dec1, self.b_dec1, filter_size=3)
        
        # Head projection (B, 2, H, W)
        logits = np.tensordot(d1, self.w_head, axes=([1], [1])).transpose(0, 3, 1, 2) + self.b_head[:, None, None]
        
        # Softmax over 2 classes
        exp_logits = np.exp(logits - np.max(logits, axis=1, keepdims=True))
        probs = exp_logits / np.sum(exp_logits, axis=1, keepdims=True)
        
        return logits, probs

class BDANetStage2Assessment:
    """
    Stage 2: Building Damage Assessment Network.
    Shared Siamese branches with MFF and CDA modules.
    Outputs 5-class damage segmentation map.
    """
    def __init__(self, in_channels=3, base_channels=24, num_classes=5, seed=42):
        self.num_classes = num_classes
        self.base_channels = base_channels
        
        # Multiscale Feature Fusion
        self.mff = MultiscaleFeatureFusion(in_channels=in_channels, base_channels=base_channels, seed=seed)
        
        # Cross-Directional Attention modules at decoder levels
        self.cda_bottleneck = CrossDirectionalAttention(channels=base_channels * 4, seed=seed)
        self.cda_d2 = CrossDirectionalAttention(channels=base_channels * 2, seed=seed+1)
        self.cda_d1 = CrossDirectionalAttention(channels=base_channels, seed=seed+2)
        
        rng = np.random.RandomState(seed)
        # Shared Siamese Backbone (initialized from Stage 1 weights)
        self.w_enc1 = rng.randn(base_channels, in_channels) * np.sqrt(2.0 / in_channels)
        self.b_enc1 = np.zeros(base_channels)
        
        self.w_enc2 = rng.randn(base_channels * 2, base_channels) * np.sqrt(2.0 / base_channels)
        self.b_enc2 = np.zeros(base_channels * 2)
        
        self.w_bottleneck = rng.randn(base_channels * 4, base_channels * 2) * np.sqrt(2.0 / (base_channels * 2))
        self.b_bottleneck = np.zeros(base_channels * 4)
        
        # Decoder weights
        self.w_dec2 = rng.randn(base_channels * 2, base_channels * 4) * np.sqrt(2.0 / (base_channels * 4))
        self.b_dec2 = np.zeros(base_channels * 2)
        
        self.w_dec1 = rng.randn(base_channels, base_channels * 2) * np.sqrt(2.0 / (base_channels * 2))
        self.b_dec1 = np.zeros(base_channels)
        
        # Head for damage classification: concatenates pre and post features (2*base_channels -> num_classes)
        self.w_head = rng.randn(num_classes, 2 * base_channels) * np.sqrt(2.0 / (2 * base_channels))
        self.b_head = np.zeros(num_classes)

    def load_stage1_weights(self, stage1_model):
        """Transfer learned weights from Stage 1 to initialize Stage 2 (Paper Section III-A)"""
        self.w_enc1 = stage1_model.w_enc1.copy()
        self.b_enc1 = stage1_model.b_enc1.copy()
        self.w_enc2 = stage1_model.w_enc2.copy()
        self.b_enc2 = stage1_model.b_enc2.copy()
        self.w_bottleneck = stage1_model.w_bottleneck.copy()
        self.b_bottleneck = stage1_model.b_bottleneck.copy()
        self.w_dec2 = stage1_model.w_dec2.copy()
        self.b_dec2 = stage1_model.b_dec2.copy()
        self.w_dec1 = stage1_model.w_dec1.copy()
        self.b_dec1 = stage1_model.b_dec1.copy()
        print("Successfully transferred and shared Stage 1 weights to Stage 2 Siamese branches.")

    def _extract_branch_features(self, x):
        """Single branch extraction with MFF integration"""
        mff_feats = self.mff.extract_features(x)
        
        # Base Level 1
        e1 = conv_block(x, self.w_enc1, self.b_enc1, filter_size=3)
        e1_down = downsample_2d(e1, factor=2)
        
        # Fuse with MFF scale 1
        e2_in = (e1_down + mff_feats["scale_1"]) / 2.0
        e2 = conv_block(e2_in, self.w_enc2, self.b_enc2, filter_size=3)
        
        # Fuse with MFF scale 2
        e2_down = downsample_2d(e2, factor=2)
        bn_in = (e2_down + mff_feats["scale_2"]) / 2.0
        bn = conv_block(bn_in, self.w_bottleneck, self.b_bottleneck, filter_size=3)
        
        return e1, e2, bn

    def forward(self, pre_img, post_img, stage1_loc_probs=None):
        """
        pre_img: (B, 3, H, W)
        post_img: (B, 3, H, W)
        stage1_loc_probs: (B, 2, H, W) - optional Stage 1 guidance
        
        Returns:
            damage_probs: (B, num_classes, H, W)
            final_pred: (B, H, W) - integer class predictions [0..4]
        """
        B, _, H, W = pre_img.shape
        
        # Extract features from pre- and post-disaster branches
        pre_e1, pre_e2, pre_bn = self._extract_branch_features(pre_img)
        post_e1, post_e2, post_bn = self._extract_branch_features(post_img)
        
        # CDA module at bottleneck (dconv1 level)
        pre_bn_cda, post_bn_cda = self.cda_bottleneck.forward(pre_bn, post_bn)
        
        # Decoder 2 with CDA (dconv2 level)
        pre_bn_up = np.repeat(np.repeat(pre_bn_cda, 2, axis=2), 2, axis=3)
        post_bn_up = np.repeat(np.repeat(post_bn_cda, 2, axis=2), 2, axis=3)
        
        pre_d2 = conv_block(pre_bn_up, self.w_dec2, self.b_dec2, filter_size=3)
        post_d2 = conv_block(post_bn_up, self.w_dec2, self.b_dec2, filter_size=3)
        
        pre_d2_cda, post_d2_cda = self.cda_d2.forward(pre_d2, post_d2)
        
        # Decoder 1 with CDA (dconv3 level)
        pre_d2_up = np.repeat(np.repeat(pre_d2_cda, 2, axis=2), 2, axis=3)
        post_d2_up = np.repeat(np.repeat(post_d2_cda, 2, axis=2), 2, axis=3)
        
        pre_d1 = conv_block(pre_d2_up, self.w_dec1, self.b_dec1, filter_size=3)
        post_d1 = conv_block(post_d2_up, self.w_dec1, self.b_dec1, filter_size=3)
        
        pre_d1_cda, post_d1_cda = self.cda_d1.forward(pre_d1, post_d1)
        
        # Concatenate pre and post feature maps in dconv4 (Paper Section III-A)
        f_concat = np.concatenate([pre_d1_cda, post_d1_cda], axis=1) # (B, 2*base_channels, H, W)
        
        # Final damage classification projection
        logits = np.tensordot(f_concat, self.w_head, axes=([1], [1])).transpose(0, 3, 1, 2) + self.b_head[:, None, None]
        
        # Softmax over damage classes (0: Background, 1: No damage, 2: Minor, 3: Major, 4: Destroyed)
        exp_logits = np.exp(logits - np.max(logits, axis=1, keepdims=True))
        dmg_probs = exp_logits / np.sum(exp_logits, axis=1, keepdims=True)
        
        # Stage 1 Building Localization Guidance (Equation 3):
        # P = argmax(P_B * P_d)
        if stage1_loc_probs is not None:
            p_b = (stage1_loc_probs[:, 1:2, :, :] > 0.45).astype(np.float32)
            guided_probs = dmg_probs.copy()
            guided_probs[:, 0:1, :, :] = (1.0 - p_b) # Background probability
            guided_probs[:, 1:, :, :] = dmg_probs[:, 1:, :, :] * p_b
            final_pred = np.argmax(guided_probs, axis=1)
        else:
            final_pred = np.argmax(dmg_probs, axis=1)
            
        return dmg_probs, final_pred
