#!/usr/bin/env python3
"""Demo 1 - Returning values.

Run:  python 01_return_values.py
Shows: returning one value, several (as a tuple), early return as a guard,
       and that a bare return / no return gives None.
"""


def classify_port(port):
    """Return a category string; early returns act as guards."""
    if not isinstance(port, int):
        return "invalid"
    if port < 0 or port > 65535:
        return "out of range"
    if port < 1024:
        return "well-known"
    return "high"


for p in [22, 8080, 70000, "x"]:
    print(f"{p!r:>7} -> {classify_port(p)}")


def parse_hostport(text):
    """Return TWO values: host and port (a tuple the caller unpacks)."""
    host, _, port = text.partition(":")
    return host, int(port) if port else None


host, port = parse_hostport("10.0.0.5:443")
print("\nhost:", host, "| port:", port)


def first_open(ports, is_open):
    """Return the first port for which is_open(port) is True, else None."""
    for p in ports:
        if is_open(p):
            return p                 # early return ends the function
    return None                      # explicit 'not found'


print("first open:", first_open([21, 22, 80], lambda p: p in {22, 80}))


def noop():
    pass                             # no return -> returns None

print("noop() returns:", noop())
