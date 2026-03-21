// Board.js - Manages the game board state and operations

import { Cell } from "./Cell.js";
import { Move } from "./Move.js";
import { getMode } from "../main.js";
import {
  GAME_CONFIG,
  isValidPosition,
  getAdjacentPositions,
} from "../utils/constants.js";

export class Board {
  constructor(size = GAME_CONFIG.BOARD_SIZE, solution = null) {
    this.size = size;
    this.grid = [];
    this.queens = [];
    this.history = [];
    this.easyMode = getMode();
    this.solution = solution;
    this.isSolved = false;
    this.initializeGrid();
  }

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
    const cell = this.getCell(row, col);
    const regionId = cell ? cell.regionId : null;

    if (!cell || (!cell.isEmpty() && !cell.isMarked())) {
      return false;
    }

    for (let c = 0; c < this.size; c++) {
      if (c !== col && this.getCell(row, c)?.hasQueen()) {
        return false;
      }
    }

    for (let r = 0; r < this.size; r++) {
      if (r !== row && this.getCell(r, col)?.hasQueen()) {
        return false;
      }
    }

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

    for (let r = 0; r < this.size; r++) {
      for (let c = 0; c < this.size; c++) {
        const checkCell = this.getCell(r, c);
        if (checkCell.regionId === regionId && checkCell.hasQueen()) {
          return false;
        }
      }
    }

    return true;
  }

  // Handle cell click - main interaction logic
  handleCellClick(row, col) {
    let placedQueen = false;
    this.easyMode = getMode();

    const cell = this.getCell(row, col);
    if (!cell) return false;

    const move = new Move({ row, col, action: "click" });
    move.begin(this);

    let changed = false;

    if (cell.isEmpty()) {
      const ok = this.applyCellChange(row, col, move, (c) => c.placeMark());
      changed = ok;
    } else if (cell.isMarked()) {
      if (this.easyMode === "on") {
        if (!this.canPlaceQueen(row, col)) {
          console.log("Cannot place queen here - violates rules!");
          return false;
        }
      }

      const ok = this.applyCellChange(row, col, move, (c) => c.placeQueen());
      if (ok) {
        this.queens.push({ row, col });
        changed = true;
        placedQueen = true;

        if (this.easyMode === "on") {
          this.autoMarkAdjacentCells(row, col, move);
          this.autoMarkCellRegion(cell.regionId, move);
        }
      }
    } else if (cell.hasQueen()) {
      const index = this.queens.findIndex(
        (q) => q.row === row && q.col === col
      );
      if (index !== -1) {
        this.queens.splice(index, 1);
        changed = true;
      }

      this.applyCellChange(row, col, move, (c) => c.clear());

      if (this.easyMode === "on") {
        this.autoClearAdjacentCells(row, col, move);
        this.autoClearCellRegion(cell.regionId, move);

        this.queens.forEach((q) => {
          this.autoMarkAdjacentCells(q.row, q.col, move);
          const qCell = this.getCell(q.row, q.col);
          this.autoMarkCellRegion(qCell.regionId, move);
        });
      }
    }

    move.finish(this);

    if (!move.isEmpty() || changed) {
      this.history.push(move);
    }

    if (placedQueen && this.solution) {
      const solved = this.checkWin(this.solution);
      if (solved) {
        this.isSolved = true;
      }
    }

    return true;
  }

  autoMarkAdjacentCells(queenRow, queenCol, move) {
    for (let col = 0; col < this.size; col++) {
      if (col === queenCol) continue;
      const cell = this.getCell(queenRow, col);
      if (cell?.isEmpty()) {
        this.applyCellChange(queenRow, col, move, (c) => c.placeMark());
      }
    }

    for (let row = 0; row < this.size; row++) {
      if (row === queenRow) continue;
      const cell = this.getCell(row, queenCol);
      if (cell?.isEmpty()) {
        this.applyCellChange(row, queenCol, move, (c) => c.placeMark());
      }
    }

    const adjacentPositions = getAdjacentPositions(queenRow, queenCol);
    adjacentPositions.forEach((pos) => {
      if (!isValidPosition(pos.row, pos.col, this.size)) return;
      if (pos.row === queenRow && pos.col === queenCol) return;

      const cell = this.getCell(pos.row, pos.col);
      if (cell?.isEmpty()) {
        this.applyCellChange(pos.row, pos.col, move, (c) => c.placeMark());
      }
    });
  }

  autoClearAdjacentCells(queenRow, queenCol, move) {
    for (let col = 0; col < this.size; col++) {
      if (col === queenCol) continue;
      const cell = this.getCell(queenRow, col);
      if (cell?.isMarked()) {
        this.applyCellChange(queenRow, col, move, (c) => c.clear());
      }
    }

    for (let row = 0; row < this.size; row++) {
      if (row === queenRow) continue;
      const cell = this.getCell(row, queenCol);
      if (cell?.isMarked()) {
        this.applyCellChange(row, queenCol, move, (c) => c.clear());
      }
    }

    const adjacentPositions = getAdjacentPositions(queenRow, queenCol);
    adjacentPositions.forEach((pos) => {
      if (!isValidPosition(pos.row, pos.col, this.size)) return;
      if (pos.row === queenRow && pos.col === queenCol) return;

      const cell = this.getCell(pos.row, pos.col);
      if (cell?.isMarked()) {
        this.applyCellChange(pos.row, pos.col, move, (c) => c.clear());
      }
    });
  }

  autoMarkCellRegion(regionId, move) {
    for (let row = 0; row < this.size; row++) {
      for (let col = 0; col < this.size; col++) {
        const cell = this.getCell(row, col);
        if (cell.regionId === regionId && cell.isEmpty()) {
          this.applyCellChange(row, col, move, (c) => c.placeMark());
        }
      }
    }
  }

  autoClearCellRegion(regionId, move) {
    for (let row = 0; row < this.size; row++) {
      for (let col = 0; col < this.size; col++) {
        const cell = this.getCell(row, col);
        if (cell.regionId === regionId && cell.isMarked()) {
          this.applyCellChange(row, col, move, (c) => c.clear());
        }
      }
    }
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
    return this.isSolved;
  }

  // Clear the entire board
  clear() {
    this.queens = [];
    this.history = [];
    for (let row = 0; row < this.size; row++) {
      for (let col = 0; col < this.size; col++) {
        this.grid[row][col].clear();
      }
    }
  }

  undo() {
    const last = this.history.pop();
    if (!last) return false;
    last.undo(this);
    return true;
  }

  applyCellChange(row, col, move, changeFn) {
    const cell = this.getCell(row, col);
    if (!cell) return false;

    const before = cell.state;
    const ok = changeFn(cell);
    const after = cell.state;

    if (move && before !== after) {
      move.recordCellChange(row, col, before, after);
    }

    return ok !== false;
  }

  checkWin(solution) {
    if (!Array.isArray(solution)) return false;

    if (this.queens.length !== solution.length) return false;

    const queensSet = new Set(this.queens.map((q) => `${q.row},${q.col}`));
    if (queensSet.size !== solution.length) return false; // guards duplicates

    for (const pos of solution) {
      if (!queensSet.has(`${pos.row},${pos.col}`)) return false;
    }

    return true;
  }

  // Debug helper
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

  // Print board for debugging
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
