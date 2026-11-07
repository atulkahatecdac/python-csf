#!/usr/bin/env python3
"""Lab - familiarise with shutil, win32clipboard and the email module.

Run:  python 04_lab_familiarise.py
A short tour of each. shutil and email are cross-platform; clipboard is Windows.
"""
import shutil
import tempfile
import os
from email.message import EmailMessage

print("=== shutil ===")
print("disk_usage:", f"{shutil.disk_usage('.').free / 1e9:.0f} GB free")
print("which      :", shutil.which("python") or shutil.which("python3"))
print("archive fmts:", [f[0] for f in shutil.get_archive_formats()])

print("\n=== email (build a message) ===")
m = EmailMessage()
m["From"] = "analyst@soc.example"
m["To"] = "lead@soc.example"
m["Subject"] = "Daily report"
m.set_content("3 alerts, 0 criticals.")
print("built message with headers:", list(m.keys()))
print("body:", m.get_content().strip())

print("\n=== win32clipboard (Windows) ===")
try:
    import win32clipboard, win32con
    win32clipboard.OpenClipboard()
    has_text = win32clipboard.IsClipboardFormatAvailable(win32con.CF_UNICODETEXT)
    win32clipboard.CloseClipboard()
    print("clipboard has text right now:", bool(has_text))
except ImportError:
    print("win32clipboard not available (not on Windows)")

# A tiny shutil demo: zip this folder to a temp file, then remove it
tmp = tempfile.mkdtemp()
archive = shutil.make_archive(os.path.join(tmp, "demos"), "zip", ".")
print("\nzipped this folder ->", os.path.basename(archive),
      f"({os.path.getsize(archive)} bytes)")
shutil.rmtree(tmp)
