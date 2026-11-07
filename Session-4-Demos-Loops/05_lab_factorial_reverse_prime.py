#!/usr/bin/env python3
"""Lab - factorial, reverse a number, prime check (Session 4 lab programs).

Run:  python 05_lab_factorial_reverse_prime.py
Sample input: 10
"""

n = int(input("Enter a positive whole number: "))

# 1. Factorial with a for loop
fact = 1
for i in range(2, n + 1):
    fact *= i
print(f"{n}! = {fact:,}")

# 2. Reverse the digits with a while loop
num, rev = n, 0
while num > 0:
    rev = rev * 10 + num % 10      # take the last digit
    num //= 10                     # drop the last digit
print(f"Reverse of {n} = {rev}")

# 3. Prime check with for...else
if n < 2:
    print(n, "is not prime")
else:
    for d in range(2, int(n ** 0.5) + 1):
        if n % d == 0:
            print(f"{n} is not prime ({d} x {n // d})")
            break
    else:
        print(n, "is prime")
