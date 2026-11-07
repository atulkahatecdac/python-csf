#!/usr/bin/env python3
"""Demo 5 - Mini project: a live Windows triage snapshot.

Run:  python 05_triage.py            (Windows only)
Brings together winreg + wmi + win32evtlog into a one-page 'what is this box
doing right now' report - the kind a responder runs first. All read-only.
"""
import winreg
import wmi
import win32evtlog

print("=" * 44)
print("  WINDOWS TRIAGE SNAPSHOT")
print("=" * 44)

# --- Identity (WMI) ---------------------------------------------------------
c = wmi.WMI()
os_info = c.Win32_OperatingSystem()[0]
cs = c.Win32_ComputerSystem()[0]
print(f"Host    : {cs.Name}")
print(f"OS      : {os_info.Caption.strip()} ({os_info.Version})")
print(f"Booted  : {os_info.LastBootUpTime.split('.')[0]}")

# --- Autostart entries (winreg) - persistence check -------------------------
print("\nAutostart (HKCU Run):")
try:
    with winreg.OpenKey(winreg.HKEY_CURRENT_USER,
                        r"SOFTWARE\Microsoft\Windows\CurrentVersion\Run") as key:
        n = winreg.QueryInfoKey(key)[1]
        for i in range(n):
            name, value, _ = winreg.EnumValue(key, i)
            print(f"  {name}: {value[:50]}")
        if n == 0:
            print("  (none - good)")
except FileNotFoundError:
    print("  (no Run key)")

# --- Recent error events (win32evtlog) --------------------------------------
print("\nRecent Application errors:")
h = win32evtlog.OpenEventLog(None, "Application")
flags = win32evtlog.EVENTLOG_BACKWARDS_READ | win32evtlog.EVENTLOG_SEQUENTIAL_READ
found = 0
while found < 3:
    batch = win32evtlog.ReadEventLog(h, flags, 0)
    if not batch:
        break
    for ev in batch:
        if ev.EventType == win32evtlog.EVENTLOG_ERROR_TYPE:
            when = ev.TimeGenerated.Format() if ev.TimeGenerated else "?"
            print(f"  {ev.SourceName[:30]:<30} {when}")
            found += 1
            if found >= 3:
                break
if found == 0:
    print("  (no recent errors)")
win32evtlog.CloseEventLog(h)

# --- Resource snapshot (WMI) ------------------------------------------------
print("\nResources:")
print(f"  Processes running : {len(c.Win32_Process())}")
print(f"  Services running  : {sum(1 for s in c.Win32_Service() if s.State == 'Running')}")
for d in c.Win32_LogicalDisk(DriveType=3):
    print(f"  Disk {d.DeviceID} free : {int(d.FreeSpace or 0) / 1e9:.0f} GB")

print("\nOne command, a full first-look. Compare against a known-good baseline")
print("to spot new autoruns, unexpected services or a flood of errors.")
