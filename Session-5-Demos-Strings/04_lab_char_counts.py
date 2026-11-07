#!/usr/bin/env python3
"""Lab - count upper/lowercase letters, and count vowels in a line.

Run:  python 04_lab_char_counts.py
Sample input: Hello World from Python 3
"""

text = input("Enter a line of text: ")

upper = lower = digits = spaces = other = 0
for ch in text:
    if ch.isupper():
        upper += 1
    elif ch.islower():
        lower += 1
    elif ch.isdigit():
        digits += 1
    elif ch.isspace():
        spaces += 1
    else:
        other += 1

print(f"Uppercase : {upper}")
print(f"Lowercase : {lower}")
print(f"Digits    : {digits}")
print(f"Spaces    : {spaces}")
print(f"Other     : {other}")

# Count vowels (a, e, i, o, u), ignoring case
vowels = 0
for ch in text.lower():
    if ch in "aeiou":
        vowels += 1
print(f"Vowels    : {vowels}")
