#!/usr/bin/env python3
"""Demo 2 - Writing and appending files.

Run:  python 02_writing.py
Shows: write(), writelines(), append mode, newlines, flush(),
       and writing a small report. Output files land in this folder.
"""

# --- write mode 'w': creates or TRUNCATES the file --------------------------
with open("report.txt", "w", encoding="utf-8") as f:
    f.write("Scan Report\n")
    f.write("=" * 20 + "\n")
    f.write("Open ports: 22, 80, 443\n")       # write() does NOT add newlines

# --- writelines(): write a list of strings (you add the newlines) -----------
findings = ["Finding 1: telnet open\n",
            "Finding 2: weak TLS\n",
            "Finding 3: default creds\n"]
with open("report.txt", "a", encoding="utf-8") as f:    # 'a' = append
    f.writelines(findings)

# --- Read it back -----------------------------------------------------------
print("report.txt now contains:\n")
with open("report.txt", encoding="utf-8") as f:
    print(f.read())

# --- 'a' appends; 'w' would have wiped the file -----------------------------
with open("audit.txt", "w", encoding="utf-8") as f:
    f.write("run 1\n")
with open("audit.txt", "a", encoding="utf-8") as f:
    f.write("run 2\n")
with open("audit.txt", encoding="utf-8") as f:
    print("audit.txt:", f.read().split())

# --- flush(): force the buffer to disk now (live logs, long runs) -----------
import time
with open("live.log", "w", encoding="utf-8") as f:
    for i in range(3):
        f.write(f"tick {i}\n")
        f.flush()                       # written immediately, not at close
        time.sleep(0.1)
print("\nlive.log written with flush() after each line")
