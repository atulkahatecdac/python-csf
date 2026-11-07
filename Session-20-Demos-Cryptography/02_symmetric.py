#!/usr/bin/env python3
"""Demo 2 - Symmetric encryption with AES (pycryptodome).

Run:  python 02_symmetric.py
Shows: AES-GCM (authenticated encryption), why a nonce must be unique,
and deriving a key from a password. Same key encrypts and decrypts.
"""
from Crypto.Cipher import AES
from Crypto.Random import get_random_bytes
from Crypto.Protocol.KDF import scrypt

plaintext = b"Top secret: the vault code is 4815162342"

# --- A random 256-bit key ---------------------------------------------------
key = get_random_bytes(32)                       # 32 bytes = AES-256

# --- Encrypt with AES-GCM (gives confidentiality AND integrity) -------------
cipher = AES.new(key, AES.MODE_GCM)
ciphertext, tag = cipher.encrypt_and_digest(plaintext)
nonce = cipher.nonce                              # must be stored with the ciphertext

print("Plaintext :", plaintext.decode())
print("Key       :", key.hex()[:24], "...")
print("Nonce     :", nonce.hex())
print("Ciphertext:", ciphertext.hex()[:32], "...")
print("Tag       :", tag.hex()[:16], "...")

# --- Decrypt (needs key + nonce + tag) --------------------------------------
dec = AES.new(key, AES.MODE_GCM, nonce=nonce)
recovered = dec.decrypt_and_verify(ciphertext, tag)
print("\nDecrypted :", recovered.decode())

# --- Tampering is DETECTED by the tag ---------------------------------------
bad = bytearray(ciphertext)
bad[0] ^= 0x01                                    # flip one bit
try:
    AES.new(key, AES.MODE_GCM, nonce=nonce).decrypt_and_verify(bytes(bad), tag)
except ValueError as err:
    print("Tamper detected:", err)

# --- Deriving a key from a password (so humans can use it) ------------------
password = b"correct horse battery staple"
salt = get_random_bytes(16)
derived = scrypt(password, salt, key_len=32, N=2**14, r=8, p=1)
print("\nKey from password (scrypt):", derived.hex()[:24], "...")
print("Store the SALT (not the password); re-derive the same key to decrypt.")
