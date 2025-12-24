// Cell.js - Represents a single cell on the game board

import { GAME_CONFIG } from "../utils/constants.js";

export class Cell {
  constructor(row, col, regionId = null) {
    this.row = row;
    this.col = col;
    this.state = GAME_CONFIG.CELL_STATES.EMPTY;
    this.regionId = regionId; // Which colored region this cell belongs to
  }

  isEmpty() {
    return this.state === GAME_CONFIG.CELL_STATES.EMPTY;
  }

  hasQueen() {
    return this.state === GAME_CONFIG.CELL_STATES.QUEEN;
  }

  isMarked() {
    return this.state === GAME_CONFIG.CELL_STATES.MARKED;
  }

  setState(newState) {
    const validStates = Object.values(GAME_CONFIG.CELL_STATES);
    if (!validStates.includes(newState)) {
      console.error(`Invalid state: ${newState}`);
      return false;
    }

    this.state = newState;
    return true;
  }

  // Place a mark (X)
  placeMark() {
    if (this.isEmpty()) {
      this.state = GAME_CONFIG.CELL_STATES.MARKED;
      return true;
    }
    return false;
  }

  // Place a queen
  placeQueen() {
    if (this.isEmpty() || this.state === GAME_CONFIG.CELL_STATES.MARKED) {
      this.state = GAME_CONFIG.CELL_STATES.QUEEN;
      return true;
    }
    return false;
  }

  // Auto-mark (when a queen is placed, mark adjacent cells)
  autoMark() {
    if (this.isEmpty()) {
      this.state = GAME_CONFIG.CELL_STATES.MARKED;
      return true;
    }
    return false;
  }

  // Clear the cell
  clear() {
    this.state = GAME_CONFIG.CELL_STATES.EMPTY;
  }

  // Get position as object
  getPosition() {
    return { row: this.row, col: this.col };
  }

  // Get color for this cell's region
  getRegionColor() {
    if (this.regionId === null) return null;
    return GAME_CONFIG.REGION_COLORS[
      this.regionId % GAME_CONFIG.REGION_COLORS.length
    ];
  }

  // Clone this cell
  clone() {
    const clonedCell = new Cell(this.row, this.col, this.regionId);
    clonedCell.state = this.state;
    return clonedCell;
  }

  // String representation for debugging
  toString() {
    const stateSymbol = {
      [GAME_CONFIG.CELL_STATES.EMPTY]: ".",
      [GAME_CONFIG.CELL_STATES.MARKED]: "X",
      [GAME_CONFIG.CELL_STATES.QUEEN]: "Q",
    };
    return stateSymbol[this.state] || "?";
  }
}
