// main.js - Entry point for the Queens Puzzle Game

import { Board } from "./core/Board.js";
import { GAME_CONFIG } from "./utils/constants.js";
import { ThemeManager } from "./ui/ThemeManager.js";
import { getPuzzle } from "./data/puzzles.js";
import { PuzzleGenerator } from "./utils/PuzzleGenerator.js";

// Game state
let board = null;
let gameStarted = false;
let themeManager = null;
let currentPuzzle = null;
let difficulty = null;

// Initialize the game
function init() {
  console.log("Queens Puzzle Game - Initializing...");

  // Initialize theme manager
  themeManager = ThemeManager.getInstance();
  themeManager.initializeUI();

  difficulty = GAME_CONFIG.DIFFICULTY.EASY;

  // currentPuzzle = getPuzzle("expert_1");
  currentPuzzle = PuzzleGenerator.generate(difficulty.boardSize);

  if (!currentPuzzle) {
    console.error("Failed to load puzzle!");
    return;
  }

  console.log("Loaded puzzle:", currentPuzzle.name);

  board = new Board(currentPuzzle.size);

  board.setRegions(currentPuzzle.regions);

  createBoardDOM();

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

  // Preserve region color
  const cell_obj = board.getCell(
    parseInt(cellDiv.dataset.row),
    parseInt(cellDiv.dataset.col)
  );
  const regionColor = cell_obj.getRegionColor();
  if (regionColor && cell.state !== GAME_CONFIG.CELL_STATES.QUEEN) {
    cellDiv.style.backgroundColor = regionColor;
  }
}

// Set up event listeners
function setupEventListeners() {
  const boardElement = document.getElementById("game-board");

  // Cell click handler
  boardElement.addEventListener("click", (e) => {
    const cellDiv = e.target.closest(".cell");
    if (!cellDiv) return;

    const row = parseInt(cellDiv.dataset.row);
    const col = parseInt(cellDiv.dataset.col);

    handleCellClick(row, col);
  });

  // Reset button
  document.getElementById("reset-btn").addEventListener("click", resetGame);
}

// Handle cell click
function handleCellClick(row, col) {
  console.log(`Cell clicked: (${row}, ${col})`);

  const success = board.handleCellClick(row, col);

  if (success) {
    updateBoardDisplay();

    if (board.isComplete()) {
      console.log("Puzzle complete!");
      alert("Congratulations! You solved the puzzle!");
    }
  }
}

// Update statistics display
function updateStats() {
  document.getElementById(
    "queens-count"
  ).textContent = `${board.getQueenCount()} / ${board.size}`;
}

// Reset the game
function resetGame() {
  board.clear();
  updateBoardDisplay();
  console.log("Game reset");
}

// Start the game when DOM is ready
document.addEventListener("DOMContentLoaded", init);
