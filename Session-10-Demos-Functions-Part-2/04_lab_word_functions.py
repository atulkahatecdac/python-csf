#!/usr/bin/env python3
"""Lab - overlapping(), find_longest_word(), filter_long_words().

Run:  python 04_lab_word_functions.py
The three syllabus function-lab programs.
"""


def overlapping(a, b):
    """Return True if lists a and b share at least one member."""
    for item in a:
        if item in b:
            return True          # found one in common: done
    return False


def find_longest_word(words):
    """Return the length of the longest word in the list."""
    longest = 0
    for w in words:
        if len(w) > longest:
            longest = len(w)
    return longest


def filter_long_words(words, n):
    """Return the words that are longer than n characters."""
    return [w for w in words if len(w) > n]


# --- Try them ---------------------------------------------------------------
print("overlapping([1,2,3], [4,5,2]) :", overlapping([1, 2, 3], [4, 5, 2]))
print("overlapping([1,2,3], [4,5,6]) :", overlapping([1, 2, 3], [4, 5, 6]))

words = ["ssh", "firewall", "ip", "encryption", "log", "authentication"]
print("\nwords:", words)
print("longest word length:", find_longest_word(words))
print("longer than 3      :", filter_long_words(words, 3))

# Bonus: the length check again, but using max() with a key
print("actual longest word:", max(words, key=len))
