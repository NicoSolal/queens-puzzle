import fs from "fs";
import { PuzzleGenerator } from "./js/utils/PuzzleGenerator.js";

const difficulties = [
  { name: "easy", size: 6, count: 20 },
  { name: "medium", size: 8, count: 20 },
  { name: "hard", size: 10, count: 10 },
  { name: "expert", size: 12, count: 10 },
];

const database = {};

difficulties.forEach((diff) => {
  database[diff.name] = [];
  for (let i = 0; i < diff.count; i++) {
    const puzzle = PuzzleGenerator.generate(diff.size);
    if (puzzle) {
      puzzle.id = `${diff.name}_${i}`;
      database[diff.name].push(puzzle);
    }
  }
});

fs.writeFileSync("./js/data/puzzles.json", JSON.stringify(database, null, 2));
console.log("Puzzles generated successfully!");
