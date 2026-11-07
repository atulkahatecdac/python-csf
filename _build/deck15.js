// Session 15: Inheritance, operator overloading, polymorphism
const { Deck, C } = require("./lib");

module.exports = async function build(out) {
  const d = new Deck(15, "Inheritance & Polymorphism");

  await d.titleSlide({
    title: "Inheritance, Overloading & Polymorphism",
    subtitle: "Share code through a class hierarchy, make your objects work with built-in operators, and treat different types the same way.",
    flow: [
      ["FaSitemap", "Inherit", "Build on a base class", C.coral],
      ["FaPlusSquare", "super()", "Reuse the parent", C.navy],
      ["FaEquals", "Overload", "+, ==, <, len() on your types", C.teal],
      ["FaClone", "Polymorph", "One call, many types", C.coral],
    ],
    notes: "Session 14 built single classes. Now we relate them: a Server IS AN Asset, a Manager IS AN Employee. Inheritance shares code; operator overloading makes our objects feel native; polymorphism lets one loop drive many types. This completes the OOP block.",
  });

  await d.goalsAgenda({
    sub: "Theory with a live demo after every concept",
    goals: [
      ["FaSitemap", "Create subclasses and override methods"],
      ["FaPlusSquare", "Call the parent with `super()`"],
      ["FaEquals", "Overload operators with dunder methods"],
      ["FaClone", "Use polymorphism and duck typing"],
    ],
    agenda: [
      "Inheritance & super()",
      "D1  Asset -> Server -> DC",
      "Operator overloading",
      "D2  Comparable Findings",
      "Polymorphism & duck typing",
      "D3  Many scanners, one loop",
      "D4  Lab: inherit + overload",
      "D5  Plugin scanner framework",
      "Troubleshooting & challenge",
    ],
    notes: "D4 is the syllabus inheritance + operator-overloading lab.",
  });

  await d.iconRows({
    title: "Inheritance",
    sub: "A subclass gets the base class's attributes and methods, and can add or change them",
    rows: [
      { icon: "FaSitemap", color: C.coral, head: "`class Server(Asset):`", text: "Server IS AN Asset: it inherits everything, then extends it." },
      { icon: "FaPlusSquare", color: C.navy, head: "`super().__init__(...)`", text: "Call the parent's method, then add your own setup." },
      { icon: "FaPenFancy", color: C.teal, head: "Override", text: "Redefine a method (e.g. `risk()`) to change behaviour for the subclass." },
      { icon: "FaStream", color: C.purple, head: "MRO", text: "Python resolves methods up the chain: subclass, then parent, then `object`." },
    ],
    panel: { caption: "A two-level hierarchy", fontSize: 10.5, lines: [
      "class Asset:",
      "    def risk(self): return 1",
      "",
      "class Server(Asset):",
      "    def __init__(self, name, ip, svcs):",
      "        super().__init__(name, ip)",
      "        self.services = svcs",
      "    def risk(self):           # override",
      "        return 2 + len(self.services)",
    ] },
    notes: "'IS A' is the test for inheritance: a Server is an Asset, so inheritance fits. 'HAS A' (a Server has ports) is composition, done with attributes. super() avoids copy-pasting the parent's __init__.",
  });

  await d.demo({
    tag: "D1", name: "Asset -> Server -> DC", file: "01_inheritance.py", codeW: 5.0,
    code: [
      "class Asset:",
      "    def __init__(self, name, ip): ...",
      "    def risk(self): return 1",
      "",
      "class Server(Asset):",
      "    def __init__(self, name, ip, services):",
      "        super().__init__(name, ip)   # parent setup",
      "        self.services = services",
      "    def risk(self):                  # override",
      "        return 2 + len(self.services)",
      "    def describe(self):",
      "        return super().describe() + f\" running ...\"",
      "",
      "class DomainController(Server):",
      "    def risk(self): return super().risk() + 5",
    ],
    output: [
      "risk  1  printer at 10.0.0.50",
      "risk  4  web01 at 10.0.0.5",
      "  running http, https",
      "risk 10  dc01 at 10.0.0.6",
      "  running ldap, kerberos, dns",
      "",
      "dc is a DomainController: True",
      "dc is a Server          : True",
      "dc is an Asset          : True",
      "MRO: ['DomainController',",
      "  'Server', 'Asset', 'object']",
    ],
    watch: [
      "`super()` reuses the parent",
      "Override `risk()` per level",
      "`isinstance` walks the whole tree",
    ],
    notes: "DomainController.risk() calls Server.risk() via super(), which itself builds on Asset. isinstance returns True for every ancestor. The MRO (method resolution order) is the exact lookup path.",
  });

  await d.tableSlide({
    title: "Operator Overloading: Dunder Methods",
    sub: "Special __methods__ let your objects work with built-in syntax",
    head: ["You write", "Python calls", "For"],
    colW: [2.3, 3.3, 3.0],
    fontSize: 11,
    rows: [
      ["`print(x)`, `str(x)`", "`x.__str__()`", "Readable display"],
      ["`x` in the REPL / a list", "`x.__repr__()`", "Debug display"],
      ["`x == y`", "`x.__eq__(y)`", "Equality"],
      ["`x < y`", "`x.__lt__(y)`", "Ordering, sorting"],
      ["`x + y`", "`x.__add__(y)`", "Combine"],
      ["`len(x)`", "`x.__len__()`", "Size"],
      ["`item in x`", "`x.__contains__(item)`", "Membership"],
    ],
    belowY: 4.4,
    below: ["Define `__eq__` and `__lt__` (or use `@total_ordering`) and your objects become **sortable**. Always pair `__eq__` with `__hash__` if you need them in sets."],
    notes: "Dunder (double-underscore) methods are how Python hooks operators to your classes. @functools.total_ordering fills in the other comparisons from __eq__ and __lt__, so you only write two.",
  });

  await d.demo({
    tag: "D2", name: "Comparable Findings", file: "02_operator_overloading.py", codeW: 5.0,
    code: [
      "from functools import total_ordering",
      "",
      "@total_ordering",
      "class Finding:",
      "    def __init__(self, title, severity):",
      "        self.title = title; self.severity = severity",
      "    def __str__(self):",
      "        return f\"{self.title} (sev {self.severity})\"",
      "    def __eq__(self, other):",
      "        return self.severity == other.severity",
      "    def __lt__(self, other):",
      "        return self.severity < other.severity",
      "",
      "sorted(findings, reverse=True)   # now works!",
      "max(findings)                    # highest severity",
    ],
    output: [
      "print(): open telnet (sev 2)",
      "repr() in a list:",
      "  [Finding('open telnet', 2), ...]",
      "",
      "sorted by severity:",
      "   default creds (sev 4)",
      "   weak TLS (sev 3)",
      "   open telnet (sev 2)",
      "   verbose errors (sev 1)",
      "max severity: default creds (sev 4)",
    ],
    watch: [
      "`__lt__` + `@total_ordering` = sortable",
      "`__str__` vs `__repr__`",
      "`+`, `len()`, `in` via dunders too",
    ],
    notes: "Once Finding has __eq__ and __lt__, sorted(), max() and the comparison operators all work. __str__ is for users; __repr__ is for developers (what you see in a list or the REPL).",
  });

  await d.twoPanels({
    title: "Polymorphism & Duck Typing",
    sub: "One interface, many implementations",
    left: { caption: "Polymorphism", fontSize: 10.5, lines: [
      "class Scanner(ABC):",
      "    @abstractmethod",
      "    def scan(self, target): ...",
      "",
      "class PortScanner(Scanner):",
      "    def scan(self, t): return ...",
      "class TLSScanner(Scanner):",
      "    def scan(self, t): return ...",
      "",
      "for s in scanners:   # same call,",
      "    s.scan(target)   # diff result",
    ] },
    right: { caption: "Duck typing", fontSize: 10.5, lines: [
      "# No shared base needed:",
      "# 'if it has .scan(), use it'",
      "",
      "class ThirdPartyTool:",
      "    def scan(self, t):",
      "        return \"vendor: clean\"",
      "",
      "def scan_all(tools, target):",
      "    return [t.scan(target)",
      "            for t in tools]",
    ] },
    below: "**Polymorphism:** different classes respond to the same method. **Duck typing:** Python cares that an object HAS the method, not what class it is - 'if it walks like a duck...'.",
    notes: "An abstract base (ABC) defines a contract: subclasses must implement scan(). Duck typing is looser: any object with a scan() method works, even without inheriting. Both let one loop drive many types.",
  });

  await d.demo({
    tag: "D3", name: "Many Scanners, One Loop", file: "03_polymorphism.py", codeW: 5.0,
    code: [
      "from abc import ABC, abstractmethod",
      "",
      "class Scanner(ABC):",
      "    @abstractmethod",
      "    def scan(self, target): ...",
      "",
      "class PortScanner(Scanner):",
      "    def scan(self, target):",
      "        return f\"ports open on {target}: 22, 443\"",
      "",
      "for s in [PortScanner(), TLSScanner(), HeaderScanner()]:",
      "    print(s.run(\"10.0.0.5\"))",
      "",
      "Scanner()      # TypeError: abstract",
    ],
    output: [
      "[PortScanner] ports open on",
      "  10.0.0.5: 22, 443",
      "[TLSScanner] TLS on 10.0.0.5:",
      "  1.2 (ok)",
      "[HeaderScanner] headers on",
      "  10.0.0.5: missing HSTS",
      "",
      "Can't instantiate abstract base:",
      "  ...abstract method 'scan'",
      "Duck typing (mixed types):",
      "  ports open...  vendor scan...",
    ],
    watch: [
      "Same `scan()` call, different output",
      "ABC can't be instantiated directly",
      "Duck typing needs no base class",
    ],
    notes: "The loop doesn't know or care which scanner it holds; it just calls scan(). The abstract base guarantees every subclass implements it. This is the plugin pattern used by Nmap scripts, Burp extensions, etc.",
  });

  await d.demo({
    tag: "D4", name: "Inherit + Overload", part: "Lab programs", file: "04_lab_inheritance_overload.py", codeW: 5.0,
    code: [
      "# Part A: inheritance chain",
      "class Person:",
      "    def intro(self): return f\"I am {self.name}...\"",
      "class Employee(Person):",
      "    def intro(self):",
      "        return super().intro() + f\", #{self.emp_id}\"",
      "class Manager(Employee):",
      "    def intro(self):",
      "        return super().intro() + f\", managing ...\"",
      "",
      "# Part B: operator overloading",
      "class Vector:",
      "    def __add__(self, o): return Vector(self.x+o.x, self.y+o.y)",
      "    def __sub__(self, o): return Vector(self.x-o.x, self.y-o.y)",
      "    def __eq__(self, o): return (self.x,self.y)==(o.x,o.y)",
    ],
    output: [
      "I am Asha, age 38, employee #101,",
      "  managing 3 people",
      "Is a Person? True",
      "",
      "a     = (2, 3)",
      "b     = (5, 1)",
      "a + b = (7, 4)",
      "b - a = (3, -2)",
      "a == a: True",
    ],
    watch: [
      "Each `intro()` extends `super()`",
      "`+`, `-`, `==` on Vectors",
      "Both syllabus OOP labs in one file",
    ],
    notes: "Part A chains super() three levels, each adding to the intro. Part B overloads arithmetic and equality so Vector objects behave like numbers. These are the two syllabus OOP lab programs.",
  });

  await d.demo({
    tag: "D5", name: "Plugin Scanner Framework", part: "Mini project", file: "05_scanner_framework.py", codeW: 5.1,
    code: [
      "class Check(ABC):",
      "    name = \"check\"",
      "    @abstractmethod",
      "    def run(self, host): ...",
      "",
      "class TelnetCheck(Check):",
      "    name = \"telnet-open\"",
      "    def run(self, host):",
      "        bad = 23 in host[\"ports\"]",
      "        return (not bad, \"telnet open\" if bad else \"ok\")",
      "",
      "for host in hosts:         # polymorphism",
      "    for check in checks:",
      "        ok, detail = check.run(host)",
      "        if not ok: report += (host['name'], check.name)",
    ],
    output: [
      "web01:",
      "  [PASS] telnet-open  telnet closed",
      "  [PASS] patch-level  patched",
      "  [PASS] tls-version  TLS 1.3",
      "legacy01:",
      "  [FAIL] telnet-open  telnet (23) open",
      "  [FAIL] patch-level  unpatched",
      "  [FAIL] tls-version  TLS 1.0",
      "",
      "3 failing checks: legacy01 ...",
    ],
    watch: [
      "Each check is a plugin subclass",
      "One loop runs them all (polymorphism)",
      "`report += item` via `__iadd__`",
    ],
    notes: "A real compliance/vuln scanner is exactly this: a set of check plugins sharing a contract, run uniformly, results collected. Adding a new check is just a new subclass. Report overloads += to collect failures.",
  });

  await d.troubleshoot({
    items: [
      ["Parent setup didn't run", "You forgot `super().__init__(...)` in the subclass constructor."],
      ["Can't instantiate abstract class", "A subclass didn't implement an `@abstractmethod`. Implement it."],
      ["`==` compares by identity", "Define `__eq__`. Without it, `==` means `is` (same object)."],
      ["Object unhashable after `__eq__`", "Defining `__eq__` drops `__hash__`. Add `__hash__` if needed in sets."],
      ["Sorting raises TypeError", "Define `__lt__` (or `@total_ordering`) so objects are comparable."],
      ["Wrong method ran", "Check the MRO: `Class.__mro__`. A subclass method shadows the parent's."],
    ],
    notes: "Forgetting super().__init__ is the most common inheritance bug: the child's attributes exist but the parent's don't.",
  });

  await d.challenge({
    items: [
      { level: "EASY", head: "Money class", text: "Make a `Money` class that overloads `+` and `__str__` so `Money(5) + Money(3)` prints as `Rs 8`.", hint: "`__add__` returns a new Money; `__str__` formats it." },
      { level: "MEDIUM", head: "Alert subclasses", text: "Base `Alert` with `priority()`; subclasses `PortScanAlert`, `MalwareAlert` overriding it. Sort a mixed list.", hint: "`@total_ordering`, `__lt__` on priority()." },
      { level: "STRETCH", head: "Add a check plugin", text: "Add an `SMBCheck` (port 445) to the D5 framework without touching the loop.", hint: "Just subclass `Check` and add it to the list." },
    ],
    notes: "Stretch proves the value of the plugin pattern: extending behaviour by adding a class, not editing existing code (the open/closed principle).",
  });

  await d.summary({
    built: [
      ["D1", "Asset -> Server -> DC", "Inheritance, `super()`, override, MRO"],
      ["D2", "Comparable Findings", "`__str__`, `__eq__`, `__lt__`, sorting"],
      ["D3", "Many Scanners, One Loop", "Polymorphism, ABCs, duck typing"],
      ["D4", "Inherit + Overload", "Lab programs"],
      ["D5", "Plugin Framework", "Checks as plugins, collected results"],
    ],
    takeaways: [
      "Inheritance shares code; use `super()` to reuse the parent",
      "Dunder methods make your objects work with `+`, `==`, `len()`, sorting",
      "Polymorphism: one call, many types; duck typing needs no base class",
      "The plugin pattern = extend by adding a subclass",
    ],
    next: "Session 16: Networking libraries: scapy, ipaddress, dns, dnslib",
  });

  await d.save(out);
};
