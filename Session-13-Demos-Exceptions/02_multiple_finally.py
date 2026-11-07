#!/usr/bin/env python3
"""Demo 2 - Multiple except blocks, else and finally.

Run:  python 02_multiple_finally.py
Shows: handling several error types, the else clause (ran on success),
       and finally (always runs - for cleanup).
"""


def read_port_from_file(path):
    """Full try / except / else / finally skeleton."""
    f = None
    try:
        f = open(path, encoding="utf-8")
        port = int(f.readline().strip())
    except FileNotFoundError:
        print(f"  [except] no such file: {path}")
        return None
    except ValueError:
        print("  [except] file's first line is not a number")
        return None
    else:
        print("  [else]   read succeeded, no error")   # runs only if try was clean
        return port
    finally:
        if f:
            f.close()
        print("  [finally] cleanup done (always runs)")


# Create test files
with open("good.txt", "w") as f:
    f.write("443\n")
with open("bad.txt", "w") as f:
    f.write("not-a-port\n")

print("good.txt:")
print("  result:", read_port_from_file("good.txt"))
print("\nbad.txt:")
print("  result:", read_port_from_file("bad.txt"))
print("\nmissing.txt:")
print("  result:", read_port_from_file("missing.txt"))

# --- Catching several types in one line -------------------------------------
for value in ["10", "x", None]:
    try:
        print(f"\nint({value!r}) =", int(value))
    except (ValueError, TypeError) as err:       # a tuple of types
        print(f"int({value!r}) failed: {type(err).__name__}")

import os
for p in ("good.txt", "bad.txt"):
    os.remove(p)
