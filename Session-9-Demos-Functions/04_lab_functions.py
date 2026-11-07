#!/usr/bin/env python3
"""Lab - same-length strings, box volume with defaults, cube with default 2.

Run:  python 04_lab_functions.py
"""


def same_length(a, b):
    """Return True if the two strings have the same length."""
    return len(a) == len(b)


def box_volume(length=1, width=1, height=1):
    """Volume of a box; every dimension defaults to 1."""
    return length * width * height


def cube(n=2):
    """Cube of n; if no value is passed, cube 2."""
    return n ** 3


# --- same_length ------------------------------------------------------------
print("same_length('abc', 'xyz') :", same_length("abc", "xyz"))
print("same_length('hi', 'hello'):", same_length("hi", "hello"))

# --- box_volume (shows positional, keyword and default use) -----------------
print("\nbox_volume(2, 3, 4) :", box_volume(2, 3, 4))
print("box_volume(5)       :", box_volume(5))             # width/height = 1
print("box_volume(height=10):", box_volume(height=10))    # others = 1

# --- cube -------------------------------------------------------------------
print("\ncube(5):", cube(5))
print("cube() :", cube())                                  # uses default 2
