// js/utils/PuzzleGenerator.js

import { isValidPosition, getAdjacentPositions } from "./constants.js";

export class PuzzleGenerator {
  static generate(size) {
    const solution = this.solveQueens(size);
    if (!solution) return null;

    const regions = this.growRegions(size, solution);

    return {
      id: `gen_${Date.now()}`,
      name: `Random ${size}x${size}`,
      difficulty:
        size === 6
          ? "easy"
          : size === 8
          ? "medium"
          : size === 10
          ? "hard"
          : "expert",
      size: size,
      regions: regions,
      solution: solution,
    };
  }

  /**
   * Randomized Backtracking to place N queens
   */
  static solveQueens(size) {
    const queens = [];

    const isSafe = (row, col, placedQueens) => {
      for (const q of placedQueens) {
        if (q.col === col) return false;
        if (q.row === row) return false;
        if (Math.abs(q.row - row) <= 1 && Math.abs(q.col - col) <= 1)
          return false;
      }
      return true;
    };

    const backtrack = (row) => {
      if (row === size) return true;

      const cols = Array.from({ length: size }, (_, i) => i).sort(
        () => Math.random() - 0.5
      );

      for (const col of cols) {
        if (isSafe(row, col, queens)) {
          queens.push({ row, col });
          if (backtrack(row + 1)) return true;
          queens.pop();
        }
      }
      return false;
    };

    return backtrack(0) ? queens : null;
  }

  /**
   * Expands regions from queens using BFS
   */
  static growRegions(size, queens) {
    const grid = Array(size)
      .fill()
      .map(() => Array(size).fill(-1));
    const regions = queens.map((q, i) => {
      grid[q.row][q.col] = i;
      return { id: i, cells: [{ row: q.row, col: q.col }] };
    });

    let unassignedCount = size * size - size;

    let frontier = [];

    const getNeighbors = (r, c) =>
      [
        { r: r - 1, c: c },
        { r: r + 1, c: c },
        { r: r, c: c - 1 },
        { r: r, c: c + 1 },
      ].filter((n) => isValidPosition(n.r, n.c, size));

    queens.forEach((q, i) => {
      getNeighbors(q.row, q.col).forEach((n) => {
        frontier.push({ row: n.r, col: n.c, regionId: i });
      });
    });

    while (unassignedCount > 0 && frontier.length > 0) {
      const randomIndex = Math.floor(Math.random() * frontier.length);
      const { row, col, regionId } = frontier.splice(randomIndex, 1)[0];

      if (grid[row][col] !== -1) continue;

      grid[row][col] = regionId;
      regions[regionId].cells.push({ row, col });
      unassignedCount--;

      getNeighbors(row, col).forEach((n) => {
        if (grid[n.r][n.c] === -1) {
          frontier.push({ row: n.r, col: n.c, regionId: regionId });
        }
      });
    }

    return regions;
  }
}
