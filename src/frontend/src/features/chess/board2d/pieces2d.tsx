import { PieceType, PieceColor } from '../engine/types';

type Piece2DProps = {
  type: PieceType;
  color: PieceColor;
};

const PIECE_UNICODE: Record<PieceColor, Record<PieceType, string>> = {
  w: {
    k: '♔',
    q: '♕',
    r: '♖',
    b: '♗',
    n: '♘',
    p: '♙',
  },
  b: {
    k: '♚',
    q: '♛',
    r: '♜',
    b: '♝',
    n: '♞',
    p: '♟',
  },
};

export function Piece2D({ type, color }: Piece2DProps) {
  return (
    <span className="text-5xl select-none" style={{ lineHeight: 1 }}>
      {PIECE_UNICODE[color][type]}
    </span>
  );
}
