import { Position, Piece, PieceColor, PieceType, Square, Move, GameState, GameStatus } from './types';

export function squareToCoords(square: Square): [number, number] {
  const file = square.charCodeAt(0) - 97; // 'a' = 0
  const rank = 8 - parseInt(square[1]);
  return [rank, file];
}

export function coordsToSquare(rank: number, file: number): Square {
  return String.fromCharCode(97 + file) + (8 - rank);
}

export function createInitialPosition(): Position {
  const position: Position = Array(8).fill(null).map(() => Array(8).fill(null));
  
  // Pawns
  for (let i = 0; i < 8; i++) {
    position[1][i] = { type: 'p', color: 'b' };
    position[6][i] = { type: 'p', color: 'w' };
  }
  
  // Rooks
  position[0][0] = { type: 'r', color: 'b' };
  position[0][7] = { type: 'r', color: 'b' };
  position[7][0] = { type: 'r', color: 'w' };
  position[7][7] = { type: 'r', color: 'w' };
  
  // Knights
  position[0][1] = { type: 'n', color: 'b' };
  position[0][6] = { type: 'n', color: 'b' };
  position[7][1] = { type: 'n', color: 'w' };
  position[7][6] = { type: 'n', color: 'w' };
  
  // Bishops
  position[0][2] = { type: 'b', color: 'b' };
  position[0][5] = { type: 'b', color: 'b' };
  position[7][2] = { type: 'b', color: 'w' };
  position[7][5] = { type: 'b', color: 'w' };
  
  // Queens
  position[0][3] = { type: 'q', color: 'b' };
  position[7][3] = { type: 'q', color: 'w' };
  
  // Kings
  position[0][4] = { type: 'k', color: 'b' };
  position[7][4] = { type: 'k', color: 'w' };
  
  return position;
}

export function createInitialGameState(): GameState {
  return {
    position: createInitialPosition(),
    turn: 'w',
    castlingRights: {
      whiteKingside: true,
      whiteQueenside: true,
      blackKingside: true,
      blackQueenside: true,
    },
    enPassantTarget: null,
    halfMoveClock: 0,
    fullMoveNumber: 1,
    moveHistory: [],
    positionHistory: [],
  };
}

// Get pawn attack squares (diagonal only, for attack detection)
function getPawnAttackSquares(position: Position, square: Square, piece: Piece | null): Square[] {
  if (!piece) return [];
  
  const [rank, file] = squareToCoords(square);
  const moves: Square[] = [];
  const direction = piece.color === 'w' ? -1 : 1;
  
  // Only diagonal attacks
  for (const df of [-1, 1]) {
    const newFile = file + df;
    const newRank = rank + direction;
    if (newRank >= 0 && newRank < 8 && newFile >= 0 && newFile < 8) {
      moves.push(coordsToSquare(newRank, newFile));
    }
  }
  
  return moves;
}

export function isSquareAttacked(position: Position, square: Square, byColor: PieceColor): boolean {
  const [targetRank, targetFile] = squareToCoords(square);
  
  for (let rank = 0; rank < 8; rank++) {
    for (let file = 0; file < 8; file++) {
      const piece = position[rank][file];
      if (piece && piece.color === byColor) {
        const fromSquare = coordsToSquare(rank, file);
        
        // Special handling for pawns - use attack squares only
        if (piece.type === 'p') {
          const pawnAttacks = getPawnAttackSquares(position, fromSquare, piece);
          if (pawnAttacks.includes(square)) {
            return true;
          }
        } else {
          const moves = getPieceMoves(position, fromSquare, piece, null, false);
          if (moves.some(m => m === square)) {
            return true;
          }
        }
      }
    }
  }
  
  return false;
}

function getPieceMoves(
  position: Position,
  square: Square,
  piece: Piece,
  enPassantTarget: Square | null,
  checkKingSafety: boolean
): Square[] {
  if (!piece) return [];
  
  const [rank, file] = squareToCoords(square);
  const moves: Square[] = [];
  
  const addMove = (r: number, f: number) => {
    if (r >= 0 && r < 8 && f >= 0 && f < 8) {
      const target = position[r][f];
      if (!target || target.color !== piece.color) {
        moves.push(coordsToSquare(r, f));
      }
    }
  };
  
  const addSliding = (directions: [number, number][]) => {
    for (const [dr, df] of directions) {
      let r = rank + dr;
      let f = file + df;
      while (r >= 0 && r < 8 && f >= 0 && f < 8) {
        const target = position[r][f];
        if (!target) {
          moves.push(coordsToSquare(r, f));
        } else {
          if (target.color !== piece.color) {
            moves.push(coordsToSquare(r, f));
          }
          break;
        }
        r += dr;
        f += df;
      }
    }
  };
  
  switch (piece.type) {
    case 'p': {
      const direction = piece.color === 'w' ? -1 : 1;
      const startRank = piece.color === 'w' ? 6 : 1;
      
      // Forward move
      if (!position[rank + direction]?.[file]) {
        moves.push(coordsToSquare(rank + direction, file));
        
        // Double move from start
        if (rank === startRank && !position[rank + 2 * direction]?.[file]) {
          moves.push(coordsToSquare(rank + 2 * direction, file));
        }
      }
      
      // Captures
      for (const df of [-1, 1]) {
        const newFile = file + df;
        if (newFile >= 0 && newFile < 8) {
          const target = position[rank + direction]?.[newFile];
          if (target && target.color !== piece.color) {
            moves.push(coordsToSquare(rank + direction, newFile));
          }
          
          // En passant
          if (enPassantTarget) {
            const [epRank, epFile] = squareToCoords(enPassantTarget);
            if (rank + direction === epRank && newFile === epFile) {
              moves.push(enPassantTarget);
            }
          }
        }
      }
      break;
    }
    
    case 'n': {
      const knightMoves = [
        [-2, -1], [-2, 1], [-1, -2], [-1, 2],
        [1, -2], [1, 2], [2, -1], [2, 1]
      ];
      for (const [dr, df] of knightMoves) {
        addMove(rank + dr, file + df);
      }
      break;
    }
    
    case 'b': {
      addSliding([[-1, -1], [-1, 1], [1, -1], [1, 1]]);
      break;
    }
    
    case 'r': {
      addSliding([[-1, 0], [1, 0], [0, -1], [0, 1]]);
      break;
    }
    
    case 'q': {
      addSliding([
        [-1, -1], [-1, 0], [-1, 1],
        [0, -1], [0, 1],
        [1, -1], [1, 0], [1, 1]
      ]);
      break;
    }
    
    case 'k': {
      for (let dr = -1; dr <= 1; dr++) {
        for (let df = -1; df <= 1; df++) {
          if (dr !== 0 || df !== 0) {
            addMove(rank + dr, file + df);
          }
        }
      }
      break;
    }
  }
  
  return moves;
}

export function getLegalMoves(state: GameState, square: Square): Square[] {
  const [rank, file] = squareToCoords(square);
  const piece = state.position[rank][file];
  
  if (!piece || piece.color !== state.turn) return [];
  
  let moves = getPieceMoves(state.position, square, piece, state.enPassantTarget, true);
  
  // Add castling moves for king
  if (piece.type === 'k') {
    const isWhite = piece.color === 'w';
    const baseRank = isWhite ? 7 : 0;
    
    if (rank === baseRank && file === 4) {
      // Check if king is currently in check (cannot castle out of check)
      const kingInCheck = isSquareAttacked(state.position, square, isWhite ? 'b' : 'w');
      
      if (!kingInCheck) {
        // Kingside castling
        const canCastleKingside = isWhite ? state.castlingRights.whiteKingside : state.castlingRights.blackKingside;
        if (canCastleKingside) {
          // Check rook presence and correct color
          const rook = state.position[baseRank][7];
          if (rook && rook.type === 'r' && rook.color === piece.color) {
            // Check path is clear (f and g squares)
            const pathClear = !state.position[baseRank][5] && !state.position[baseRank][6];
            // Check king doesn't pass through or land in check
            const f5 = coordsToSquare(baseRank, 5);
            const g6 = coordsToSquare(baseRank, 6);
            const pathSafe = !isSquareAttacked(state.position, f5, isWhite ? 'b' : 'w') &&
                            !isSquareAttacked(state.position, g6, isWhite ? 'b' : 'w');
            
            if (pathClear && pathSafe) {
              moves.push(coordsToSquare(baseRank, 6));
            }
          }
        }
        
        // Queenside castling
        const canCastleQueenside = isWhite ? state.castlingRights.whiteQueenside : state.castlingRights.blackQueenside;
        if (canCastleQueenside) {
          // Check rook presence and correct color
          const rook = state.position[baseRank][0];
          if (rook && rook.type === 'r' && rook.color === piece.color) {
            // Check path is clear (b, c, d squares)
            const pathClear = !state.position[baseRank][1] && 
                             !state.position[baseRank][2] && 
                             !state.position[baseRank][3];
            // Check king doesn't pass through or land in check (d and c squares)
            const d3 = coordsToSquare(baseRank, 3);
            const c2 = coordsToSquare(baseRank, 2);
            const pathSafe = !isSquareAttacked(state.position, d3, isWhite ? 'b' : 'w') &&
                            !isSquareAttacked(state.position, c2, isWhite ? 'b' : 'w');
            
            if (pathClear && pathSafe) {
              moves.push(coordsToSquare(baseRank, 2));
            }
          }
        }
      }
    }
  }
  
  // Filter moves that would leave king in check
  moves = moves.filter(toSquare => {
    const testState = applyMove(state, { from: square, to: toSquare });
    return !isKingInCheck(testState.position, state.turn);
  });
  
  return moves;
}

export function isKingInCheck(position: Position, color: PieceColor): boolean {
  // Find king
  let kingSquare: Square | null = null;
  for (let rank = 0; rank < 8; rank++) {
    for (let file = 0; file < 8; file++) {
      const piece = position[rank][file];
      if (piece?.type === 'k' && piece.color === color) {
        kingSquare = coordsToSquare(rank, file);
        break;
      }
    }
    if (kingSquare) break;
  }
  
  if (!kingSquare) return false;
  
  return isSquareAttacked(position, kingSquare, color === 'w' ? 'b' : 'w');
}

export function applyMove(state: GameState, move: Move): GameState {
  const newState: GameState = {
    ...state,
    position: state.position.map(row => [...row]),
    castlingRights: { ...state.castlingRights },
    moveHistory: [...state.moveHistory],
    positionHistory: [...state.positionHistory],
  };
  
  const [fromRank, fromFile] = squareToCoords(move.from);
  const [toRank, toFile] = squareToCoords(move.to);
  const piece = newState.position[fromRank][fromFile];
  const capturedPiece = newState.position[toRank][toFile];
  
  if (!piece) return newState;
  
  // Create position key before move for repetition tracking
  const positionKey = createPositionKey(state);
  newState.positionHistory.push(positionKey);
  
  // Create move record with capture information
  const moveRecord: Move = {
    from: move.from,
    to: move.to,
    promotion: move.promotion,
    captured: capturedPiece?.type,
  };
  
  // Handle en passant capture
  if (piece.type === 'p' && move.to === state.enPassantTarget) {
    const captureRank = piece.color === 'w' ? toRank + 1 : toRank - 1;
    const enPassantCaptured = newState.position[captureRank][toFile];
    if (enPassantCaptured) {
      moveRecord.captured = enPassantCaptured.type;
      moveRecord.enPassant = true;
    }
    newState.position[captureRank][toFile] = null;
  }
  
  // Move piece
  newState.position[toRank][toFile] = piece;
  newState.position[fromRank][fromFile] = null;
  
  // Handle promotion
  if (move.promotion) {
    newState.position[toRank][toFile] = { type: move.promotion, color: piece.color };
  }
  
  // Handle castling
  if (piece.type === 'k' && Math.abs(toFile - fromFile) === 2) {
    const isKingside = toFile > fromFile;
    const rookFromFile = isKingside ? 7 : 0;
    const rookToFile = isKingside ? 5 : 3;
    
    moveRecord.castling = isKingside ? 'kingside' : 'queenside';
    
    newState.position[toRank][rookToFile] = newState.position[toRank][rookFromFile];
    newState.position[toRank][rookFromFile] = null;
  }
  
  // Add move to history
  newState.moveHistory.push(moveRecord);
  
  // Update castling rights
  if (piece.type === 'k') {
    if (piece.color === 'w') {
      newState.castlingRights.whiteKingside = false;
      newState.castlingRights.whiteQueenside = false;
    } else {
      newState.castlingRights.blackKingside = false;
      newState.castlingRights.blackQueenside = false;
    }
  }
  
  if (piece.type === 'r') {
    if (piece.color === 'w') {
      if (fromFile === 0) newState.castlingRights.whiteQueenside = false;
      if (fromFile === 7) newState.castlingRights.whiteKingside = false;
    } else {
      if (fromFile === 0) newState.castlingRights.blackQueenside = false;
      if (fromFile === 7) newState.castlingRights.blackKingside = false;
    }
  }
  
  // Update en passant target
  if (piece.type === 'p' && Math.abs(toRank - fromRank) === 2) {
    const epRank = piece.color === 'w' ? fromRank - 1 : fromRank + 1;
    newState.enPassantTarget = coordsToSquare(epRank, fromFile);
  } else {
    newState.enPassantTarget = null;
  }
  
  // Update half move clock
  if (piece.type === 'p' || capturedPiece) {
    newState.halfMoveClock = 0;
  } else {
    newState.halfMoveClock++;
  }
  
  // Update turn and move number
  newState.turn = state.turn === 'w' ? 'b' : 'w';
  if (state.turn === 'b') {
    newState.fullMoveNumber++;
  }
  
  return newState;
}

// Create a position key that includes all relevant state for repetition detection
function createPositionKey(state: GameState): string {
  const posFEN = positionToFEN(state.position);
  const turn = state.turn;
  const castling = [
    state.castlingRights.whiteKingside ? 'K' : '',
    state.castlingRights.whiteQueenside ? 'Q' : '',
    state.castlingRights.blackKingside ? 'k' : '',
    state.castlingRights.blackQueenside ? 'q' : '',
  ].join('') || '-';
  const ep = state.enPassantTarget || '-';
  
  return `${posFEN}|${turn}|${castling}|${ep}`;
}

export function getGameStatus(state: GameState): GameStatus {
  const hasLegalMoves = hasAnyLegalMoves(state);
  
  if (!hasLegalMoves) {
    if (isKingInCheck(state.position, state.turn)) {
      return 'checkmate';
    }
    return 'stalemate';
  }
  
  // Fifty-move rule
  if (state.halfMoveClock >= 100) {
    return 'draw';
  }
  
  // Threefold repetition
  const currentPos = createPositionKey(state);
  const repetitions = state.positionHistory.filter(pos => pos === currentPos).length;
  if (repetitions >= 2) {
    return 'draw';
  }
  
  // Insufficient material
  if (isInsufficientMaterial(state.position)) {
    return 'draw';
  }
  
  return 'playing';
}

function hasAnyLegalMoves(state: GameState): boolean {
  for (let rank = 0; rank < 8; rank++) {
    for (let file = 0; file < 8; file++) {
      const piece = state.position[rank][file];
      if (piece && piece.color === state.turn) {
        const square = coordsToSquare(rank, file);
        const moves = getLegalMoves(state, square);
        if (moves.length > 0) return true;
      }
    }
  }
  return false;
}

function isInsufficientMaterial(position: Position): boolean {
  const pieces: Piece[] = [];
  for (let rank = 0; rank < 8; rank++) {
    for (let file = 0; file < 8; file++) {
      const piece = position[rank][file];
      if (piece) pieces.push(piece);
    }
  }
  
  // King vs King
  if (pieces.length === 2) {
    return pieces.every(p => p && p.type === 'k');
  }
  
  // King + minor piece vs King
  if (pieces.length === 3) {
    const kings = pieces.filter(p => p && p.type === 'k').length;
    const minorPieces = pieces.filter(p => p && (p.type === 'n' || p.type === 'b')).length;
    return kings === 2 && minorPieces === 1;
  }
  
  return false;
}

function positionToFEN(position: Position): string {
  return position.map(row => {
    let fen = '';
    let empty = 0;
    for (const piece of row) {
      if (!piece) {
        empty++;
      } else {
        if (empty > 0) {
          fen += empty;
          empty = 0;
        }
        const char = piece.type.toUpperCase();
        fen += piece.color === 'w' ? char : char.toLowerCase();
      }
    }
    if (empty > 0) fen += empty;
    return fen;
  }).join('/');
}

export function needsPromotion(state: GameState, move: Move): boolean {
  const [fromRank, fromFile] = squareToCoords(move.from);
  const [toRank] = squareToCoords(move.to);
  const piece = state.position[fromRank][fromFile];
  
  if (!piece || piece.type !== 'p') return false;
  
  return (piece.color === 'w' && toRank === 0) || (piece.color === 'b' && toRank === 7);
}
