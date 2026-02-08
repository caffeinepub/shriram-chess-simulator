import { GameState, Move } from '../engine/types';
import { getLegalMoves, applyMove, getGameStatus, squareToCoords } from '../engine/chessRules';
import { evaluatePosition } from './evaluation';
import { Difficulty, Personality } from '../settings/types';

function getAllLegalMoves(state: GameState): Move[] {
  const moves: Move[] = [];
  
  for (let rank = 0; rank < 8; rank++) {
    for (let file = 0; file < 8; file++) {
      const piece = state.position[rank][file];
      if (piece && piece.color === state.turn) {
        const from = String.fromCharCode(97 + file) + (8 - rank);
        const legalSquares = getLegalMoves(state, from);
        
        for (const to of legalSquares) {
          moves.push({ from, to });
        }
      }
    }
  }
  
  return moves;
}

function minimax(
  state: GameState,
  depth: number,
  alpha: number,
  beta: number,
  maximizing: boolean,
  personality: Personality
): number {
  const status = getGameStatus(state);
  
  if (status === 'checkmate') {
    return maximizing ? -100000 : 100000;
  }
  
  if (status === 'stalemate' || status === 'draw') {
    return 0;
  }
  
  if (depth === 0) {
    return evaluatePosition(state.position, personality);
  }
  
  const moves = getAllLegalMoves(state);
  
  if (maximizing) {
    let maxEval = -Infinity;
    for (const move of moves) {
      const newState = applyMove(state, move);
      const evaluation = minimax(newState, depth - 1, alpha, beta, false, personality);
      maxEval = Math.max(maxEval, evaluation);
      alpha = Math.max(alpha, evaluation);
      if (beta <= alpha) break;
    }
    return maxEval;
  } else {
    let minEval = Infinity;
    for (const move of moves) {
      const newState = applyMove(state, move);
      const evaluation = minimax(newState, depth - 1, alpha, beta, true, personality);
      minEval = Math.min(minEval, evaluation);
      beta = Math.min(beta, evaluation);
      if (beta <= alpha) break;
    }
    return minEval;
  }
}

export function searchBestMove(
  state: GameState,
  difficulty: Difficulty,
  personality: Personality
): Move | null {
  const moves = getAllLegalMoves(state);
  
  if (moves.length === 0) return null;
  
  // Determine search depth based on difficulty
  let depth = 2;
  let randomness = 0.3;
  
  if (difficulty === 'easy') {
    depth = 1;
    randomness = 0.5;
  } else if (difficulty === 'medium') {
    depth = 2;
    randomness = 0.2;
  } else if (difficulty === 'pro') {
    depth = 3;
    randomness = 0.05;
  }
  
  // Evaluate all moves
  const moveEvaluations = moves.map(move => {
    const newState = applyMove(state, move);
    const evaluation = minimax(newState, depth - 1, -Infinity, Infinity, false, personality);
    
    // Add randomness based on difficulty
    const randomFactor = (Math.random() - 0.5) * randomness * 200;
    
    return {
      move,
      score: evaluation + randomFactor,
    };
  });
  
  // Sort by score (descending for black)
  moveEvaluations.sort((a, b) => b.score - a.score);
  
  // For easy mode, sometimes pick a suboptimal move
  if (difficulty === 'easy' && Math.random() < 0.3 && moveEvaluations.length > 3) {
    const randomIndex = Math.floor(Math.random() * Math.min(5, moveEvaluations.length));
    return moveEvaluations[randomIndex].move;
  }
  
  return moveEvaluations[0].move;
}
