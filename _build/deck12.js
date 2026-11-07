// Session 12: File handling - open/close, modes, read/readline/readlines, write/writelines, flush
const { Deck, C } = require("./lib");

module.exports = async function build(out) {
  const d = new Deck(12, "File Handling");

  await d.titleSlide({
    title: "File Handling: Logs, Evidence and Reports",
    subtitle: "Read logs line by line, write reports, append safely, and hash files to prove they're unchanged.",
    flow: [
      ["FaFolderOpen", "open()", "Modes: r, w, a, b", C.coral],
      ["FaBookReader", "read", "read, readline, iterate", C.navy],
      ["FaPen", "write", "write, writelines, append", C.teal],
      ["FaFingerprint", "hash", "Prove integrity", C.coral],
    ],
    notes: "Files are where the real work starts: logs to analyse, evidence to hash, reports to write. The key habit is the 'with' statement, which always closes the file. We finish with file hashing, the backbone of forensic integrity.",
  });

  await d.goalsAgenda({
    sub: "Theory with a live demo after every concept",
    goals: [
      ["FaFolderOpen", "Open files in the right mode, always with `with`"],
      ["FaBookReader", "Read whole, by line, or by iterating"],
      ["FaPen", "Write, append and flush to files"],
      ["FaFingerprint", "Hash files for integrity verification"],
    ],
    agenda: [
      "open(), modes & with",
      "D1  Four ways to read",
      "Writing & appending",
      "D2  write, writelines, flush",
      "D3  Lab: words, append, count",
      "Paths & integrity",
      "D4  pathlib + file hashing",
      "D5  Log -> report pipeline",
      "Troubleshooting & challenge",
    ],
    notes: "D3 is the syllabus lab set. Demos create small output files in the Session-12-Demos folder.",
  });

  await d.tableSlide({
    title: "open() and File Modes",
    sub: "open(path, mode, encoding='utf-8') returns a file object",
    head: ["Mode", "Meaning", "If file exists / missing"],
    colW: [1.3, 3.5, 3.5],
    fontSize: 10.5,
    rows: [
      ["`\"r\"`", "Read (the default)", "Reads it / **error**"],
      ["`\"w\"`", "Write", "**Truncates** it / creates it"],
      ["`\"a\"`", "Append", "Adds to end / creates it"],
      ["`\"x\"`", "Create exclusively", "**Error** / creates it"],
      ["`\"r+\"`", "Read and write", "Reads+writes / error"],
      ["`\"rb\"` `\"wb\"`", "Binary (bytes, not text)", "For images, PCAPs, hashing"],
    ],
    belowY: 4.35,
    below: [
      "**Always** use `with open(...) as f:` - it closes the file automatically, even on an error.",
      "For text, pass `encoding=\"utf-8\"`; for binary data (hashing, images) use a `b` mode and no encoding.",
    ],
    notes: "The 'w' mode truncating is a classic data-loss foot-gun: opening a log 'w' to read it wipes it. The with statement is non-negotiable in real code; a leaked handle can lock a file on Windows.",
  });

  await d.demo({
    tag: "D1", name: "Four Ways to Read", file: "01_reading.py", codeW: 5.0,
    code: [
      "with open(PATH, \"r\", encoding=\"utf-8\") as f:",
      "    content = f.read()        # whole file -> one str",
      "",
      "with open(PATH, encoding=\"utf-8\") as f:",
      "    first = f.readline()      # one line",
      "    second = f.readline()",
      "",
      "with open(PATH, encoding=\"utf-8\") as f:",
      "    lines = f.readlines()     # list of lines",
      "",
      "with open(PATH, encoding=\"utf-8\") as f:",
      "    for line in f:            # lazy, memory-friendly",
      "        if line.startswith(\"Failed\"):",
      "            print(line.strip())",
    ],
    output: [
      "read(): file is 331 characters",
      "",
      "First line : Accepted password for",
      "  alice from 10.0.0.21 ...",
      "readlines(): got 6 lines",
      "",
      "Failed logins:",
      "   Failed password for root from",
      "     45.155.205.233 ...",
      "   Failed password for admin from",
      "     203.0.113.9 ...",
    ],
    watch: [
      "`with` closes the file for you",
      "Iterating reads one line at a time",
      "`.strip()` drops the trailing newline",
    ],
    notes: "Iterating the file object is the idiom for large files: it never loads the whole thing into memory, so it handles multi-gigabyte logs. read() and readlines() load everything at once.",
  });

  await d.demo({
    tag: "D2", name: "write, writelines, flush", file: "02_writing.py", codeW: 5.0,
    code: [
      "with open(\"report.txt\", \"w\", encoding=\"utf-8\") as f:",
      "    f.write(\"Scan Report\\n\")      # no auto newline",
      "    f.write(\"=\" * 20 + \"\\n\")",
      "",
      "findings = [\"Finding 1: telnet open\\n\", ...]",
      "with open(\"report.txt\", \"a\", encoding=\"utf-8\") as f:",
      "    f.writelines(findings)         # 'a' = append",
      "",
      "# flush(): force buffer to disk now",
      "with open(\"live.log\", \"w\") as f:",
      "    for i in range(3):",
      "        f.write(f\"tick {i}\\n\")",
      "        f.flush()",
    ],
    output: [
      "report.txt now contains:",
      "",
      "Scan Report",
      "====================",
      "Open ports: 22, 80, 443",
      "Finding 1: telnet open",
      "Finding 2: weak TLS",
      "Finding 3: default creds",
      "",
      "audit.txt: ['run', '1', 'run', '2']",
    ],
    watch: [
      "`write()` does NOT add newlines",
      "`\"w\"` truncates; `\"a\"` appends",
      "`flush()` writes buffered data now",
    ],
    notes: "write() needs explicit \\n. Data is buffered and written at close; flush() forces it out immediately, which matters for live logs or if the process might be killed mid-run.",
  });

  await d.demo({
    tag: "D3", name: "Words, Append, Count", part: "Lab programs", file: "03_lab_file_programs.py", codeW: 5.1,
    code: [
      "# 1. Words shorter than 4 characters",
      "with open(SRC, encoding=\"utf-8\") as f:",
      "    for line in f:",
      "        for word in line.split():",
      "            if len(word) < 4:",
      "                short.append(word)",
      "",
      "# 2. Append one file to another",
      "with open(SRC) as src, open(\"combined.log\", \"a\") as dst:",
      "    dst.write(src.read())",
      "",
      "# 3. Count lines starting with 'A'",
      "with open(SRC, encoding=\"utf-8\") as f:",
      "    for line in f:",
      "        if line.startswith(\"A\"):",
      "            count += 1",
    ],
    output: [
      "Words with fewer than 4 chars:",
      "  ['for', 'for', 'for', 'for',",
      "   'bob', 'for', 'for']",
      "",
      "combined.log line count: 12",
      "Lines starting with 'A': 3",
      "",
      "wc-style -> lines=6 words=48",
      "  chars=331",
    ],
    watch: [
      "Open two files in one `with`",
      "`startswith` for line filtering",
      "Nested loop: lines, then words",
    ],
    notes: "The three syllabus lab programs plus a wc-style count (a self-learning task). Opening two files in one with statement is the clean way to copy/append between them.",
  });

  await d.demo({
    tag: "D4", name: "pathlib + File Hashing", file: "04_paths_integrity.py", codeW: 5.0,
    code: [
      "from pathlib import Path",
      "here = Path(__file__).parent",
      "target = here / \"sample_auth.log\"   # '/' joins paths",
      "target.name, target.suffix, target.exists()",
      "target.stat().st_size               # bytes",
      "",
      "def sha256_file(path, chunk=65536):",
      "    h = hashlib.sha256()",
      "    with open(path, \"rb\") as f:      # binary!",
      "        while (block := f.read(chunk)):",
      "            h.update(block)",
      "    return h.hexdigest()",
      "",
      "sha256_file(copy_ok) == digest     # True",
      "sha256_file(copy_bad) == digest    # False",
    ],
    output: [
      "Path   : .../sample_auth.log",
      "Name   : sample_auth.log",
      "Suffix : .log",
      "Size   : 331 bytes",
      "",
      "SHA-256: 9d2da2d2eb25bce9437e09...",
      "",
      "Integrity check:",
      "  exact copy matches  : True",
      "  tampered copy matches: False",
    ],
    watch: [
      "`Path` with `/` is OS-independent",
      "Hash in chunks for huge files",
      "One byte changes the whole hash",
    ],
    notes: "This is forensic integrity: hash evidence on collection, hash again later; matching hashes prove it is unchanged. Chunked reading handles disk-image-sized files. pathlib replaces fragile string paths and works on Windows and Linux alike.",
  });

  await d.demo({
    tag: "D5", name: "Log to Report Pipeline", part: "Mini project", file: "05_log_report.py", codeW: 5.1,
    code: [
      "from collections import Counter",
      "fails_by_ip = Counter()",
      "",
      "with open(SRC, encoding=\"utf-8\") as f:",
      "    for line in f:",
      "        parts = line.split()",
      "        ip = parts[parts.index(\"from\") + 1]",
      "        if line.startswith(\"Failed\"):",
      "            fails_by_ip[ip] += 1",
      "",
      "with open(OUT, \"w\", encoding=\"utf-8\") as r:",
      "    r.write(\"AUTH LOG REPORT\\n\")",
      "    for ip, n in fails_by_ip.most_common():",
      "        r.write(f\"  {ip:<18} {n}\\n\")",
    ],
    output: [
      "Wrote auth_report.txt:",
      "",
      "AUTH LOG REPORT",
      "Generated: 2026-11-07 14:07",
      "Total events : 6",
      "Accepted     : 3",
      "Failed       : 3",
      "",
      "Failed logins by source IP:",
      "  45.155.205.233  2 <-- brute force",
      "  203.0.113.9     1",
    ],
    watch: [
      "Read -> analyse -> write a report",
      "`Counter` tallies per IP",
      "The whole pipeline is ~20 lines",
    ],
    notes: "This is the shape of countless real scripts: ingest a log, count something, emit a report file. Everything from earlier sessions (loops, dicts, functions, strings) comes together here.",
  });

  await d.troubleshoot({
    items: [
      ["`FileNotFoundError`", "Wrong path or working directory. Use `pathlib` and check `.exists()`."],
      ["My file got wiped", "`\"w\"` truncates on open. Use `\"a\"` to add, `\"r\"` to read."],
      ["`UnicodeDecodeError`", "Not UTF-8 text. Try `encoding=\"latin-1\"`, or open binary (`\"rb\"`)."],
      ["Written data is missing", "The file wasn't closed. Use `with`, or call `flush()`."],
      ["Blank lines when reading", "Lines keep their `\\n`. Use `line.strip()` or `line.rstrip(\"\\n\")`."],
      ["`PermissionError` on Windows", "The file is open elsewhere, or you lack rights. Close other handles."],
    ],
    notes: "FileNotFoundError is almost always a working-directory issue: the script runs from somewhere other than where you think. Path(__file__).parent anchors to the script's own folder.",
  });

  await d.challenge({
    items: [
      { level: "EASY", head: "grep-lite", text: "Read a file and print every line containing a word the user types, with its line number.", hint: "`enumerate(f, 1)` and `if term in line`." },
      { level: "MEDIUM", head: "Dedolog", text: "Read a log and write a new file with duplicate lines removed, keeping first-seen order.", hint: "A `set` of seen lines; write only new ones." },
      { level: "STRETCH", head: "Integrity manifest", text: "Hash every file in a folder and write a manifest; a second run reports changed/added/removed files.", hint: "`pathlib.Path.rglob('*')`, store `{path: hash}` as JSON." },
    ],
    notes: "Stretch is a real tripwire tool (like AIDE): a hash manifest that detects tampering, combining files, pathlib, hashing and json.",
  });

  await d.summary({
    built: [
      ["D1", "Four Ways to Read", "`read`, `readline`, `readlines`, iterate; `with`"],
      ["D2", "write, writelines, flush", "Modes `w`/`a`, newlines, buffering"],
      ["D3", "Words, Append, Count", "Lab programs"],
      ["D4", "pathlib + Hashing", "Portable paths, integrity verification"],
      ["D5", "Log to Report", "Read, analyse, write a report"],
    ],
    takeaways: [
      "Always use `with open(...)`; it closes the file for you",
      "`\"w\"` truncates, `\"a\"` appends, `\"b\"` is binary",
      "Iterate a file to read huge logs without filling memory",
      "File hashes prove evidence hasn't changed",
    ],
    next: "Session 13: Exceptions: try, except, else, finally",
  });

  await d.save(out);
};
