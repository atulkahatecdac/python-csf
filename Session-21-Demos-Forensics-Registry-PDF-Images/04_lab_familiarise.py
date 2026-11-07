#!/usr/bin/env python3
"""Lab - familiarise with pypdf, Pillow and winreg (syllabus lab task).

Run:  python 04_lab_familiarise.py
A short tour. pypdf and Pillow are cross-platform; winreg is Windows-only.
"""
from pypdf import PdfWriter, PdfReader
from PIL import Image
import os

print("=== pypdf ===")
w = PdfWriter()
w.add_blank_page(width=200, height=200)
w.add_metadata({"/Author": "demo", "/Title": "Lab"})
with open("x.pdf", "wb") as f:
    w.write(f)
r = PdfReader("x.pdf")
print("pages   :", len(r.pages))
print("metadata:", {k: r.metadata[k] for k in r.metadata})
os.remove("x.pdf")

print("\n=== Pillow ===")
im = Image.new("RGB", (120, 80), (200, 60, 60))
print("size    :", im.size, "| mode:", im.mode)
print("getpixel:", im.getpixel((0, 0)))
small = im.resize((30, 20))
print("resized :", small.size)
print("formats :", [f for f in ("JPEG", "PNG", "GIF", "BMP")])

print("\n=== winreg (Windows) ===")
try:
    import winreg
    with winreg.OpenKey(winreg.HKEY_CURRENT_USER, r"Environment") as k:
        print("HKCU\\Environment values:", winreg.QueryInfoKey(k)[1])
except ImportError:
    print("winreg not available (not on Windows)")

print("\nExplore: dir(PdfReader), help(Image.open), dir(winreg).")
