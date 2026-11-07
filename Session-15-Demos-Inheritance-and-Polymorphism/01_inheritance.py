#!/usr/bin/env python3
"""Demo 1 - Inheritance: build on an existing class.

Run:  python 01_inheritance.py
Shows: a base class, subclasses that extend it, super(), method overriding,
       and isinstance across the hierarchy.
"""


class Asset:
    """Base class: anything we track in an inventory."""

    def __init__(self, name, ip):
        self.name = name
        self.ip = ip

    def describe(self):
        return f"{self.name} at {self.ip}"

    def risk(self):
        return 1                       # a plain asset has baseline risk


class Server(Asset):
    """A Server IS AN Asset, with extra attributes and behaviour."""

    def __init__(self, name, ip, services):
        super().__init__(name, ip)     # run Asset.__init__ first
        self.services = services

    def risk(self):                    # override: servers are riskier
        return 2 + len(self.services)

    def describe(self):                # extend the base description
        return super().describe() + f" running {', '.join(self.services)}"


class DomainController(Server):
    """A DomainController IS A Server (two levels of inheritance)."""

    def risk(self):
        return super().risk() + 5      # the crown jewels: extra risk


# --- Use them ---------------------------------------------------------------
assets = [
    Asset("printer", "10.0.0.50"),
    Server("web01", "10.0.0.5", ["http", "https"]),
    DomainController("dc01", "10.0.0.6", ["ldap", "kerberos", "dns"]),
]

for a in assets:
    print(f"risk {a.risk():>2}  {a.describe()}")

# --- isinstance walks up the tree -------------------------------------------
dc = assets[2]
print("\ndc is a DomainController:", isinstance(dc, DomainController))
print("dc is a Server          :", isinstance(dc, Server))
print("dc is an Asset          :", isinstance(dc, Asset))
print("\nMRO:", [c.__name__ for c in DomainController.__mro__])
