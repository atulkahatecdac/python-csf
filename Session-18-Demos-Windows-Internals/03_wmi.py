#!/usr/bin/env python3
"""Demo 3 - WMI: query the Windows machine like a database.

Run:  python 03_wmi.py             (Windows only)
Shows: querying OS, processes, services, network config and logged-on users
through WMI - the backbone of Windows system administration and live forensics.
All read-only.
"""
import wmi

c = wmi.WMI()

# --- Operating system -------------------------------------------------------
os_info = c.Win32_OperatingSystem()[0]
print("OS      :", os_info.Caption.strip())
print("Version :", os_info.Version)
print("Boot    :", os_info.LastBootUpTime.split(".")[0])

# --- Computer / hardware ----------------------------------------------------
cs = c.Win32_ComputerSystem()[0]
print("Host    :", cs.Name)
print("RAM     :", f"{int(cs.TotalPhysicalMemory) / 1e9:.1f} GB")

# --- Running processes (top by handle count, a cheap 'interesting' proxy) ----
print("\nSample of running processes:")
procs = c.Win32_Process()
print(f"  {len(procs)} processes total")
for p in sorted(procs, key=lambda p: p.ProcessId)[:6]:
    print(f"  PID {p.ProcessId:<6} {p.Name}")

# --- Services that are running (service-based persistence lives here) --------
print("\nRunning services (first 5):")
running = [s for s in c.Win32_Service() if s.State == "Running"]
print(f"  {len(running)} running")
for s in running[:5]:
    print(f"  {s.Name:<24} {s.StartMode}")

# --- Network adapters with an IP --------------------------------------------
print("\nNetwork (configured adapters):")
for nic in c.Win32_NetworkAdapterConfiguration(IPEnabled=True):
    ips = ", ".join(nic.IPAddress or [])
    print(f"  {nic.Description[:34]:<34} {ips}")

print("\nLive forensics: WMI reads processes, services, autoruns and network")
print("state from a running machine - often the first look in incident response.")
