#!/usr/bin/env python3
"""Demo 2 - while loops.

Run:  python 02_while_loops.py
Shows: a counted while loop, a retry loop with a limit,
       and the 'while True ... break' pattern.
"""
import time

# --- Counted: exponential back-off between retries -------------------------
attempt = 1
delay = 1
while attempt <= 5:
    print(f"Attempt {attempt}: wait {delay}s before next try")
    delay *= 2                       # 1, 2, 4, 8, 16
    attempt += 1

# --- Retry with a limit: simulated login attempts ---------------------------
typed_passwords = ["admin", "123456", "S3cure!Pass", "never reached"]
correct = "S3cure!Pass"
tries = 0
MAX_TRIES = 3
while tries < MAX_TRIES:
    guess = typed_passwords[tries]
    tries += 1
    if guess == correct:
        print(f"\nLogin succeeded on try {tries}")
        break
    print(f"Try {tries}: wrong password")
else:
    print("Account locked")          # runs only if the loop ended without break

# --- while True + break: process a queue until it is empty ----------------
alerts = ["port scan from 45.155.205.233", "malware hash match", "impossible travel"]
print()
while True:
    if not alerts:
        print("Queue empty - stopping")
        break
    alert = alerts.pop(0)            # take the first item off the list
    print("Handling:", alert)
    time.sleep(0.2)                  # pretend to do work
