export type PieceType = 'p' | 'n' | 'b' | 'r' | 'q' | 'k';
export type PieceColor = 'w' | 'b';
export type Piece = {
  type: PieceType;
  color: PieceColor;
} | null;

export type Square = string; // e.g., 'e4', 'a1'
export type Position = Piece[][];

export type Move = {
  from: Square;
  to: Square;
  promotion?: PieceType;
  captured?: PieceType;
  castling?: 'kingside' | 'queenside';
  enPassant?: boolean;
};

export type GameStatus = 'playing' | 'checkmate' | 'stalemate' | 'draw';

export type GameState = {
  position: Position;
  turn: PieceColor;
  castlingRights: {
    whiteKingside: boolean;
    whiteQueenside: boolean;
    blackKingside: boolean;
    blackQueenside: boolean;
  };
  enPassantTarget: Square | null;
  halfMoveClock: number;
  fullMoveNumber: number;
  moveHistory: Move[];
  positionHistory: string[];
};
