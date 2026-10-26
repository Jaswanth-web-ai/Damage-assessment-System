import base64
import os
import subprocess
from pathlib import Path
import pypdf

WORKSPACE = Path(r"d:\DisasterAid")
HTML_FILE = WORKSPACE / "project_documentation.html"
PDF_FILE = WORKSPACE / "DisasterAid_Project_Documentation.pdf"

def get_base64_image(rel_path: str) -> str:
    path = WORKSPACE / rel_path
    if not path.exists():
        print(f"Warning: Image not found at {path}")
        return ""
    suffix = path.suffix.lower().replace(".", "")
    mime = "image/png" if suffix == "png" else "image/jpeg" if suffix in ["jpg", "jpeg"] else "image/svg+xml"
    with open(path, "rb") as f:
        encoded = base64.b64encode(f.read()).decode("utf-8")
    return f"data:{mime};base64,{encoded}"

print("Reading and encoding figures to base64...")
fig1_b64 = get_base64_image("basepaper/outputs/graphs/fig1_sota_f1_comparison.png")
fig2_b64 = get_base64_image("basepaper/outputs/graphs/fig2_ablation_study.png")
fig3_b64 = get_base64_image("basepaper/outputs/graphs/fig3_confusion_matrix_heatmap.png")
fig4_b64 = get_base64_image("basepaper/outputs/graphs/fig4_training_curves_fig8.png")
fig5_b64 = get_base64_image("basepaper/outputs/graphs/fig5_radar_sota_comparison.png")
pred0_b64 = get_base64_image("basepaper/outputs/predictions/disaster_test_000_comparison.png")
pred1_b64 = get_base64_image("basepaper/outputs/predictions/disaster_test_001_comparison.png")

template_path = WORKSPACE / "doc_template.html"
if not template_path.exists():
    raise FileNotFoundError("doc_template.html not found")

with open(template_path, "r", encoding="utf-8") as f:
    content = f.read()

content = content.replace("__FIG1__", fig1_b64)
content = content.replace("__FIG2__", fig2_b64)
content = content.replace("__FIG3__", fig3_b64)
content = content.replace("__FIG4__", fig4_b64)
content = content.replace("__FIG5__", fig5_b64)
content = content.replace("__PRED0__", pred0_b64)
content = content.replace("__PRED1__", pred1_b64)

with open(HTML_FILE, "w", encoding="utf-8") as f:
    f.write(content)

print(f"HTML generated successfully at {HTML_FILE} ({HTML_FILE.stat().st_size:,} bytes)")

edge_path = r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"
if not os.path.exists(edge_path):
    edge_path = r"C:\Program Files\Google\Chrome\Application\chrome.exe"

print(f"Compiling PDF using {edge_path}...")
cmd = [
    edge_path,
    "--headless=new",
    "--disable-gpu",
    "--no-pdf-header-footer",
    "--allow-file-access-from-files",
    f"--print-to-pdf={PDF_FILE}",
    str(HTML_FILE)
]

res = subprocess.run(cmd, capture_output=True, text=True, timeout=60)
print("Browser exit code:", res.returncode)

if PDF_FILE.exists():
    reader = pypdf.PdfReader(str(PDF_FILE))
    page_count = len(reader.pages)
    size_mb = PDF_FILE.stat().st_size / (1024 * 1024)
    print("=" * 60)
    print(f"SUCCESS! Official PDF Documentation Generated:")
    print(f"Location: {PDF_FILE}")
    print(f"Total Pages: {page_count}")
    print(f"File Size: {size_mb:.2f} MB ({PDF_FILE.stat().st_size:,} bytes)")
    print("=" * 60)
else:
    print("Error: PDF file was not created!")
