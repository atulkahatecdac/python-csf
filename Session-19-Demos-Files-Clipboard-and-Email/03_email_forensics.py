#!/usr/bin/env python3
"""Demo 3 - Email forensics: parse an .eml, and read PST archives (libpff).

Run:  python 03_email_forensics.py
Shows: parsing an email message with the standard-library 'email' module
(headers, spoofing checks, attachments), plus how libratom/libpff open the
Outlook PST archives that hold a mailbox. We build a sample .eml to stay offline.
"""
from email import message_from_string
from email.utils import parseaddr

SAMPLE_EML = """From: "IT Support" <support@yourbank-secure.com>
Return-Path: <bounce@spam-sender.ru>
Reply-To: attacker@evil.example
To: victim@example.com
Subject: Urgent: verify your account
Date: Fri, 07 Nov 2026 10:15:42 +0000
Received: from spam-sender.ru (unknown [45.155.205.233]) by mx.example.com
Content-Type: multipart/mixed; boundary="b1"

--b1
Content-Type: text/plain

Please verify at http://yourbank-secure.com.evil.example/login
--b1
Content-Type: application/octet-stream
Content-Disposition: attachment; filename="invoice.pdf.exe"

(binary)
--b1--
"""

msg = message_from_string(SAMPLE_EML)

# --- Header basics ----------------------------------------------------------
print("Subject :", msg["Subject"])
print("From    :", msg["From"])
print("To      :", msg["To"])

# --- Spoofing indicators ----------------------------------------------------
from_addr = parseaddr(msg["From"])[1]
return_path = parseaddr(msg["Return-Path"])[1]
reply_to = parseaddr(msg["Reply-To"])[1]
print("\nSpoofing checks:")
print(f"  From domain       : {from_addr.split('@')[-1]}")
print(f"  Return-Path domain: {return_path.split('@')[-1]}")
print(f"  Mismatch From/Return-Path? {from_addr.split('@')[-1] != return_path.split('@')[-1]}")
print(f"  Reply-To differs?          {reply_to != from_addr}  ({reply_to})")

# --- Attachments (double extensions are a red flag) -------------------------
print("\nAttachments:")
for part in msg.walk():
    fn = part.get_filename()
    if fn:
        dangerous = fn.lower().endswith((".exe", ".scr", ".js", ".bat"))
        print(f"  {fn}  {'<-- DANGEROUS' if dangerous else ''}")

# --- PST archives with libpff (if a sample is available) --------------------
print("\nPST archives (Outlook mailboxes):")
import os
import pypff
pst = "sample.pst"
if os.path.exists(pst):
    pff = pypff.file()
    pff.open(pst)
    root = pff.get_root_folder()
    print(f"  opened {pst}: {root.number_of_sub_folders} folders")
    pff.close()
else:
    print("  (no sample.pst here) libratom/pypff open PST files like this:")
    print("     pff = pypff.file(); pff.open('archive.pst')")
    print("     walk pff.get_root_folder() -> messages (subject, sender, body)")
    print(f"  pypff is installed: version {pypff.get_version()}")
