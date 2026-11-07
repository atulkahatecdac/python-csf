#!/usr/bin/env python3
"""Lab - an Employee class (the syllabus OOP lab program).

Run:  python 03_lab_employee.py
Create a class holding employee details, make instances, call its methods.
"""


class Employee:
    """Holds the details of one employee."""

    company = "SecureCorp"               # class variable: same for all

    def __init__(self, emp_id, name, department, salary):
        self.emp_id = emp_id
        self.name = name
        self.department = department
        self.salary = salary

    def give_raise(self, percent):
        """Increase this employee's salary by a percentage."""
        self.salary += self.salary * percent / 100
        return self.salary

    def details(self):
        return (f"[{self.emp_id}] {self.name:<12} "
                f"{self.department:<10} Rs {self.salary:>10,.0f}")

    def __str__(self):
        """Nice printable form, used by print()."""
        return f"{self.name} ({self.department})"


# --- Create instances and call methods --------------------------------------
staff = [
    Employee(101, "Asha Patil", "SOC", 650000),
    Employee(102, "Rahul Deshmukh", "Forensics", 720000),
    Employee(103, "Meera Iyer", "SOC", 580000),
]

print(f"Company: {Employee.company}\n")
for e in staff:
    print(e.details())

# Give the SOC team a raise
print("\nAfter a 10% raise for the SOC team:")
for e in staff:
    if e.department == "SOC":
        e.give_raise(10)
    print(e.details())

print("\nprint(employee) uses __str__:", staff[0])
print("Total payroll: Rs", f"{sum(e.salary for e in staff):,.0f}")
