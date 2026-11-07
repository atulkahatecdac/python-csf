#!/usr/bin/env python3
"""Demo 4 - Nested loops.

Run:  python 04_nested_loops.py
Shows: a loop inside a loop: address generation, a table,
       and why short PINs fall to brute force (offline, against our own hash).
"""
import hashlib
import time

# --- Generate addresses for two /30-sized blocks -----------------------------
for third in (10, 20):
    for host in range(1, 3):
        print(f"192.168.{third}.{host}", end="  ")
print()

# --- Multiplication table (self-learning task) ------------------------------
for row in range(1, 6):
    for col in range(1, 6):
        print(f"{row * col:4}", end="")
    print()

# --- Why 4-digit PINs are weak ---------------------------------------------------
# We store the SHA-256 of a PIN we chose, then recover it by trying every PIN.
stored_hash = hashlib.sha256(b"7392").hexdigest()

start = time.perf_counter()
tries = 0
found = None
for a in range(10):
    for b in range(10):
        for c in range(10):
            for d in range(10):
                guess = f"{a}{b}{c}{d}"
                tries += 1
                h = hashlib.sha256(guess.encode())
                if h.hexdigest() == stored_hash:
                    found = guess
                    break
            if found: break
        if found: break
    if found: break
elapsed = time.perf_counter() - start
print(f"\nPIN recovered: {found} after {tries:,} tries in {elapsed:.3f} s")
print("Lesson: a 10,000-value space offers no protection offline; use rate limits and salts.")
