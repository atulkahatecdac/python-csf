#!/usr/bin/env python3
"""Demo 2 - Nested if: a tiny firewall decision.

Run:  python 02_nested_if.py
Shows: an if inside another if, and the same logic flattened with 'and'.
"""

def decide(src_ip, protocol, port):
    """Return ALLOW or DENY for one connection (functions: Session 9)."""
    if src_ip.startswith("10."):                  # internal network?
        if protocol == "tcp":
            if port in (22, 443):
                return "ALLOW (internal admin/web)"
            else:
                return "DENY  (internal, port not allowed)"
        else:
            return "ALLOW (internal non-TCP)"
    else:                                         # from the internet
        if protocol == "tcp" and port == 443:
            return "ALLOW (public HTTPS)"
        return "DENY  (external)"


tests = [
    ("10.0.0.8", "tcp", 22),
    ("10.0.0.8", "tcp", 3389),
    ("10.0.0.8", "udp", 53),
    ("203.0.113.9", "tcp", 443),
    ("203.0.113.9", "tcp", 22),
]
for src, proto, port in tests:
    print(f"{src:<12} {proto} {port:<5} -> {decide(src, proto, port)}")

# Deep nesting is hard to read. Flatten with 'and' when you can:
src, proto, port = "10.0.0.8", "tcp", 22
if src.startswith("10.") and proto == "tcp" and port in (22, 443):
    print("\nFlattened check agrees: ALLOW")
