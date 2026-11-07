#!/usr/bin/env python3
"""Demo 5 - Mini project: hybrid encryption (how real systems do it).

Run:  python 05_hybrid.py
Brings together AES + RSA: encrypt the data with fast AES, then encrypt the
AES key with the recipient's RSA public key. This is how TLS, PGP and age work:
asymmetric crypto to share a key, symmetric crypto for the bulk data.
"""
from Crypto.PublicKey import RSA
from Crypto.Cipher import AES, PKCS1_OAEP
from Crypto.Random import get_random_bytes

# --- Recipient has an RSA key pair; sender knows the public key --------------
recipient = RSA.generate(2048)
recipient_pub = recipient.publickey()

message = b"Large confidential report... " * 10      # 'bulk' data

# --- SENDER: encrypt data with a fresh AES key, then wrap that key with RSA --
aes_key = get_random_bytes(32)
cipher = AES.new(aes_key, AES.MODE_GCM)
ciphertext, tag = cipher.encrypt_and_digest(message)

wrapped_key = PKCS1_OAEP.new(recipient_pub).encrypt(aes_key)   # RSA-encrypt the AES key

print("SENDER:")
print(f"  data encrypted with AES  : {len(ciphertext)} bytes")
print(f"  AES key wrapped with RSA : {len(wrapped_key)} bytes")
print("  sends: wrapped_key + nonce + tag + ciphertext")

# --- RECIPIENT: unwrap the AES key with RSA, then decrypt the data -----------
unwrapped_key = PKCS1_OAEP.new(recipient).decrypt(wrapped_key)
dec = AES.new(unwrapped_key, AES.MODE_GCM, nonce=cipher.nonce)
recovered = dec.decrypt_and_verify(ciphertext, tag)

print("\nRECIPIENT:")
print("  unwrapped AES key matches:", unwrapped_key == aes_key)
print("  decrypted first 30 chars :", recovered[:30].decode())

print("\nWhy hybrid? RSA is slow and size-limited; AES is fast and handles any")
print("size. So we RSA-encrypt only the small AES key, and AES-encrypt the data.")
