#!/usr/bin/env python3
"""Demo 2 - win32evtlog: read the Windows Event Log.

Run:  python 02_win32evtlog.py        (Windows only)
Shows: opening a log, counting records, and reading the newest few events.
The Application log is readable as a normal user; the Security log needs admin.

Event logs are central to incident response: logons, process creation, service
changes and errors all land here.
"""
import win32evtlog
from collections import Counter

LOG = "Application"            # try "System" too; "Security" needs admin

handle = win32evtlog.OpenEventLog(None, LOG)
total = win32evtlog.GetNumberOfEventLogRecords(handle)
print(f"'{LOG}' log holds {total:,} records\n")

TYPE = {
    win32evtlog.EVENTLOG_ERROR_TYPE: "ERROR",
    win32evtlog.EVENTLOG_WARNING_TYPE: "WARN",
    win32evtlog.EVENTLOG_INFORMATION_TYPE: "INFO",
    win32evtlog.EVENTLOG_AUDIT_SUCCESS: "AUDIT_OK",
    win32evtlog.EVENTLOG_AUDIT_FAILURE: "AUDIT_FAIL",
}

flags = win32evtlog.EVENTLOG_BACKWARDS_READ | win32evtlog.EVENTLOG_SEQUENTIAL_READ

by_source = Counter()
by_type = Counter()
shown = 0

print("Newest 5 events:")
while shown < 5:
    events = win32evtlog.ReadEventLog(handle, flags, 0)
    if not events:
        break
    for ev in events:
        etype = TYPE.get(ev.EventType, str(ev.EventType))
        by_source[ev.SourceName] += 1
        by_type[etype] += 1
        if shown < 5:
            when = ev.TimeGenerated.Format() if ev.TimeGenerated else "?"
            print(f"  [{etype:<9}] {ev.SourceName[:28]:<28} {when}")
            shown += 1

# Read a bigger batch just to build a small summary
for _ in range(3):
    events = win32evtlog.ReadEventLog(handle, flags, 0)
    if not events:
        break
    for ev in events:
        by_source[ev.SourceName] += 1
        by_type[TYPE.get(ev.EventType, str(ev.EventType))] += 1

win32evtlog.CloseEventLog(handle)

print("\nEvent types in the sample:", dict(by_type))
print("\nTop sources:")
for src, n in by_source.most_common(5):
    print(f"  {src[:34]:<34} {n}")
