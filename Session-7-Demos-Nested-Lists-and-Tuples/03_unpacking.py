#!/usr/bin/env python3
"""Demo 3 - Tuple unpacking (and where tuples appear everywhere).

Run:  python 03_unpacking.py
Shows: basic unpacking, swap, starred unpacking, functions returning
       tuples, enumerate/zip/items all yielding tuples.
"""

# --- Basic unpacking --------------------------------------------------------
host, port = ("10.0.0.5", 443)
print("host:", host, "| port:", port)

# --- Swap without a temp (it's tuple packing + unpacking) -------------------
a, b = 1, 2
a, b = b, a
print("swapped:", a, b)

# --- Starred unpacking: first, *middle, last --------------------------------
octets = [10, 0, 0, 5]
first, *rest = octets
*head, last = octets
print("first:", first, "| rest:", rest, "| last:", last)

# --- Functions return tuples (so you can return several values) -------------
def min_max_avg(values):
    return min(values), max(values), sum(values) / len(values)

lo, hi, avg = min_max_avg([42, 7, 128, 15, 3])
print(f"\nlo={lo} hi={hi} avg={avg}")

# --- The loops you already use are handing you tuples -----------------------
services = {22: "ssh", 80: "http"}
for port, name in services.items():          # each item is a (key, value) tuple
    print(f"  {port} -> {name}")

for i, letter in enumerate("AB", start=1):   # (index, item) tuples
    print(f"  {i}:{letter}")

for ip, status in zip(["10.0.0.5", "10.0.0.6"], ["up", "down"]):
    print(f"  {ip} is {status}")
