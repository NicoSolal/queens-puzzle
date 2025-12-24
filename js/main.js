// main.js - Entry point for the Queens Puzzle Game

import { Board } from "./core/Board.js";
import { GAME_CONFIG } from "./utils/constants.js";
import { ThemeManager } from "./ui/ThemeManager.js";

// Game state
let board = null;
let gameStarted = false;
let themeManager = null;

// Initialize the game
function init() {
  console.log("Queens Puzzle Game - Initializing...");

  // Initialize theme manager
  themeManager = ThemeManager.getInstance();
  themeManager.initializeUI();

  // Create board
  board = new Board(GAME_CONFIG.BOARD_SIZE);

  // Render the board
  renderBoard();

  // Set up event listeners
  setupEventListeners();

  console.log("Game initialized!");
  console.log(
    "Click a cell to place an X mark, then click the X to place a queen."
  );
}

// Render the board to the DOM
function renderBoard() {
  const boardElement = document.getElementById("game-board");
  boardElement.innerHTML = ""; // Clear existing content

  // Set grid template based on board size
  boardElement.style.gridTemplateColumns = `repeat(${board.size}, 60px)`;
  boardElement.style.gridTemplateRows = `repeat(${board.size}, 60px)`;

  // Create cells
  for (let row = 0; row < board.size; row++) {
    for (let col = 0; col < board.size; col++) {
      const cellDiv = createCellElement(row, col);
      boardElement.appendChild(cellDiv);
    }
  }

  updateStats();
}

// Create a single cell element
function createCellElement(row, col) {
  const cell = board.getCell(row, col);
  const cellDiv = document.createElement("div");

  cellDiv.className = "cell";
  cellDiv.dataset.row = row;
  cellDiv.dataset.col = col;

  // Set region color if exists
  const regionColor = cell.getRegionColor();
  if (regionColor) {
    cellDiv.style.backgroundColor = regionColor;
  }

  // Set cell content based on state
  updateCellDisplay(cellDiv, cell);

  return cellDiv;
}

// Update cell display based on its state
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
    renderBoard(); // Re-render entire board for simplicity (optimize later)

    // Check if game is complete
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
  renderBoard();
  console.log("Game reset");
}

// Start the game when DOM is ready
document.addEventListener("DOMContentLoaded", init);
