// Move.js - Records a single user move so it can be undone.

import { GAME_CONFIG } from "../utils/constants.js";

export class Move {
  constructor({ row, col, action = "click" } = {}) {
    this.row = row;
    this.col = col;
    this.action = action;

    this.queensBefore = null;
    this.queensAfter = null;

    // key: "r,c" -> { row, col, beforeState, afterState }
    this._cellChangeMap = new Map();
  }

  begin(board) {
    this.queensBefore = board.getQueens().map((q) => ({ ...q }));
  }

  finish(board) {
    this.queensAfter = board.getQueens().map((q) => ({ ...q }));
  }

  /**
   * Record a cell change.
   * - The first time we see a cell, we store beforeState.
   * - Subsequent times in the same move, we only update afterState.
   */
  recordCellChange(row, col, beforeState, afterState) {
    const key = `${row},${col}`;
    const existing = this._cellChangeMap.get(key);

    if (!existing) {
      this._cellChangeMap.set(key, { row, col, beforeState, afterState });
      return;
    }

    existing.afterState = afterState;
  }

  /**
   * Convenience: record change by reading the cell "before",
   * applying a function, then reading "after".
   */
  recordAroundCell(board, row, col, changeFn) {
    const cell = board.getCell(row, col);
    if (!cell) return false;

    const before = cell.getState();
    const ok = changeFn(cell);

    const after = cell.getState();
    if (before !== after) {
      this.recordCellChange(row, col, before, after);
    }

    return ok !== false;
  }

  /**
   * Undo the move: restore all affected cells + queens snapshot.
   * Order: restore cells first, then queens (or vice versa) is fine
   * as long as you treat queens array as "source of truth" for queen list.
   */
  undo(board) {
    for (const ch of this._cellChangeMap.values()) {
      const cell = board.getCell(ch.row, ch.col);
      if (cell) cell.setState(ch.beforeState);
    }

    board.queens = this.queensBefore.map((q) => ({ ...q }));
  }

  /**
   * Redo the move: apply afterState + queensAfter.
   * (Optional now, but basically free once you have undo.)
   */
  redo(board) {
    for (const ch of this._cellChangeMap.values()) {
      const cell = board.getCell(ch.row, ch.col);
      if (cell) cell.setState(ch.afterState);
    }
    board.queens = this.queensAfter.map((q) => ({ ...q }));
  }

  /**
   * Useful for UI: disable Undo if move didn't change anything.
   */
  isEmpty() {
    const queensChanged =
      JSON.stringify(this.queensBefore) !== JSON.stringify(this.queensAfter);
    return this._cellChangeMap.size === 0 && !queensChanged;
  }
}
