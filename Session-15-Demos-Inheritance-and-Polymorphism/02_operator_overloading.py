#!/usr/bin/env python3
"""Demo 2 - Operator overloading: dunder methods.

Run:  python 02_operator_overloading.py
Shows: __str__, __repr__, __eq__, __lt__, __add__, __len__, __contains__,
       so our own objects work with print, ==, <, +, len(), in and sorted().
"""
from functools import total_ordering


@total_ordering                        # fills in <=, >, >= from __eq__ and __lt__
class Finding:
    """A security finding with a severity we can compare and combine."""

    def __init__(self, title, severity):
        self.title = title
        self.severity = severity       # 1..4

    def __str__(self):                 # print(finding)
        return f"{self.title} (sev {self.severity})"

    def __repr__(self):                # how it shows in a list / the REPL
        return f"Finding({self.title!r}, {self.severity})"

    def __eq__(self, other):           # ==
        return self.severity == other.severity

    def __lt__(self, other):           # <  (and, via total_ordering, >, <=, >=)
        return self.severity < other.severity


findings = [
    Finding("open telnet", 2),
    Finding("default creds", 4),
    Finding("verbose errors", 1),
    Finding("weak TLS", 3),
]

print("print():", findings[0])
print("repr() in a list:", findings)

# Comparison operators now work -> so does sorting
print("\nsorted by severity:")
for f in sorted(findings, reverse=True):
    print("  ", f)

print("\nmax severity:", max(findings))
print("telnet == creds?", findings[0] == findings[1])


# --- __add__, __len__, __contains__ on a container ---------------------------
class Report:
    def __init__(self):
        self.items = []

    def __add__(self, finding):        # report + finding
        self.items.append(finding)
        return self

    def __len__(self):                 # len(report)
        return len(self.items)

    def __contains__(self, title):     # "x" in report
        return any(f.title == title for f in self.items)


r = Report()
r = r + findings[0] + findings[1]      # uses __add__ twice
print("\nlen(report):", len(r))
print("'open telnet' in report:", "open telnet" in r)
