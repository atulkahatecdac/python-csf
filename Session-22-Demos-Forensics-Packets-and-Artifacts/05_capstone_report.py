#!/usr/bin/env python3
"""Demo 5 - Capstone: a full incident report generator.

Run:  python 05_capstone_report.py
The whole module in one script: read evidence, analyse it, and write a
structured incident report (JSON + human-readable). Uses functions, classes,
files, dicts, hashing and the standard library - everything from the course.
Sample evidence is built in-script; output is a report file, then cleaned up.
"""
import json
import hashlib
import os
from datetime import datetime


class Incident:
    """Collects findings and renders a report."""

    def __init__(self, case_id, analyst):
        self.case_id = case_id
        self.analyst = analyst
        self.findings = []          # list of dicts
        self.evidence = []          # list of (name, sha256)

    def add_finding(self, severity, title, detail):
        self.findings.append({"severity": severity, "title": title,
                              "detail": detail})

    def add_evidence(self, name, data: bytes):
        self.evidence.append({"file": name,
                              "sha256": hashlib.sha256(data).hexdigest(),
                              "size": len(data)})

    def risk_score(self):
        weight = {"low": 1, "medium": 3, "high": 5, "critical": 8}
        return sum(weight.get(f["severity"], 0) for f in self.findings)

    def to_dict(self):
        return {"case_id": self.case_id, "analyst": self.analyst,
                "generated": datetime.now().isoformat(timespec="seconds"),
                "risk_score": self.risk_score(),
                "findings": self.findings, "evidence": self.evidence}


# --- Analyse the (sample) evidence ------------------------------------------
auth_log = (b"Failed password for root from 45.155.205.233\n" * 4
            + b"Accepted password for root from 45.155.205.233\n")
history = b"http://45.155.205.233/panel\nhttps://docs.python.org\n"

inc = Incident("CASE-2026-042", "a.patil")
inc.add_evidence("auth.log", auth_log)
inc.add_evidence("history.txt", history)

# Finding 1: brute force then success
fails = auth_log.count(b"Failed password")
if fails >= 3 and b"Accepted password for root" in auth_log:
    inc.add_finding("critical", "SSH brute force then root login",
                    f"{fails} failures then a success from 45.155.205.233")

# Finding 2: browsing to an IP-literal host
if b"http://45.155.205.233" in history:
    inc.add_finding("medium", "Browsing to IP-literal host",
                    "Visit to http://45.155.205.233/panel (possible C2 panel)")

# --- Render the report (JSON + text) ----------------------------------------
report = inc.to_dict()
with open("incident.json", "w") as f:
    json.dump(report, f, indent=2)

print(f"INCIDENT REPORT  {report['case_id']}")
print("=" * 52)
print(f"Analyst    : {report['analyst']}")
print(f"Generated  : {report['generated']}")
print(f"Risk score : {report['risk_score']}")
print("\nEvidence (chain of custody):")
for e in report["evidence"]:
    print(f"  {e['file']:<14} {e['size']:>4} B  {e['sha256'][:16]}...")
print("\nFindings (most severe first):")
for f in sorted(report["findings"],
                key=lambda x: {"critical": 0, "high": 1, "medium": 2, "low": 3}[x["severity"]]):
    print(f"  [{f['severity'].upper():<8}] {f['title']}")
    print(f"             {f['detail']}")

print("\nWrote incident.json. This capstone uses classes, functions, files,")
print("dicts, hashing and the standard library - the whole course in one tool.")

os.remove("incident.json")
