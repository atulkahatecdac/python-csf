// Session 11: Modules, packages, importing, the standard library, random
const { Deck, C } = require("./lib");

module.exports = async function build(out) {
  const d = new Deck(11, "Modules & Packages");

  await d.titleSlide({
    title: "Modules, Packages & the Standard Library",
    subtitle: "Reuse code across files, organise it into packages, and stand on Python's 'batteries included'.",
    flow: [
      ["FaFileImport", "import", "Pull in other code", C.coral],
      ["FaBoxes", "Package", "A folder of modules", C.navy],
      ["FaBatteryFull", "Stdlib", "hashlib, json, collections", C.teal],
      ["FaDice", "random", "Simulations and test data", C.coral],
    ],
    notes: "Everything so far lived in one file. Real tools span many files and lean on libraries. Today: how import works, how to build a package, a tour of the standard library every analyst uses, and the random module (with a security caveat).",
  });

  await d.goalsAgenda({
    sub: "Theory with a live demo after every concept",
    goals: [
      ["FaFileImport", "Import modules in all four forms"],
      ["FaBoxes", "Build and use a package of your own"],
      ["FaBatteryFull", "Reach for the right standard-library module"],
      ["FaDice", "Use `random` safely; know when to use `secrets`"],
    ],
    agenda: [
      "What is a module; importing",
      "D1  Four import forms",
      "Packages",
      "D2  A package you wrote",
      "Standard-library tour",
      "D3  hashlib, json, Counter...",
      "D4  Lab: random (dice, IPv4)",
      "D5  Inspecting the environment",
      "Troubleshooting & challenge",
    ],
    notes: "D4 covers the random self-learning tasks; D5 covers listing installed packages in code.",
  });

  await d.tableSlide({
    title: "Four Ways to Import",
    sub: "Pick the form that keeps names clear",
    head: ["Form", "Example", "Use it to"],
    colW: [2.9, 3.3, 2.8],
    fontSize: 10.5,
    rows: [
      ["`import module`", "`import math`", "Keep the prefix: `math.pi`"],
      ["`import module as x`", "`import datetime as dt`", "Shorten a long name"],
      ["`from m import name`", "`from hashlib import sha256`", "Use a name directly"],
      ["`from m import a, b`", "`from os.path import join, exists`", "Pull in a few names"],
      ["`from m import *`", "`from os.path import *`", "Avoid: hides where names came from"],
    ],
    belowY: 4.2,
    below: [
      "Python finds modules by searching `sys.path`: the script's folder, then the standard library, then installed packages.",
      "`if __name__ == \"__main__\":` lets a file be **both** an importable module and a runnable script.",
    ],
    notes: "from module import * is convenient in the REPL but bad in scripts: it dumps unknown names into your namespace and can silently shadow built-ins. The __name__ guard is why library files don't run their demo code when imported.",
  });

  await d.demo({
    tag: "D1", name: "Four Import Forms", file: "01_importing.py", codeW: 4.9,
    code: [
      "import math",
      "print(math.sqrt(2), math.pi)",
      "",
      "import datetime as dt",
      "print(dt.datetime.now())",
      "",
      "from hashlib import sha256, md5",
      "print(sha256(b\"a\").hexdigest())",
      "",
      "from os.path import *      # risky",
      "print(join(\"logs\", \"auth.log\"))",
      "",
      "import string",
      "print(string.punctuation)",
      "",
      "if __name__ == \"__main__\":",
      "    main()",
    ],
    output: [
      "math.sqrt(2) = 1.4142",
      "math.pi      = 3.1416",
      "now          : 2026-11-07 14:04",
      "sha256('a')  : ca978112ca1bbdca ...",
      "join demo    : logs\\2026\\auth.log",
      "",
      "digits      : 0123456789",
      "punctuation : !\"#$%&'()*+,-./:;...",
      "",
      "Running as a script",
      "  (__name__ == '__main__')",
    ],
    watch: [
      "Prefix (`math.`) vs direct name",
      "`as` renames; `*` is discouraged",
      "`dir(module)` lists what's inside",
    ],
    notes: "os.path.join builds paths with the right separator for the OS (backslash on Windows, slash on Linux): essential for portable code. Encourage dir(module) and help(module) to explore.",
  });

  await d.twoPanels({
    title: "Packages: Folders of Modules",
    sub: "A package is a directory with an __init__.py that groups related modules",
    left: { caption: "The netkit/ package", fontSize: 10.5, lines: [
      "netkit/",
      "  __init__.py   # marks it a package",
      "  ip.py         # is_private, to_int",
      "  ports.py      # COMMON, name_for",
      "",
      "# __init__.py re-exports names:",
      "from .ip import is_private, to_int",
      "from .ports import name_for",
      "__version__ = \"0.1.0\"",
    ] },
    right: { caption: "Using it", fontSize: 10.5, lines: [
      "from netkit import is_private",
      "import netkit.ip as ipmod",
      "",
      "is_private(\"10.0.0.5\")   # True",
      "ipmod.to_int(\"10.0.0.5\")",
      "# 167772165",
      "",
      "# The dot in '.ip' means",
      "# 'from this same package'",
    ] },
    below: "Group related modules into a package; the `__init__.py` decides what the package exposes. This is how Scapy, requests and every big library are organised.",
    notes: "The leading dot (from .ip) is a relative import: 'the ip module next to me'. __init__.py running on import is how a package can present a clean public API while hiding its internal modules.",
  });

  await d.demo({
    tag: "D2", name: "A Package You Wrote", file: "02_package.py",
    code: [
      "from netkit import is_private, name_for, __version__",
      "import netkit.ip as ipmod",
      "",
      "print(\"netkit version:\", __version__)",
      "",
      "for ip in [\"10.0.0.5\", \"8.8.8.8\", \"172.16.9.9\"]:",
      "    where = \"internal\" if is_private(ip) else \"external\"",
      "    print(f\"{ip:<14} {where} int={ipmod.to_int(ip)}\")",
      "",
      "for port in [22, 443, 9999]:",
      "    print(f\"port {port} -> {name_for(port)}\")",
      "",
      "import netkit",
      "print(netkit.__file__)",
    ],
    output: [
      "netkit version: 0.1.0",
      "",
      "10.0.0.5       internal int=167772165",
      "8.8.8.8        external int=134744072",
      "172.16.9.9     internal int=2886732041",
      "",
      "port 22    -> ssh",
      "port 443   -> https",
      "port 9999  -> unknown",
      "",
      "netkit loaded from:",
      "  .../netkit/__init__.py",
    ],
    watch: [
      "`from netkit import ...` uses re-exports",
      "`netkit.ip` reaches a submodule",
      "Run from the folder that holds netkit/",
    ],
    notes: "Run this from the Session-11-Demos folder so Python finds netkit on sys.path. This is the same structure as any real library; building one demystifies them.",
  });

  await d.grid4({
    title: "Batteries Included: Modules You'll Live In",
    sub: "Shipped with Python, no pip needed",
    cells: [
      { icon: "FaFingerprint", color: C.coral, head: "`hashlib`, `hmac`, `secrets`", text: "File and password hashing, HMAC signatures, secure tokens." },
      { icon: "FaCode", color: C.navy, head: "`json`, `csv`, `base64`", text: "Read/write APIs and config; decode tokens, emails, encoded payloads." },
      { icon: "FaBoxes", color: C.teal, head: "`collections`, `itertools`", text: "`Counter` for tallies, `defaultdict` for grouping, combinatorics." },
      { icon: "FaClock", color: C.purple, head: "`datetime`, `os`, `sys`, `re`", text: "Timestamps, files and env, interpreter info, regular expressions." },
    ],
    notes: "Counter and defaultdict replace the manual counter/grouping patterns from Session 8 with one line. json is the lingua franca of security APIs and threat feeds.",
  });

  await d.demo({
    tag: "D3", name: "hashlib, json, Counter", file: "03_stdlib_tour.py", codeW: 5.0,
    code: [
      "import hashlib, base64, json",
      "from collections import Counter",
      "",
      "hashlib.sha256(b\"evidence\").hexdigest()",
      "",
      "token = base64.b64encode(b\"user:password\").decode()",
      "base64.b64decode(token).decode()    # 'user:password'",
      "",
      "ips = [\"10.0.0.5\", \"45.1.1.1\", \"10.0.0.5\", \"45.1.1.1\", \"45.1.1.1\"]",
      "Counter(ips).most_common(2)",
      "",
      "record = {\"ip\": \"45.1.1.1\", \"hits\": 3, \"blocked\": True}",
      "text = json.dumps(record)",
      "back = json.loads(text)             # back to a dict",
    ],
    output: [
      "len/min/max/sum: 4 7 128 192",
      "any/all > 10   : True False",
      "",
      "sha256: 4ce78dedfb8706542d735b5a ...",
      "base64 encode: dXNlcjpwYXNzd29yZA==",
      "base64 decode: user:password",
      "",
      "top talkers: [('45.1.1.1', 3),",
      "             ('10.0.0.5', 2)]",
      "json string: {\"ip\": \"45.1.1.1\",",
      "  \"hits\": 3, \"blocked\": true}",
    ],
    watch: [
      "`Counter(...).most_common()` = top talkers",
      "`json.dumps`/`loads` convert dict <-> text",
      "base64 is encoding, NOT encryption",
    ],
    notes: "Stress that base64 is reversible encoding, not secrecy: anyone can decode it. Counter.most_common is the one-liner for 'top N' in any log. json true/false map to Python True/False.",
  });

  await d.demo({
    tag: "D4", name: "random: Dice & IPv4", part: "Lab", file: "04_random_lab.py", codeW: 5.0,
    code: [
      "import random, secrets, string",
      "",
      "random.randint(1, 6)              # a die roll",
      "",
      "ip = \".\".join(str(random.randint(0, 255))",
      "               for _ in range(4))   # random IPv4",
      "",
      "random.choice(subnet)            # one host",
      "random.sample(subnet, 3)         # 3 distinct",
      "",
      "random.seed(42)                  # reproducible",
      "",
      "# For SECURITY tokens, not random:",
      "token = \"\".join(secrets.choice(alphabet)",
      "                for _ in range(16))",
    ],
    output: [
      "Rolling two dice five times:",
      "  1 + 3 = 4",
      "  6 + 2 = 8",
      "Random IPv4 test addresses:",
      "   217.44.94.241",
      "   1.192.167.117",
      "random.sample : ['10.0.0.9',",
      "  '10.0.0.3', '10.0.0.4']",
      "Same seed -> same sequence:",
      "  [82, 15, 4] == [82, 15, 4]",
      "Secure token: nAK7Ngsy7cMshxDx",
    ],
    watch: [
      "`random` is great for simulations",
      "`seed()` makes runs repeatable",
      "Tokens/passwords -> use `secrets`",
    ],
    notes: "The dice and random-IPv4 self-learning tasks. Critical security point: random is a predictable PRNG; never use it for passwords, tokens or keys. secrets (and os.urandom) are cryptographically secure.",
  });

  await d.demo({
    tag: "D5", name: "Inspecting the Environment", file: "05_pip_inspect.py", codeW: 4.8,
    code: [
      "import sys",
      "from importlib import metadata",
      "",
      "print(sys.executable)      # which python",
      "print(sys.path[:3])        # where it searches",
      "",
      "# 'pip list' in code:",
      "for d in metadata.distributions():",
      "    print(d.metadata['Name'], d.version)",
      "",
      "metadata.version(\"scapy\")  # 2.8.0",
      "# raises PackageNotFoundError if absent",
    ],
    output: [
      "Interpreter: ...\\.venv\\python.exe",
      "Version    : 3.12.10",
      "Installed packages (first 12):",
      "  beautifulsoup4    4.15.0",
      "  dnspython         2.9.2",
      "  pycryptodome      4.3.0",
      "  scapy             2.8.0  ...",
      "scapy: 2.8.0",
      "requests: 2.34.2",
      "not-installed: not installed",
    ],
    watch: [
      "`sys.executable` = which Python",
      "`sys.path` = where imports are found",
      "`importlib.metadata` = pip list in code",
    ],
    notes: "The self-learning 'list installed packages programmatically' task. sys.executable and sys.path are your first checks when an import mysteriously fails: they tell you which interpreter and which search path are in play.",
  });

  await d.troubleshoot({
    items: [
      ["`ModuleNotFoundError`", "Not installed, or not on `sys.path`. Activate the venv; run from the right folder."],
      ["My file shadows a real module", "Don't name a file `random.py` or `json.py`: it hides the real one."],
      ["`ImportError: cannot import name`", "The name isn't in that module. Check spelling and `dir(module)`."],
      ["Package import fails", "Needs an `__init__.py`, and run from the folder that contains the package."],
      ["Demo code runs on import", "Guard it with `if __name__ == \"__main__\":`."],
      ["Circular import", "Two modules import each other. Move the shared code to a third module."],
    ],
    notes: "The 'my file shadows stdlib' bug is nasty: a local random.py means import random gets YOUR file. The downloaded-files warning in this course is the same idea.",
  });

  await d.challenge({
    items: [
      { level: "EASY", head: "Dice histogram", text: "Roll two dice 1000 times and print a text histogram of the totals (2-12).", hint: "`Counter`, then `print('#' * count)`." },
      { level: "MEDIUM", head: "netkit.hash module", text: "Add a `hash.py` module to netkit with `sha256_file(path)`, and re-export it from `__init__.py`.", hint: "Read the file in binary chunks; update the hash." },
      { level: "STRETCH", head: "Mini CLI", text: "Make a module that, run directly, prints a report, but when imported only offers functions. Use `__name__`.", hint: "`sys.argv` for arguments; guard with `__main__`." },
    ],
    notes: "Medium has students extend the package they just used. Stretch cements the __name__ == __main__ dual-use pattern.",
  });

  await d.summary({
    built: [
      ["D1", "Four Import Forms", "import, as, from-import, and the `*` caveat"],
      ["D2", "A Package You Wrote", "`__init__.py`, submodules, re-exports"],
      ["D3", "hashlib, json, Counter", "The standard-library workhorses"],
      ["D4", "random: Dice & IPv4", "Simulations; `secrets` for security"],
      ["D5", "Inspecting the Environment", "`sys.path`, listing packages in code"],
    ],
    takeaways: [
      "`import` searches `sys.path`; prefer named imports over `*`",
      "A package is a folder with `__init__.py`",
      "The standard library already has hashing, JSON, counters, dates",
      "`random` for simulations, `secrets` for anything security-sensitive",
    ],
    next: "Session 12: File handling: reading, writing and appending files",
  });

  await d.save(out);
};
