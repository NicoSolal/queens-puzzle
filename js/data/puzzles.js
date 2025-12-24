// puzzles.js - Preset puzzle definitions for Queens game

/**
 * Puzzle structure:
 * {
 *   id: unique identifier
 *   name: puzzle name
 *   difficulty: 'easy' | 'medium' | 'hard'
 *   size: board size (6, 8, 10, etc.)
 *   regions: array of colored regions
 *     - Each region: { id: number, cells: [{row, col}, ...] }
 *   solution: (optional) array of queen positions for validation
 * }
 */

export const PUZZLES = {
  // Easy 6x6 puzzle
  easy_1: {
    id: "easy_1",
    name: "Beginner Challenge",
    difficulty: "easy",
    size: 6,
    regions: [
      {
        id: 0,
        cells: [
          { row: 0, col: 0 },
          { row: 0, col: 1 },
          { row: 1, col: 0 },
        ],
      },
      {
        id: 1,
        cells: [
          { row: 0, col: 2 },
          { row: 0, col: 3 },
          { row: 1, col: 3 },
        ],
      },
      {
        id: 2,
        cells: [
          { row: 0, col: 4 },
          { row: 0, col: 5 },
          { row: 1, col: 5 },
        ],
      },
      {
        id: 3,
        cells: [
          { row: 1, col: 1 },
          { row: 1, col: 2 },
          { row: 2, col: 0 },
          { row: 2, col: 1 },
        ],
      },
      {
        id: 4,
        cells: [
          { row: 1, col: 4 },
          { row: 2, col: 3 },
          { row: 2, col: 4 },
          { row: 2, col: 5 },
        ],
      },
      {
        id: 5,
        cells: [
          { row: 2, col: 2 },
          { row: 3, col: 0 },
          { row: 3, col: 1 },
          { row: 3, col: 2 },
        ],
      },
      {
        id: 6,
        cells: [
          { row: 3, col: 3 },
          { row: 3, col: 4 },
          { row: 4, col: 4 },
          { row: 4, col: 5 },
        ],
      },
      {
        id: 7,
        cells: [
          { row: 3, col: 5 },
          { row: 4, col: 3 },
          { row: 5, col: 3 },
          { row: 5, col: 4 },
          { row: 5, col: 5 },
        ],
      },
      {
        id: 8,
        cells: [
          { row: 4, col: 0 },
          { row: 4, col: 1 },
          { row: 4, col: 2 },
          { row: 5, col: 0 },
          { row: 5, col: 1 },
        ],
      },
      {
        id: 9,
        cells: [{ row: 5, col: 2 }],
      },
    ],
    solution: [
      { row: 0, col: 1 },
      { row: 1, col: 3 },
      { row: 2, col: 5 },
      { row: 3, col: 2 },
      { row: 4, col: 4 },
      { row: 5, col: 0 },
    ],
  },

  easy_2: {
    id: "easy_2",
    name: "Simple Start",
    difficulty: "easy",
    size: 6,
    regions: [
      {
        id: 0,
        cells: [
          { row: 0, col: 0 },
          { row: 0, col: 1 },
          { row: 0, col: 2 },
          { row: 0, col: 3 },
          { row: 0, col: 4 },
          { row: 0, col: 5 },
        ],
      },
      {
        id: 1,
        cells: [
          { row: 1, col: 0 },
          { row: 1, col: 1 },
          { row: 1, col: 2 },
          { row: 1, col: 3 },
          { row: 1, col: 4 },
          { row: 1, col: 5 },
        ],
      },
      {
        id: 2,
        cells: [
          { row: 2, col: 0 },
          { row: 2, col: 1 },
          { row: 2, col: 2 },
          { row: 2, col: 3 },
          { row: 2, col: 4 },
          { row: 2, col: 5 },
        ],
      },
      {
        id: 3,
        cells: [
          { row: 3, col: 0 },
          { row: 3, col: 1 },
          { row: 3, col: 2 },
          { row: 3, col: 3 },
          { row: 3, col: 4 },
          { row: 3, col: 5 },
        ],
      },
      {
        id: 4,
        cells: [
          { row: 4, col: 0 },
          { row: 4, col: 1 },
          { row: 4, col: 2 },
          { row: 4, col: 3 },
          { row: 4, col: 4 },
          { row: 4, col: 5 },
        ],
      },
      {
        id: 5,
        cells: [
          { row: 5, col: 0 },
          { row: 5, col: 1 },
          { row: 5, col: 2 },
          { row: 5, col: 3 },
          { row: 5, col: 4 },
          { row: 5, col: 5 },
        ],
      },
    ],
  },

  // Medium 8x8 puzzle - Simple test
  medium_1: {
    id: "medium_1",
    name: "Classic Eight",
    difficulty: "medium",
    size: 8,
    regions: [
      {
        id: 0,
        cells: [
          { row: 0, col: 0 },
          { row: 0, col: 1 },
          { row: 1, col: 0 },
          { row: 1, col: 1 },
        ],
      },
      {
        id: 1,
        cells: [
          { row: 0, col: 2 },
          { row: 0, col: 3 },
          { row: 1, col: 2 },
          { row: 1, col: 3 },
        ],
      },
      {
        id: 2,
        cells: [
          { row: 0, col: 4 },
          { row: 0, col: 5 },
          { row: 1, col: 4 },
          { row: 1, col: 5 },
        ],
      },
      {
        id: 3,
        cells: [
          { row: 0, col: 6 },
          { row: 0, col: 7 },
          { row: 1, col: 6 },
          { row: 1, col: 7 },
        ],
      },
      {
        id: 4,
        cells: [
          { row: 2, col: 0 },
          { row: 2, col: 1 },
          { row: 3, col: 0 },
          { row: 3, col: 1 },
        ],
      },
      {
        id: 5,
        cells: [
          { row: 2, col: 2 },
          { row: 2, col: 3 },
          { row: 3, col: 2 },
          { row: 3, col: 3 },
        ],
      },
      {
        id: 6,
        cells: [
          { row: 2, col: 4 },
          { row: 2, col: 5 },
          { row: 3, col: 4 },
          { row: 3, col: 5 },
        ],
      },
      {
        id: 7,
        cells: [
          { row: 2, col: 6 },
          { row: 2, col: 7 },
          { row: 3, col: 6 },
          { row: 3, col: 7 },
        ],
      },
      {
        id: 8,
        cells: [
          { row: 4, col: 0 },
          { row: 4, col: 1 },
          { row: 5, col: 0 },
          { row: 5, col: 1 },
        ],
      },
      {
        id: 9,
        cells: [
          { row: 4, col: 2 },
          { row: 4, col: 3 },
          { row: 5, col: 2 },
          { row: 5, col: 3 },
        ],
      },
      {
        id: 10,
        cells: [
          { row: 4, col: 4 },
          { row: 4, col: 5 },
          { row: 5, col: 4 },
          { row: 5, col: 5 },
        ],
      },
      {
        id: 11,
        cells: [
          { row: 4, col: 6 },
          { row: 4, col: 7 },
          { row: 5, col: 6 },
          { row: 5, col: 7 },
        ],
      },
      {
        id: 12,
        cells: [
          { row: 6, col: 0 },
          { row: 6, col: 1 },
          { row: 7, col: 0 },
          { row: 7, col: 1 },
        ],
      },
      {
        id: 13,
        cells: [
          { row: 6, col: 2 },
          { row: 6, col: 3 },
          { row: 7, col: 2 },
          { row: 7, col: 3 },
        ],
      },
      {
        id: 14,
        cells: [
          { row: 6, col: 4 },
          { row: 6, col: 5 },
          { row: 7, col: 4 },
          { row: 7, col: 5 },
        ],
      },
      {
        id: 15,
        cells: [
          { row: 6, col: 6 },
          { row: 6, col: 7 },
          { row: 7, col: 6 },
          { row: 7, col: 7 },
        ],
      },
    ],
  },

  expert_1: {
    id: "expert_1",
    name: "Expert Level",
    difficulty: "expert",
    size: 12,
    regions: [
      {
        id: 0,
        cells: [
          { row: 0, col: 0 },
          { row: 0, col: 1 },
          { row: 0, col: 2 },
          { row: 0, col: 3 },
          { row: 0, col: 4 },
          { row: 0, col: 5 },
          { row: 0, col: 6 },
          { row: 0, col: 7 },
          { row: 0, col: 8 },
          { row: 0, col: 9 },
          { row: 0, col: 10 },
          { row: 0, col: 11 },
        ],
      },
      {
        id: 1,
        cells: [
          { row: 1, col: 0 },
          { row: 1, col: 1 },
          { row: 1, col: 2 },
          { row: 1, col: 3 },
          { row: 1, col: 4 },
          { row: 1, col: 5 },
          { row: 1, col: 6 },
          { row: 1, col: 7 },
          { row: 1, col: 8 },
          { row: 1, col: 9 },
          { row: 1, col: 10 },
          { row: 1, col: 11 },
        ],
      },
      {
        id: 2,
        cells: [
          { row: 2, col: 0 },
          { row: 2, col: 1 },
          { row: 2, col: 2 },
          { row: 2, col: 3 },
          { row: 2, col: 4 },
          { row: 2, col: 5 },
          { row: 2, col: 6 },
          { row: 2, col: 7 },
          { row: 2, col: 8 },
          { row: 2, col: 9 },
          { row: 2, col: 10 },
          { row: 2, col: 11 },
        ],
      },
      {
        id: 3,
        cells: [
          { row: 3, col: 0 },
          { row: 3, col: 1 },
          { row: 3, col: 2 },
          { row: 3, col: 3 },
          { row: 3, col: 4 },
          { row: 3, col: 5 },
          { row: 3, col: 6 },
          { row: 3, col: 7 },
          { row: 3, col: 8 },
          { row: 3, col: 9 },
          { row: 3, col: 10 },
          { row: 3, col: 11 },
        ],
      },
      {
        id: 4,
        cells: [
          { row: 4, col: 0 },
          { row: 4, col: 1 },
          { row: 4, col: 2 },
          { row: 4, col: 3 },
          { row: 4, col: 4 },
          { row: 4, col: 5 },
          { row: 4, col: 6 },
          { row: 4, col: 7 },
          { row: 4, col: 8 },
          { row: 4, col: 9 },
          { row: 4, col: 10 },
          { row: 4, col: 11 },
        ],
      },
      {
        id: 5,
        cells: [
          { row: 5, col: 0 },
          { row: 5, col: 1 },
          { row: 5, col: 2 },
          { row: 5, col: 3 },
          { row: 5, col: 4 },
          { row: 5, col: 5 },
          { row: 5, col: 6 },
          { row: 5, col: 7 },
          { row: 5, col: 8 },
          { row: 5, col: 9 },
          { row: 5, col: 10 },
          { row: 5, col: 11 },
        ],
      },
      {
        id: 6,
        cells: [
          { row: 6, col: 0 },
          { row: 6, col: 1 },
          { row: 6, col: 2 },
          { row: 6, col: 3 },
          { row: 6, col: 4 },
          { row: 6, col: 5 },
          { row: 6, col: 6 },
          { row: 6, col: 7 },
          { row: 6, col: 8 },
          { row: 6, col: 9 },
          { row: 6, col: 10 },
          { row: 6, col: 11 },
        ],
      },
      {
        id: 7,
        cells: [
          { row: 7, col: 0 },
          { row: 7, col: 1 },
          { row: 7, col: 2 },
          { row: 7, col: 3 },
          { row: 7, col: 4 },
          { row: 7, col: 5 },
          { row: 7, col: 6 },
        ],
      },
      {
        id: 8,
        cells: [
          { row: 7, col: 7 },
          { row: 7, col: 8 },
          { row: 7, col: 9 },
          { row: 7, col: 10 },
          { row: 7, col: 11 },
          { row: 8, col: 0 },
          { row: 8, col: 1 },
          { row: 8, col: 2 },
          { row: 8, col: 3 },
          { row: 8, col: 4 },
          { row: 8, col: 5 },
          { row: 8, col: 6 },
          { row: 8, col: 7 },
          { row: 8, col: 8 },
          { row: 8, col: 9 },
          { row: 8, col: 10 },
          { row: 8, col: 11 },
        ],
      },
      {
        id: 9,
        cells: [
          { row: 9, col: 0 },
          { row: 9, col: 1 },
          { row: 9, col: 2 },
          { row: 9, col: 3 },
          { row: 9, col: 4 },
          { row: 9, col: 5 },
          { row: 9, col: 6 },
          { row: 9, col: 7 },
          { row: 9, col: 8 },
          { row: 9, col: 9 },
          { row: 9, col: 10 },
          { row: 9, col: 11 },
        ],
      },
      {
        id: 10,
        cells: [
          { row: 10, col: 0 },
          { row: 10, col: 1 },
          { row: 10, col: 2 },
          { row: 10, col: 3 },
          { row: 10, col: 4 },
          { row: 10, col: 5 },
          { row: 10, col: 6 },
          { row: 10, col: 7 },
          { row: 10, col: 8 },
          { row: 10, col: 9 },
          { row: 10, col: 10 },
          { row: 10, col: 11 },
        ],
      },
      {
        id: 11,
        cells: [
          { row: 11, col: 0 },
          { row: 11, col: 1 },
          { row: 11, col: 2 },
          { row: 11, col: 3 },
          { row: 11, col: 4 },
          { row: 11, col: 5 },
          { row: 11, col: 6 },
          { row: 11, col: 7 },
          { row: 11, col: 8 },
          { row: 11, col: 9 },
          { row: 11, col: 10 },
          { row: 11, col: 11 },
        ],
      },
    ],
  },
};

// Get puzzle by ID
export function getPuzzle(puzzleId) {
  return PUZZLES[puzzleId] || null;
}

// Get all puzzles of a specific difficulty
export function getPuzzlesByDifficulty(difficulty) {
  return Object.values(PUZZLES).filter((p) => p.difficulty === difficulty);
}

// Get all puzzle IDs
export function getAllPuzzleIds() {
  return Object.keys(PUZZLES);
}
