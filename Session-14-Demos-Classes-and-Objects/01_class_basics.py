#!/usr/bin/env python3
"""Demo 1 - Classes and objects: the basics.

Run:  python 01_class_basics.py
Shows: defining a class, __init__, self, instance attributes and methods,
       and creating several independent objects (instances).
"""


class Host:
    """A single machine we are tracking."""

    def __init__(self, ip, os="unknown"):
        # __init__ runs when you create a Host(); self is the new object.
        self.ip = ip                 # instance attribute - unique per object
        self.os = os
        self.open_ports = []         # each Host gets its OWN empty list

    def add_port(self, port):
        """An instance method: acts on this object's data via self."""
        self.open_ports.append(port)

    def is_exposed(self):
        """Return True if a risky port is open."""
        return any(p in self.open_ports for p in (23, 3389, 445))

    def summary(self):
        return f"{self.ip} ({self.os}): ports {self.open_ports}"


# --- Create instances -------------------------------------------------------
web = Host("10.0.0.5", "Linux")
dc = Host("10.0.0.6", "Windows")

web.add_port(22)
web.add_port(443)
dc.add_port(3389)

print(web.summary())
print(dc.summary())

# --- Each object has its own data -------------------------------------------
print("\nweb exposed?", web.is_exposed())
print("dc  exposed?", dc.is_exposed())      # True: RDP (3389) open

# --- Objects are of their class type ----------------------------------------
print("\ntype(web):", type(web).__name__)
print("isinstance(web, Host):", isinstance(web, Host))
print("web's attributes:", vars(web))
