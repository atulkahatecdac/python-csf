#!/usr/bin/env python3
"""Demo 2 - Argument styles: positional, keyword, default.

Run:  python 02_arguments.py
Shows: positional vs keyword arguments, default values, and the order rules.
"""


def connect(host, port=22, timeout=5, use_tls=False):
    """Describe a connection; only host is required."""
    proto = "TLS" if use_tls else "plain"
    return f"{host}:{port} ({proto}, timeout={timeout}s)"


# --- Positional: matched by order -------------------------------------------
print(connect("10.0.0.5"))                       # all defaults
print(connect("10.0.0.5", 443))                  # override port

# --- Keyword: matched by name (order-independent, self-documenting) ---------
print(connect("10.0.0.5", use_tls=True, port=443))
print(connect("web01", timeout=10))

# --- Mixing: positional first, then keyword ---------------------------------
print(connect("mail01", 993, use_tls=True))

# --- The mutable-default trap (very common bug) -----------------------------
def add_finding_BAD(finding, report=[]):         # DON'T: list shared across calls
    report.append(finding)
    return report

print("\nMutable-default trap:")
print(add_finding_BAD("open port 23"))
print(add_finding_BAD("weak cipher"))            # unexpectedly keeps the first!

def add_finding(finding, report=None):           # DO: create a fresh list
    if report is None:
        report = []
    report.append(finding)
    return report

print("\nFixed:")
print(add_finding("open port 23"))
print(add_finding("weak cipher"))                # independent, as expected
