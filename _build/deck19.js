// Session 19: shutil, win32clipboard, email/PST archives (libpff)
const { Deck, C } = require("./lib");

module.exports = async function build(out) {
  const d = new Deck(19, "Files, Clipboard & Email");

  await d.titleSlide({
    title: "shutil, Clipboard & Email Archives",
    subtitle: "Handle evidence files safely, inspect the clipboard, and pull apart emails and Outlook archives.",
    flow: [
      ["FaCopy", "shutil", "Copy, move, archive", C.coral],
      ["FaClipboard", "clipboard", "Read & write it", C.navy],
      ["FaEnvelopeOpenText", "email", "Parse messages", C.teal],
      ["FaInbox", "libpff", "Read PST archives", C.coral],
    ],
    notes: "A grab-bag of practical forensic tools: shutil for handling evidence files, win32clipboard for the clipboard (where secrets get copied), the email module for message analysis, and libpff/libratom for Outlook PST archives. Clipboard is Windows-only; the rest are cross-platform.",
  });

  await d.goalsAgenda({
    sub: "Theory with a live demo after every concept",
    goals: [
      ["FaCopy", "Copy, move and archive files with `shutil`"],
      ["FaClipboard", "Read and write the clipboard safely"],
      ["FaEnvelopeOpenText", "Parse emails and spot spoofing"],
      ["FaInbox", "Know how PST archives are read"],
    ],
    agenda: [
      "shutil: evidence handling",
      "D1  Copy, archive, disk usage",
      "win32clipboard",
      "D2  Read/write the clipboard",
      "Email & PST forensics",
      "D3  Parse an email; libpff",
      "D4  Lab: familiarise",
      "D5  Evidence packager",
      "Troubleshooting & challenge",
    ],
    notes: "pywin32, and pypff (for PST) are in requirements.txt; pypff is the pip name 'libpff-python'.",
  });

  await d.iconRows({
    title: "shutil: High-Level File Operations",
    sub: "Copy, move and archive whole trees - above the low-level os functions",
    rows: [
      { icon: "FaCopy", color: C.coral, head: "`copy2` / `copytree`", text: "`copy2` preserves timestamps (vital for evidence); `copytree` copies folders." },
      { icon: "FaArrowRight", color: C.navy, head: "`move`", text: "Move or rename a file or directory across the filesystem." },
      { icon: "FaFileArchive", color: C.teal, head: "`make_archive`", text: "Zip (or tar) a folder into one file for transfer: `make_archive(base, \"zip\", src)`." },
      { icon: "FaHdd", color: C.purple, head: "`disk_usage` / `which`", text: "Free space before you copy a disk image; find a tool on PATH." },
    ],
    panel: { caption: "Evidence handling", fontSize: 10.5, lines: [
      "import shutil",
      "shutil.copy2(src, dst)      # keep mtime",
      "shutil.copytree(case, backup)",
      "shutil.move(a, b)",
      "",
      "shutil.make_archive(\"case01\",",
      "                    \"zip\", folder)",
      "",
      "shutil.disk_usage(\".\").free",
      "shutil.which(\"python\")",
    ] },
    notes: "copy2 vs copy: copy2 preserves metadata, which matters when timestamps are evidence. make_archive produces a single file to hand off. disk_usage before imaging a large drive avoids running out of space mid-copy.",
  });

  await d.demo({
    tag: "D1", name: "Copy, Archive, Disk Usage", file: "01_shutil.py", codeW: 5.0,
    code: [
      "import shutil, tempfile, os",
      "",
      "shutil.copy2(src, dst)            # preserves metadata",
      "shutil.copytree(case, backup)     # whole folder",
      "shutil.move(dst, moved)",
      "",
      "archive = shutil.make_archive(",
      "    zip_base, \"zip\", case)        # -> case01_evidence.zip",
      "",
      "usage = shutil.disk_usage(work)",
      "usage.free, usage.total",
      "shutil.which(\"python\")",
      "",
      "shutil.rmtree(work)               # clean up",
    ],
    output: [
      "copied notes.txt (metadata): True",
      "copied whole folder: 3 files",
      "moved file: archived_notes.txt",
      "",
      "made archive: case01_evidence.zip",
      "  (400 bytes)",
      "",
      "disk: 290 GB free of 1023 GB",
      "python on PATH: ...\\python.EXE",
      "cleaned up: True",
    ],
    watch: [
      "`copy2` keeps timestamps",
      "`make_archive` bundles a folder",
      "`rmtree` deletes a tree (careful!)",
    ],
    notes: "The demo works entirely in a temp folder and removes it. rmtree is powerful and irreversible: in real tools, guard the path you pass it. make_archive is the clean way to bundle a case for transfer.",
  });

  await d.demo({
    tag: "D2", name: "Read/Write the Clipboard", file: "02_clipboard.py", codeW: 5.0,
    code: [
      "import win32clipboard, win32con, time",
      "",
      "def _open():      # clipboard is shared - retry",
      "    for _ in range(10):",
      "        try: win32clipboard.OpenClipboard(); return",
      "        except Exception: time.sleep(0.05)",
      "",
      "def get_text():",
      "    _open()",
      "    try:",
      "        if win32clipboard.IsClipboardFormatAvailable(",
      "                win32con.CF_UNICODETEXT):",
      "            return win32clipboard.GetClipboardData(...)",
      "    finally: win32clipboard.CloseClipboard()",
      "",
      "# restore the user's original clipboard afterwards",
    ],
    output: [
      "Current clipboard text: (no text)",
      "After set_text -> 'CSF demo: this",
      "  replaced the clipboard'",
      "",
      "Sensitive content on clipboard? True",
      "",
      "Restored your original clipboard.",
      "",
      "DFIR note: clipboard lives in memory;",
      "  managers may keep history on disk.",
    ],
    watch: [
      "Clipboard is shared: open with retry",
      "Always `CloseClipboard` in `finally`",
      "We restore the original contents",
    ],
    notes: "The clipboard is a shared OS resource, so OpenClipboard can fail if another app holds it; retry. Why it matters for security: password managers copy secrets to the clipboard, and clipboard-history features (and malware) can capture them. We act only on our own clipboard and restore it.",
  });

  await d.demo({
    tag: "D3", name: "Parse an Email; libpff", file: "03_email_forensics.py", codeW: 5.1,
    code: [
      "from email import message_from_string",
      "from email.utils import parseaddr",
      "",
      "msg = message_from_string(raw_eml)",
      "msg[\"Subject\"], msg[\"From\"]",
      "",
      "from_dom = parseaddr(msg[\"From\"])[1].split(\"@\")[-1]",
      "rp_dom   = parseaddr(msg[\"Return-Path\"])[1].split(\"@\")[-1]",
      "from_dom != rp_dom          # spoofing indicator",
      "",
      "for part in msg.walk():",
      "    fn = part.get_filename()",
      "    fn.endswith((\".exe\", \".scr\"))   # dangerous",
      "",
      "import pypff                 # PST archives",
      "pff = pypff.file(); pff.open(\"archive.pst\")",
    ],
    output: [
      "Subject : Urgent: verify your account",
      "From    : ...@yourbank-secure.com",
      "",
      "Spoofing checks:",
      "  From domain       : yourbank-secure.com",
      "  Return-Path domain: spam-sender.ru",
      "  Mismatch? True",
      "  Reply-To differs?  True",
      "Attachments:",
      "  invoice.pdf.exe  <-- DANGEROUS",
      "pypff version 20260926",
    ],
    watch: [
      "From vs Return-Path = spoofing flag",
      "`invoice.pdf.exe` = double extension",
      "libpff/pypff opens Outlook PST files",
    ],
    notes: "The email module parses messages into headers and parts. Classic phishing tells: From domain differs from Return-Path, a different Reply-To, and a double-extension attachment. libpff (pip: libpff-python) opens PST archives, which libratom builds on for mailbox-scale analysis. We show the API; a real PST would be read the same way.",
  });

  await d.demo({
    tag: "D4", name: "Familiarise", part: "Lab", file: "04_lab_familiarise.py", codeW: 5.0,
    code: [
      "import shutil",
      "from email.message import EmailMessage",
      "",
      "shutil.disk_usage(\".\").free",
      "shutil.which(\"python\")",
      "shutil.get_archive_formats()",
      "",
      "m = EmailMessage()",
      "m[\"From\"] = \"analyst@soc.example\"",
      "m[\"Subject\"] = \"Daily report\"",
      "m.set_content(\"3 alerts, 0 criticals.\")",
      "",
      "import win32clipboard, win32con   # Windows",
      "win32clipboard.IsClipboardFormatAvailable(...)",
    ],
    output: [
      "=== shutil ===",
      "disk_usage: 290 GB free",
      "archive fmts: ['bztar', 'gztar',",
      "  'tar', 'xztar', 'zip']",
      "=== email (build a message) ===",
      "headers: ['From', 'To', 'Subject', ...]",
      "body: 3 alerts, 0 criticals.",
      "=== win32clipboard ===",
      "clipboard has text right now: True",
    ],
    watch: [
      "`get_archive_formats()` lists options",
      "`EmailMessage` builds messages too",
      "Clipboard check is one call",
    ],
    notes: "The familiarise task. EmailMessage builds as well as parses, useful for automated report emails. shutil supports several archive formats, not just zip.",
  });

  await d.demo({
    tag: "D5", name: "Evidence Packager", part: "Mini project", file: "05_evidence_packager.py", codeW: 5.1,
    code: [
      "import shutil, hashlib, json",
      "",
      "def sha256_file(path):",
      "    h = hashlib.sha256()",
      "    with open(path, \"rb\") as f:",
      "        for block in iter(lambda: f.read(65536), b\"\"):",
      "            h.update(block)",
      "    return h.hexdigest()",
      "",
      "for name, path in sources.items():",
      "    digest = sha256_file(path)         # chain of custody",
      "    shutil.copy2(path, case / name)    # keep metadata",
      "    manifest[\"items\"].append({...})",
      "",
      "shutil.make_archive(\"CASE-2026-011\", \"zip\", case)",
    ],
    output: [
      "Case packaged: CASE-2026-011.zip",
      "  (781 bytes)",
      "",
      "Manifest:",
      "  hosts.txt   20 B  f1fb345c7b04...",
      "  iocs.csv    42 B  215b8e931ec4...",
      "  note.md     43 B  0b8d6e00d3b8...",
      "",
      "SHA-256 of each file = chain of",
      "  custody; the zip is one bundle.",
    ],
    watch: [
      "Hash on collection = chain of custody",
      "`copy2` preserves metadata",
      "Manifest + zip = verifiable bundle",
    ],
    notes: "This mirrors real evidence handling: hash each artifact when collected, copy preserving metadata, record a manifest, and bundle into one archive. Re-hashing later proves nothing was altered. Combines shutil, hashlib and json.",
  });

  await d.troubleshoot({
    items: [
      ["`OpenClipboard: Access is denied`", "Another app holds the clipboard. Retry with a short sleep."],
      ["Clipboard empty after my script", "You replaced it. Save and restore the original, as the demo does."],
      ["`copytree` fails: target exists", "The destination must not exist (pre-3.8) or pass `dirs_exist_ok=True`."],
      ["`rmtree` deleted too much", "It is recursive and irreversible. Validate the path first; never pass user input raw."],
      ["Email headers are None", "That header wasn't present. Use `msg.get(name, default)`."],
      ["`pypff` import fails", "Install `libpff-python`. PST reading is optional for the labs."],
    ],
    notes: "rmtree safety is worth stressing: a bug in the path can wipe a drive. Always build the path from a known base and check it.",
  });

  await d.challenge({
    items: [
      { level: "EASY", head: "Backup tool", text: "Copy every .log file in a folder into a timestamped backup folder, preserving metadata.", hint: "`os.listdir`, filter `.log`, `shutil.copy2`." },
      { level: "MEDIUM", head: "Phish scorer", text: "Score an .eml for phishing: +points for From/Return-Path mismatch, different Reply-To, dangerous attachment, IP-literal links.", hint: "Parse with `email`, sum the indicators." },
      { level: "STRETCH", head: "Clipboard watcher", text: "Poll the clipboard every second for 10s and log when it changes (your own clipboard only).", hint: "Compare to the last value in a loop with `time.sleep(1)`." },
    ],
    notes: "Medium extends D3 into a weighted phishing score. Stretch is a benign clipboard monitor on the student's own machine, framed as the privacy risk it illustrates.",
  });

  await d.summary({
    built: [
      ["D1", "Copy, Archive, Disk", "`shutil` for evidence files"],
      ["D2", "Clipboard", "Read/write/restore with retry"],
      ["D3", "Email & libpff", "Parse messages, spot spoofing; PST archives"],
      ["D4", "Familiarise", "Lab: shutil, email, clipboard"],
      ["D5", "Evidence Packager", "Hash, copy, manifest, zip"],
    ],
    takeaways: [
      "`shutil.copy2` preserves metadata; `make_archive` bundles a case",
      "The clipboard is shared: open with retry, restore the original",
      "From vs Return-Path mismatch is a spoofing flag",
      "Hash evidence on collection for chain of custody",
    ],
    next: "Session 20: Cryptography with pycryptodome (hashing, AES, RSA)",
  });

  await d.save(out);
};
