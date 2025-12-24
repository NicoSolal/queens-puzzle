// Game Constants - Central configuration for the Queens Puzzle Game

export const GAME_CONFIG = {
  // Board settings
  BOARD_SIZE: 8, // 8x8 grid
  CELL_SIZE: 60, // Size of each cell in pixels

  // Cell states
  CELL_STATES: {
    EMPTY: "empty",
    MARKED: "marked", // X mark
    QUEEN: "queen", // Queen placed
  },

  // Difficulty levels
  DIFFICULTY: {
    EASY: {
      name: "Easy",
      boardSize: 6,
      regions: 4,
    },
    MEDIUM: {
      name: "Medium",
      boardSize: 8,
      regions: 6,
    },
    HARD: {
      name: "Hard",
      boardSize: 10,
      regions: 8,
    },
  },

  // Scoring
  SCORE: {
    BASE: 1000,
    TIME_PENALTY_PER_SECOND: 1,
    MILESTONE_FIRST_QUEEN: 100,
    MILESTONE_HALF_QUEENS: 150,
    MILESTONE_FIRST_QUEEN_TIME_LIMIT: 10, // seconds
    MILESTONE_HALF_QUEENS_TIME_LIMIT: 120, // seconds
  },

  // Colors for regions (colored blobs)
  REGION_COLORS: [
    "#FF6B6B", // Red
    "#4ECDC4", // Teal
    "#45B7D1", // Blue
    "#FFA07A", // Light Salmon
    "#98D8C8", // Mint
    "#F7DC6F", // Yellow
    "#BB8FCE", // Purple
    "#85C1E2", // Sky Blue
    "#F8B500", // Orange
    "#7DCEA0", // Green
  ],

  // UI Colors
  UI_COLORS: {
    BACKGROUND: "#1a1a2e",
    PRIMARY: "#00d9ff",
    SECONDARY: "#16213e",
    TEXT: "#eee",
    GRID_LINE: "#333",
    CELL_HOVER: "#2a2a3e",
  },
};

// Helper function to get difficulty settings
export function getDifficultyConfig(difficulty) {
  return (
    GAME_CONFIG.DIFFICULTY[difficulty.toUpperCase()] ||
    GAME_CONFIG.DIFFICULTY.MEDIUM
  );
}

// Helper to check if position is valid on board
export function isValidPosition(row, col, boardSize = GAME_CONFIG.BOARD_SIZE) {
  return row >= 0 && row < boardSize && col >= 0 && col < boardSize;
}

// Get all adjacent positions (8 directions + same cell)
export function getAdjacentPositions(row, col) {
  const positions = [];
  for (let r = row - 1; r <= row + 1; r++) {
    for (let c = col - 1; c <= col + 1; c++) {
      positions.push({ row: r, col: c });
    }
  }
  return positions;
}
