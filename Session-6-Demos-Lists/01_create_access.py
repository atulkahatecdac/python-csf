#!/usr/bin/env python3
"""Demo 1 - Creating and accessing lists.

Run:  python 01_create_access.py
Shows: list literals, list(), indexing, slicing, negative indexes,
       len(), and that lists are mutable and ordered.
"""

# --- Creating ---------------------------------------------------------------
ports = [22, 80, 443, 3389]                 # literal
empty = []
chars = list("GET")                          # from an iterable -> ['G', 'E', 'T']
nums = list(range(1, 6))                      # [1, 2, 3, 4, 5]
mixed = ["10.0.0.5", 443, True, None]         # any types, mixed
print(ports, empty, chars, nums, mixed, sep="\n")

# --- Accessing --------------------------------------------------------------
print("\nFirst :", ports[0])
print("Last  :", ports[-1])
print("Slice :", ports[1:3])                  # [80, 443]
print("Count :", len(ports))

# --- Lists are mutable ------------------------------------------------------
ports[0] = 21                                 # change in place
print("\nAfter edit:", ports)
ports[1:3] = [8080, 8443]                     # replace a slice
print("After slice replace:", ports)

# --- Membership and a quick scan summary -----------------------------------
open_now = [22, 80]
for p in [21, 22, 80, 445]:
    print(f"Port {p:>4}: {'OPEN' if p in open_now else 'closed'}")
