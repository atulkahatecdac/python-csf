#!/usr/bin/env python3
"""Lab - short words, append one file to another, count lines starting with 'A'.

Run:  python 03_lab_file_programs.py
The three syllabus file-handling lab programs, plus a line/word/char count.
"""

SRC = "sample_auth.log"

# 1. Display all words shorter than 4 characters
print("Words with fewer than 4 characters:")
short = []
with open(SRC, encoding="utf-8") as f:
    for line in f:
        for word in line.split():
            if len(word) < 4:
                short.append(word)
print(" ", short)

# 2. Append the contents of one file to another
with open(SRC, encoding="utf-8") as src, open("combined.log", "w", encoding="utf-8") as dst:
    dst.write(src.read())                       # start combined.log with SRC
with open(SRC, encoding="utf-8") as src, open("combined.log", "a", encoding="utf-8") as dst:
    dst.write(src.read())                       # append SRC again
with open("combined.log", encoding="utf-8") as f:
    print("\ncombined.log line count:", len(f.readlines()))

# 3. Count lines that start with 'A'
count = 0
with open(SRC, encoding="utf-8") as f:
    for line in f:
        if line.startswith("A"):
            count += 1
print("Lines starting with 'A':", count)

# Bonus (self-learning): count lines, words and characters (like 'wc')
lines = words = chars = 0
with open(SRC, encoding="utf-8") as f:
    for line in f:
        lines += 1
        words += len(line.split())
        chars += len(line)
print(f"\nwc-style -> lines={lines} words={words} chars={chars}")
