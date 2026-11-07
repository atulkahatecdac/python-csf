#!/usr/bin/env python3
"""Demo 3 - The exception hierarchy and raising exceptions.

Run:  python 03_hierarchy.py
Shows: that exceptions form a class tree (catch a base to catch its children),
       raising exceptions, and re-raising after logging.
"""

# --- Catching a base class catches its subclasses ---------------------------
# ValueError and KeyError are both subclasses of Exception.
for action in ("value", "key", "zero"):
    try:
        if action == "value":
            int("nope")
        elif action == "key":
            _ = {}["missing"]
        elif action == "zero":
            1 / 0
    except Exception as err:            # one handler, any of the above
        print(f"{action:6} -> {type(err).__name__}: {err}")

# --- LookupError is the parent of KeyError and IndexError -------------------
for container, access in [({"a": 1}, "b"), ([1, 2], 5)]:
    try:
        _ = container[access]
    except LookupError as err:          # catches BOTH KeyError and IndexError
        print(f"LookupError caught: {type(err).__name__}")

# --- raise: signal an error yourself ----------------------------------------
def set_threshold(n):
    if not isinstance(n, int):
        raise TypeError("threshold must be an int")
    if n < 0:
        raise ValueError(f"threshold cannot be negative: {n}")
    return n


for candidate in (5, -1, "x"):
    try:
        print("\nthreshold:", set_threshold(candidate))
    except (TypeError, ValueError) as err:
        print(f"rejected {candidate!r}: {type(err).__name__}: {err}")

# --- Re-raise after logging (don't hide the problem) ------------------------
def load_config(text):
    try:
        return int(text)
    except ValueError:
        print("  [log] bad config value, re-raising")
        raise                           # re-raise the same exception

try:
    load_config("oops")
except ValueError:
    print("  caller still sees the ValueError")
