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

  // Set regions (colored blobs) on the board
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

  // Check if a queen can be placed at this position
  canPlaceQueen(row, col) {
    // Check if cell is available
    const cell = this.getCell(row, col);
    if (!cell || (!cell.isEmpty() && !cell.isMarked())) {
      return false;
    }

    // Check row - no other queens
    for (let c = 0; c < this.size; c++) {
      if (c !== col && this.getCell(row, c)?.hasQueen()) {
        return false;
      }
    }

    // Check column - no other queens
    for (let r = 0; r < this.size; r++) {
      if (r !== row && this.getCell(r, col)?.hasQueen()) {
        return false;
      }
    }

    // Check adjacent cells (1 spot radius including diagonals)
    const adjacentPositions = getAdjacentPositions(row, col);
    for (const pos of adjacentPositions) {
      if (
        (pos.row !== row || pos.col !== col) &&
        isValidPosition(pos.row, pos.col, this.size)
      ) {
        const adjacentCell = this.getCell(pos.row, pos.col);
        if (adjacentCell?.hasQueen()) {
          return false;
        }
      }
    }

    return true;
  }

  // Handle cell click - main interaction logic
  handleCellClick(row, col) {
    const cell = this.getCell(row, col);
    if (!cell) return false;

    // If empty -> place mark (X)
    if (cell.isEmpty()) {
      return cell.placeMark();
    }

    // If marked -> try to place queen (check if valid first)
    if (cell.isMarked()) {
      if (!this.canPlaceQueen(row, col)) {
        console.log("Cannot place queen here - violates rules!");
        return false;
      }

      const success = cell.placeQueen();
      if (success) {
        this.queens[this.queens.length] = { row, col };
        this.autoMarkAdjacentCells(row, col);
        return true;
      }
    }

    if (cell.hasQueen()) {
      const index = this.queens.findIndex(
        (q) => q.row === row && q.col === col
      );
      if (index !== -1) {
        this.queens.splice(index, 1);
      }

      cell.clear();
      this.autoClearAdjacentCells(row, col);
      this.queens.forEach((queen) => {
        this.autoMarkAdjacentCells(queen.row, queen.col);
      });
      return true;
    }
  }

  // Auto-mark all cells that must be empty after placing a queen
  autoMarkAdjacentCells(queenRow, queenCol) {
    // Mark all cells in the same row
    for (let col = 0; col < this.size; col++) {
      if (col !== queenCol) {
        const cell = this.getCell(queenRow, col);
        if (cell?.isEmpty()) {
          cell.placeMark();
        }
      }
    }

    // Mark all cells in the same column
    for (let row = 0; row < this.size; row++) {
      if (row !== queenRow) {
        const cell = this.getCell(row, queenCol);
        if (cell?.isEmpty()) {
          cell.placeMark();
        }
      }
    }

    // Mark all adjacent cells (1 spot radius diagonally)
    const adjacentPositions = getAdjacentPositions(queenRow, queenCol);
    adjacentPositions.forEach((pos) => {
      if (pos.row !== queenRow || pos.col !== queenCol) {
        const cell = this.getCell(pos.row, pos.col);
        if (
          cell &&
          isValidPosition(pos.row, pos.col, this.size) &&
          cell.isEmpty()
        ) {
          cell.placeMark();
        }
      }
    });
  }

  autoClearAdjacentCells(queenRow, queenCol) {
    for (let col = 0; col < this.size; col++) {
      if (col !== queenCol) {
        const cell = this.getCell(queenRow, col);
        if (cell?.isMarked()) {
          cell.clear();
        }
      }
    }

    for (let row = 0; row < this.size; row++) {
      if (row !== queenRow) {
        const cell = this.getCell(row, queenCol);
        if (cell?.isMarked()) {
          cell.clear();
        }
      }
    }

    const adjacentPositions = getAdjacentPositions(queenRow, queenCol);
    adjacentPositions.forEach((pos) => {
      if (pos.row !== queenRow || pos.col !== queenCol) {
        const cell = this.getCell(pos.row, pos.col);
        if (
          cell &&
          isValidPosition(pos.row, pos.col, this.size) &&
          cell.isMarked()
        ) {
          cell.clear();
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
