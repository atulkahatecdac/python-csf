"""netkit.ports - a lookup table and helper (another module in the package)."""

COMMON = {22: "ssh", 80: "http", 443: "https", 3389: "rdp", 53: "dns"}


def name_for(port):
    """Return the common service name for a port, or 'unknown'."""
    return COMMON.get(port, "unknown")
