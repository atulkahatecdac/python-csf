#!/usr/bin/env python3
"""Lab - familiarise with winreg, win32evtlog and wmi (syllabus lab task).

Run:  python 04_lab_familiarise.py     (Windows only)
A quick, safe tour of the key functions of each module. All read-only.
"""
import winreg
import win32evtlog
import wmi

print("=== winreg ===")
# The hive constants and the open/query pattern
print("hives:", [h for h in dir(winreg) if h.startswith("HKEY")][:3], "...")
with winreg.OpenKey(winreg.HKEY_CURRENT_USER, r"Environment") as k:
    n_values = winreg.QueryInfoKey(k)[1]
    print(f"HKCU\\Environment has {n_values} values")
    if n_values:
        name, val, _ = winreg.EnumValue(k, 0)
        print(f"  first value: {name}")

print("\n=== win32evtlog ===")
h = win32evtlog.OpenEventLog(None, "System")
print("System log records:", f"{win32evtlog.GetNumberOfEventLogRecords(h):,}")
print("read flags:", win32evtlog.EVENTLOG_BACKWARDS_READ,
      "|", win32evtlog.EVENTLOG_SEQUENTIAL_READ)
win32evtlog.CloseEventLog(h)

print("\n=== wmi ===")
c = wmi.WMI()
print("classes you can query, e.g. Win32_OperatingSystem, Win32_Process")
print("logical disks:")
for d in c.Win32_LogicalDisk(DriveType=3):          # 3 = local disk
    free = int(d.FreeSpace or 0) / 1e9
    size = int(d.Size or 0) / 1e9
    print(f"  {d.DeviceID} {free:.0f} GB free of {size:.0f} GB")

print("\nExplore more: dir(winreg), help(wmi.WMI), and the Win32_* class names.")
