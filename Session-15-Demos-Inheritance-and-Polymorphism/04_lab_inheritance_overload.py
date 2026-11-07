#!/usr/bin/env python3
"""Lab - inheritance and operator overloading (the syllabus OOP labs).

Run:  python 04_lab_inheritance_overload.py
Part A: a Person -> Employee -> Manager inheritance chain.
Part B: a Vector class that overloads +, -, == and str (operator overloading).
"""


# --- Part A: inheritance ----------------------------------------------------
class Person:
    def __init__(self, name, age):
        self.name = name
        self.age = age

    def intro(self):
        return f"I am {self.name}, age {self.age}"


class Employee(Person):
    def __init__(self, name, age, emp_id, salary):
        super().__init__(name, age)
        self.emp_id = emp_id
        self.salary = salary

    def intro(self):
        return super().intro() + f", employee #{self.emp_id}"


class Manager(Employee):
    def __init__(self, name, age, emp_id, salary, team):
        super().__init__(name, age, emp_id, salary)
        self.team = team

    def intro(self):
        return super().intro() + f", managing {len(self.team)} people"


m = Manager("Asha", 38, 101, 1500000, ["bob", "carol", "dan"])
print(m.intro())
print("Is a Person?", isinstance(m, Person))


# --- Part B: operator overloading -------------------------------------------
class Vector:
    def __init__(self, x, y):
        self.x = x
        self.y = y

    def __add__(self, other):
        return Vector(self.x + other.x, self.y + other.y)

    def __sub__(self, other):
        return Vector(self.x - other.x, self.y - other.y)

    def __eq__(self, other):
        return self.x == other.x and self.y == other.y

    def __str__(self):
        return f"({self.x}, {self.y})"


a = Vector(2, 3)
b = Vector(5, 1)
print("\na     =", a)
print("b     =", b)
print("a + b =", a + b)        # uses __add__
print("b - a =", b - a)        # uses __sub__
print("a == a:", a == Vector(2, 3))
