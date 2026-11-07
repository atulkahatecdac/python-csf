"""netkit - a tiny example package for Session 11.

The presence of this __init__.py makes the 'netkit' folder a package.
It re-exports a couple of names so callers can write `from netkit import is_private`.
"""
from .ip import is_private, to_int
from .ports import COMMON, name_for

__all__ = ["is_private", "to_int", "COMMON", "name_for"]
__version__ = "0.1.0"
