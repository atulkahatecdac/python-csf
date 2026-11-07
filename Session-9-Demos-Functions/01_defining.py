#!/usr/bin/env python3
"""Demo 1 - Defining and calling functions.

Run:  python 01_defining.py
Shows: def, parameters vs arguments, docstrings, returning a value,
       and why functions beat copy-pasted code.
"""


def is_private_ip(ip):
    """Return True if ip is in a private (RFC 1918) range."""
    return (ip.startswith("10.")
            or ip.startswith("192.168.")
            or ip.startswith("172.16."))


def banner(text):
    """Print text inside a box (a reusable bit of formatting)."""
    line = "+" + "-" * (len(text) + 2) + "+"
    print(line)
    print(f"| {text} |")
    print(line)


# --- Calling ----------------------------------------------------------------
banner("Scan Report")

for ip in ["10.0.0.5", "8.8.8.8", "192.168.1.1", "45.155.205.233"]:
    label = "internal" if is_private_ip(ip) else "EXTERNAL"
    print(f"{ip:<16} {label}")

# --- A function that returns a value is used in an expression ---------------
internal_count = sum(1 for ip in ["10.0.0.5", "8.8.8.8", "192.168.1.1"]
                     if is_private_ip(ip))
print("\nInternal hosts:", internal_count)

# --- Read the docstring at runtime ------------------------------------------
print("\nHelp for is_private_ip:")
print(" ", is_private_ip.__doc__)
