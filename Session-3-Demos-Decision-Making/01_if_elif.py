#!/usr/bin/env python3
"""Demo 1 - if, if-else and if-elif-else.

Run:  python 01_if_elif.py
Shows: a lockout check (if/else), port classification (elif ladder),
       truthiness in conditions and the one-line conditional expression.
"""

# --- if / else: account lockout -----------------------------------------
failed_logins = 6
MAX_ATTEMPTS = 5

if failed_logins > MAX_ATTEMPTS:
    print(f"LOCK account: {failed_logins} failed logins")
else:
    print("Account OK")

# --- if / elif / else: classify a port (first true branch wins) ----------
for port in (22, 8080, 51515, 70000):          # loop preview (Session 4)
    if port < 0 or port > 65535:
        kind = "invalid"
    elif port < 1024:
        kind = "well-known (system)"
    elif port < 49152:
        kind = "registered"
    else:
        kind = "dynamic / ephemeral"
    print(f"Port {port:>5}: {kind}")

# --- Truthiness: empty values are False ---------------------------------
api_key = ""
if not api_key:
    print("No API key configured - running in offline mode")

# --- Conditional expression: value_if_true if condition else value_if_false
severity = 9
label = "CRITICAL" if severity >= 9 else "normal"
print("Alert level:", label)
