#!/usr/bin/env python3
"""Demo 5 - Mini project: a small plugin-style scanner framework.

Run:  python 05_scanner_framework.py
Brings together: an abstract base (the plugin contract), subclasses (plugins),
polymorphism (run them all), and a Report that overloads += and len().
Everything is simulated - no real scanning.
"""
from abc import ABC, abstractmethod


class Check(ABC):
    """Every check is a plugin with a name and a run() returning (ok, detail)."""
    name = "check"

    @abstractmethod
    def run(self, host):
        ...


class TelnetCheck(Check):
    name = "telnet-open"
    def run(self, host):
        open_ports = host["ports"]
        bad = 23 in open_ports
        return (not bad, "telnet (23) is open" if bad else "telnet closed")


class PatchCheck(Check):
    name = "patch-level"
    def run(self, host):
        return (host["patched"], "unpatched" if not host["patched"] else "patched")


class TLSCheck(Check):
    name = "tls-version"
    def run(self, host):
        ok = host["tls"] >= 1.2
        return (ok, f"TLS {host['tls']}")


class Report:
    def __init__(self):
        self.failures = []
    def __iadd__(self, item):          # report += (check_name, detail)
        self.failures.append(item)
        return self
    def __len__(self):
        return len(self.failures)


# --- Run every check against every host (polymorphism) ----------------------
checks = [TelnetCheck(), PatchCheck(), TLSCheck()]
hosts = [
    {"name": "web01", "ports": [22, 443], "patched": True, "tls": 1.3},
    {"name": "legacy01", "ports": [23, 80], "patched": False, "tls": 1.0},
]

report = Report()
for host in hosts:
    print(f"\n{host['name']}:")
    for check in checks:
        ok, detail = check.run(host)
        mark = "PASS" if ok else "FAIL"
        print(f"  [{mark}] {check.name:<12} {detail}")
        if not ok:
            report += (host["name"], check.name)

print(f"\n{len(report)} failing checks:")
for host, check in report.failures:
    print(f"  {host}: {check}")
