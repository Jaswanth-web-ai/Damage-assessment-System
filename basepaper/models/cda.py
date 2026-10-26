"""
Cross-Directional Attention (CDA) Module for BDANet
Paper: "BDANet: Multiscale Convolutional Neural Network With Cross-Directional
Attention for Building Damage Assessment From Satellite Images", Section III-C.

Implements cross-directional channel attention and cross-directional spatial attention
between pre-disaster features (U_pre) and post-disaster features (U_post).
"""

import numpy as np

def sigmoid(x):
    return 1.0 / (1.0 + np.exp(-np.clip(x, -15.0, 15.0)))

def relu(x):
    return np.maximum(0, x)

class CrossDirectionalAttention:
    """
    NumPy implementation of the CDA module for dual-branch feature maps.
    Channels: E, Height: h, Width: w
    """
    def __init__(self, channels, reduction=16, seed=42):
        self.channels = channels
        self.reduction = max(1, channels // reduction)
        rng = np.random.RandomState(seed)
        
        # Channel attention weights: [2*channels -> reduction -> channels]
        scale1 = np.sqrt(2.0 / (2 * channels))
        self.w_c1 = rng.randn(self.reduction, 2 * channels) * scale1
        self.b_c1 = np.zeros(self.reduction)
        
        scale2 = np.sqrt(2.0 / self.reduction)
        self.w_c2 = rng.randn(channels, self.reduction) * scale2
        self.b_c2 = np.zeros(channels)
        
        # Spatial attention weights: 1x1 conv on concatenated 2*channels -> 1 channel
        scale_s = np.sqrt(2.0 / (2 * channels))
        self.w_s = rng.randn(1, 2 * channels, 1, 1) * scale_s
        self.b_s = np.zeros(1)

    def forward(self, u_pre, u_post):
        """
        Input:
            u_pre:  (B, E, H, W)
            u_post: (B, E, H, W)
        Output:
            u_pre_spa:  (B, E, H, W)
            u_post_spa: (B, E, H, W)
        """
        B, E, H, W = u_pre.shape
        
        # 1. Channel Attention
        # Concatenate along channel dimension: [U_pre, U_post] -> (B, 2E, H, W)
        u_concat = np.concatenate([u_pre, u_post], axis=1)
        
        # Global Average Pooling: (B, 2E)
        gap = np.mean(u_concat, axis=(2, 3))
        
        # MLP: Linear -> ReLU -> Linear -> Sigmoid
        fc1 = relu(np.dot(gap, self.w_c1.T) + self.b_c1)
        i_cha = sigmoid(np.dot(fc1, self.w_c2.T) + self.b_c2) # (B, E)
        i_cha = i_cha[:, :, np.newaxis, np.newaxis] # (B, E, 1, 1)
        
        # Cross channel modulation (Equation 5)
        # U_pre_cha = I_cha * U_post + U_pre
        # U_post_cha = I_cha * U_pre + U_post
        u_pre_cha = i_cha * u_post + u_pre
        u_post_cha = i_cha * u_pre + u_post
        
        # 2. Spatial Attention
        # Concatenate U_pre_cha and U_post_cha -> (B, 2E, H, W)
        u_cha_concat = np.concatenate([u_pre_cha, u_post_cha], axis=1)
        
        # 1x1 Convolution: (B, 1, H, W)
        # For 1x1 conv, dot product over channels
        conv_s = np.tensordot(u_cha_concat, self.w_s[0, :, 0, 0], axes=([1], [0])) # (B, H, W)
        conv_s = conv_s[:, np.newaxis, :, :] + self.b_s[0]
        i_spa = sigmoid(conv_s) # (B, 1, H, W)
        
        # Cross spatial modulation (Equation 7)
        # U_pre_spa = I_spa * U_post_cha + U_pre
        # U_post_spa = I_spa * U_pre_cha + U_post
        u_pre_spa = i_spa * u_post_cha + u_pre
        u_post_spa = i_spa * u_pre_cha + u_post
        
        return u_pre_spa, u_post_spa

try:
    import torch
    import torch.nn as nn
    
    class CrossDirectionalAttentionPyTorch(nn.Module):
        """PyTorch Module for CDA"""
        def __init__(self, channels, reduction=16):
            super().__init__()
            red_c = max(1, channels // reduction)
            self.channel_mlp = nn.Sequential(
                nn.AdaptiveAvgPool2d(1),
                nn.Flatten(),
                nn.Linear(2 * channels, red_c),
                nn.ReLU(inplace=True),
                nn.Linear(red_c, channels),
                nn.Sigmoid()
            )
            self.spatial_conv = nn.Sequential(
                nn.Conv2d(2 * channels, 1, kernel_size=1, bias=True),
                nn.Sigmoid()
            )

        def forward(self, u_pre, u_post):
            u_cat = torch.cat([u_pre, u_post], dim=1)
            i_cha = self.channel_mlp(u_cat).unsqueeze(-1).unsqueeze(-1)
            
            u_pre_cha = i_cha * u_post + u_pre
            u_post_cha = i_cha * u_pre + u_post
            
            u_cha_cat = torch.cat([u_pre_cha, u_post_cha], dim=1)
            i_spa = self.spatial_conv(u_cha_cat)
            
            u_pre_spa = i_spa * u_post_cha + u_pre
            u_post_spa = i_spa * u_pre_cha + u_post
            
            return u_pre_spa, u_post_spa
except ImportError:
    pass
