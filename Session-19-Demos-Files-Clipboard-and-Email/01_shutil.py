#!/usr/bin/env python3
"""Demo 1 - shutil: high-level file and folder operations.

Run:  python 01_shutil.py
Shows: copy, move, make an archive, disk usage, find an executable.
Great for evidence handling: copy files preserving metadata, then zip them.
Works on a temporary folder so it cleans up after itself. Cross-platform.
"""
import shutil
import os
import tempfile

work = tempfile.mkdtemp(prefix="csf_shutil_")
print("Working in:", work)

# --- Create some sample evidence files --------------------------------------
case = os.path.join(work, "case01")
os.makedirs(case)
for name in ("notes.txt", "image.dd", "memory.raw"):
    with open(os.path.join(case, name), "w") as f:
        f.write(f"sample contents of {name}\n")

# --- copy2 preserves metadata (timestamps) - important for evidence ---------
src = os.path.join(case, "notes.txt")
dst = os.path.join(work, "notes_copy.txt")
shutil.copy2(src, dst)
print("\ncopied notes.txt (with metadata):", os.path.exists(dst))

# --- copytree / move --------------------------------------------------------
backup = os.path.join(work, "case01_backup")
shutil.copytree(case, backup)
print("copied whole folder:", len(os.listdir(backup)), "files")

moved = os.path.join(work, "archived_notes.txt")
shutil.move(dst, moved)
print("moved file:", os.path.basename(moved))

# --- make_archive: zip up evidence for transfer -----------------------------
zip_base = os.path.join(work, "case01_evidence")
archive = shutil.make_archive(zip_base, "zip", case)
print("\nmade archive:", os.path.basename(archive),
      f"({os.path.getsize(archive)} bytes)")

# --- disk_usage and which ---------------------------------------------------
usage = shutil.disk_usage(work)
print(f"\ndisk: {usage.free / 1e9:.0f} GB free of {usage.total / 1e9:.0f} GB")
print("python on PATH:", shutil.which("python") or shutil.which("python3"))

# --- Clean up ---------------------------------------------------------------
shutil.rmtree(work)
print("\ncleaned up:", not os.path.exists(work))
