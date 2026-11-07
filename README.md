# Module 6 — Python Programming for Cyber Security

Theory decks plus live-demo code for the full module: **22 sessions**, one `.pptx`
deck and one demo folder each. Author: **Atul Kahate**
([LinkedIn](https://www.linkedin.com/in/atulkahate/)).

Each session has a deck (`python-cyber-session-N-<Name>.pptx`) and a matching
demo folder (`Session-N-Demos-<Name>/`) with ~5 runnable scripts. Every concept
is followed by a live demo; examples are security-themed; every slide has speaker
notes. Decks sized at roughly 2 hours each (40 theory hours total).

Students work on a **mix of Ubuntu and Windows**; the code is OS-neutral and
runs on Python **3.10–3.12** (not 3.13 — it removed `telnetlib`).

| # | Session | Deck | Demos |
|---|---|---|---|
| 1 | Introduction to Python | `...session-1-Introduction-to-Python.pptx` | `Session-1-Demos-Introduction-to-Python/` |
| 2 | Input, Output & Operators | `...-2-Input-Output-and-Operators.pptx` | `Session-2-Demos-Input-Output-and-Operators/` |
| 3 | Decision Making | `...-3-Decision-Making.pptx` | `Session-3-Demos-Decision-Making/` |
| 4 | Loops | `...-4-Loops.pptx` | `Session-4-Demos-Loops/` |
| 5 | Strings | `...-5-Strings.pptx` | `Session-5-Demos-Strings/` |
| 6 | Lists | `...-6-Lists.pptx` | `Session-6-Demos-Lists/` |
| 7 | Nested Lists & Tuples | `...-7-Nested-Lists-and-Tuples.pptx` | `Session-7-Demos-Nested-Lists-and-Tuples/` |
| 8 | Dictionaries | `...-8-Dictionaries.pptx` | `Session-8-Demos-Dictionaries/` |
| 9 | Functions | `...-9-Functions.pptx` | `Session-9-Demos-Functions/` |
| 10 | Functions, Part 2 | `...-10-Functions-Part-2.pptx` | `Session-10-Demos-Functions-Part-2/` |
| 11 | Modules & Packages | `...-11-Modules-and-Packages.pptx` | `Session-11-Demos-Modules-and-Packages/` |
| 12 | File Handling | `...-12-File-Handling.pptx` | `Session-12-Demos-File-Handling/` |
| 13 | Exceptions | `...-13-Exceptions.pptx` | `Session-13-Demos-Exceptions/` |
| 14 | Classes & Objects | `...-14-Classes-and-Objects.pptx` | `Session-14-Demos-Classes-and-Objects/` |
| 15 | Inheritance & Polymorphism | `...-15-Inheritance-and-Polymorphism.pptx` | `Session-15-Demos-Inheritance-and-Polymorphism/` |
| 16 | Networking Libraries | `...-16-Networking-Libraries.pptx` | `Session-16-Demos-Networking-Libraries/` |
| 17 | Web Parsing & OS | `...-17-Web-Parsing-and-OS.pptx` | `Session-17-Demos-Web-Parsing-and-OS/` |
| 18 | Windows Internals | `...-18-Windows-Internals.pptx` | `Session-18-Demos-Windows-Internals/` |
| 19 | Files, Clipboard & Email | `...-19-Files-Clipboard-and-Email.pptx` | `Session-19-Demos-Files-Clipboard-and-Email/` |
| 20 | Cryptography | `...-20-Cryptography.pptx` | `Session-20-Demos-Cryptography/` |
| 21 | Forensics: Registry, PDF, Images | `...-21-Forensics-Registry-PDF-Images.pptx` | `Session-21-Demos-Forensics-Registry-PDF-Images/` |
| 22 | Forensics: Packets & Artifacts | `...-22-Forensics-Packets-and-Artifacts.pptx` | `Session-22-Demos-Forensics-Packets-and-Artifacts/` |

Sessions 1–15 cover the language; 16–22 cover security libraries and forensics.

## Student setup

**Ubuntu / Kali:**

```bash
cd ~/csf-python
bash setup-ubuntu.sh        # python3-venv/pip, create .venv, install requirements
source .venv/bin/activate
```

**Windows:**

```powershell
cd C:\csf-python
powershell -ExecutionPolicy Bypass -File setup-windows.ps1   # needs Python 3.12 from python.org
.\.venv\Scripts\Activate.ps1
```

Then run any demo from its folder, e.g.:

```bash
cd Session-16-Demos-Networking-Libraries
python 01_ipaddress.py
```

## Platform notes

- **Sessions 1–17, 19–22** run on Ubuntu and Windows.
- **Session 18 (Windows Internals)** needs Windows: `winreg`, `win32evtlog`, `wmi`.
  Ubuntu students use a lab Windows VM.
- **Scapy (Session 16):** demos craft/parse packets and read PCAP files offline.
  Live capture/sending needs Npcap (Windows) or root (Linux) and is lab-only.
- **Crypto (Session 20):** uses `pycryptodome` (import `Crypto`), not the dead
  `pycrypto`.

Many demos are **simulated or use generated sample data** so they run anywhere
with no network and clean up after themselves. All offensive-leaning techniques
(banner grabbing, packet work, clipboard, forensics) are framed for **authorised,
defensive use only**.

## Rebuild the decks

Decks are generated from code in `_build/` (pptxgenjs), using the same layout
library as the instructor's other course decks.

```bash
cd _build
npm install          # first time only
node build-all.js    # all decks, or: node build-all.js 16
```

`_build/names.js` maps each session number to its name (used for folder and PPT
names). Speaker notes on every slide hold talking points and follow-up ideas.

## Course author

Atul Kahate — https://www.linkedin.com/in/atulkahate/
