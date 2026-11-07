#!/usr/bin/env python3
"""Demo 3 - Flexible arguments: *args and **kwargs.

Run:  python 03_args_kwargs.py
Shows: accepting any number of positional/keyword arguments, and
       unpacking a list/dict into a call with * and **.
"""


def scan_ports(host, *ports):
    """*ports collects any number of extra positional arguments into a tuple."""
    print(f"Scanning {host}: {ports}")
    return list(ports)


scan_ports("10.0.0.5", 22)
scan_ports("10.0.0.5", 22, 80, 443, 3389)


def log_event(message, **fields):
    """**fields collects any number of keyword arguments into a dict."""
    extras = " ".join(f"{k}={v}" for k, v in fields.items())
    print(f"[LOG] {message}  {extras}")


log_event("login failed", user="root", src="45.155.205.233", attempts=5)
log_event("service started", name="sshd")


# --- Unpacking INTO a call with * and ** -------------------------------------
wanted = [22, 80, 443]
scan_ports("web01", *wanted)                     # list -> separate arguments

conn = {"host": "10.0.0.5", "port": 443}
def connect(host, port):
    return f"connect {host}:{port}"
print(connect(**conn))                            # dict -> keyword arguments

# --- Combine everything (the order is fixed) --------------------------------
def report(title, *items, level="INFO", **meta):
    print(f"\n{level}: {title}")
    for i in items:
        print("  -", i)
    if meta:
        print("  meta:", meta)

report("Findings", "open 23", "weak TLS", level="WARN", scan_id=7)
