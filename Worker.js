// worker.js
import { parentPort, workerData } from "worker_threads";
import { PuzzleGenerator } from "./js/utils/PuzzleGenerator.js";

// We need your Validator class here too
class PuzzleValidator {
  constructor(puzzle) {
    this.size = puzzle.size;
    this.sortedRegions = [...puzzle.regions].sort(
      (a, b) => a.cells.length - b.cells.length
    );
    this.cellToRegion = Array(this.size)
      .fill()
      .map(() => Array(this.size));
    puzzle.regions.forEach((reg) => {
      reg.cells.forEach((c) => (this.cellToRegion[c.row][c.col] = reg.id));
    });
  }

  isSafe(row, col, queens) {
    for (let i = 0; i < queens.length; i++) {
      const q = queens[i];
      if (Math.abs(q.row - row) <= 1 && Math.abs(q.col - col) <= 1)
        return false;
    }
    return true;
  }

  countSolutions() {
    let solutionsCount = 0;
    const queens = [];
    const rowOccupied = new Array(this.size).fill(false);
    const colOccupied = new Array(this.size).fill(false);

    const solve = (regionIdx) => {
      if (solutionsCount > 1) return;
      if (regionIdx === this.size) {
        solutionsCount++;
        return;
      }

      const currentRegion = this.sortedRegions[regionIdx];
      for (const cell of currentRegion.cells) {
        const { row, col } = cell;
        if (
          rowOccupied[row] ||
          colOccupied[col] ||
          !this.isSafe(row, col, queens)
        )
          continue;

        // Forward checking logic
        let possible = true;
        for (let i = regionIdx + 1; i < this.size; i++) {
          const nextRegion = this.sortedRegions[i];
          const hasValidSpot = nextRegion.cells.some((c) => {
            if (rowOccupied[c.row] || c.row === row) return false;
            if (colOccupied[c.col] || c.col === col) return false;
            for (const q of queens) {
              if (Math.abs(q.row - c.row) <= 1 && Math.abs(q.col - c.col) <= 1)
                return false;
            }
            if (Math.abs(row - c.row) <= 1 && Math.abs(col - c.col) <= 1)
              return false;
            return true;
          });
          if (!hasValidSpot) {
            possible = false;
            break;
          }
        }
        if (!possible) continue;

        queens.push({ row, col });
        rowOccupied[row] = true;
        colOccupied[col] = true;
        solve(regionIdx + 1);
        queens.pop();
        rowOccupied[row] = false;
        colOccupied[col] = false;
      }
    };
    solve(0);
    return solutionsCount;
  }
}

// THE WORKER LOOP
const findUniquePuzzle = () => {
  const { size } = workerData;
  let attempts = 0;

  while (true) {
    attempts++;
    const candidate = PuzzleGenerator.generate(size);
    const validator = new PuzzleValidator(candidate);

    if (validator.countSolutions() === 1) {
      // Success! Send the puzzle back to the main thread
      parentPort.postMessage({
        status: "SUCCESS",
        puzzle: candidate,
        attempts,
      });
      attempts = 0; // Reset for the next round
    }

    // Periodically report progress to main thread
    if (attempts % 500 === 0) {
      parentPort.postMessage({ status: "PROGRESS", attempts: 500 });
    }
  }
};

findUniquePuzzle();
