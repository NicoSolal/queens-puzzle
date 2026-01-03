// js/core/HintManager.js

export class HintManager {
  constructor(board) {
    this.board = board;
    this.strategies = [
      new SingleRemainingSpotStrategy(),
      new SingleRemainingRowSpot(),
      new SingleRemainingColumnSpot(),
    ];
  }

  getHint() {
    for (const strategy of this.strategies) {
      const hint = strategy.execute(this.board);
      if (hint) return hint;
    }
    return { message: "No obvious moves found. Try exploring!" };
  }
}

class SingleRemainingSpotStrategy {
  execute(board) {
    const regionMap = {};
    for (let r = 0; r < board.size; r++) {
      for (let c = 0; c < board.size; c++) {
        const cell = board.getCell(r, c);
        if (!regionMap[cell.regionId]) regionMap[cell.regionId] = [];
        regionMap[cell.regionId].push(cell);
      }
    }

    for (const regionId in regionMap) {
      const cells = regionMap[regionId];

      if (cells.some((c) => c.hasQueen())) continue;

      const potentialSpots = cells.filter((c) => c.isEmpty());

      if (potentialSpots.length === 1) {
        const spot = potentialSpots[0];
        return {
          row: spot.row,
          col: spot.col,
          type: "MUST_BE_QUEEN",
          message: "This is the only possible spot left in its region!",
        };
      }
    }
    return null;
  }
}

class SingleRemainingRowSpot {
  execute(board) {
    const rowMap = {};
    for (let r = 0; r < board.size; r++) {
      for (let c = 0; c < board.size; c++) {
        const cell = board.getCell(r, c);
        if (!rowMap[r]) rowMap[r] = [];
        rowMap[r].push(cell);
      }
    }

    for (const row in rowMap) {
      const cells = rowMap[row];

      if (cells.some((c) => c.hasQueen())) continue;

      const potentialSpots = cells.filter((c) => c.isEmpty());

      if (potentialSpots.length === 1) {
        const spot = potentialSpots[0];
        return {
          row: spot.row,
          col: spot.col,
          type: "MUST_BE_QUEEN",
          message: "This is the only possible spot left in its row!",
        };
      }
    }
    return null;
  }
}

class SingleRemainingColumnSpot {
  execute(board) {
    const rowMap = {};
    for (let c = 0; c < board.size; c++) {
      for (let r = 0; r < board.size; r++) {
        const cell = board.getCell(r, c);
        if (!rowMap[c]) rowMap[c] = [];
        rowMap[c].push(cell);
      }
    }

    for (const col in rowMap) {
      const cells = rowMap[col];

      if (cells.some((c) => c.hasQueen())) continue;

      const potentialSpots = cells.filter((c) => c.isEmpty());

      if (potentialSpots.length === 1) {
        const spot = potentialSpots[0];
        return {
          row: spot.row,
          col: spot.col,
          type: "MUST_BE_QUEEN",
          message: "This is the only possible spot left in its column!",
        };
      }
    }
    return null;
  }
}
