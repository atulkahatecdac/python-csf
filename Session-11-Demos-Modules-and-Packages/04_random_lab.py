#!/usr/bin/env python3
"""Lab - the random module: dice, random IPv4, and a token.

Run:  python 04_random_lab.py
Covers the self-learning tasks: simulate dice, generate random IPv4 addresses.
NOTE: random is fine for simulations/tests, NOT for security tokens -
      use the 'secrets' module for anything that must be unguessable.
"""
import random
import secrets
import string

# --- Dice simulation --------------------------------------------------------
print("Rolling two dice five times:")
for _ in range(5):
    d1, d2 = random.randint(1, 6), random.randint(1, 6)
    print(f"  {d1} + {d2} = {d1 + d2}")

# --- Random IPv4 addresses (for test data / lab traffic) --------------------
print("\nRandom IPv4 test addresses:")
for _ in range(3):
    ip = ".".join(str(random.randint(0, 255)) for _ in range(4))
    print("  ", ip)

# --- Pick / shuffle / sample ------------------------------------------------
subnet = [f"10.0.0.{h}" for h in range(1, 11)]
print("\nrandom.choice :", random.choice(subnet))
print("random.sample :", random.sample(subnet, 3))   # 3 distinct hosts

# --- Reproducible runs with a seed (important for testing) ------------------
random.seed(42)
a = [random.randint(1, 100) for _ in range(3)]
random.seed(42)
b = [random.randint(1, 100) for _ in range(3)]
print("\nSame seed -> same sequence:", a, "==", b)

# --- The RIGHT tool for security tokens: secrets ----------------------------
alphabet = string.ascii_letters + string.digits
token = "".join(secrets.choice(alphabet) for _ in range(16))
print("\nSecure token (secrets):", token)
