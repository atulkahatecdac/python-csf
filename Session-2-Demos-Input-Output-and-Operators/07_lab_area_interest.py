#!/usr/bin/env python3
"""Lab starter - Session 2 & 3 lab programs that need only input, casting and operators.

Run:  python 07_lab_area_interest.py
1. Read and print values   2. Area of a circle   3. Simple interest
"""
import math

# 1. Read and print values
name = input("Your name: ")
age = int(input("Your age : "))
print(f"Hello {name}, next year you will be {age + 1}.")

# 2. Area of a circle:  A = pi * r^2
radius = float(input("\nRadius of the circle: "))
area = math.pi * radius ** 2
print(f"Area = {area:.2f}")

# 3. Simple interest:  SI = P * R * T / 100
principal = float(input("\nPrincipal (Rs): "))
rate = float(input("Rate (% per year): "))
years = float(input("Time (years): "))
interest = principal * rate * years / 100
print(f"Simple interest = Rs {interest:,.2f}")
print(f"Total amount    = Rs {principal + interest:,.2f}")
