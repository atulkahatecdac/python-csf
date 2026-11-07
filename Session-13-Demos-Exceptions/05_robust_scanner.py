#!/usr/bin/env python3
"""Demo 5 - Mini project: a robust config-and-targets loader.

Run:  python 05_robust_scanner.py
Brings together: try/except/else/finally, custom exceptions, validation,
and the principle that one bad input must not crash the whole run.
"""


class ConfigError(Exception):
    """A problem with user-supplied configuration."""


def parse_target(line):
    """Parse 'host:port'; raise ConfigError with a clear message on bad input."""
    line = line.strip()
    if not line or line.startswith("#"):
        return None                           # skip blanks and comments
    if ":" not in line:
        raise ConfigError(f"missing ':' in {line!r}")
    host, _, port_text = line.partition(":")
    try:
        port = int(port_text)
    except ValueError:
        raise ConfigError(f"port is not a number in {line!r}")
    if not (1 <= port <= 65535):
        raise ConfigError(f"port out of range in {line!r}")
    return host, port


# A targets file, some lines deliberately broken
raw_targets = [
    "10.0.0.5:22",
    "# a comment line",
    "10.0.0.6:443",
    "10.0.0.7:99999",          # out of range
    "brokenline",              # no colon
    "10.0.0.8:ssh",            # non-numeric port
    "10.0.0.9:80",
]

valid = []
errors = 0
for line in raw_targets:
    try:
        target = parse_target(line)
    except ConfigError as err:
        print(f"SKIP: {err}")
        errors += 1
        continue                              # one bad line doesn't stop the run
    if target:
        valid.append(target)

print(f"\nParsed {len(valid)} valid targets, skipped {errors} bad lines:")
for host, port in valid:
    print(f"  {host}:{port}")

# The whole run completed despite the bad input - that's robustness.
