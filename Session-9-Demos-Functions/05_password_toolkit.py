#!/usr/bin/env python3
"""Demo 5 - Mini project: a small password-strength toolkit of functions.

Run:  python 05_password_toolkit.py
Brings together: several small functions, default and keyword arguments,
returning values, and composing functions into a report.
"""
import hashlib


def entropy_bits(length, charset_size):
    """Rough password entropy in bits: length * log2(charset)."""
    import math
    return round(length * math.log2(charset_size), 1)


def charset_size(pw):
    """Estimate the character set a password draws from."""
    size = 0
    if any(c.islower() for c in pw):
        size += 26
    if any(c.isupper() for c in pw):
        size += 26
    if any(c.isdigit() for c in pw):
        size += 10
    if any(not c.isalnum() for c in pw):
        size += 32
    return size


def strength(pw, min_bits=60):
    """Classify a password; the threshold is a keyword argument."""
    bits = entropy_bits(len(pw), max(charset_size(pw), 1))
    if bits >= min_bits:
        return "strong", bits
    elif bits >= min_bits * 0.6:
        return "fair", bits
    return "weak", bits


def sha256(pw):
    """Return the hex SHA-256 of a password (for the leaked-hash idea)."""
    return hashlib.sha256(pw.encode()).hexdigest()


# --- Compose the functions into a report ------------------------------------
for pw in ["123456", "Summer2026", "Tr0ub4dor&3x!", "correct horse battery staple"]:
    label, bits = strength(pw)
    print(f"{pw:<30} {label:<6} {bits:>5} bits  sha256={sha256(pw)[:12]}...")
