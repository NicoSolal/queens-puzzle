// validator.js
import fs from "fs";
import { PuzzleGenerator } from "./js/utils/PuzzleGenerator.js";

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
      if (Math.abs(q.row - row) <= 1 && Math.abs(q.col - col) <= 1) {
        return false;
      }
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
        ) {
          continue;
        }

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

const startValidationProcess = async () => {
  console.log("--- Starting Unique Puzzle Generation ---");

  const path = "./js/data/puzzles.json";
  let database = { easy: [], medium: [], hard: [], expert: [] };

  if (fs.existsSync(path)) {
    try {
      const existingData = JSON.parse(fs.readFileSync(path, "utf8"));
      database = { ...database, ...existingData };
      console.log("[i] Archivo existente cargado correctamente.");
    } catch (err) {
      console.warn("[!] Error al leer puzzles.json, se creará uno nuevo.");
    }
  }

  // const config = [{ difficulty: "easy", size: 6, count: 10, prefix: "e_" }];
  // const config = [{ difficulty: "medium", size: 8, count: 10, prefix: "m_" }];
  // const config = [{ difficulty: "hard", size: 10, count: 10, prefix: "h_" }];
  const config = [{ difficulty: "expert", size: 12, count: 1, prefix: "x_" }];

  for (const item of config) {
    console.log(
      `\nGenerando ${item.count} puzzles nuevos para: ${item.difficulty}`
    );

    const currentList = database[item.difficulty] || [];
    let nextIndex = currentList.length + 1;

    const newResults = [];
    let attempts = 0;

    while (newResults.length < item.count) {
      attempts++;
      const candidate = PuzzleGenerator.generate(item.size);

      const validator = new PuzzleValidator(candidate);
      const solCount = validator.countSolutions();

      if (solCount === 1) {
        const idNum = nextIndex.toString().padStart(3, "0");
        candidate.id = `${item.prefix}${idNum}`;

        newResults.push(candidate);
        database[item.difficulty].push(candidate);

        process.stdout.write(
          `\nGuardado como ${candidate.id} (Intentos: ${attempts})`
        );

        nextIndex++;
        attempts = 0;
      } else {
        if (attempts % 500 === 0) process.stdout.write(".");
      }
    }
  }

  fs.writeFileSync(path, JSON.stringify(database, null, 2));
  console.log(
    "\n\n¡Proceso terminado! El archivo puzzles.json ha sido actualizado."
  );
};

startValidationProcess();
