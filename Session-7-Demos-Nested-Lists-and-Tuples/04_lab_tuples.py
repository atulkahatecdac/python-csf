#!/usr/bin/env python3
"""Lab - Fibonacci tuple (first 9 terms), min and max of a tuple.

Run:  python 04_lab_tuples.py
"""

# 1. Build a tuple of the first 9 Fibonacci terms
fib = []                       # build in a list (tuples are immutable)...
a, b = 0, 1
for _ in range(9):
    fib.append(a)
    a, b = b, a + b
fib = tuple(fib)               # ...then freeze it into a tuple
print("First 9 Fibonacci terms:", fib)
print("Type:", type(fib).__name__)

# 2. Minimum and maximum of a tuple
values = (42, 7, 128, 15, 3, 99)
print("\nTuple :", values)
print("Min   :", min(values))
print("Max   :", max(values))
print("Sum   :", sum(values))

# Tuples are immutable, so there is no .append(); build a new one if needed
values = values + (256,)
print("After adding 256 (new tuple):", values)
