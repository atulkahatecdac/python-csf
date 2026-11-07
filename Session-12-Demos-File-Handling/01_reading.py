#!/usr/bin/env python3
"""Demo 1 - Reading files: the four ways, and why 'with' matters.

Run:  python 01_reading.py
Shows: open modes, read(), readline(), readlines(), iterating a file object,
       and the 'with' context manager that always closes the file.
"""

PATH = "sample_auth.log"

# --- The right way: 'with' closes the file even if an error happens ----------
with open(PATH, "r", encoding="utf-8") as f:
    content = f.read()                 # whole file as one string
print("read(): file is", len(content), "characters")

# --- readline(): one line at a time (good for huge files) -------------------
with open(PATH, encoding="utf-8") as f:
    first = f.readline()
    second = f.readline()
print("\nFirst line :", first.strip())
print("Second line:", second.strip())

# --- readlines(): a list of all lines ---------------------------------------
with open(PATH, encoding="utf-8") as f:
    lines = f.readlines()
print("\nreadlines(): got", len(lines), "lines")

# --- Iterating the file object: the memory-friendly idiom -------------------
print("\nFailed logins:")
with open(PATH, encoding="utf-8") as f:
    for line in f:                     # reads one line per loop, lazily
        if line.startswith("Failed"):
            print("  ", line.strip())

# --- What happens WITHOUT 'with' (don't do this) ----------------------------
f = open(PATH, encoding="utf-8")
print("\nmanual open - remember to close!")
f.close()                              # easy to forget; leaks the handle
print("closed?", f.closed)
