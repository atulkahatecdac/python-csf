#!/usr/bin/env python3
"""Lab - encrypt and decrypt file contents (the self-learning task).

Run:  python 04_lab_file_crypto.py
Encrypts a file with a password using AES-GCM, writes an encrypted file,
then decrypts it back - a small but correct file-encryption tool.
Works in this folder and cleans up after itself.
"""
from Crypto.Cipher import AES
from Crypto.Protocol.KDF import scrypt
from Crypto.Random import get_random_bytes

PASSWORD = b"lab-passphrase-2026"


def encrypt_file(in_path, out_path, password):
    with open(in_path, "rb") as f:
        data = f.read()
    salt = get_random_bytes(16)
    key = scrypt(password, salt, 32, N=2**14, r=8, p=1)
    cipher = AES.new(key, AES.MODE_GCM)
    ct, tag = cipher.encrypt_and_digest(data)
    # File layout: salt | nonce | tag | ciphertext
    with open(out_path, "wb") as f:
        f.write(salt + cipher.nonce + tag + ct)


def decrypt_file(in_path, out_path, password):
    with open(in_path, "rb") as f:
        blob = f.read()
    salt, nonce, tag, ct = blob[:16], blob[16:32], blob[32:48], blob[48:]
    key = scrypt(password, salt, 32, N=2**14, r=8, p=1)
    cipher = AES.new(key, AES.MODE_GCM, nonce=nonce)
    data = cipher.decrypt_and_verify(ct, tag)       # raises if wrong pw/tampered
    with open(out_path, "wb") as f:
        f.write(data)


# --- Make a sample secret file ----------------------------------------------
with open("secret.txt", "w") as f:
    f.write("Credentials:\n  admin / S3cur3Pass!\n  api_key = sk-demo-123\n")

encrypt_file("secret.txt", "secret.enc", PASSWORD)
decrypt_file("secret.enc", "secret.dec", PASSWORD)

import os
print("Original size :", os.path.getsize("secret.txt"), "bytes")
print("Encrypted size:", os.path.getsize("secret.enc"), "bytes (salt+nonce+tag+ct)")
print("\nEncrypted bytes are unreadable:")
with open("secret.enc", "rb") as f:
    print("  ", f.read()[:24].hex(), "...")
with open("secret.txt") as a, open("secret.dec") as b:
    print("\nDecrypted matches original:", a.read() == b.read())

# Wrong password fails loudly
try:
    decrypt_file("secret.enc", "nope.dec", b"wrong-password")
except ValueError as err:
    print("Wrong password rejected:", err)

for name in ("secret.txt", "secret.enc", "secret.dec"):
    os.remove(name)
