#!/usr/bin/env python3
"""Demo 1 - Nested lists and 2D lists (grids/tables).

Run:  python 01_nested_2d.py
Shows: a list of lists, double indexing, iterating a grid,
       and the shared-row trap when building a grid with *.
"""

# --- A scan result table: one row per host --------------------------------
scan = [
    ["10.0.0.5", 22, "open"],
    ["10.0.0.5", 80, "open"],
    ["10.0.0.6", 22, "closed"],
]
print("First row :", scan[0])
print("Row 0 port:", scan[0][1])          # double index: row, then column

# --- Iterate with unpacking -------------------------------------------------
print("\nOpen services:")
for host, port, state in scan:
    if state == "open":
        print(f"  {host}:{port}")

# --- A numeric grid (matrix) -------------------------------------------------
grid = [
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9],
]
print("\nGrid, row by row:")
for row in grid:
    print("  ", row)
print("Diagonal:", [grid[i][i] for i in range(len(grid))])

# --- The shared-row trap -----------------------------------------------------
bad = [[0] * 3] * 3            # all three rows are the SAME list object
bad[0][0] = 99
print("\nWrong (rows shared):", bad)      # [[99,0,0],[99,0,0],[99,0,0]]

good = [[0] * 3 for _ in range(3)]        # a fresh row each time
good[0][0] = 99
print("Right (independent):", good)       # only the first row changes
