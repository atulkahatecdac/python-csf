// Session 18: Windows internals - winreg, win32evtlog, wmi
const { Deck, C } = require("./lib");

module.exports = async function build(out) {
  const d = new Deck(18, "Windows Internals");

  await d.titleSlide({
    title: "Windows Internals: Registry, Event Logs & WMI",
    subtitle: "Read the Registry, parse event logs and query the live machine through WMI - the core of Windows forensics.",
    flow: [
      ["FaKey", "winreg", "The Windows Registry", C.coral],
      ["FaClipboardList", "win32evtlog", "Event logs", C.navy],
      ["FaDatabase", "WMI", "Query the live machine", C.teal],
      ["FaSearchLocation", "Triage", "First-look snapshot", C.coral],
    ],
    notes: "This session is Windows-only, from the pywin32 and wmi packages. These labs need a Windows machine or VM; Ubuntu students use a lab Windows box. Everything here is READ-ONLY system inspection: registry recon, event-log parsing, live WMI queries. It is the foundation of Windows incident response and forensics.",
  });

  await d.goalsAgenda({
    sub: "Windows only - read-only system inspection",
    goals: [
      ["FaKey", "Read and enumerate the Registry with `winreg`"],
      ["FaClipboardList", "Parse the Windows Event Log"],
      ["FaDatabase", "Query processes, services and config via WMI"],
      ["FaSearchLocation", "Combine them into a triage snapshot"],
    ],
    agenda: [
      "Setup: Windows modules",
      "winreg: the Registry",
      "D1  Registry recon & autoruns",
      "win32evtlog: event logs",
      "D2  Read & summarise events",
      "WMI: query the machine",
      "D3  Processes, services, network",
      "D4  Lab: familiarise",
      "D5  Live triage snapshot",
    ],
    notes: "Install with pip install pywin32 wmi (already in requirements.txt). The Security event log needs Administrator; Application and System are readable as a normal user.",
  });

  await d.cards3({
    title: "The Windows Forensic Trio",
    sub: "Three read-only windows into a Windows machine",
    cards: [
      { icon: "FaKey", color: C.coral, head: "Registry (winreg)", body: ["Central config database", "Autoruns, installed software, user settings, MRU lists", "A top persistence location"] },
      { icon: "FaClipboardList", color: C.navy, head: "Event Log (win32evtlog)", body: ["Logons, process creation, service changes, errors", "Application / System / Security logs", "The incident-response timeline"] },
      { icon: "FaDatabase", color: C.teal, head: "WMI", body: ["Query the live machine like a DB", "Processes, services, network, hardware", "Used by admins and attackers alike"] },
    ],
    below: [
      "**All read-only here.** We never write the Registry or clear logs. Changing these needs care and authorisation.",
      "**Attackers use them too:** autoruns for persistence, log clearing to cover tracks, WMI for lateral movement, so defenders must know them.",
    ],
    notes: "These three are where Windows keeps its state. Knowing how to read them in Python means you can automate triage, baseline a fleet, and spot deviations.",
  });

  await d.iconRows({
    title: "winreg: Reading the Registry",
    sub: "Hives -> keys -> values, like folders and files",
    rows: [
      { icon: "FaSitemap", color: C.coral, head: "Hives", text: "`HKEY_LOCAL_MACHINE` (system), `HKEY_CURRENT_USER` (this user)." },
      { icon: "FaFolderOpen", color: C.navy, head: "`OpenKey(hive, path)`", text: "Open a key; use it in a `with` block so it closes cleanly." },
      { icon: "FaTag", color: C.teal, head: "`QueryValueEx(key, name)`", text: "Read one value; returns `(data, type)`. Wrap in try/except." },
      { icon: "FaList", color: C.purple, head: "`EnumKey` / `EnumValue`", text: "Walk subkeys and values; `QueryInfoKey` gives the counts." },
    ],
    panel: { caption: "Read a value", fontSize: 10.5, lines: [
      "import winreg",
      "NT = r\"SOFTWARE\\Microsoft\\Windows NT\\...\"",
      "with winreg.OpenKey(",
      "        winreg.HKEY_LOCAL_MACHINE, NT) as k:",
      "    val, typ = winreg.QueryValueEx(",
      "        k, \"ProductName\")",
      "",
      "# Enumerate the Run (autostart) key",
      "for i in range(count):",
      "    name, value, _ = winreg.EnumValue(k, i)",
    ] },
    notes: "Registry paths use backslashes, so use raw strings (r\"...\"). HKLM is machine-wide; HKCU is the current user. QueryValueEx raises FileNotFoundError if the value is absent, so guard it.",
  });

  await d.demo({
    tag: "D1", name: "Registry Recon & Autoruns", file: "01_winreg.py", codeW: 5.0,
    code: [
      "def read_value(hive, path, name):",
      "    try:",
      "        with winreg.OpenKey(hive, path) as key:",
      "            value, _ = winreg.QueryValueEx(key, name)",
      "            return value",
      "    except FileNotFoundError:",
      "        return None",
      "",
      "NT = r\"SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\"",
      "read_value(HKLM, NT, \"ProductName\")",
      "",
      "RUN = r\"SOFTWARE\\Microsoft\\Windows\\...\\Run\"",
      "with winreg.OpenKey(HKCU, RUN) as key:",
      "    for i in range(QueryInfoKey(key)[1]):",
      "        name, value, _ = winreg.EnumValue(key, i)",
    ],
    output: [
      "Product : Windows 11 Home",
      "Build   : 26200",
      "",
      "Autostart programs (HKCU Run):",
      "  SecurityHealth -> ...SecHealthUI",
      "  OneDrive -> ...OneDrive.exe",
      "  Updater -> C:\\Temp\\upd.exe  (?)",
      "",
      "Installed software (first 5):",
      "  7-Zip, Docker Desktop, ...",
    ],
    watch: [
      "Raw strings for Registry paths",
      "Guard `QueryValueEx` with try/except",
      "Run keys = autostart = persistence",
    ],
    notes: "The Run key is the headline: every program there starts at login. A suspicious entry (an exe in Temp, a random name) is a classic persistence IOC. Live output shows the student's own machine; this slide uses generic examples.",
  });

  await d.demo({
    tag: "D2", name: "Read & Summarise Events", file: "02_win32evtlog.py", codeW: 5.0,
    code: [
      "import win32evtlog",
      "h = win32evtlog.OpenEventLog(None, \"Application\")",
      "win32evtlog.GetNumberOfEventLogRecords(h)",
      "",
      "flags = (win32evtlog.EVENTLOG_BACKWARDS_READ |",
      "         win32evtlog.EVENTLOG_SEQUENTIAL_READ)",
      "",
      "while shown < 5:",
      "    events = win32evtlog.ReadEventLog(h, flags, 0)",
      "    for ev in events:",
      "        ev.SourceName, ev.EventType,",
      "        ev.TimeGenerated.Format()",
      "win32evtlog.CloseEventLog(h)",
    ],
    output: [
      "'Application' log holds 15,708 records",
      "",
      "Newest 5 events:",
      "  [INFO ] Software Protection ...",
      "  [INFO ] Windows Error Reporting ...",
      "  [ERROR] Application Hang  Nov 6 ...",
      "",
      "Event types: {'INFO': 10, 'ERROR': 2}",
      "Top sources:",
      "  Windows Error Reporting   8",
    ],
    watch: [
      "`BACKWARDS_READ` = newest first",
      "`ReadEventLog` returns a batch",
      "Count by source and type",
    ],
    notes: "Event logs are the IR timeline. Security log (needs admin) has logons and process creation (4624, 4688); Application/System are readable as a user. Reading backwards gets the most recent events first. Real tools parse these into a timeline.",
  });

  await d.demo({
    tag: "D3", name: "Processes, Services, Network", file: "03_wmi.py", codeW: 5.0,
    code: [
      "import wmi",
      "c = wmi.WMI()",
      "",
      "c.Win32_OperatingSystem()[0].Caption",
      "c.Win32_ComputerSystem()[0].TotalPhysicalMemory",
      "",
      "for p in c.Win32_Process():",
      "    p.ProcessId, p.Name",
      "",
      "running = [s for s in c.Win32_Service()",
      "           if s.State == \"Running\"]",
      "",
      "for nic in c.Win32_NetworkAdapterConfiguration(",
      "        IPEnabled=True):",
      "    nic.Description, nic.IPAddress",
    ],
    output: [
      "OS      : Windows 11 Home",
      "Host    : LAB-VM-07",
      "RAM     : 33.5 GB",
      "",
      "383 processes total",
      "  PID 4     System",
      "  PID 828   svchost.exe",
      "132 services running",
      "  Appinfo   Manual",
      "Network: Wi-Fi  192.168.0.199",
    ],
    watch: [
      "`wmi.WMI()` then query `Win32_*`",
      "Filter in the call: `IPEnabled=True`",
      "Processes, services, NICs, disks",
    ],
    notes: "WMI exposes the whole machine as queryable classes. Win32_Process, Win32_Service and Win32_NetworkAdapterConfiguration are the triage staples. Attackers use WMI for recon and lateral movement, so monitoring WMI activity is itself a defensive topic.",
  });

  await d.demo({
    tag: "D4", name: "Familiarise", part: "Lab", file: "04_lab_familiarise.py", codeW: 5.0,
    code: [
      "import winreg, win32evtlog, wmi",
      "",
      "# winreg",
      "[h for h in dir(winreg) if h.startswith(\"HKEY\")]",
      "winreg.OpenKey(HKCU, r\"Environment\")",
      "winreg.QueryInfoKey(k)   # (subkeys, values, mtime)",
      "",
      "# win32evtlog",
      "h = win32evtlog.OpenEventLog(None, \"System\")",
      "win32evtlog.GetNumberOfEventLogRecords(h)",
      "",
      "# wmi",
      "c = wmi.WMI()",
      "c.Win32_LogicalDisk(DriveType=3)   # local disks",
    ],
    output: [
      "=== winreg ===",
      "hives: ['HKEY_CLASSES_ROOT', ...]",
      "HKCU\\Environment has 10 values",
      "  first value: OneDrive",
      "=== win32evtlog ===",
      "System log records: 29,954",
      "=== wmi ===",
      "logical disks:",
      "  C: 290 GB free of 1023 GB",
    ],
    watch: [
      "`QueryInfoKey` = counts + mtime",
      "Filter WMI in the call",
      "`dir()`/`help()` to explore",
    ],
    notes: "The syllabus familiarise task across all three modules. WMI query filters (DriveType=3) run server-side, which is faster than filtering in Python.",
  });

  await d.demo({
    tag: "D5", name: "Live Triage Snapshot", part: "Mini project", file: "05_triage.py", codeW: 5.1,
    code: [
      "# winreg + wmi + win32evtlog in one report",
      "",
      "cs = c.Win32_ComputerSystem()[0]       # host, RAM",
      "os_info = c.Win32_OperatingSystem()[0] # OS, boot time",
      "",
      "# Autostart entries (persistence)",
      "winreg ... HKCU\\...\\Run -> EnumValue",
      "",
      "# Recent Application ERROR events",
      "win32evtlog ... EVENTLOG_ERROR_TYPE",
      "",
      "# Resource counts",
      "len(c.Win32_Process());  running services;  disk free",
    ],
    output: [
      "  WINDOWS TRIAGE SNAPSHOT",
      "Host    : LAB-VM-07",
      "OS      : Windows 11 Home (10.0.26200)",
      "Booted  : 2026-10-17 14:05",
      "",
      "Autostart (HKCU Run):",
      "  OneDrive, SecurityHealth, ...",
      "Recent Application errors:",
      "  Application Hang  Nov 6 18:17",
      "Resources: 386 procs, 132 svcs,",
      "  C: 290 GB free",
    ],
    watch: [
      "Three modules, one snapshot",
      "Autoruns + errors + resources",
      "Baseline, then diff to find change",
    ],
    notes: "This is a real responder's first command on a suspect host: who is it, what starts at boot, what's erroring, what's running. The power comes from diffing against a known-good baseline to surface what changed.",
  });

  await d.troubleshoot({
    items: [
      ["`ModuleNotFoundError: win32evtlog`", "Install pywin32: `pip install pywin32`."],
      ["`ModuleNotFoundError: wmi`", "`pip install wmi` (it builds on pywin32)."],
      ["Access denied on Security log", "That log needs Administrator. Use Application/System as a user."],
      ["`FileNotFoundError` from QueryValueEx", "The value isn't there. Guard with try/except and return a default."],
      ["WMI query is slow", "Filter in the call (`Win32_Service(State='Running')`), not in Python."],
      ["Works on Windows, fails on Linux", "These modules are Windows-only. Run on a Windows machine or VM."],
    ],
    notes: "The Windows-only point is the big one for this cohort: schedule these labs on the Windows boxes.",
  });

  await d.challenge({
    items: [
      { level: "EASY", head: "Autorun diff", text: "Save the HKCU Run entries to a JSON baseline; on a second run, report any new or removed entries.", hint: "Dict of name->value, compare with a saved JSON." },
      { level: "MEDIUM", head: "Error timeline", text: "Read the last 100 Application events and print a count of errors per source, worst first.", hint: "`Counter` on SourceName where EventType is ERROR." },
      { level: "STRETCH", head: "Service baseline", text: "Snapshot running services via WMI; diff against a baseline to flag newly-running or stopped services.", hint: "Set of service names now vs. saved set." },
    ],
    notes: "All three build the baseline-and-diff habit, the heart of host monitoring. Easy and Stretch are real persistence/anomaly detectors.",
  });

  await d.summary({
    built: [
      ["D1", "Registry Recon", "`winreg`: read values, enumerate, autoruns"],
      ["D2", "Event Logs", "`win32evtlog`: read and summarise events"],
      ["D3", "WMI Queries", "Processes, services, network, disks"],
      ["D4", "Familiarise", "Lab: all three modules"],
      ["D5", "Live Triage", "One-page first-look snapshot"],
    ],
    takeaways: [
      "Registry, event logs and WMI are the Windows forensic trio",
      "Raw strings for Registry paths; guard missing values",
      "Read event logs backwards; Security log needs admin",
      "WMI queries the live box; baseline, then diff",
    ],
    next: "Session 19: shutil, clipboard, email archives (libpff) and crypto",
  });

  await d.save(out);
};
