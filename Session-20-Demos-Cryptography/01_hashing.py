#!/usr/bin/env python3
"""Demo 1 - Hashing: integrity, password storage, HMAC.

Run:  python 01_hashing.py
Shows: cryptographic hashes, why salting matters, slow password hashing
(PBKDF2), and HMAC for authenticated messages. Uses hashlib + Crypto.
"""
import hashlib
import hmac
import os

# --- A hash is a one-way fingerprint ----------------------------------------
data = b"evidence.bin contents"
print("SHA-256 :", hashlib.sha256(data).hexdigest())
print("One bit changes everything:")
print("  'hello' :", hashlib.sha256(b"hello").hexdigest()[:32])
print("  'hellO' :", hashlib.sha256(b"hellO").hexdigest()[:32])

# --- Why raw hashes are BAD for passwords: identical pwds -> identical hashes
pw = b"password123"
print("\nUnsalted (same hash every time - bad):")
print("  ", hashlib.sha256(pw).hexdigest()[:32])
print("  ", hashlib.sha256(pw).hexdigest()[:32])

# --- Salt + slow KDF: the right way to store passwords ----------------------
salt = os.urandom(16)
slow = hashlib.pbkdf2_hmac("sha256", pw, salt, iterations=200_000)
print("\nPBKDF2 (salted, slow):")
print("  salt :", salt.hex()[:16], "...")
print("  hash :", slow.hex()[:32], "...")

# Verifying a password: recompute with the stored salt and compare
def verify(candidate, salt, expected):
    test = hashlib.pbkdf2_hmac("sha256", candidate.encode(), salt, 200_000)
    return hmac.compare_digest(test, expected)     # constant-time compare

print("  correct password?", verify("password123", salt, slow))
print("  wrong password?  ", verify("guessing", salt, slow))

# --- HMAC: prove a message came from someone who knows the key --------------
key = b"shared-secret-key"
msg = b"transfer 1000 to account 42"
tag = hmac.new(key, msg, hashlib.sha256).hexdigest()
print("\nHMAC tag:", tag[:32], "...")
print("tampered message detected?",
      not hmac.compare_digest(tag, hmac.new(key, b"transfer 9999 to account 99",
                                            hashlib.sha256).hexdigest()))
