"""
Multiscale Feature Fusion (MFF) Module for BDANet
Paper: "BDANet: Multiscale Convolutional Neural Network With Cross-Directional
Attention for Building Damage Assessment From Satellite Images", Section III-B.

Extracts and fuses features from three different image scales:
1x (original resolution), 0.5x resolution, and 0.25x resolution.
"""

import numpy as np
import scipy.ndimage

def downsample_2d(x, factor=2):
    """Spatial average pooling downsample for NumPy tensor (B, C, H, W)."""
    B, C, H, W = x.shape
    new_h, new_w = H // factor, W // factor
    x_reshaped = x[:, :, :new_h*factor, :new_w*factor].reshape(B, C, new_h, factor, new_w, factor)
    return x_reshaped.mean(axis=(3, 5))

def conv_block(x, weights, bias, filter_size=1):
    """Pointwise conv followed by spatial neighborhood filter and ReLU"""
    proj = np.tensordot(x, weights, axes=([1], [1])).transpose(0, 3, 1, 2) + bias[:, None, None]
    if filter_size > 1 and x.shape[2] <= 64:
        proj = scipy.ndimage.uniform_filter(proj, size=(1, 1, filter_size, filter_size))
    return np.maximum(0, proj)

class MultiscaleFeatureFusion:
    """NumPy implementation of MFF Module"""
    def __init__(self, in_channels=3, base_channels=32, seed=42):
        self.in_channels = in_channels
        self.base_channels = base_channels
        rng = np.random.RandomState(seed)
        
        # 1x stream weights: (base_channels, in_channels)
        self.w1 = rng.randn(base_channels, in_channels) * np.sqrt(2.0 / in_channels)
        self.b1 = np.zeros(base_channels)
        
        # 0.5x stream weights: (base_channels, in_channels)
        self.w2 = rng.randn(base_channels, in_channels) * np.sqrt(2.0 / in_channels)
        self.b2 = np.zeros(base_channels)
        
        # Dimension reduction weights: (base_channels, 2*base_channels)
        self.w_fuse1 = rng.randn(base_channels, 2 * base_channels) * np.sqrt(2.0 / (2 * base_channels))
        self.b_fuse1 = np.zeros(base_channels)
        
        # 0.25x stream weights: (2*base_channels, in_channels)
        self.w3 = rng.randn(base_channels * 2, in_channels) * np.sqrt(2.0 / in_channels)
        self.b3 = np.zeros(base_channels * 2)

    def extract_features(self, x):
        """
        x: (B, 3, H, W)
        Returns multiscale fused feature representations.
        """
        # Stream 1: 1x resolution, downsampled by 2
        x_down1 = downsample_2d(x, factor=2) # (B, 3, H/2, W/2)
        f1 = conv_block(x_down1, self.w1, self.b1, filter_size=3)
        
        # Stream 2: 0.5x resolution
        x_half = downsample_2d(x, factor=2)
        f2 = conv_block(x_half, self.w2, self.b2, filter_size=3)
        
        # Concat f1 and f2, dimension reduction
        f12 = np.concatenate([f1, f2], axis=1) # (B, 2*base_channels, H/2, W/2)
        f12_reduced = conv_block(f12, self.w_fuse1, self.b_fuse1, filter_size=1)
        
        # Stream 3: 0.25x resolution
        x_quarter = downsample_2d(x, factor=4)
        f3 = conv_block(x_quarter, self.w3, self.b3, filter_size=3)
        
        return {
            "scale_1": f12_reduced, # (H/2, W/2)
            "scale_2": f3           # (H/4, W/4)
        }

try:
    import torch
    import torch.nn as nn
    import torch.nn.functional as F

    class MultiscaleFeatureFusionPyTorch(nn.Module):
        """PyTorch Module for MFF"""
        def __init__(self, in_channels=3, base_channels=64):
            super().__init__()
            self.stream1 = nn.Sequential(
                nn.Conv2d(in_channels, base_channels, kernel_size=3, stride=2, padding=1),
                nn.BatchNorm2d(base_channels),
                nn.ReLU(inplace=True)
            )
            self.stream2 = nn.Sequential(
                nn.Conv2d(in_channels, base_channels, kernel_size=3, stride=1, padding=1),
                nn.BatchNorm2d(base_channels),
                nn.ReLU(inplace=True)
            )
            self.dim_reduce = nn.Sequential(
                nn.Conv2d(base_channels * 2, base_channels, kernel_size=1),
                nn.BatchNorm2d(base_channels),
                nn.ReLU(inplace=True)
            )
            self.stream3 = nn.Sequential(
                nn.Conv2d(in_channels, base_channels * 2, kernel_size=3, stride=1, padding=1),
                nn.BatchNorm2d(base_channels * 2),
                nn.ReLU(inplace=True)
            )

        def forward(self, x):
            f1 = self.stream1(x)
            x_half = F.interpolate(x, scale_factor=0.5, mode='bilinear', align_corners=False)
            f2 = self.stream2(x_half)
            f12 = self.dim_reduce(torch.cat([f1, f2], dim=1))
            x_quarter = F.interpolate(x, scale_factor=0.25, mode='bilinear', align_corners=False)
            f3 = self.stream3(x_quarter)
            return f12, f3
except ImportError:
    pass
