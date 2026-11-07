#!/usr/bin/env python3
"""Lab - odd or even, and the largest of three numbers.

Run:  python 04_lab_odd_even_largest.py
Sample input: 17, then 42 7 19
"""

# 1. Odd or even
n = int(input("Enter a number: "))
if n % 2 == 0:
    print(n, "is even")
else:
    print(n, "is odd")

# 2. Largest of three - with if/elif
a, b, c = input("Enter three numbers separated by spaces: ").split()
a, b, c = int(a), int(b), int(c)

if a >= b and a >= c:
    largest = a
elif b >= a and b >= c:
    largest = b
else:
    largest = c
print("Largest (if/elif):", largest)

# ...and the built-in way
print("Largest (max())  :", max(a, b, c))
