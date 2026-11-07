#!/usr/bin/env python3
"""Lab - greatest element, delete all occurrences, sum of odd numbers.

Run:  python 04_lab_list_programs.py
Sample input: 4 9 2 9 7 1 9 6
"""

raw = input("Enter numbers separated by spaces: ").split()
numbers = [int(x) for x in raw]        # list comprehension (preview)
print("List:", numbers)

# 1. Greatest element (without max(), to show the pattern)
greatest = numbers[0]
for n in numbers[1:]:
    if n > greatest:
        greatest = n
print("Greatest:", greatest, " (max() agrees:", max(numbers), ")")

# 2. Delete all occurrences of a value
target = int(input("Value to delete: "))
cleaned = [n for n in numbers if n != target]    # comprehension = filter
print(f"After deleting {target}:", cleaned)

# 3. Sum of all odd numbers
odd_sum = 0
for n in numbers:
    if n % 2 == 1:
        odd_sum += n
print("Sum of odd numbers:", odd_sum)
