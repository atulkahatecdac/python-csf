#!/usr/bin/env python3
"""Demo 1 - winreg: read the Windows Registry (forensic recon).

Run:  python 01_winreg.py          (Windows only)
Shows: opening keys, reading values, enumerating subkeys/values, and the
autostart (Run) key that malware loves. READ-ONLY - we never write.

The Registry is Windows' central config database; forensics lives here.
"""
import winreg


def read_value(hive, path, name):
    """Safely read one value, returning None if absent."""
    try:
        with winreg.OpenKey(hive, path) as key:
            value, _ = winreg.QueryValueEx(key, name)
            return value
    except FileNotFoundError:
        return None


# --- OS build info ----------------------------------------------------------
NT = r"SOFTWARE\Microsoft\Windows NT\CurrentVersion"
print("Product :", read_value(winreg.HKEY_LOCAL_MACHINE, NT, "ProductName"))
print("Build   :", read_value(winreg.HKEY_LOCAL_MACHINE, NT, "CurrentBuild"))
print("Owner   :", read_value(winreg.HKEY_LOCAL_MACHINE, NT, "RegisteredOwner"))

# --- Enumerate autostart programs (a persistence location) ------------------
RUN = r"SOFTWARE\Microsoft\Windows\CurrentVersion\Run"
print("\nAutostart programs (HKCU Run):")
try:
    with winreg.OpenKey(winreg.HKEY_CURRENT_USER, RUN) as key:
        count = winreg.QueryInfoKey(key)[1]        # number of values
        for i in range(count):
            name, value, _ = winreg.EnumValue(key, i)
            print(f"  {name} -> {value}")
        if count == 0:
            print("  (none)")
except FileNotFoundError:
    print("  (Run key not present)")

# --- Enumerate a few installed-software subkeys -----------------------------
UNINSTALL = r"SOFTWARE\Microsoft\Windows\CurrentVersion\Uninstall"
print("\nInstalled software (first 5):")
with winreg.OpenKey(winreg.HKEY_LOCAL_MACHINE, UNINSTALL) as key:
    subkeys = winreg.QueryInfoKey(key)[0]
    for i in range(min(5, subkeys)):
        sub = winreg.EnumKey(key, i)
        name = read_value(winreg.HKEY_LOCAL_MACHINE,
                          UNINSTALL + "\\" + sub, "DisplayName")
        print(f"  {name or sub}")

print("\nForensics: the Run keys are prime persistence spots - malware adds")
print("itself here so it starts at login. Analysts diff these against a baseline.")
