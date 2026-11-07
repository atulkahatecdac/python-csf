#!/usr/bin/env python3
"""Lab - reverse a string, and check whether a sentence is a pangram.

Run:  python 05_lab_reverse_pangram.py
A pangram contains every letter of the English alphabet at least once.
Sample input: The quick brown fox jumps over the lazy dog
"""
import string

text = input("Enter a sentence: ")

# 1. Reverse - two ways
print("Reversed (slice):", text[::-1])

rev = ""
for ch in text:
    rev = ch + rev            # build up back-to-front
print("Reversed (loop) :", rev)

# 2. Pangram check
letters_present = set()
for ch in text.lower():
    if ch in string.ascii_lowercase:
        letters_present.add(ch)

missing = set(string.ascii_lowercase) - letters_present
if not missing:
    print("This IS a pangram - all 26 letters are present")
else:
    print("Not a pangram. Missing:", "".join(sorted(missing)))
