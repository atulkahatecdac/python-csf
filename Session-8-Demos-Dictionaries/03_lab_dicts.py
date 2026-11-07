#!/usr/bin/env python3
"""Lab - number->word dictionary, and an employee salary dictionary.

Run:  python 03_lab_dicts.py
"""

# 1. Dictionary of odd numbers 1-10: number -> word
odd_words = {
    1: "one",
    3: "three",
    5: "five",
    7: "seven",
    9: "nine",
}
print("Odd-number words:")
for num, word in odd_words.items():
    print(f"  {num} = {word}")
print("Look up 5:", odd_words[5])

# 2. Employee -> salary dictionary from user input
employees = {}
n = int(input("\nHow many employees? "))
for _ in range(n):
    name = input("  Name   : ")
    salary = int(input("  Salary : "))
    employees[name] = salary

print("\nName         Salary")
print("-----------  ---------")
for name, salary in employees.items():
    print(f"{name:<12} {salary:>9,}")

if employees:
    top = max(employees, key=employees.get)       # key with the largest value
    print(f"\nHighest paid: {top} ({employees[top]:,})")
    print(f"Total payroll: {sum(employees.values()):,}")
