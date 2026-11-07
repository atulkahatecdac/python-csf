// Session 21: Forensics - PDF metadata (pypdf), image EXIF (Pillow), Recycle Bin
const { Deck, C } = require("./lib");

module.exports = async function build(out) {
  const d = new Deck(21, "Document & Image Forensics");

  await d.titleSlide({
    title: "Forensics: PDF, Image & Deleted-File Metadata",
    subtitle: "Pull author and software from PDFs, location and time from photos, and deleted-file records from the Recycle Bin.",
    flow: [
      ["FaFilePdf", "PyPDF", "PDF metadata", C.coral],
      ["FaCamera", "Pillow EXIF", "Photo location & time", C.navy],
      ["FaTrashRestore", "Recycle Bin", "Deleted-file records", C.teal],
      ["FaClipboardCheck", "Triage", "Hash + metadata report", C.coral],
    ],
    notes: "Digital forensics is about the data behind the data. PDFs carry author and software; photos carry camera and GPS; the Recycle Bin keeps records of deleted files. We extract all three in Python. Samples are generated so demos are self-contained; on a real case you'd point these at seized files.",
  });

  await d.goalsAgenda({
    sub: "Theory with a live demo after every concept",
    goals: [
      ["FaFilePdf", "Extract and interpret PDF metadata"],
      ["FaCamera", "Read EXIF, including GPS, from images"],
      ["FaTrashRestore", "Parse Recycle Bin `$I` deleted-file records"],
      ["FaClipboardCheck", "Combine into a metadata triage report"],
    ],
    agenda: [
      "Metadata in forensics",
      "D1  PDF metadata (pypdf)",
      "Image EXIF",
      "D2  EXIF & GPS (Pillow)",
      "Deleted files",
      "D3  Recycle Bin $I records",
      "D4  Lab: familiarise",
      "D5  Triage report",
      "Ethics & challenge",
    ],
    notes: "pypdf and pillow are in requirements.txt. The Recycle Bin parsing is cross-platform (we parse the format), though real $I files come from Windows.",
  });

  await d.iconRows({
    title: "Why Metadata Matters",
    sub: "The hidden data in everyday files tells a story",
    rows: [
      { icon: "FaFilePdf", color: C.coral, head: "Documents", text: "Author, software/OS (Producer), create & modify times, revision history." },
      { icon: "FaCamera", color: C.navy, head: "Photos (EXIF)", text: "Camera make/model, timestamp, and often GPS coordinates." },
      { icon: "FaTrashRestore", color: C.teal, head: "Deleted files", text: "The Recycle Bin keeps the original path, size and deletion time." },
      { icon: "FaUserSecret", color: C.purple, head: "Attribution & privacy", text: "Metadata links files to people and places, and leaks when files are shared." },
    ],
    panel: { caption: "What you can recover", fontSize: 10.5, lines: [
      "PDF   -> /Author, /Producer,",
      "         /CreationDate",
      "photo -> Make, Model, DateTime,",
      "         GPS lat/lon",
      "bin   -> original path, size,",
      "         deletion time",
      "",
      "# all survive casual 'cleanup'",
    ] },
    notes: "Famous cases have been cracked by metadata: a document's author field, a photo's GPS. The flip side is privacy: people share files not realising what travels with them. Both are reasons to understand it.",
  });

  await d.demo({
    tag: "D1", name: "PDF Metadata (pypdf)", file: "01_pdf_metadata.py", codeW: 5.0,
    code: [
      "from pypdf import PdfWriter, PdfReader",
      "",
      "# (sample created with PdfWriter + add_metadata)",
      "",
      "reader = PdfReader(\"sample.pdf\")",
      "meta = reader.metadata",
      "len(reader.pages)",
      "meta.title       # 'Quarterly Security Report'",
      "meta.author      # 'a.patil'",
      "meta.producer    # 'Microsoft Word 2019'",
      "meta.get(\"/CreationDate\")",
      "reader.is_encrypted",
    ],
    output: [
      "PDF METADATA",
      "Pages    : 2",
      "Title    : Quarterly Security Report",
      "Author   : a.patil",
      "Producer : Microsoft Word 2019",
      "Created  : D:20261101091500",
      "Encrypted: False",
      "",
      "/Author & /Producer attribute the",
      "doc; mismatched dates = tampering.",
    ],
    watch: [
      "`.author` / `.producer` attribute it",
      "`/Producer` often names the software/OS",
      "Dates use the `D:YYYYMMDD...` format",
    ],
    notes: "The Producer field frequently reveals the exact software and version, sometimes the OS. Author is often a username. Creation vs modification date mismatches can indicate forgery. pypdf also extracts page text for keyword search.",
  });

  await d.demo({
    tag: "D2", name: "EXIF & GPS (Pillow)", file: "02_image_exif.py", codeW: 5.0,
    code: [
      "from PIL import Image",
      "from PIL.ExifTags import TAGS, Base",
      "",
      "loaded = Image.open(\"photo.jpg\")",
      "data = loaded.getexif()",
      "for tag_id, value in data.items():",
      "    TAGS.get(tag_id, tag_id), value",
      "",
      "# GPS is rationals (deg, min, sec):",
      "def to_degrees(dms):",
      "    d, m, s = (x[0]/x[1] for x in dms)",
      "    return d + m/60 + s/3600",
      "",
      "# real GPS: data.get_ifd(Base.GPSInfo.value)",
    ],
    output: [
      "IMAGE EXIF",
      "Size     : (64, 64)",
      "Model       : PhoneX Pro",
      "Software    : CameraApp 3.1",
      "DateTime    : 2026:11:01 14:22:05",
      "Make        : ACME",
      "",
      "GPS: 18.5167 N, 73.8500 E",
      "map: maps.google.com/?q=",
      "  18.5167,73.8500",
    ],
    watch: [
      "`getexif()` returns the tag map",
      "GPS is degrees/minutes/seconds",
      "Convert DMS -> decimal for a map link",
    ],
    notes: "EXIF Make/Model/DateTime identify the device and when. GPS, when present, is stored as rationals in a sub-IFD; convert to decimal degrees for a map link. Many platforms strip EXIF on upload, but originals shared directly keep it.",
  });

  await d.demo({
    tag: "D3", name: "Recycle Bin $I Records", file: "03_recycle_bin.py", codeW: 5.1,
    code: [
      "import struct",
      "from datetime import datetime, timedelta, timezone",
      "",
      "# $I layout: version(8) size(8) filetime(8) namelen(4) name",
      "def parse_I(blob):",
      "    version, size, ticks, n = struct.unpack_from(\"<qqqi\", blob, 0)",
      "    path = blob[28:28+n*2].decode(\"utf-16-le\").rstrip(\"\\x00\")",
      "    deleted = (datetime(1601,1,1, tzinfo=timezone.utc)",
      "               + timedelta(microseconds=ticks/10))",
      "    return path, size, deleted",
      "",
      "# real system: read C:\\$Recycle.Bin\\<SID>\\$I* files",
    ],
    output: [
      "RECYCLE BIN - DELETED ITEMS",
      "Original : C:\\Users\\asha\\Documents",
      "  \\secret_plan.docx",
      "  size   : 48,213 bytes",
      "  deleted: 2026-11-05 09:15:00 UTC",
      "",
      "Original : C:\\Users\\asha\\Downloads",
      "  \\tool.exe",
      "  size   : 1,048,576 bytes",
      "  deleted: 2026-11-06 22:40:00 UTC",
    ],
    watch: [
      "`struct.unpack` reads binary formats",
      "FILETIME = ticks since 1601",
      "`$I` = metadata, `$R` = the content",
    ],
    notes: "The Recycle Bin stores a $I metadata file and a $R content file per deleted item. Parsing $I with struct recovers the original path, size and deletion time even after the file is 'gone' from view. This is a classic forensic artifact; struct is the key skill for any binary format.",
  });

  await d.demo({
    tag: "D4", name: "Familiarise", part: "Lab", file: "04_lab_familiarise.py", codeW: 5.0,
    code: [
      "from pypdf import PdfWriter, PdfReader",
      "from PIL import Image",
      "",
      "r = PdfReader(\"x.pdf\")",
      "len(r.pages); r.metadata",
      "",
      "im = Image.new(\"RGB\", (120, 80), (200, 60, 60))",
      "im.size, im.mode",
      "im.getpixel((0, 0))",
      "im.resize((30, 20))",
      "",
      "import winreg   # Windows",
      "winreg.OpenKey(HKCU, r\"Environment\")",
    ],
    output: [
      "=== pypdf ===",
      "pages   : 1",
      "metadata: {'/Producer': 'pypdf',",
      "  '/Author': 'demo', ...}",
      "=== Pillow ===",
      "size    : (120, 80) | mode: RGB",
      "getpixel: (200, 60, 60)",
      "resized : (30, 20)",
      "=== winreg ===",
      "HKCU\\Environment values: 10",
    ],
    watch: [
      "pypdf reads and writes PDFs",
      "Pillow reads pixels and resizes",
      "winreg recaps Session 18",
    ],
    notes: "The familiarise task across the three libraries. Pillow does far more (crop, convert, filter, thumbnails); pypdf can merge, split and extract text. Encourage dir()/help() exploration.",
  });

  await d.demo({
    tag: "D5", name: "Metadata Triage Report", part: "Mini project", file: "05_document_triage.py", codeW: 5.1,
    code: [
      "def meta_for(path):",
      "    if path.endswith(\".pdf\"):",
      "        r = PdfReader(path); m = r.metadata or {}",
      "        return {\"type\": \"PDF\", \"pages\": len(r.pages),",
      "                \"author\": m.get(\"/Author\"),",
      "                \"producer\": m.get(\"/Producer\")}",
      "    if path.endswith((\".jpg\", \".png\")):",
      "        tags = Image.open(path).getexif()",
      "        return {\"type\": \"image\", \"make\": ...}",
      "",
      "for name in sorted(os.listdir(EVID)):",
      "    sha256(path); meta_for(path)   # hash + metadata",
    ],
    output: [
      "DOCUMENT & IMAGE TRIAGE",
      "",
      "scene.jpg  [image]",
      "  sha256: 4161c7717a69a060...",
      "  make: ACME",
      "  software: CameraApp 3.1",
      "",
      "statement.pdf  [PDF]",
      "  sha256: df2c4dae6170dc2e...",
      "  author: a.patil",
      "  producer: LibreOffice 7.6",
    ],
    watch: [
      "Walk a folder, dispatch by type",
      "Hash each (chain of custody)",
      "One report across file types",
    ],
    notes: "This is real triage: point it at a folder of seized files, hash everything, extract metadata, flag what's notable. It combines pypdf, Pillow, hashlib and os - the whole module coming together on an evidence set.",
  });

  await d.troubleshoot({
    items: [
      ["`reader.metadata` is None", "The PDF has no metadata dict. Guard with `r.metadata or {}`."],
      ["No EXIF on an image", "PNGs and screenshots often have none; uploads get stripped. Handle empty."],
      ["`PermissionError` deleting an image", "`Image.open` holds the file. Call `.close()` before removing it."],
      ["GPS looks wrong", "It's degrees/minutes/seconds rationals in a sub-IFD; convert, mind N/S/E/W."],
      ["`struct.error: unpack`", "Wrong format string or too-short data. Match the byte layout exactly."],
      ["Encrypted PDF won't read", "Call `reader.decrypt(password)` first, if you're authorised to."],
    ],
    notes: "The Image.open file-handle issue and the None-metadata guard are the two that bite in practice.",
  });

  await d.challenge({
    items: [
      { level: "EASY", head: "PDF author scan", text: "Scan a folder of PDFs and list each file's author and producer in a table.", hint: "`os.listdir`, `PdfReader(path).metadata`." },
      { level: "MEDIUM", head: "EXIF stripper", text: "Write a tool that saves a copy of an image with ALL EXIF removed (privacy).", hint: "Open, copy pixels to a new Image, save without exif." },
      { level: "STRETCH", head: "Deleted-file timeline", text: "Parse several $I records and print them as a time-ordered deletion timeline.", hint: "Parse each, sort by the deletion datetime." },
    ],
    notes: "Medium (EXIF stripping) is the defensive/privacy counterpart. Stretch builds a timeline, a core forensic deliverable.",
  });

  await d.summary({
    built: [
      ["D1", "PDF Metadata", "pypdf: author, producer, dates"],
      ["D2", "EXIF & GPS", "Pillow: camera, time, location"],
      ["D3", "Recycle Bin", "Parse `$I` records with struct"],
      ["D4", "Familiarise", "Lab: pypdf, Pillow, winreg"],
      ["D5", "Triage Report", "Hash + metadata across file types"],
    ],
    takeaways: [
      "Documents and photos carry attribution and location metadata",
      "EXIF GPS is degrees/minutes/seconds; convert to decimal",
      "The Recycle Bin's `$I` files record deleted items",
      "`struct` unpacks any binary forensic format",
    ],
    next: "Session 22: Packet and database forensics (dpkt, SQLite) and capstone",
  });

  await d.save(out);
};
