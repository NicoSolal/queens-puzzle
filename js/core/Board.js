// Board.js - Manages the game board state and operations

import { Cell } from "./Cell.js";
import {
  GAME_CONFIG,
  isValidPosition,
  getAdjacentPositions,
} from "../utils/constants.js";

export class Board {
  constructor(size = GAME_CONFIG.BOARD_SIZE) {
    this.size = size;
    this.grid = [];
    this.queens = []; // Array of queen positions: [{row, col}, ...]
    this.initializeGrid();
  }

  // Create empty grid
  initializeGrid() {
    this.grid = [];
    for (let row = 0; row < this.size; row++) {
      this.grid[row] = [];
      for (let col = 0; col < this.size; col++) {
        this.grid[row][col] = new Cell(row, col);
      }
    }
  }

  // Get cell at position
  getCell(row, col) {
    if (!isValidPosition(row, col, this.size)) {
      return null;
    }
    return this.grid[row][col];
  }

  // Set regions (colored blobs)
  setRegions(regionsData) {
    // regionsData format: [{ id: 0, cells: [{row, col}, {row, col}] }, ...]
    regionsData.forEach((region) => {
      region.cells.forEach((pos) => {
        const cell = this.getCell(pos.row, pos.col);
        if (cell) {
          cell.regionId = region.id;
        }
      });
    });
  }

  // Handle cell click - main interaction logic
  handleCellClick(row, col) {
    const cell = this.getCell(row, col);
    if (!cell) return false;

    // If empty -> place mark (X)
    if (cell.isEmpty()) {
      return cell.placeMark();
    }

    // If marked -> place queen and auto-mark adjacent cells
    if (cell.state === GAME_CONFIG.CELL_STATES.MARKED) {
      const success = cell.placeQueen();
      if (success) {
        this.queens.push({ row, col });
        this.autoMarkAdjacentCells(row, col);
        return true;
      }
    }

    return false;
  }

  // Auto-mark all cells that must be empty after placing a queen
  autoMarkAdjacentCells(queenRow, queenCol) {
    // Mark all cells in the same row
    for (let col = 0; col < this.size; col++) {
      if (col !== queenCol) {
        this.getCell(queenRow, col)?.autoMark();
      }
    }

    // Mark all cells in the same column
    for (let row = 0; row < this.size; row++) {
      if (row !== queenRow) {
        this.getCell(row, queenCol)?.autoMark();
      }
    }

    // Mark all adjacent cells (1 spot radius diagonally)
    const adjacentPositions = getAdjacentPositions(queenRow, queenCol);
    adjacentPositions.forEach((pos) => {
      if (pos.row !== queenRow || pos.col !== queenCol) {
        const cell = this.getCell(pos.row, pos.col);
        if (cell && isValidPosition(pos.row, pos.col, this.size)) {
          cell.autoMark();
        }
      }
    });
  }

  // Get all queens on the board
  getQueens() {
    return [...this.queens];
  }

  // Count queens currently placed
  getQueenCount() {
    return this.queens.length;
  }

  // Check if board is complete (has correct number of queens)
  isComplete() {
    return this.queens.length === this.size;
  }

  // Clear the entire board
  clear() {
    this.queens = [];
    this.initializeGrid();
  }

  // Get board state as 2D array of symbols (for debugging)
  toStringGrid() {
    let output = "";
    for (let row = 0; row < this.size; row++) {
      for (let col = 0; col < this.size; col++) {
        output += this.grid[row][col].toString() + " ";
      }
      output += "\n";
    }
    return output;
  }

  // Print board to console (for debugging)
  print() {
    console.log(this.toStringGrid());
  }

  // Clone the board (useful for undo/redo)
  clone() {
    const clonedBoard = new Board(this.size);
    clonedBoard.grid = this.grid.map((row) => row.map((cell) => cell.clone()));
    clonedBoard.queens = this.queens.map((q) => ({ ...q }));
    return clonedBoard;
  }
}
