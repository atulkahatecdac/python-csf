#!/usr/bin/env python3
"""Demo 2 - The os module: files, directories, environment, processes.

Run:  python 02_os_module.py
Shows: os and os.path basics, walking a directory tree, environment variables,
and file metadata - the foundations of triage and automation. Cross-platform.
"""
import os

# --- Where am I, and who am I? ----------------------------------------------
print("cwd      :", os.getcwd())
print("platform :", os.name, "(nt=Windows, posix=Linux/Mac)")
print("user     :", os.environ.get("USERNAME") or os.environ.get("USER"))
print("PATH dirs:", len(os.environ.get("PATH", "").split(os.pathsep)))

# --- os.path: build and inspect paths portably ------------------------------
here = os.path.dirname(os.path.abspath(__file__))
sample = os.path.join(here, "02_os_module.py")      # this file
print("\nbasename :", os.path.basename(sample))
print("ext      :", os.path.splitext(sample)[1])
print("size     :", os.path.getsize(sample), "bytes")
print("exists   :", os.path.exists(sample))
print("is file  :", os.path.isfile(sample))

# --- Walk a directory tree (recursively list files) -------------------------
print("\nPython files in this folder:")
for root, dirs, files in os.walk(here):
    for name in files:
        if name.endswith(".py"):
            full = os.path.join(root, name)
            print(f"  {name:<28} {os.path.getsize(full):>5} bytes")

# --- A triage helper: find large or recently-changed files ------------------
import time
print("\nFiles modified in the last hour:")
cutoff = time.time() - 3600
for name in os.listdir(here):
    full = os.path.join(here, name)
    if os.path.isfile(full) and os.path.getmtime(full) > cutoff:
        age = int((time.time() - os.path.getmtime(full)) / 60)
        print(f"  {name:<28} {age} min ago")
