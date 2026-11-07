#!/usr/bin/env python3
"""Demo 3 - Mutable vs immutable objects.

Run:  python 03_mutable_immutable.py
Shows: "changing" an immutable object creates a new one; changing a mutable
       object is seen through every name that points to it (aliasing).
"""

# --- Immutable: str, int, float, bool, tuple, bytes, frozenset ----------
user = "guest"
print("before:", user, id(user))
user = user + "_admin"                 # builds a NEW string object
print("after :", user, id(user))       # different id

hash_value = "5f4dcc3b5aa765d61d8327deb882cf99"
try:
    hash_value[0] = "X"                # strings cannot be changed in place
except TypeError as err:
    print("TypeError:", err)

# --- Mutable: list, dict, set, bytearray --------------------------------
blocked = ["10.0.0.7"]
print("\nbefore:", blocked, id(blocked))
blocked.append("10.0.0.9")             # same object, changed in place
print("after :", blocked, id(blocked))  # same id

# --- The aliasing trap ---------------------------------------------------
default_rules = ["allow 443", "allow 80"]
guest_rules = default_rules            # NOT a copy - a second name
guest_rules.append("allow 23")         # someone opens telnet for guests...
print("\ndefault_rules:", default_rules)   # ...and the default policy changed too!

# Fix: make a real copy
default_rules = ["allow 443", "allow 80"]
guest_rules = default_rules.copy()
guest_rules.append("allow 23")
print("default_rules:", default_rules)
print("guest_rules  :", guest_rules)

# --- is vs == ------------------------------------------------------------
a = [1, 2, 3]
b = [1, 2, 3]
print("\na == b:", a == b, "(same value)")
print("a is b:", a is b, "(same object?)")

# --- Why it matters: only immutable objects can be dict keys / set items --
seen = {("10.0.0.5", 22): "ssh"}       # tuple key: OK
try:
    seen[["10.0.0.5", 22]] = "ssh"     # list key: not allowed
except TypeError as err:
    print("TypeError:", err)
