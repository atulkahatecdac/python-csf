#!/usr/bin/env python3
"""Demo 5 - Recursion and lambda (functions as data).

Run:  python 05_recursion_lambda.py
Shows: a recursive factorial and directory-walk, lambda expressions,
       and functions passed to sorted()/filter()/map().
"""
import os

# --- Recursion: a function that calls itself (with a base case) -------------
def factorial(n):
    if n <= 1:                       # base case stops the recursion
        return 1
    return n * factorial(n - 1)      # recursive case

print("factorial(5):", factorial(5))

# --- Recursion fits tree-shaped data, like a filesystem ---------------------
def total_size(path):
    """Sum the sizes of all files under path (recursion over subfolders)."""
    if os.path.isfile(path):
        return os.path.getsize(path)
    total = 0
    for entry in os.listdir(path):
        total += total_size(os.path.join(path, entry))
    return total

here = os.path.dirname(os.path.abspath(__file__))
print(f"Bytes in this demo folder: {total_size(here):,}")

# --- lambda: a tiny anonymous function --------------------------------------
double = lambda x: x * 2            # usually used inline, not named
print("\ndouble(21):", double(21))

# --- Functions as arguments: sort connections by a chosen field -------------
conns = [("10.0.0.5", 443), ("10.0.0.7", 4444), ("10.0.0.6", 22)]
by_port = sorted(conns, key=lambda c: c[1])
print("sorted by port:", by_port)

# --- filter() and map() take a function -------------------------------------
ports = [22, 4444, 80, 31337, 443]
suspicious = list(filter(lambda p: p > 1024, ports))
as_text = list(map(lambda p: f"port-{p}", ports))
print("filter >1024:", suspicious)
print("map to text :", as_text)
