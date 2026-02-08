import { Position, PieceColor, PieceType } from '../engine/types';
import { Personality } from '../settings/types';

const PIECE_VALUES: Record<PieceType, number> = {
  p: 100,
  n: 320,
  b: 330,
  r: 500,
  q: 900,
  k: 20000,
};

const PAWN_TABLE = [
  [0, 0, 0, 0, 0, 0, 0, 0],
  [50, 50, 50, 50, 50, 50, 50, 50],
  [10, 10, 20, 30, 30, 20, 10, 10],
  [5, 5, 10, 25, 25, 10, 5, 5],
  [0, 0, 0, 20, 20, 0, 0, 0],
  [5, -5, -10, 0, 0, -10, -5, 5],
  [5, 10, 10, -20, -20, 10, 10, 5],
  [0, 0, 0, 0, 0, 0, 0, 0],
];

const KNIGHT_TABLE = [
  [-50, -40, -30, -30, -30, -30, -40, -50],
  [-40, -20, 0, 0, 0, 0, -20, -40],
  [-30, 0, 10, 15, 15, 10, 0, -30],
  [-30, 5, 15, 20, 20, 15, 5, -30],
  [-30, 0, 15, 20, 20, 15, 0, -30],
  [-30, 5, 10, 15, 15, 10, 5, -30],
  [-40, -20, 0, 5, 5, 0, -20, -40],
  [-50, -40, -30, -30, -30, -30, -40, -50],
];

const BISHOP_TABLE = [
  [-20, -10, -10, -10, -10, -10, -10, -20],
  [-10, 0, 0, 0, 0, 0, 0, -10],
  [-10, 0, 5, 10, 10, 5, 0, -10],
  [-10, 5, 5, 10, 10, 5, 5, -10],
  [-10, 0, 10, 10, 10, 10, 0, -10],
  [-10, 10, 10, 10, 10, 10, 10, -10],
  [-10, 5, 0, 0, 0, 0, 5, -10],
  [-20, -10, -10, -10, -10, -10, -10, -20],
];

const KING_TABLE = [
  [-30, -40, -40, -50, -50, -40, -40, -30],
  [-30, -40, -40, -50, -50, -40, -40, -30],
  [-30, -40, -40, -50, -50, -40, -40, -30],
  [-30, -40, -40, -50, -50, -40, -40, -30],
  [-20, -30, -30, -40, -40, -30, -30, -20],
  [-10, -20, -20, -20, -20, -20, -20, -10],
  [20, 20, 0, 0, 0, 0, 20, 20],
  [20, 30, 10, 0, 0, 10, 30, 20],
];

function getPieceSquareValue(type: PieceType, rank: number, file: number, color: PieceColor): number {
  const adjustedRank = color === 'w' ? rank : 7 - rank;
  
  switch (type) {
    case 'p':
      return PAWN_TABLE[adjustedRank][file];
    case 'n':
      return KNIGHT_TABLE[adjustedRank][file];
    case 'b':
      return BISHOP_TABLE[adjustedRank][file];
    case 'k':
      return KING_TABLE[adjustedRank][file];
    default:
      return 0;
  }
}

export function evaluatePosition(position: Position, personality: Personality): number {
  let score = 0;
  
  // Personality weights
  const weights = {
    material: 1.0,
    position: 1.0,
    centerControl: 1.0,
    kingSafety: 1.0,
  };
  
  if (personality === 'aggressive') {
    weights.material = 0.9;
    weights.position = 1.2;
    weights.centerControl = 1.3;
    weights.kingSafety = 0.7;
  } else if (personality === 'defensive') {
    weights.material = 1.1;
    weights.position = 0.9;
    weights.centerControl = 0.8;
    weights.kingSafety = 1.5;
  }
  
  for (let rank = 0; rank < 8; rank++) {
    for (let file = 0; file < 8; file++) {
      const piece = position[rank][file];
      if (!piece) continue;
      
      const multiplier = piece.color === 'w' ? 1 : -1;
      
      // Material value
      score += multiplier * PIECE_VALUES[piece.type] * weights.material;
      
      // Positional value
      score += multiplier * getPieceSquareValue(piece.type, rank, file, piece.color) * weights.position;
      
      // Center control bonus
      if ((rank === 3 || rank === 4) && (file === 3 || file === 4)) {
        score += multiplier * 10 * weights.centerControl;
      }
    }
  }
  
  return score;
}
