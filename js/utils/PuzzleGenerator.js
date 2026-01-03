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

  static solveQueens(size) {
    const queens = [];
    const isSafe = (row, col, placedQueens) => {
      for (const q of placedQueens) {
        if (q.col === col || q.row === row) return false;
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

  static growRegions(size, queens) {
    const grid = Array(size)
      .fill()
      .map(() => Array(size).fill(-1));

    const regionFrontiers = queens.map((q, i) => {
      grid[q.row][q.col] = i;
      return [{ row: q.row, col: q.col }];
    });

    const regions = queens.map((q, i) => ({
      id: i,
      cells: [{ row: q.row, col: q.col }],
    }));

    let unassignedCount = size * size - size;

    const getNeighbors = (r, c) =>
      [
        { r: r - 1, c: c },
        { r: r + 1, c: c },
        { r: r, c: c - 1 },
        { r: r, c: c + 1 },
      ].filter((n) => isValidPosition(n.r, n.c, size) && grid[n.r][n.c] === -1);

    while (unassignedCount > 0) {
      const regionOrder = Array.from({ length: size }, (_, i) => i).sort(
        () => Math.random() - 0.5
      );
      let changedInThisRound = false;

      for (const regionId of regionOrder) {
        const frontier = regionFrontiers[regionId];
        if (frontier.length === 0) continue;

        let head = frontier[frontier.length - 1];
        let neighbors = getNeighbors(head.row, head.col);

        if (neighbors.length === 0) {
          frontier.pop();
          continue;
        }

        const next = neighbors[Math.floor(Math.random() * neighbors.length)];

        grid[next.r][next.c] = regionId;
        regions[regionId].cells.push({ row: next.r, col: next.c });
        regions[regionId].cells[regions[regionId].cells.length - 1] = {
          row: next.r,
          col: next.c,
        };

        frontier.push({ row: next.r, col: next.c });
        unassignedCount--;
        changedInThisRound = true;
      }

      if (!changedInThisRound && unassignedCount > 0) {
        this.fillGaps(grid, regions, size);
        break;
      }
    }

    return regions;
  }

  static fillGaps(grid, regions, size) {
    for (let r = 0; r < size; r++) {
      for (let c = 0; c < size; c++) {
        if (grid[r][c] === -1) {
          const adj = [
            { r: r - 1, c },
            { r: r + 1, c },
            { r, c: c - 1 },
            { r, c: c + 1 },
          ].find(
            (n) => isValidPosition(n.r, n.c, size) && grid[n.r][n.c] !== -1
          );

          if (adj) {
            const regionId = grid[adj.r][adj.c];
            grid[r][c] = regionId;
            regions[regionId].cells.push({ row: r, col: c });
          }
        }
      }
    }
  }
}
