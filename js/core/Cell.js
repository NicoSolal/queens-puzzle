// Cell.js - Represents a single cell on the game board

import { GAME_CONFIG } from "../utils/constants.js";

export class Cell {
  constructor(row, col, regionId = null) {
    this.row = row;
    this.col = col;
    this.state = GAME_CONFIG.CELL_STATES.EMPTY;
    this.regionId = regionId; // Which colored region this cell belongs to
  }

  // Check if cell is empty
  isEmpty() {
    return this.state === GAME_CONFIG.CELL_STATES.EMPTY;
  }

  // Check if cell has a queen
  hasQueen() {
    return this.state === GAME_CONFIG.CELL_STATES.QUEEN;
  }

  // Check if cell is marked (X)
  isMarked() {
    return this.state === GAME_CONFIG.CELL_STATES.MARKED;
  }

  // Set cell state
  setState(newState) {
    // Validate state
    const validStates = Object.values(GAME_CONFIG.CELL_STATES);
    if (!validStates.includes(newState)) {
      console.error(`Invalid state: ${newState}`);
      return false;
    }

    this.state = newState;
    return true;
  }

  // Place a mark (X) - user action
  placeMark() {
    if (this.isEmpty()) {
      this.state = GAME_CONFIG.CELL_STATES.MARKED;
      return true;
    }
    return false;
  }

  // Place a queen
  placeQueen() {
    // Can only place queen on empty or marked cells
    if (this.isEmpty() || this.state === GAME_CONFIG.CELL_STATES.MARKED) {
      this.state = GAME_CONFIG.CELL_STATES.QUEEN;
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
