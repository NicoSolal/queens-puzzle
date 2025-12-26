// js/core/HintManager.js

export class HintManager {
  constructor(board) {
    this.board = board;
    this.strategies = [
      new SingleRemainingSpotStrategy(),
      new OnlyOnePossibleQueenInRegionStrategy(),
      // We can add more complex ones later (e.g., Hidden Singles)
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

/**
 * STRATEGY 1: The "Lone Survivor" in a Region
 * Logic: If a region has only one cell that is NOT marked (X),
 * and no queen is in that region yet, that cell MUST be a queen.
 */
class SingleRemainingSpotStrategy {
  execute(board) {
    // Group cells by region
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

      // Skip if region already has a queen
      if (cells.some((c) => c.hasQueen())) continue;

      // Find cells that are NOT marked and NOT queens (potential spots)
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

/**
 * STRATEGY 2: Only One Valid Spot (Check against other queens)
 * Logic: Even if there are multiple empty spots, if only one doesn't
 * violate 'canPlaceQueen', then that's the one.
 */
class OnlyOnePossibleQueenInRegionStrategy {
  execute(board) {
    // Similar to above, but use board.canPlaceQueen(r, c)
    // to filter the empty cells.
    // ... logic for filtering ...
    return null; // Placeholder
  }
}
