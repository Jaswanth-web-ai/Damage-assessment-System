"""
BDANet PyTorch Implementation
Paper: "BDANet: Multiscale Convolutional Neural Network With Cross-Directional
Attention for Building Damage Assessment From Satellite Images", IEEE TGRS 2022.
"""

try:
    import torch
    import torch.nn as nn
    import torch.nn.functional as F
    from .cda import CrossDirectionalAttentionPyTorch
    from .mff import MultiscaleFeatureFusionPyTorch

    class BDANetLocalizationPyTorch(nn.Module):
        """Stage 1: Building Localization U-Net in PyTorch"""
        def __init__(self, in_channels=3, base_channels=64):
            super().__init__()
            self.enc1 = nn.Sequential(
                nn.Conv2d(in_channels, base_channels, 3, padding=1),
                nn.BatchNorm2d(base_channels),
                nn.ReLU(inplace=True),
                nn.Conv2d(base_channels, base_channels, 3, padding=1),
                nn.BatchNorm2d(base_channels),
                nn.ReLU(inplace=True)
            )
            self.pool1 = nn.MaxPool2d(2, 2)
            self.enc2 = nn.Sequential(
                nn.Conv2d(base_channels, base_channels * 2, 3, padding=1),
                nn.BatchNorm2d(base_channels * 2),
                nn.ReLU(inplace=True)
            )
            self.pool2 = nn.MaxPool2d(2, 2)
            self.bottleneck = nn.Sequential(
                nn.Conv2d(base_channels * 2, base_channels * 4, 3, padding=1),
                nn.BatchNorm2d(base_channels * 4),
                nn.ReLU(inplace=True)
            )
            self.up2 = nn.ConvTranspose2d(base_channels * 4, base_channels * 2, 2, stride=2)
            self.dec2 = nn.Sequential(
                nn.Conv2d(base_channels * 4, base_channels * 2, 3, padding=1),
                nn.BatchNorm2d(base_channels * 2),
                nn.ReLU(inplace=True)
            )
            self.up1 = nn.ConvTranspose2d(base_channels * 2, base_channels, 2, stride=2)
            self.dec1 = nn.Sequential(
                nn.Conv2d(base_channels * 2, base_channels, 3, padding=1),
                nn.BatchNorm2d(base_channels),
                nn.ReLU(inplace=True)
            )
            self.head = nn.Conv2d(base_channels, 2, kernel_size=1)

        def forward(self, x):
            e1 = self.enc1(x)
            e2 = self.enc2(self.pool1(e1))
            bn = self.bottleneck(self.pool2(e2))
            
            d2 = self.dec2(torch.cat([self.up2(bn), e2], dim=1))
            d1 = self.dec1(torch.cat([self.up1(d2), e1], dim=1))
            return self.head(d1)

    class BDANetDamageAssessmentPyTorch(nn.Module):
        """Stage 2: BDANet Siamese Architecture in PyTorch"""
        def __init__(self, in_channels=3, base_channels=64, num_classes=5):
            super().__init__()
            self.num_classes = num_classes
            self.mff = MultiscaleFeatureFusionPyTorch(in_channels, base_channels)
            
            # Shared encoder
            self.enc1 = nn.Sequential(
                nn.Conv2d(in_channels, base_channels, 3, padding=1),
                nn.BatchNorm2d(base_channels),
                nn.ReLU(inplace=True)
            )
            self.pool1 = nn.MaxPool2d(2, 2)
            self.enc2 = nn.Sequential(
                nn.Conv2d(base_channels, base_channels * 2, 3, padding=1),
                nn.BatchNorm2d(base_channels * 2),
                nn.ReLU(inplace=True)
            )
            self.pool2 = nn.MaxPool2d(2, 2)
            self.bottleneck = nn.Sequential(
                nn.Conv2d(base_channels * 2, base_channels * 4, 3, padding=1),
                nn.BatchNorm2d(base_channels * 4),
                nn.ReLU(inplace=True)
            )
            
            # CDA Attention modules at decoders
            self.cda_bn = CrossDirectionalAttentionPyTorch(base_channels * 4)
            self.up2 = nn.ConvTranspose2d(base_channels * 4, base_channels * 2, 2, stride=2)
            self.cda_d2 = CrossDirectionalAttentionPyTorch(base_channels * 2)
            self.up1 = nn.ConvTranspose2d(base_channels * 2, base_channels, 2, stride=2)
            self.cda_d1 = CrossDirectionalAttentionPyTorch(base_channels)
            
            # Fusion and Classification Head
            self.head = nn.Sequential(
                nn.Conv2d(base_channels * 2, base_channels, 3, padding=1),
                nn.BatchNorm2d(base_channels),
                nn.ReLU(inplace=True),
                nn.Conv2d(base_channels, num_classes, kernel_size=1)
            )

        def forward(self, pre_img, post_img, stage1_loc_mask=None):
            # Pre branch
            pre_e1 = self.enc1(pre_img)
            pre_e2 = self.enc2(self.pool1(pre_e1))
            pre_bn = self.bottleneck(self.pool2(pre_e2))
            
            # Post branch
            post_e1 = self.enc1(post_img)
            post_e2 = self.enc2(self.pool1(post_e1))
            post_bn = self.bottleneck(self.pool2(post_e2))
            
            # Cross-Directional Attention
            pre_bn, post_bn = self.cda_bn(pre_bn, post_bn)
            
            pre_d2 = self.up2(pre_bn)
            post_d2 = self.up2(post_bn)
            pre_d2, post_d2 = self.cda_d2(pre_d2, post_d2)
            
            pre_d1 = self.up1(pre_d2)
            post_d1 = self.up1(post_d2)
            pre_d1, post_d1 = self.cda_d1(pre_d1, post_d1)
            
            # Concat in dconv4
            f_cat = torch.cat([pre_d1, post_d1], dim=1)
            logits = self.head(f_cat)
            
            if stage1_loc_mask is not None:
                # Gate damage with building mask: argmax(PB * Pd)
                p_b = (stage1_loc_mask > 0).float().unsqueeze(1)
                dmg_probs = F.softmax(logits, dim=1)
                guided_probs = dmg_probs.clone()
                guided_probs[:, 0:1] = 1.0 - p_b
                guided_probs[:, 1:] = dmg_probs[:, 1:] * p_b
                return guided_probs
                
            return logits

except ImportError:
    pass
