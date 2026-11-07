// Session 5: Strings - operators, slicing, functions and methods
const { Deck, C } = require("./lib");

module.exports = async function build(out) {
  const d = new Deck(5, "Strings");

  await d.titleSlide({
    title: "Strings: Text Is Where Security Lives",
    subtitle: "Logs, URLs, hashes, usernames and commands are all text. Slice it, search it and clean it.",
    flow: [
      ["FaFont", "Index & slice", "Reach any character or range", C.coral],
      ["FaPlus", "Operators", "+, *, in, comparison", C.navy],
      ["FaTools", "Methods", "split, strip, replace, find", C.teal],
      ["FaUserShield", "Normalise", "Clean input before trusting it", C.coral],
    ],
    notes: "Almost everything an analyst touches arrives as text: a log line, an HTTP request, a hash, a filename. This session is the toolkit for taking text apart. Strings are immutable, which we lean on throughout.",
  });

  await d.goalsAgenda({
    sub: "Theory with a live demo after every concept",
    goals: [
      ["FaFont", "Index strings and understand immutability"],
      ["FaCut", "Slice with `[start:stop:step]`"],
      ["FaTools", "Use the common string methods fluently"],
      ["FaUserShield", "Normalise input and spot simple attacks in it"],
    ],
    agenda: [
      "String basics & operators",
      "D1  Indexing & operators",
      "Slicing",
      "D2  Slicing hashes & logs",
      "String methods",
      "D3  Cleaning & checking text",
      "D4  Lab: char & vowel counts",
      "D5  Lab: reverse & pangram",
      "Troubleshooting & challenge",
    ],
    notes: "D4 and D5 are the syllabus lab programs for this session.",
  });

  await d.iconRows({
    title: "String Basics",
    sub: "An ordered, immutable sequence of characters",
    rows: [
      { icon: "FaHashtag", color: C.coral, head: "Indexing from 0", text: "`s[0]` is the first character, `s[-1]` the last. `len(s)` counts them." },
      { icon: "FaLock", color: C.navy, head: "Immutable", text: "`s[0] = \"X\"` is a TypeError. Methods return a **new** string instead." },
      { icon: "FaPlus", color: C.teal, head: "`+` joins, `*` repeats", text: "`\"a\" + \"b\"`, `\"=\" * 30`. Mixing in a number needs `str()`." },
      { icon: "FaSearch", color: C.purple, head: "`in` and comparison", text: "`\"-enc\" in cmd` tests substrings; `<` compares by Unicode code point." },
    ],
    panel: { caption: "Basics", fontSize: 11, lines: [
      "cmd = \"powershell -enc SQBFAFgA\"",
      "cmd[0]        # 'p'",
      "cmd[-1]       # 'A'",
      "len(cmd)      # 24",
      "",
      "\"-enc\" in cmd           # True",
      "\"admin\" == \"Admin\"      # False",
      "ord(\"A\"), ord(\"a\")      # 65 97",
    ] },
    notes: "The -enc example: encoded PowerShell is a common thing to grep for in logs. 'admin' != 'Admin' is why case-folding matters: attackers vary case to slip past naive filters.",
  });

  await d.demo({
    tag: "D1", name: "Indexing & Operators", file: "01_string_operators.py",
    code: [
      "cmd = \"powershell -enc SQBFAFgA\"",
      "print(\"First char :\", cmd[0])",
      "print(\"Last char  :\", cmd[-1])",
      "print(\"Length     :\", len(cmd))",
      "",
      "try:",
      "    cmd[0] = \"P\"                  # strings are immutable",
      "except TypeError as err:",
      "    print(\"TypeError  :\", err)",
      "",
      "target = user + \"@\" + host",
      "print(\"=\" * 30)",
      "print(\"ALERT\".center(30, \"*\"))",
      "",
      "print(\"'-enc' in cmd?\", \"-enc\" in cmd)",
      "print(\"'Zebra' < 'apple'?\", \"Zebra\" < \"apple\")",
    ],
    output: [
      "First char : p",
      "Last char  : A",
      "Length     : 24",
      "TypeError  : 'str' object does not",
      "  support item assignment",
      "Concatenated: root@10.0.0.5",
      "************ALERT*************",
      "ssh root@10.0.0.5 -p 22",
      "'-enc' in cmd?       True",
      "'Zebra' < 'apple'?   True",
    ],
    watch: [
      "`cmd[-1]` reaches the last char",
      "Can't assign to `cmd[0]`: immutable",
      "`<` compares by code point (A=65, a=97)",
    ],
    notes: "'Zebra' < 'apple' is True because uppercase Z (90) comes before lowercase a (97). This surprises students sorting names or comparing tokens; the fix is to .lower() first.",
  });

  await d.tableCode({
    title: "Slicing: s[start:stop:step]",
    sub: "A substring by position; stop is excluded",
    head: ["Slice", "Gives"],
    colW: [1.7, 2.7],
    fontSize: 11,
    rows: [
      ["`s[:8]`", "First 8 characters"],
      ["`s[-8:]`", "Last 8 characters"],
      ["`s[8:16]`", "Characters 8 to 15"],
      ["`s[::4]`", "Every 4th character"],
      ["`s[::-1]`", "The string reversed"],
      ["`s[100:200]`", "`''` (never errors)"],
    ],
    panel: { caption: "Fields and redaction", fontSize: 10.5, lines: [
      "ioc = \"a94a8fe5ccb19ba6...\"  # SHA-1",
      "ioc[:8]      # 'a94a8fe5'",
      "ioc[::-1]    # reversed digest",
      "",
      "# Pull fields from a fixed layout",
      "line[0:10]   # '2026-11-07'",
      "line[11:19]  # '10:15:42'",
      "",
      "# Keep only the last 4 digits",
      "card = \"4111111111111234\"",
      "\"*\" * 12 + card[-4:]",
      "# ************1234",
    ] },
    notes: "A slice is forgiving: out-of-range bounds give a shorter string or '', never IndexError, unlike single-index access. That makes slicing safe for parsing messy data. Masking all but the last four digits is a standard data-protection pattern.",
  });

  await d.demo({
    tag: "D2", name: "Slicing Hashes & Logs", file: "02_slicing.py",
    code: [
      "ioc = \"a94a8fe5ccb19ba61c4c0873d391e987982fbbd3\"",
      "print(\"First 8 :\", ioc[:8])",
      "print(\"Last 8  :\", ioc[-8:])",
      "print(\"Every 4th char:\", ioc[::4])",
      "print(\"Reversed      :\", ioc[::-1])",
      "",
      "line = \"2026-11-07 10:15:42 [WARN ] auth: failed ...\"",
      "date = line[0:10]",
      "time = line[11:19]",
      "level = line[21:26].strip()",
      "message = line[28:]",
      "",
      "card = \"4111111111111234\"",
      "masked = \"*\" * (len(card) - 4) + card[-4:]",
      "print(\"Masked:\", masked)",
    ],
    output: [
      "First 8 : a94a8fe5",
      "Last 8  : 982fbbd3",
      "Middle  : ccb19ba6",
      "Every 4th char: a8c910de9b",
      "Reversed      : 3dbbf28978...5ef8a49a",
      "",
      "date=2026-11-07  time=10:15:42",
      "  level='WARN'",
      "message: auth: failed login for root",
      "",
      "Masked: ************1234",
    ],
    watch: [
      "`[:8]` and `[-8:]` grab the ends",
      "`[::-1]` reverses",
      "Slicing out of range gives `''`",
    ],
    notes: "Slicing fixed-width fields works for formats whose columns never move (many syslog variants). For CSV or key=value logs, split() is better: shown next.",
  });

  await d.tableSlide({
    title: "Essential String Methods",
    sub: "Each returns a new string or value; the original is unchanged",
    head: ["Method", "Does", "Example -> result"],
    colW: [2.3, 2.9, 3.8],
    fontSize: 10.5,
    rows: [
      ["`.lower()` `.upper()`", "Change case", "`\"Admin\".lower()` -> `\"admin\"`"],
      ["`.strip()`", "Trim whitespace/newlines", "`\"  hi\\n\".strip()` -> `\"hi\"`"],
      ["`.split(sep)`", "Break into a list", "`\"a,b,c\".split(\",\")` -> `[a, b, c]`"],
      ["`.join(list)`", "Combine a list", "`\",\".join(parts)` -> `\"a,b,c\"`"],
      ["`.replace(a, b)`", "Swap substrings", "`log.replace(\"../\", \"\")`"],
      ["`.find(sub)`", "Index or -1", "`log.find(\"../\")` -> `11`"],
      ["`.count(sub)`", "How many times", "`log.count(\"../\")` -> `2`"],
      ["`.startswith()` `.endswith()`", "Prefix / suffix test", "`name.endswith(\".exe\")`"],
      ["`.isdigit()` `.isalpha()` `.isalnum()`", "Validate content", "`\"8080\".isdigit()` -> `True`"],
    ],
    belowY: 4.7,
    below: ["Chain them: `line.strip().lower().split(\"@\")` cleans, folds case and splits in one readable step."],
    notes: "endswith() accepts a tuple: name.endswith((\".exe\", \".bat\")). These methods are the workhorses of log parsing and input validation.",
  });

  await d.demo({
    tag: "D3", name: "Cleaning & Checking Text", file: "03_methods.py", codeW: 5.0,
    code: [
      "raw = \"   Administrator@CORP.LOCAL\\n\"",
      "clean = raw.strip()",
      "user, domain = clean.lower().split(\"@\")",
      "",
      "csv_row = \"10.0.0.5,22,open,ssh\"",
      "fields = csv_row.split(\",\")",
      "print(\" | \".join(fields))",
      "",
      "log = \"GET /admin/../../etc/passwd HTTP/1.1\"",
      "print(\"find('../') :\", log.find(\"../\"))",
      "print(\"count('../'):\", log.count(\"../\"))",
      "print(\"replaced    :\", log.replace(\"../\", \"\"))",
      "",
      "for name in (\"report.pdf\", \"invoice.exe\"):",
      "    if name.endswith((\".exe\", \".bat\", \".scr\")):",
      "        print(\"  Blocked attachment:\", name)",
    ],
    output: [
      "stripped : 'Administrator@CORP.LOCAL'",
      "lower    : administrator@corp.local",
      "user = administrator",
      "  | domain = corp.local",
      "re-joined: 10.0.0.5 | 22 | open | ssh",
      "",
      "find('../')  : 11",
      "count('../') : 2",
      "replaced     : GET /admin/etc/",
      "  passwd HTTP/1.1",
      "  Blocked attachment: invoice.exe",
    ],
    watch: [
      "`strip()` then `lower()` then `split()`",
      "`../` in a path = traversal attempt",
      "Blocklisting `replace` is weak (see notes)",
    ],
    notes: "Teaching point: stripping '../' once is NOT a real defence - '....//' becomes '../' after one pass. Proper fixes use os.path.realpath and allow-lists (Session 11). The demo shows detection, not a cure. Normalising (strip + lower) before comparing usernames prevents trivial bypass.",
  });

  await d.demo({
    tag: "D4", name: "Char & Vowel Counts", part: "Lab program", file: "04_lab_char_counts.py", codeW: 4.7,
    code: [
      "text = input(\"Enter a line of text: \")",
      "",
      "upper = lower = digits = spaces = other = 0",
      "for ch in text:",
      "    if ch.isupper():",
      "        upper += 1",
      "    elif ch.islower():",
      "        lower += 1",
      "    elif ch.isdigit():",
      "        digits += 1",
      "    elif ch.isspace():",
      "        spaces += 1",
      "    else:",
      "        other += 1",
      "",
      "vowels = 0",
      "for ch in text.lower():",
      "    if ch in \"aeiou\":",
      "        vowels += 1",
    ],
    output: [
      "> Enter a line of text:",
      "  Hello World from Python 3",
      "Uppercase : 3",
      "Lowercase : 17",
      "Digits    : 1",
      "Spaces    : 4",
      "Other     : 0",
      "Vowels    : 5",
    ],
    watch: [
      "The `is*` tests classify each char",
      "`ch in \"aeiou\"` is a quick set test",
    ],
    notes: "Two of the session's lab programs. Ask how to also count consonants (a letter that is not a vowel). This is character-frequency analysis in miniature, the basis of breaking simple substitution ciphers.",
  });

  await d.demo({
    tag: "D5", name: "Reverse & Pangram", part: "Lab program", file: "05_lab_reverse_pangram.py", codeW: 4.7,
    code: [
      "import string",
      "text = input(\"Enter a sentence: \")",
      "",
      "print(\"Reversed (slice):\", text[::-1])",
      "",
      "rev = \"\"",
      "for ch in text:",
      "    rev = ch + rev          # build back-to-front",
      "",
      "letters_present = set()",
      "for ch in text.lower():",
      "    if ch in string.ascii_lowercase:",
      "        letters_present.add(ch)",
      "",
      "missing = set(string.ascii_lowercase) - letters_present",
      "if not missing:",
      "    print(\"This IS a pangram\")",
      "else:",
      "    print(\"Missing:\", \"\".join(sorted(missing)))",
    ],
    output: [
      "> The quick brown fox jumps",
      "    over the lazy dog",
      "Reversed (slice): god yzal",
      "  eht revo spmuj xof ...",
      "This IS a pangram -",
      "  all 26 letters are present",
      "",
      "> Pack my box with five dozen jugs",
      "Not a pangram. Missing: lqr",
    ],
    watch: [
      "`[::-1]` vs building a string in a loop",
      "A **set** removes duplicate letters (Session 8)",
    ],
    notes: "The pangram check previews sets: set subtraction finds the missing letters. Both lab programs are on the syllabus. Ask: how would you check a pangram without the string module? (Compare against 'abcdefghijklmnopqrstuvwxyz'.)",
  });

  await d.troubleshoot({
    items: [
      ["`'str' object` won't assign", "Strings are immutable. Build a new one, or use `.replace()`."],
      ["`string index out of range`", "`s[i]` past the end. Check `len(s)`, or use a slice, which never errors."],
      ["`can only concatenate str (not \"int\")`", "Wrap the number: `str(port)`, or use an f-string."],
      ["`.strip(\"abc\")` removed too much", "`strip` takes a **set of characters**, not a prefix. Use `removeprefix` (3.9+)."],
      ["Comparison fails on case/spaces", "Normalise first: `a.strip().lower() == b.strip().lower()`."],
      ["`.split()` vs `.split(\" \")`", "No argument splits on **any** run of whitespace and drops blanks; `\" \"` does not."],
    ],
    notes: "The strip() gotcha bites everyone once: 'example.com'.strip('moc') returns 'example.' because strip removes any of those characters from both ends.",
  });

  await d.challenge({
    items: [
      { level: "EASY", head: "Split into words", text: "Read a sentence and print each word on its own line, numbered, with a total word count at the end.", hint: "`text.split()` then `enumerate(words, 1)`." },
      { level: "MEDIUM", head: "Validate an email", text: "Without regex, check a string looks like an email: exactly one `@`, a `.` after it, and no spaces.", hint: "`count('@')`, `split('@')`, `in` and `.rfind('.')`." },
      { level: "STRETCH", head: "ROT-13", text: "Implement ROT-13: shift each letter 13 places, wrapping around. Applying it twice returns the original.", hint: "`ord`, `chr`, `%26`; or explore `str.maketrans`." },
    ],
    notes: "Split-into-words and email validation are on the self-learning list. ROT-13 leads into the Caesar-cipher dictionary exercise in Session 8.",
  });

  await d.summary({
    built: [
      ["D1", "Indexing & Operators", "Index, len, immutability, +, *, in, compare"],
      ["D2", "Slicing Hashes & Logs", "`[start:stop:step]`, reverse, redact"],
      ["D3", "Cleaning & Checking", "strip, split, join, find, replace, is*"],
      ["D4", "Char & Vowel Counts", "Lab program"],
      ["D5", "Reverse & Pangram", "Lab program"],
    ],
    takeaways: [
      "Strings are immutable: methods return new strings",
      "Slicing is forgiving; indexing can raise IndexError",
      "`split` / `join` / `strip` carry most log parsing",
      "Always normalise text before comparing or trusting it",
    ],
    next: "Session 6: Lists and tuples: creating, slicing, methods, nesting",
  });

  await d.save(out);
};
