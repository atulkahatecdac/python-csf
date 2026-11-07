"""netkit.ip - small IP helpers (one module inside the package)."""


def is_private(ip):
    """True if ip is in a private RFC 1918 range."""
    return ip.startswith(("10.", "192.168.", "172.16."))


def to_int(ip):
    """Pack a dotted IPv4 string into a single 32-bit integer."""
    a, b, c, d = (int(x) for x in ip.split("."))
    return (a << 24) | (b << 16) | (c << 8) | d
