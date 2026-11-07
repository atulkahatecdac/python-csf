#!/usr/bin/env python3
"""Demo 5 - Mini project: an evidence packager.

Run:  python 05_evidence_packager.py
Brings together shutil + hashlib + json: collect files into a case folder,
hash each (chain of custody), copy them preserving metadata, zip the case,
and write a manifest. Uses a temp area and cleans up. Cross-platform.
"""
import shutil
import hashlib
import json
import os
import tempfile
from datetime import datetime

work = tempfile.mkdtemp(prefix="csf_case_")

# --- Pretend these are the artifacts we collected ---------------------------
sources = {}
src_dir = os.path.join(work, "collected")
os.makedirs(src_dir)
for name, content in [("hosts.txt", "10.0.0.5\n10.0.0.7\n"),
                      ("iocs.csv", "ip,first_seen\n45.155.205.233,2026-11-07\n"),
                      ("note.md", "# Case notes\nSuspicious logins from .233\n")]:
    path = os.path.join(src_dir, name)
    with open(path, "w") as f:
        f.write(content)
    sources[name] = path


def sha256_file(path):
    h = hashlib.sha256()
    with open(path, "rb") as f:
        for block in iter(lambda: f.read(65536), b""):
            h.update(block)
    return h.hexdigest()


# --- Build the case: copy with metadata, hash, record -----------------------
case = os.path.join(work, "CASE-2026-011")
os.makedirs(case)
manifest = {"case": "CASE-2026-011",
            "collected": datetime.now().isoformat(timespec="seconds"),
            "items": []}

for name, path in sources.items():
    digest = sha256_file(path)
    shutil.copy2(path, os.path.join(case, name))      # preserve timestamps
    manifest["items"].append({"file": name,
                              "sha256": digest,
                              "size": os.path.getsize(path)})

# --- Write the manifest and zip the case ------------------------------------
with open(os.path.join(case, "manifest.json"), "w") as f:
    json.dump(manifest, f, indent=2)

archive = shutil.make_archive(os.path.join(work, "CASE-2026-011"), "zip", case)

# --- Report -----------------------------------------------------------------
print(f"Case packaged: {os.path.basename(archive)} "
      f"({os.path.getsize(archive)} bytes)\n")
print("Manifest:")
for item in manifest["items"]:
    print(f"  {item['file']:<12} {item['size']:>4} B  {item['sha256'][:16]}...")

print("\nThe SHA-256 of each file is the chain of custody: re-hash later to")
print("prove nothing changed. The zip is a single, verifiable evidence bundle.")

shutil.rmtree(work)
