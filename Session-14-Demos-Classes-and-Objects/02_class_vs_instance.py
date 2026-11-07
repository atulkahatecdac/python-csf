#!/usr/bin/env python3
"""Demo 2 - Class variables and methods vs instance variables.

Run:  python 02_class_vs_instance.py
Shows: class attributes shared by all instances, @classmethod, @staticmethod,
       and the shared-mutable-class-attribute trap.
"""


class ScanSession:
    # Class variables: shared by ALL instances
    total_sessions = 0
    default_timeout = 5

    def __init__(self, analyst):
        self.analyst = analyst                 # instance variable
        self.findings = []                     # per-instance (correct)
        ScanSession.total_sessions += 1        # update the shared counter

    def add_finding(self, text):
        self.findings.append(text)

    @classmethod
    def count(cls):
        """A class method receives the class (cls), not an instance."""
        return f"{cls.total_sessions} sessions so far"

    @staticmethod
    def is_valid_port(port):
        """A static method: a plain function grouped under the class."""
        return 1 <= port <= 65535


# --- Instance vs class data -------------------------------------------------
a = ScanSession("alice")
b = ScanSession("bob")
a.add_finding("open telnet")

print("a.findings:", a.findings)
print("b.findings:", b.findings)               # independent: []
print("sessions  :", ScanSession.total_sessions)
print(ScanSession.count())

# --- Static method: called on the class, no instance needed -----------------
print("\nis_valid_port(22)    :", ScanSession.is_valid_port(22))
print("is_valid_port(99999) :", ScanSession.is_valid_port(99999))

# --- Changing a class variable affects everyone -----------------------------
ScanSession.default_timeout = 10
print("\ntimeout seen by a:", a.default_timeout)   # 10 (reads the class var)
print("timeout seen by b:", b.default_timeout)     # 10
