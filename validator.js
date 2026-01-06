// validator.js
import fs from "fs";
import os from "os";
import { Worker } from "worker_threads";

const startValidationProcess = async () => {
  console.log("--- Starting Parallel Unique Puzzle Generation ---");
  const path = "./js/data/puzzles.json";
  let database = { easy: [], medium: [], hard: [], expert: [] };

  if (fs.existsSync(path)) {
    database = { ...database, ...JSON.parse(fs.readFileSync(path, "utf8")) };
  }

  // const item = { difficulty: "easy", size: 6, count: 5, prefix: "e_" };
  // const item = { difficulty: "medium", size: 8, count: 5, prefix: "m_" };
  // const item = { difficulty: "hard", size: 10, count: 50, prefix: "h_" };
  const item = { difficulty: "expert", size: 12, count: 5, prefix: "x_" };
  const numWorkers = os.cpus().length; // Detects your CPU cores
  console.log(
    `Spawning ${numWorkers} workers to find ${item.count} puzzles...`
  );

  let foundCount = 0;
  let totalAttempts = 0;
  let nextIndex = (database[item.difficulty] || []).length + 1;

  const workers = [];

  // Function to save and stop
  const finish = () => {
    fs.writeFileSync(path, JSON.stringify(database, null, 2));
    console.log(`\n\nDone! Saved ${foundCount} new puzzles.`);
    process.exit();
  };

  for (let i = 0; i < numWorkers; i++) {
    const worker = new Worker("./worker.js", {
      workerData: { size: item.size },
    });

    worker.on("message", (msg) => {
      if (msg.status === "SUCCESS") {
        foundCount++;
        const puzzle = msg.puzzle;
        const idNum = nextIndex.toString().padStart(3, "0");
        puzzle.id = `${item.prefix}${idNum}`;

        database[item.difficulty].push(puzzle);
        nextIndex++;

        process.stdout.write(
          `\n[✔] Worker ${i} found ${puzzle.id} (Total New: ${foundCount}/${item.count})`
        );

        if (foundCount >= item.count) finish();
      } else if (msg.status === "PROGRESS") {
        totalAttempts += msg.attempts;
        if (totalAttempts % 5000 === 0) process.stdout.write(".");
      }
    });

    workers.push(worker);
  }
};

startValidationProcess();
