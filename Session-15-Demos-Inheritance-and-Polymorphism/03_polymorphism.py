#!/usr/bin/env python3
"""Demo 3 - Polymorphism and duck typing.

Run:  python 03_polymorphism.py
Shows: one loop calling the same method on different types (polymorphism),
       an abstract base that defines an interface, and duck typing.
"""
from abc import ABC, abstractmethod


class Scanner(ABC):
    """Abstract base: every scanner must provide scan()."""

    @abstractmethod
    def scan(self, target):
        ...

    def run(self, target):
        print(f"[{type(self).__name__}] ", end="")
        return self.scan(target)


class PortScanner(Scanner):
    def scan(self, target):
        return f"ports open on {target}: 22, 443"


class TLSScanner(Scanner):
    def scan(self, target):
        return f"TLS on {target}: 1.2 (ok)"


class HeaderScanner(Scanner):
    def scan(self, target):
        return f"headers on {target}: missing HSTS"


# --- Polymorphism: same call, different behaviour ---------------------------
scanners = [PortScanner(), TLSScanner(), HeaderScanner()]
for s in scanners:
    print(s.run("10.0.0.5"))

# --- You cannot instantiate an abstract base --------------------------------
try:
    Scanner()
except TypeError as err:
    print("\nCan't instantiate abstract base:", err)


# --- Duck typing: "if it has .scan(), it works" (no inheritance needed) ------
class ThirdPartyTool:
    """Not a Scanner subclass, but has the same method shape."""
    def scan(self, target):
        return f"vendor scan of {target}: clean"


def scan_all(tools, target):
    """Works with anything that has a scan() method - that's duck typing."""
    return [tool.scan(target) for tool in tools]


print("\nDuck typing (mixed types):")
for line in scan_all([PortScanner(), ThirdPartyTool()], "10.0.0.9"):
    print("  ", line)
