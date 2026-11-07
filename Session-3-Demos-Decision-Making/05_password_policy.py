#!/usr/bin/env python3
"""Demo 5 - Mini project: password policy checker.

Run:  python 05_password_policy.py
Brings together: if/elif/else, in / not in, string tests, conditional expressions.
Sample inputs: password123   then   Tr0ub4dor&3x!
"""
from getpass import getpass

COMMON = ("123456", "password", "password123", "qwerty", "admin", "letmein", "iloveyou")

pw = getpass("Password to check (hidden): ")

if pw.lower() in COMMON:
    print("REJECT: appears in the common-password list")
elif len(pw) < 12:
    print(f"REJECT: only {len(pw)} characters (minimum 12)")
else:
    has_upper = pw.lower() != pw          # lower() changed something -> had uppercase
    has_lower = pw.upper() != pw
    has_digit_or_symbol = not pw.isalpha()
    has_symbol = not pw.isalnum()

    print("Uppercase letter :", "yes" if has_upper else "NO")
    print("Lowercase letter :", "yes" if has_lower else "NO")
    print("Digit or symbol  :", "yes" if has_digit_or_symbol else "NO")
    print("Symbol           :", "yes" if has_symbol else "NO")

    score = has_upper + has_lower + has_digit_or_symbol + has_symbol   # bools add as 1/0
    if score == 4:
        print("ACCEPT: strong password")
    elif score == 3:
        print("ACCEPT: acceptable, add a symbol to make it stronger")
    else:
        print("REJECT: too predictable")
