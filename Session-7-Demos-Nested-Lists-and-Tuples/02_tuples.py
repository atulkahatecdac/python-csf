#!/usr/bin/env python3
"""Demo 2 - Tuples: immutable sequences.

Run:  python 02_tuples.py
Shows: creating tuples, the one-element gotcha, immutability,
       tuple methods, and why tuples make good dict keys / fixed records.
"""

# --- Creating ---------------------------------------------------------------
endpoint = ("10.0.0.5", 443)               # a fixed (host, port) record
one = (42,)                                 # one-element tuple NEEDS the comma
not_a_tuple = (42)                          # this is just the int 42
empty = ()
print("endpoint:", endpoint, "| one:", one, "| (42) is:", type(not_a_tuple).__name__)

# --- Parentheses are optional -----------------------------------------------
rgb = 255, 128, 0                           # still a tuple
print("rgb:", rgb)

# --- Immutable --------------------------------------------------------------
try:
    endpoint[1] = 8443
except TypeError as err:
    print("TypeError:", err)

# --- Indexing, slicing and methods (a small set) ----------------------------
print("\nhost:", endpoint[0], "| port:", endpoint[1])
flags = ("SYN", "ACK", "SYN", "FIN", "SYN")
print("count('SYN'):", flags.count("SYN"))
print("index('FIN'):", flags.index("FIN"))

# --- Why tuples: immutable, so they can be dict keys / set members ----------
seen = {}
seen[("10.0.0.5", 443)] = "https"
seen[("10.0.0.5", 22)] = "ssh"
print("\nservice map:", seen)
print("look up:", seen[("10.0.0.5", 22)])
# A list key would raise: TypeError: unhashable type: 'list'
