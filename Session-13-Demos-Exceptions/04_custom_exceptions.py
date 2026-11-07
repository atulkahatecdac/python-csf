#!/usr/bin/env python3
"""Lab/Demo - custom exceptions.

Run:  python 04_custom_exceptions.py
Covers the self-learning task 'create and raise custom exceptions'.
Shows: defining your own exception types for clearer, catchable errors.
"""


class SecurityError(Exception):
    """Base class for our security-tool errors (so callers can catch them all)."""


class WeakPasswordError(SecurityError):
    """Raised when a password fails policy."""


class BlockedIPError(SecurityError):
    """Raised when an action involves a blocklisted IP."""
    def __init__(self, ip):
        super().__init__(f"IP {ip} is on the blocklist")
        self.ip = ip                       # extra data the handler can use


BLOCKLIST = {"45.155.205.233", "185.220.101.4"}


def check_password(pw):
    if len(pw) < 12:
        raise WeakPasswordError(f"too short ({len(pw)} chars, need 12)")
    return True


def connect(ip):
    if ip in BLOCKLIST:
        raise BlockedIPError(ip)
    return f"connected to {ip}"


# --- Handle each specific type ----------------------------------------------
for pw in ["short", "a-long-enough-passphrase"]:
    try:
        check_password(pw)
        print(f"{pw!r:28} accepted")
    except WeakPasswordError as err:
        print(f"{pw!r:28} REJECTED: {err}")

# --- Catch the base class to handle any SecurityError -----------------------
for ip in ["10.0.0.5", "45.155.205.233"]:
    try:
        print(connect(ip))
    except BlockedIPError as err:          # subclass carries extra data
        print(f"blocked: {err}  (ip attribute: {err.ip})")
    except SecurityError as err:           # any other security error
        print(f"security error: {err}")
