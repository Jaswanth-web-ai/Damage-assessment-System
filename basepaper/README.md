# BDANet: Building Damage Assessment From Satellite Images
**Paper:** *BDANet: Multiscale Convolutional Neural Network With Cross-Directional Attention for Building Damage Assessment From Satellite Images*  
**Publication:** IEEE Transactions on Geoscience and Remote Sensing (IEEE TGRS), Vol. 60, 2022  
**Dataset Benchmark:** xBD Large-scale Disaster Dataset (xView2 Challenge)

---

## 1. Base Paper వివరణ & అసలు Output ఏమి వస్తుంది? (Overview & Expected Outputs)

### A. సమస్య & ఉద్దేశం (Problem Statement & Purpose)
ప్రకృతి విపత్తులు (భూకంపాలు, తుఫానులు, వరదలు, సునామీలు) సంభవించినప్పుడు మానవతా సహాయం (Humanitarian Assistance & Disaster Response - HADR) సత్వరమే అందించడానికి ఉపగ్రహ చిత్రాల (Satellite Imagery) ద్వారా భవనాలు ఎంతవరకు దెబ్బతిన్నాయో అంచనా వేయడం అత్యంత ముఖ్యం.

సాంప్రదాయ పద్ధతుల్లో ప్రీ-డిజాస్టర్ (విపత్తుకు ముందు) మరియు పోస్ట్-డిజాస్టర్ (విపత్తు తర్వాత) ఇమేజ్‌లను డైరెక్ట్‌గా ఒకే నెట్‌వర్క్‌కి కంకాటినేట్ చేసి పంపుతారు. దీనివల్ల:
1. రెండు సమయాల చిత్రాల మధ్య పరస్పర సంబంధాలు (cross-temporal directional correlations) సరిగ్గా క్యాప్చర్ కావు.
2. "No Damage" మరియు "Minor Damage" వంటి క్లిష్టమైన తరగతులు శాటిలైట్ ఇమేజ్‌లలో ఒకేలా కనిపిస్తాయి (Difficult Classes).

### B. అసలు ఈ మోడల్ నుండి Output ఏమి వస్తుంది? (What Output is Produced?)
ఈ BDANet పైప్‌లైన్ రన్ చేస్తే క్రింది outputs లభిస్తాయి:

1. **Stage 1 Output (భవనాల లొకేలైజేషన్ మాస్క్ - Binary Building Mask):**
   - ప్రీ-డిజాస్టర్ ఇమేజ్ నుండి భవనాలు ఎక్కడెక్కడ ఉన్నాయో స్పష్టమైన బైనరీ మాస్క్ ($P_B \in \{0, 1\}$) ఇస్తుంది (Building vs Background).

2. **Stage 2 Output (భవనాల నష్టం వర్గీకరణ పటం - 4-Level Damage Assessment Map):**
   - ప్రీ-డిజాస్టర్ మరియు పోస్ట్-డిజాస్టర్ చిత్రాలను పోల్చి, ప్రతి భవనానికి రంగులతో కూడిన డ్యామేజ్ స్థాయిని పిక్సెల్ వారీగా వర్గీకరిస్తుంది:
     - 🟦 **Background (C0):** భవనం లేని ప్రాంతం (Dark Blue)
     - 🟩 **No Damage (C1):** సురక్షితమైన / దెబ్బతినని భవనం (Green)
     - 🟨 **Minor Damage (C2):** చిన్నపాటి నష్టం - పైకప్పు స్వల్పంగా పాడవడం (Light Yellow)
     - 🟧 **Major Damage (C3):** తీవ్రమైన నష్టం - గోడలు, పైకప్పు గణనీయంగా కూలడం (Orange)
     - 🟥 **Destroyed (C4):** పూర్తిగా ధ్వంసమైన భవనం - శిథిలాలు మాత్రమే ఉండడం (Red)

3. **Quantitative Metrics (పరిమాణాత్మక కొలమానాలు):**
   - **$F1_b$ (Building Localization F1):** భవనాల గుర్తింపు స్కోర్ (పేపర్‌లో $0.864$)
   - **$F1_d$ (Damage Classification F1):** 4 తరగతుల హార్మోనిక్ మీన్ స్కోర్ (పేపర్‌లో $0.782$)
     $$F1_d = \frac{4}{\frac{1}{F1_1} + \frac{1}{F1_2} + \frac{1}{F1_3} + \frac{1}{F1_4}}$$
   - **$F1_s$ (Overall Final Score):** అధికారిక xView2 పోటీ స్కోర్ (పేపర్‌లో **$0.806$**, SOTA విజేత):
     $$F1_s = 0.3 \times F1_b + 0.7 \times F1_d$$

4. **Visual Graphs & Tables (గ్రాఫ్‌లు & పట్టికలు):**
   - **Fig 1:** SOTA మోడల్స్ (WNet, U-Net++, RescueNet, Weber et al., FCN, SegNet, DeepLabv3, BDANet) F1 స్కోర్ల తులనాత్మక బార్ చార్ట్.
   - **Fig 2:** అబ్లేషన్ స్టడీ (MFF, CDA, CutMix వల్ల వచ్చిన క్రమానుగత పెరుగుదల).
   - **Fig 3:** నార్మలైజ్డ్ కన్‌ఫ్యూజన్ మ్యాట్రిక్స్ హీట్‌మ్యాప్ (Table VI).
   - **Fig 4 (Fig 8 Reproduction):** Stage 1 వెయిట్స్ ట్రాన్స్‌ఫర్ చేయడం వల్ల మరియు చేయకపోవడం వల్ల ట్రైనింగ్ కన్వర్జెన్స్ & లాస్ తగ్గుదల గ్రాఫ్.
   - **Fig 5:** రాడార్ / స్పైడర్ చార్ట్ కంపారిజన్.
   - **Tables V to XII:** పేపర్‌లోని అన్ని 8 పట్టికలు CSV మరియు Markdown ఫార్మాట్‌లో.

---

## 2. ఆర్కిటెక్చర్ నిర్మాణం (BDANet Architecture)

BDANet ముఖ్యమైన 4 వినూత్న భాగాలను కలిగి ఉంది:
```
Pre-Disaster Image ───► [Stage 1 U-Net] ───► Building Mask (PB)
                               │ (Weights Shared)
                               ▼
Pre-Disaster Image ───► [Siamese Encoder 1] ──┐
                                              ├──► [Cross-Directional Attention (CDA)] ──► [Damage Head (Pd)] ──► Final P = argmax(PB · Pd)
Post-Disaster Image ──► [Siamese Encoder 2] ──┘
```

1. **Two-Stage Framework:**
   - **Stage 1:** ప్రీ-డిజాస్టర్ ఇమేజ్ ఉపయోగించి బిల్డింగ్ ఫుట్‌ప్రింట్‌లను గుర్తిస్తుంది.
   - **Stage 2:** నేర్చుకున్న వెయిట్స్‌ను సియామీస్ (Siamese) రెండు శాఖలకు షేర్ చేస్తుంది.
2. **Multiscale Feature Fusion (MFF):**
   - $1\times, 0.5\times, 0.25\times$ రెసొల్యూషన్ల నుండి వివిధ సైజుల భవనాల ఫీచర్లను సంగ్రహిస్తుంది.
3. **Cross-Directional Attention (CDA):**
   - ఛానెల్ క్రాస్-అటెన్షన్ ($I_{cha}$) మరియు స్పేషియల్ క్రాస్-అటెన్షన్ ($I_{spa}$) ద్వారా డిజాస్టర్‌కు ముందు మరియు తర్వాత ఫీచర్ల మధ్య సంబంధాన్ని మోడల్ చేస్తుంది.
4. **Class-Specific CutMix:**
   - కష్టతరమైన క్లాసులైన Minor Damage మరియు Major Damage శాంపిల్స్ నుండి ప్యాచెస్‌ను కట్ చేసి పేస్ట్ చేయడం ద్వారా డేటా ఇంబ్యాలెన్స్‌ను అధిగమిస్తుంది.

---

## 3. ప్రాజెక్ట్ ఫోల్డర్ల అమరిక (Folder Structure)

```
basepaper/
├── BDANet_Multiscale_...pdf            # మూల పరిశోధనా పత్రం (Base Research Paper)
├── extracted_paper_text.txt           # PDF నుండి వెలికితీసిన పూర్తి పాఠ్యాంశం
├── dataset/
│   ├── synthetic_xbd.py               # డిఫాల్ట్ శాటిలైట్ ఇమేజ్ జెనరేటర్ (Pre/Post/Damage)
│   ├── dataset_loader.py              # xBD & సింథటిక్ డేటా లోడర్ (CutMix తో)
│   └── data/                          # ట్రైన్ & టెస్ట్ శాటిలైట్ ఇమేజ్‌లు, టార్గెట్లు
├── models/
│   ├── cda.py                         # Cross-Directional Attention మాడ్యూల్
│   ├── mff.py                         # Multiscale Feature Fusion మాడ్యూల్
│   ├── bdanet_model.py                # పూర్తి BDANet ఆర్కిటెక్చర్ (Stage 1 & Stage 2)
│   ├── bdanet_pytorch.py              # PyTorch నేటివ్ ఇంప్లిమెంటేషన్
│   └── losses.py                      # CE, Dice Loss & xBD F1 మెట్రిక్స్
├── paper_figures/                     # పేపర్ నుండి తీసిన మూల డయాగ్రమ్‌లు (Tables & Figs)
├── outputs/
│   ├── graphs/                        # అధిక రిజల్యూషన్ గ్రాఫ్‌లు (Fig 1 to 5)
│   │   ├── fig1_sota_f1_comparison.png
│   │   ├── fig2_ablation_study.png
│   │   ├── fig3_confusion_matrix_heatmap.png
│   │   ├── fig4_training_curves_fig8.png
│   │   └── fig5_radar_sota_comparison.png
│   ├── tables/                        # Table V నుండి Table XII వరకు CSV & MD ఫైల్స్
│   └── predictions/                   # విజువల్ డ్యామేజ్ ప్రిడిక్షన్ మ్యాప్స్ (Side-by-side)
├── train_stage1.py                    # Stage 1 లోకలైజేషన్ ట్రైనింగ్
├── train_stage2.py                    # Stage 2 డ్యామేజ్ అసెస్‌మెంట్ ట్రైనింగ్
├── evaluate.py                        # టెస్ట్ ఎవాల్యుయేషన్ & విజువలైజేషన్
├── generate_paper_results.py          # పేపర్ గ్రాఫ్‌లు & పట్టికల జెనరేటర్
└── run_pipeline.py                    # సింగిల్ కమాండ్ మాస్టర్ పైప్‌లైన్
```

---

## 4. ఎలా రన్ చేయాలి? (How to Run)

ఏదైనా టెర్మినల్ లేదా పవర్‌షెల్‌లో `basepaper` ఫోల్డర్‌లోకి వెళ్లి ఈ క్రింది కమాండ్‌ను అమలు చేయండి:

### పూర్తి పైప్‌లైన్ ఒక్కసారే రన్ చేయడానికి (End-to-End Execution):
```bash
python run_pipeline.py
```
ఇది స్వయంచాలకంగా:
1. శాటిలైట్ డేటాసెట్‌ను రూపొందిస్తుంది.
2. Stage 1 భవనాల లోకలైజేషన్ నెట్‌వర్క్‌ను ట్రైన్ చేస్తుంది.
3. Stage 1 వెయిట్స్‌ను Stage 2 కి బదిలీ చేస్తుంది.
4. MFF మరియు CDA లతో Stage 2 డ్యామేజ్ అసెస్‌మెంట్ మోడల్‌ను ట్రైన్ చేస్తుంది.
5. టెస్ట్ డేటాపై F1 స్కోర్లు, కన్‌ఫ్యూజన్ మ్యాట్రిక్స్ లెక్కిస్తుంది.
6. పేపర్‌లోని అన్ని గ్రాఫ్‌లు మరియు టేబుల్స్‌ను `outputs/` లోకి జనరేట్ చేస్తుంది.

### విడివిడిగా రన్ చేయాలనుకుంటే (Individual Execution):
- **గ్రాఫ్‌లు మరియు టేబుల్స్ రీప్రొడ్యూస్ చేయడానికి:**
  ```bash
  python generate_paper_results.py
  ```
- **కొత్త డేటాసెట్ జెనరేట్ చేయడానికి:**
  ```bash
  python dataset/synthetic_xbd.py
  ```
- **టెస్ట్ మోడల్ ప్రిడిక్షన్లను విజువలైజ్ చేయడానికి:**
  ```bash
  python evaluate.py
  ```

---

## 5. పేపర్ ఫలితాల పట్టిక (Base Paper Benchmark Summary)

| మోడల్ (Method) | $F1_s$ (Overall) | $F1_b$ (Loc) | $F1_d$ (Damage) | No damage | Minor | Major | Destroyed |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| WNet [53] | 0.737 | 0.817 | 0.703 | 0.884 | 0.518 | 0.684 | 0.855 |
| U-Net++ [57] | 0.740 | 0.819 | 0.707 | 0.886 | 0.523 | 0.689 | 0.858 |
| RescueNet [14] (2020) | 0.741 | 0.835 | 0.697 | 0.906 | 0.493 | 0.722 | 0.837 |
| Weber et al. [12] (2020) | 0.770 | 0.840 | 0.740 | 0.885 | 0.563 | 0.771 | 0.808 |
| FCN [58] | 0.765 | 0.864 | 0.722 | 0.919 | 0.532 | 0.708 | 0.861 |
| SegNet [59] | 0.782 | 0.864 | 0.747 | 0.921 | 0.567 | 0.746 | 0.859 |
| DeepLabv3 [60] | 0.788 | 0.864 | 0.756 | 0.919 | 0.580 | 0.761 | 0.859 |
| Ours (vanilla) | 0.789 | 0.864 | 0.757 | 0.923 | 0.578 | 0.760 | 0.869 |
| **Ours (BDANet)** | **0.806** | **0.864** | **0.782** | **0.925** | **0.616** | **0.788** | **0.876** |
