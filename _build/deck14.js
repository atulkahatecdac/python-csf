// Session 14: Classes and objects - self, instance/class variables and methods, encapsulation
const { Deck, C } = require("./lib");

module.exports = async function build(out) {
  const d = new Deck(14, "Classes & Objects");

  await d.titleSlide({
    title: "Classes & Objects: Model Your Domain",
    subtitle: "Bundle data and behaviour together: a Host, an Account, a security Event, each with its own state.",
    flow: [
      ["FaDrawPolygon", "class", "A blueprint for objects", C.coral],
      ["FaCube", "instance", "A real object with data", C.navy],
      ["FaUserCog", "self", "This object's own state", C.teal],
      ["FaShieldAlt", "encapsulate", "Protect internal state", C.coral],
    ],
    notes: "Object-oriented programming lets us model things: a Host with ports, an Account that can lock, an Event with a severity. A class is the blueprint; an object (instance) is a real one with its own data. Session 15 adds inheritance and operator overloading.",
  });

  await d.goalsAgenda({
    sub: "Theory with a live demo after every concept",
    goals: [
      ["FaDrawPolygon", "Define a class with `__init__` and methods"],
      ["FaUserCog", "Use `self`, instance attributes and methods"],
      ["FaLayerGroup", "Tell class variables from instance variables"],
      ["FaShieldAlt", "Encapsulate state with `_private` and `@property`"],
    ],
    agenda: [
      "Classes, objects, self",
      "D1  A Host class",
      "Class vs instance data",
      "D2  Counters, class/static methods",
      "D3  Lab: Employee class",
      "Encapsulation",
      "D4  Account lockout + property",
      "D5  Security-event tracker",
      "Troubleshooting & challenge",
    ],
    notes: "D3 is the syllabus Employee lab program.",
  });

  await d.iconRows({
    title: "Classes, Objects and self",
    sub: "A class is a blueprint; an object is one built from it",
    rows: [
      { icon: "FaDrawPolygon", color: C.coral, head: "`class Host:`", text: "Defines a new type. By convention class names are `CapWords`." },
      { icon: "FaMagic", color: C.navy, head: "`__init__(self, ...)`", text: "The constructor: runs when you create an object, sets up its attributes." },
      { icon: "FaUserCog", color: C.teal, head: "`self`", text: "The current object. Every method takes it first; it holds that object's data." },
      { icon: "FaCube", color: C.purple, head: "Instances are independent", text: "`web = Host(...)`, `dc = Host(...)`: each has its own attributes." },
    ],
    panel: { caption: "A class and two objects", fontSize: 10.5, lines: [
      "class Host:",
      "    def __init__(self, ip, os):",
      "        self.ip = ip",
      "        self.open_ports = []",
      "    def add_port(self, p):",
      "        self.open_ports.append(p)",
      "",
      "web = Host(\"10.0.0.5\", \"Linux\")",
      "web.add_port(22)   # self = web",
    ] },
    notes: "self is not magic: it's just the first parameter, and Python passes the object automatically. web.add_port(22) is really Host.add_port(web, 22). Each object carries its own attributes.",
  });

  await d.demo({
    tag: "D1", name: "A Host Class", file: "01_class_basics.py", codeW: 5.0,
    code: [
      "class Host:",
      "    def __init__(self, ip, os=\"unknown\"):",
      "        self.ip = ip",
      "        self.os = os",
      "        self.open_ports = []       # own list per host",
      "",
      "    def add_port(self, port):",
      "        self.open_ports.append(port)",
      "",
      "    def is_exposed(self):",
      "        return any(p in self.open_ports",
      "                   for p in (23, 3389, 445))",
      "",
      "web = Host(\"10.0.0.5\", \"Linux\")",
      "dc = Host(\"10.0.0.6\", \"Windows\")",
      "dc.add_port(3389)",
    ],
    output: [
      "10.0.0.5 (Linux): ports [22, 443]",
      "10.0.0.6 (Windows): ports [3389]",
      "",
      "web exposed? False",
      "dc  exposed? True",
      "",
      "type(web): Host",
      "isinstance(web, Host): True",
      "web's attributes: {'ip': '10.0.0.5',",
      "  'os': 'Linux',",
      "  'open_ports': [22, 443]}",
    ],
    watch: [
      "Each Host has its OWN open_ports",
      "Methods act via `self`",
      "`vars(obj)` shows its attributes",
    ],
    notes: "dc is exposed because RDP (3389) is open. Note each Host gets its own open_ports list in __init__; defining it there (not as a class attribute) is what keeps them independent.",
  });

  await d.twoPanels({
    title: "Class vs Instance Data",
    sub: "Shared by all, or unique to each object",
    left: { caption: "Where variables live", fontSize: 10.5, lines: [
      "class ScanSession:",
      "    total_sessions = 0   # CLASS var",
      "    default_timeout = 5  # shared",
      "",
      "    def __init__(self, analyst):",
      "        self.analyst = analyst  # instance",
      "        self.findings = []      # per-object",
      "        ScanSession.total_sessions += 1",
    ] },
    right: { caption: "class & static methods", fontSize: 10.5, lines: [
      "    @classmethod",
      "    def count(cls):      # gets the class",
      "        return cls.total_sessions",
      "",
      "    @staticmethod",
      "    def is_valid_port(port):",
      "        return 1 <= port <= 65535",
      "",
      "ScanSession.is_valid_port(22)  # True",
    ] },
    below: "**Instance** variables (`self.x`) are per-object. **Class** variables are shared by all. A `@classmethod` gets the class; a `@staticmethod` is a plain helper grouped under the class.",
    notes: "Use a class variable for things shared by all instances (a counter, a default, a lookup table). The trap: a MUTABLE class variable (a list) is shared, so one object's change shows up in all; keep per-object lists in __init__.",
  });

  await d.demo({
    tag: "D2", name: "Counters, class/static methods", file: "02_class_vs_instance.py", codeW: 5.0,
    code: [
      "class ScanSession:",
      "    total_sessions = 0           # class variable",
      "    def __init__(self, analyst):",
      "        self.analyst = analyst",
      "        self.findings = []       # instance variable",
      "        ScanSession.total_sessions += 1",
      "",
      "    @classmethod",
      "    def count(cls):",
      "        return f\"{cls.total_sessions} sessions\"",
      "",
      "a = ScanSession(\"alice\"); b = ScanSession(\"bob\")",
      "a.add_finding(\"open telnet\")",
      "ScanSession.default_timeout = 10   # affects all",
    ],
    output: [
      "a.findings: ['open telnet']",
      "b.findings: []",
      "sessions  : 2",
      "2 sessions so far",
      "",
      "is_valid_port(22)    : True",
      "is_valid_port(99999) : False",
      "",
      "timeout seen by a: 10",
      "timeout seen by b: 10",
    ],
    watch: [
      "`findings` is per-object",
      "`total_sessions` is shared",
      "Changing a class var affects all",
    ],
    notes: "a and b have separate findings lists but share total_sessions and default_timeout. classmethod for things about the class as a whole; staticmethod for a helper that logically belongs with the class but needs no object.",
  });

  await d.demo({
    tag: "D3", name: "Employee Class", part: "Lab program", file: "03_lab_employee.py", codeW: 5.0,
    code: [
      "class Employee:",
      "    company = \"SecureCorp\"       # class variable",
      "",
      "    def __init__(self, emp_id, name, department, salary):",
      "        self.emp_id = emp_id",
      "        self.name = name",
      "        self.department = department",
      "        self.salary = salary",
      "",
      "    def give_raise(self, percent):",
      "        self.salary += self.salary * percent / 100",
      "",
      "    def __str__(self):",
      "        return f\"{self.name} ({self.department})\"",
      "",
      "staff = [Employee(101, \"Asha Patil\", \"SOC\", 650000), ...]",
    ],
    output: [
      "Company: SecureCorp",
      "",
      "[101] Asha Patil   SOC    Rs  650,000",
      "[102] Rahul ...    Foren  Rs  720,000",
      "[103] Meera Iyer   SOC    Rs  580,000",
      "",
      "After a 10% raise for SOC:",
      "[101] Asha Patil   SOC    Rs  715,000",
      "[103] Meera Iyer   SOC    Rs  638,000",
      "",
      "print(employee): Asha Patil (SOC)",
    ],
    watch: [
      "`__init__` stores each field",
      "Methods change `self.salary`",
      "`__str__` controls `print(obj)`",
    ],
    notes: "The syllabus Employee lab. give_raise mutates the object's own salary. Defining __str__ makes print(employee) and f-strings show a friendly form instead of <Employee object at 0x...>.",
  });

  await d.demo({
    tag: "D4", name: "Account Lockout + property", file: "04_encapsulation.py", codeW: 5.0,
    code: [
      "class Account:",
      "    MAX_FAILS = 3",
      "    def __init__(self, username):",
      "        self.username = username",
      "        self._fails = 0          # _ = internal",
      "        self.__locked = False    # __ = name-mangled",
      "",
      "    def record_failure(self):",
      "        self._fails += 1",
      "        if self._fails >= self.MAX_FAILS:",
      "            self.__locked = True",
      "",
      "    @property",
      "    def locked(self):            # read-only view",
      "        return self.__locked",
    ],
    output: [
      "attempts remaining: 3",
      "after fail 1: locked=False, rem=2",
      "after fail 2: locked=False, rem=1",
      "after fail 3: locked=True, rem=0",
      "after fail 4: locked=True, rem=0",
      "",
      "Can't set locked directly:",
      "  property 'locked' has no setter",
      "mangled name (_Account__locked):",
      "  True",
    ],
    watch: [
      "`_x` = \"internal, don't touch\"",
      "`@property` = computed, read-only",
      "`__x` is name-mangled",
    ],
    notes: "Encapsulation hides internal state behind a controlled interface. @property exposes a read-only, computed value. Python has no true 'private'; _x is a convention and __x is name-mangled (to _Account__locked), not truly hidden.",
  });

  await d.demo({
    tag: "D5", name: "Security-Event Tracker", part: "Mini project", file: "05_event_tracker.py", codeW: 5.0,
    code: [
      "class Event:",
      "    SEVERITY = {\"low\": 1, \"medium\": 2, \"high\": 3,",
      "                \"critical\": 4}",
      "    count = 0",
      "    def __init__(self, source_ip, kind, severity=\"low\"):",
      "        self.source_ip = source_ip; self.kind = kind",
      "        self.severity = severity",
      "        Event.count += 1",
      "    def score(self):",
      "        return self.SEVERITY.get(self.severity, 0)",
      "    def is_critical(self):",
      "        return self.score() >= 3",
      "",
      "worst = max(events, key=lambda e: e.score())",
    ],
    output: [
      "All events:",
      "  [HIGH    ] 45.155.205.233 brute...",
      "  [LOW     ] 10.0.0.5       port scan",
      "  [CRITICAL] 45.155.205.233 malware",
      "",
      "Total events (class var): 4",
      "High/critical (2): ...",
      "Most severe: [CRITICAL] ... score 4",
      "Total risk score: 10",
    ],
    watch: [
      "Objects in a list, analysed together",
      "`SEVERITY` lookup shared by all",
      "Methods compute (score, is_critical)",
    ],
    notes: "A collection of objects is the natural model for events, hosts, findings. Methods keep the logic (scoring, classification) next to the data it uses. This is how SIEM-style tools are structured internally.",
  });

  await d.troubleshoot({
    items: [
      ["`missing 1 required argument: 'self'`", "You called a method on the class, not an object, or forgot `self` in the def."],
      ["All objects share one list", "A mutable **class** variable. Create it in `__init__` as `self.x = []`."],
      ["`AttributeError: no attribute 'x'`", "Not set in `__init__`, or a typo. Check `vars(obj)`."],
      ["`print(obj)` shows `<...0x...>`", "Define `__str__` (or `__repr__`) to control display."],
      ["Changed instance, class var unchanged", "`self.x = v` makes an instance var that shadows the class one."],
      ["Forgot `self.`", "Bare `x = 1` in a method is a local, lost on return. Use `self.x`."],
    ],
    notes: "The shared-mutable-class-variable bug is the OOP equivalent of the mutable-default trap from Session 9.",
  });

  await d.challenge({
    items: [
      { level: "EASY", head: "Port class", text: "Write a `Port` class with number and service, and an `is_privileged()` method (< 1024).", hint: "Store number in __init__; return number < 1024." },
      { level: "MEDIUM", head: "Firewall rules", text: "Write a `Firewall` class that stores rules and has `allow(ip, port)` / `check(ip, port)` methods.", hint: "Keep a set of (ip, port) tuples in self." },
      { level: "STRETCH", head: "IOC store", text: "Write an `IOCStore` with a class-level count of all IOCs and instance methods to add and match indicators.", hint: "Class var for the total; instance set for this store's IOCs." },
    ],
    notes: "These build toward Session 15, where we add inheritance (e.g. a StatefulFirewall subclass) and operator overloading.",
  });

  await d.summary({
    built: [
      ["D1", "A Host Class", "`class`, `__init__`, `self`, instance methods"],
      ["D2", "Class vs Instance", "Class variables, `@classmethod`, `@staticmethod`"],
      ["D3", "Employee Class", "Lab program; `__str__`"],
      ["D4", "Account Lockout", "`_private`, `__mangled`, `@property`"],
      ["D5", "Event Tracker", "A collection of objects, analysed"],
    ],
    takeaways: [
      "A class is a blueprint; objects are independent instances",
      "`self` carries each object's own data",
      "Class variables are shared; instance variables are per-object",
      "Encapsulate with `_private` and `@property`",
    ],
    next: "Session 15: Inheritance, operator overloading and polymorphism",
  });

  await d.save(out);
};
