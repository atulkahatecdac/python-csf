#!/usr/bin/env python3
"""Lab - familiarise with Beautiful Soup and os (the syllabus lab task).

Run:  python 04_lab_familiarise.py
Quick tour of the functions you'll use most. Offline and cross-platform.
"""
from bs4 import BeautifulSoup
import os

print("=== Beautiful Soup ===")
soup = BeautifulSoup("<ul><li class='ok'>a</li><li>b</li></ul>", "html.parser")
print("find      :", soup.find("li").get_text())
print("find_all  :", [li.get_text() for li in soup.find_all("li")])
print("by class  :", soup.find("li", class_="ok").get_text())
print("tag name  :", soup.find("li").name)

print("\n=== os / os.path ===")
print("sep       :", repr(os.sep), "| pathsep:", repr(os.pathsep))
print("join      :", os.path.join("logs", "2026", "auth.log"))
print("split     :", os.path.split("/var/log/auth.log"))
print("splitext  :", os.path.splitext("report.final.pdf"))
print("abspath   :", os.path.basename(os.path.abspath(".")))
print("listdir   :", len(os.listdir(".")), "entries here")

# A tiny, safe automation: count files by extension in this folder
counts = {}
for name in os.listdir("."):
    if os.path.isfile(name):
        ext = os.path.splitext(name)[1] or "(none)"
        counts[ext] = counts.get(ext, 0) + 1
print("\nFiles by extension:", counts)
