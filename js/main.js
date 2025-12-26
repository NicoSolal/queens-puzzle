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
let difficulty = null;
let hintManager = null;
let isDragging = false;

// Timer
let secondsElapsed = 0;
let timerInterval = null;

// Initialize the game
async function init() {
  console.log("Queens Puzzle Game - Initializing...");

  // Initialize theme manager
  themeManager = ThemeManager.getInstance();
  themeManager.initializeUI();

  difficulty = GAME_CONFIG.DIFFICULTY.MEDIUM;

  // currentPuzzle = getPuzzle("expert_1");
  currentPuzzle = PuzzleGenerator.generate(difficulty.boardSize);
  // currentPuzzle = await getPuzzleById("e_002");

  if (!currentPuzzle) {
    console.error("Failed to load puzzle!");
    return;
  }

  console.log("Loaded puzzle:", currentPuzzle.name);
  console.log("Current Puzzle Data:", JSON.stringify(currentPuzzle));

  board = new Board(currentPuzzle.size);

  board.setRegions(currentPuzzle.regions);

  hintManager = new HintManager(board);

  createBoardDOM();
  startTimer();

  setupEventListeners();

  console.log("Game initialized!");
  console.log(
    "Click a cell to place an X mark, then click the X to place a queen."
  );
}

// Render the board to the DOM
function createBoardDOM() {
  const boardElement = document.getElementById("game-board");
  boardElement.innerHTML = "";

  boardElement.style.gridTemplateColumns = `repeat(${board.size}, 60px)`;
  boardElement.style.gridTemplateRows = `repeat(${board.size}, 60px)`;

  for (let row = 0; row < board.size; row++) {
    for (let col = 0; col < board.size; col++) {
      const cell = board.getCell(row, col);
      const cellDiv = document.createElement("div");

      cellDiv.className = "cell";
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

  document.getElementById("play-again-btn").addEventListener("click", () => {
    document.getElementById("victory-overlay").classList.add("hidden");
    resetGame();
  });

  document.getElementById("close-victory-btn").addEventListener("click", () => {
    document.getElementById("victory-overlay").classList.add("hidden");
  });
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

  const score = Math.max(0, 4000 - secondsElapsed * 3);

  document.getElementById("final-time").textContent = finalTime;
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
  startTimer();
  console.log("Game reset");
}

document.addEventListener("DOMContentLoaded", init);

document.getElementById("hint-btn").addEventListener("click", () => {
  const hint = hintManager.getHint();

  if (hint.row !== undefined) {
    const cellDiv = document.querySelector(
      `.cell[data-row="${hint.row}"][data-col="${hint.col}"]`
    );

    cellDiv.classList.add("hint-highlight");
    console.log(`Hint: ${hint.message}`);

    setTimeout(() => cellDiv.classList.remove("hint-highlight"), 2000);
  } else {
    alert(hint.message);
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
  const minutes = Math.floor(secondsElapsed / 60);
  const seconds = secondsElapsed % 60;

  const formattedTime = `${minutes}:${seconds.toString().padStart(2, "0")}`;
  document.getElementById("timer").textContent = formattedTime;
}
