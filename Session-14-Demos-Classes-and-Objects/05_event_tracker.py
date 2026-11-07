#!/usr/bin/env python3
"""Demo 5 - Mini project: a security-event tracker built from classes.

Run:  python 05_event_tracker.py
Brings together: a class with instance + class data, methods that compute,
__str__ for display, and a collection of objects analysed together.
"""
from datetime import datetime


class Event:
    SEVERITY = {"low": 1, "medium": 2, "high": 3, "critical": 4}
    count = 0                         # class variable: total events created

    def __init__(self, source_ip, kind, severity="low"):
        self.source_ip = source_ip
        self.kind = kind
        self.severity = severity
        self.time = datetime.now()
        Event.count += 1

    def score(self):
        return self.SEVERITY.get(self.severity, 0)

    def is_critical(self):
        return self.score() >= 3

    def __str__(self):
        return f"[{self.severity.upper():<8}] {self.source_ip:<16} {self.kind}"


# --- Build a list of Event objects ------------------------------------------
events = [
    Event("45.155.205.233", "brute force", "high"),
    Event("10.0.0.5", "port scan", "low"),
    Event("45.155.205.233", "malware download", "critical"),
    Event("203.0.113.9", "failed login", "medium"),
]

print("All events:")
for e in events:
    print(" ", e)

# --- Analyse the collection -------------------------------------------------
print("\nTotal events (class var):", Event.count)

critical = [e for e in events if e.is_critical()]
print(f"\nHigh/critical ({len(critical)}):")
for e in critical:
    print(" ", e)

# Highest-scoring event
worst = max(events, key=lambda e: e.score())
print("\nMost severe:", worst, "- score", worst.score())

# Risk total across all events
print("Total risk score:", sum(e.score() for e in events))
