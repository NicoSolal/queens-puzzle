// main.js - Entry point for the Queens Puzzle Game

import { Board } from "./core/Board.js";
import { GAME_CONFIG } from "./utils/constants.js";
import { ThemeManager } from "./ui/ThemeManager.js";
import { PuzzleGenerator } from "./utils/PuzzleGenerator.js";
import { getPuzzleById } from "./data/puzzles.js";
import { HintManager } from "./core/HintManager.js";

// Game state
let board = null;
let gameStarted = false;
let themeManager = null;
let currentPuzzle = null;
let currentPuzzleNumber = null;
let difficulty = null;
let hintManager = null;
let isDragging = false;
let score = 0;

// Timer
let secondsElapsed = 0;
let timerInterval = null;

// Initialize the game - Run ONCE when the page loads
async function init() {
  console.log("Queens Puzzle Game - Initializing App...");

  themeManager = ThemeManager.getInstance();
  themeManager.initializeUI();

  setupEventListeners();

  console.log("App ready. Waiting for user to select difficulty...");
}

async function loadPuzzleByDifficulty(difficultyType, size) {
  console.log(`Loading ${difficultyType} puzzle (Size: ${size})...`);

  currentPuzzle = PuzzleGenerator.generate(size);

  if (!currentPuzzle) {
    console.error("Failed to generate/load puzzle!");
    return;
  }

  board = new Board(currentPuzzle.size);
  board.setRegions(currentPuzzle.regions);

  hintManager = new HintManager(board);

  createBoardDOM();
  updateStats();

  startTimer();

  console.log("Game started!");
}

// Render the board to the DOM
function createBoardDOM() {
  const boardElement = document.getElementById("game-board");
  boardElement.innerHTML = "";

  const maxAvailableWidth = Math.min(window.innerWidth * 0.95, 600);

  const totalGapSpace = (board.size + 1) * 4;
  const availableForCells = maxAvailableWidth - totalGapSpace;

  const cellSize = Math.floor(availableForCells / board.size);

  boardElement.style.gridTemplateColumns = `repeat(${board.size}, ${cellSize}px)`;
  boardElement.style.gridTemplateRows = `repeat(${board.size}, ${cellSize}px)`;

  for (let row = 0; row < board.size; row++) {
    for (let col = 0; col < board.size; col++) {
      const cell = board.getCell(row, col);
      const cellDiv = document.createElement("div");

      cellDiv.className = "cell";
      cellDiv.style.width = `${cellSize}px`;
      cellDiv.style.height = `${cellSize}px`;
      cellDiv.style.fontSize = `${Math.floor(cellSize * 0.6)}px`;

      cellDiv.dataset.row = row;
      cellDiv.dataset.col = col;

      const regionColor = cell.getRegionColor();
      if (regionColor) cellDiv.style.backgroundColor = regionColor;

      boardElement.appendChild(cellDiv);
    }
  }
}

function updateBoardDisplay() {
  const cellDivs = document.querySelectorAll(".cell");

  cellDivs.forEach((div) => {
    const r = parseInt(div.dataset.row);
    const c = parseInt(div.dataset.col);
    const cell = board.getCell(r, c);

    updateCellDisplay(div, cell);
  });

  updateStats();
}

function updateCellDisplay(cellDiv, cell) {
  cellDiv.className = "cell " + cell.state;

  switch (cell.state) {
    case GAME_CONFIG.CELL_STATES.EMPTY:
      cellDiv.textContent = "";
      break;
    case GAME_CONFIG.CELL_STATES.MARKED:
      cellDiv.textContent = "✕";
      break;
    case GAME_CONFIG.CELL_STATES.QUEEN:
      cellDiv.textContent = "♛";
      break;
  }

  const cell_obj = board.getCell(
    parseInt(cellDiv.dataset.row),
    parseInt(cellDiv.dataset.col)
  );
  const regionColor = cell_obj.getRegionColor();
  if (regionColor && cell.state !== GAME_CONFIG.CELL_STATES.QUEEN) {
    cellDiv.style.backgroundColor = regionColor;
  }
}

function setupEventListeners() {
  const boardElement = document.getElementById("game-board");

  boardElement.addEventListener("mousedown", (e) => {
    const cellDiv = e.target.closest(".cell");
    if (!cellDiv) return;

    isDragging = true;
    const row = parseInt(cellDiv.dataset.row);
    const col = parseInt(cellDiv.dataset.col);

    handleCellClick(row, col);
  });

  boardElement.addEventListener(
    "mouseenter",
    (e) => {
      if (!isDragging) return;

      const cellDiv = e.target.closest(".cell");
      if (!cellDiv) return;

      const row = parseInt(cellDiv.dataset.row);
      const col = parseInt(cellDiv.dataset.col);

      const cell = board.getCell(row, col);
      if (cell.isEmpty()) {
        handleCellClick(row, col);
      }
    },
    true
  );

  window.addEventListener("mouseup", () => {
    isDragging = false;
  });

  document.getElementById("reset-btn").addEventListener("click", resetGame);

  document
    .getElementById("play-next-btn")
    .addEventListener("click", async () => {
      document.getElementById("victory-overlay").classList.add("hidden");

      currentPuzzleNumber++;

      const prefix =
        difficulty === "easy"
          ? "e_"
          : difficulty === "medium"
          ? "m_"
          : difficulty === "hard"
          ? "h_"
          : "x_";

      const paddedNum = currentPuzzleNumber.toString().padStart(3, "0");
      const puzzleId = `${prefix}${paddedNum}`;

      const success = await loadSpecificPuzzle(puzzleId);

      if (success === null) {
        currentPuzzleNumber--; // Revert the increment
        document.getElementById("game-screen").classList.add("hidden");
        document.getElementById("main-menu").classList.remove("hidden");
      }
    });

  document.getElementById("close-victory-btn").addEventListener("click", () => {
    document.getElementById("victory-overlay").classList.add("hidden");
  });

  document.getElementById("back-to-menu-btn").addEventListener("click", () => {
    stopTimer();
    document.getElementById("game-screen").classList.add("hidden");
    document.getElementById("main-menu").classList.remove("hidden");
  });

  const menuButtons = document.querySelectorAll(".menu-btn");
  menuButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const diff = btn.dataset.difficulty;
      showLevelSelection(diff);
    });
  });

  document.getElementById("back-to-main-btn").addEventListener("click", () => {
    document.getElementById("level-selection").classList.add("hidden");
    document.getElementById("main-menu").classList.remove("hidden");
  });
}

async function showLevelSelection(diff) {
  const mainMenu = document.getElementById("main-menu");
  const levelSelection = document.getElementById("level-selection");
  const levelGrid = document.getElementById("level-grid");
  const selectionTitle = document.getElementById("selection-title");

  mainMenu.classList.add("hidden");
  levelSelection.classList.remove("hidden");

  selectionTitle.textContent = `${
    diff.charAt(0).toUpperCase() + diff.slice(1)
  } Levels`;
  levelGrid.innerHTML = "";

  const response = await fetch("./js/data/puzzles.json");
  const data = await response.json();
  const puzzlesInDiff = data[diff] || [];

  difficulty = diff;

  puzzlesInDiff.forEach((puzzle, index) => {
    const btn = document.createElement("button");
    btn.className = "level-item-btn";
    btn.textContent = index + 1;

    btn.addEventListener("click", () => {
      const prefix =
        diff === "easy"
          ? "e_"
          : diff === "medium"
          ? "m_"
          : diff === "hard"
          ? "h_"
          : "x_";
      currentPuzzleNumber = index + 1;
      const paddedNum = (index + 1).toString().padStart(3, "0");
      const puzzleId = `${prefix}${paddedNum}`;

      loadSpecificPuzzle(puzzleId);
    });

    levelGrid.appendChild(btn);
  });
}

async function loadSpecificPuzzle(puzzleId) {
  console.log(`Attempting to load: ${puzzleId}`);

  document.getElementById("level-selection").classList.add("hidden");
  document.getElementById("game-screen").classList.remove("hidden");
  document
    .getElementById("side-panel")
    .querySelector("h2").textContent = `Puzzle ${currentPuzzleNumber}`;

  currentPuzzle = await getPuzzleById(puzzleId);

  if (currentPuzzle) {
    board = new Board(currentPuzzle.size);
    board.setRegions(currentPuzzle.regions);

    hintManager = new HintManager(board);
    createBoardDOM();
    updateStats();
    startTimer();
  } else {
    console.error("Puzzle ID not found in JSON!");
    alert("Error loading puzzle.");
    return null;
  }

  score = 5000;
}

function handleCellClick(row, col) {
  console.log(`Cell clicked: (${row}, ${col})`);

  const success = board.handleCellClick(row, col);

  if (success) {
    updateBoardDisplay();

    if (board.isComplete()) {
      console.log("Puzzle complete!");
      stopTimer();
      showVictoryScreen();
    }
  }
}

function showVictoryScreen() {
  const overlay = document.getElementById("victory-overlay");
  const finalTime = document.getElementById("timer").textContent;

  document.getElementById("final-time").textContent = finalTime;

  if (secondsElapsed < 60) {
    score += 1000;
    document.getElementById("victory-bonus").textContent =
      "1000 Speed bonus points";
  } else if (secondsElapsed < 120) {
    score += 500;
    document.getElementById("victory-bonus").textContent =
      "500 Speed bonus points";
  } else if (secondsElapsed < 180) {
    score += 200;
    document.getElementById("victory-bonus").textContent =
      "200 Speed bonus points";
  } else {
    document.getElementById("victory-bonus").textContent = "No bonus points";
  }

  document.getElementById("final-score").textContent = score;

  overlay.classList.remove("hidden");
}

function updateStats() {
  document.getElementById(
    "queens-count"
  ).textContent = `${board.getQueenCount()} / ${board.size}`;
}

function resetGame() {
  board.clear();
  updateBoardDisplay();
  console.log("Game reset");
}

document.addEventListener("DOMContentLoaded", init);

document.getElementById("hint-btn").addEventListener("click", () => {
  if (!hintManager || !board) return;

  const hint = hintManager.getHint(board);
  if (hint.row !== undefined) {
    const cellDiv = document.querySelector(
      `.cell[data-row="${hint.row}"][data-col="${hint.col}"]`
    );

    cellDiv.classList.add("hint-highlight");
    console.log(`Hint: ${hint.message}`);

    setTimeout(() => cellDiv.classList.remove("hint-highlight"), 2000);
  } else {
    console.log(hint.message);
  }
});

function startTimer() {
  stopTimer();
  secondsElapsed = 0;
  updateTimerDisplay();

  timerInterval = setInterval(() => {
    secondsElapsed++;
    updateTimerDisplay();
  }, 1000);
}

function stopTimer() {
  if (timerInterval) {
    clearInterval(timerInterval);
    timerInterval = null;
  }
}

function updateTimerDisplay() {
  score -= 4;
  const minutes = Math.floor(secondsElapsed / 60);
  const seconds = secondsElapsed % 60;

  const formattedTime = `${minutes}:${seconds.toString().padStart(2, "0")}`;
  document.getElementById("timer").textContent = formattedTime;
  document.getElementById("score").textContent = score;
}
