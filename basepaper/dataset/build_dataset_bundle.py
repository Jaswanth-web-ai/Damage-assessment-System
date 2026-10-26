import os
import json

base_dir = r"d:\DisasterAid\basepaper\dataset"
data_dir = os.path.join(base_dir, "data")

bundle = {
    "stats": {},
    "train_samples": [],
    "test_samples": []
}

with open(os.path.join(data_dir, "dataset_stats.json")) as f:
    bundle["stats"] = json.load(f)

for split in ["train", "test"]:
    manifest_p = os.path.join(data_dir, f"{split}_manifest.json")
    with open(manifest_p) as f:
        manifest = json.load(f)
    for item in manifest:
        meta_p = os.path.join(data_dir, split, "targets", f"{item['id']}_meta.json")
        with open(meta_p) as mf:
            meta = json.load(mf)
        entry = {
            "id": item["id"],
            "split": split,
            "pre_image": "data/" + item["pre_image"].replace("\\", "/"),
            "post_image": "data/" + item["post_image"].replace("\\", "/"),
            "loc_target": "data/" + item["loc_target"].replace("\\", "/"),
            "dmg_target": "data/" + item["dmg_target"].replace("\\", "/"),
            "comparison": f"../outputs/predictions/{item['id']}_comparison.png" if split == "test" else None,
            "buildings": meta
        }
        if split == "train":
            bundle["train_samples"].append(entry)
        else:
            bundle["test_samples"].append(entry)

out_js = os.path.join(base_dir, "dataset_bundle.js")
with open(out_js, "w") as f:
    f.write("window.DATASET_BUNDLE = " + json.dumps(bundle, indent=2) + ";\n")

print(f"Bundle successfully written to {out_js} with {len(bundle['train_samples'])} train & {len(bundle['test_samples'])} test samples!")
