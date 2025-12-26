// js/data/puzzles.js

let cachedPuzzles = null;

// Load the JSON file
async function loadPuzzleData() {
  if (cachedPuzzles) return cachedPuzzles;

  const response = await fetch("./js/data/puzzles.json");
  cachedPuzzles = await response.json();
  return cachedPuzzles;
}

export async function getRandomPuzzle(difficulty) {
  const data = await loadPuzzleData();
  const list = data[difficulty];
  return list[Math.floor(Math.random() * list.length)];
}

export async function getPuzzleById(id) {
  const data = await loadPuzzleData();
  for (const diff in data) {
    const found = data[diff].find((p) => p.id === id);
    if (found) return found;
  }
  return null;
}
