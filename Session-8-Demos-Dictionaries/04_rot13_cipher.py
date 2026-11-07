#!/usr/bin/env python3
"""Lab - ROT-13 encoder/decoder using a dictionary (Caesar cipher).

Run:  python 04_rot13_cipher.py
A Caesar cipher shifts each letter a fixed number of places. ROT-13 shifts by 13,
so applying it twice returns the original. The syllabus gives the mapping as a dict.
Secret message to decode: Pnrfne pvcure? V zhpu cersre Pnrfne fnynq!
"""

# Build the ROT-13 key as a dictionary (as the syllabus shows it)
key = {}
for i in range(26):
    lower_plain = chr(ord("a") + i)
    lower_cipher = chr(ord("a") + (i + 13) % 26)
    key[lower_plain] = lower_cipher
    key[lower_plain.upper()] = lower_cipher.upper()


def rot13(text):
    """Translate text through the ROT-13 dict; non-letters pass through."""
    result = ""
    for ch in text:
        result += key.get(ch, ch)      # keep punctuation/spaces unchanged
    return result


message = "Caesar cipher? I much prefer Caesar salad!"
secret = "Pnrfne pvcure? V zhpu cersre Pnrfne fnynq!"

print("Original :", message)
encoded = rot13(message)
print("Encoded  :", encoded)
print("Decoded  :", rot13(encoded), "(same as original)")

print("\nSecret   :", secret)
print("Decoded  :", rot13(secret))

# Python's standard library can do this too:
import codecs
print("\nvia codecs:", codecs.encode(message, "rot_13"))
