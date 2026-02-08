import { Position, Square, GameStatus, Move } from '../engine/types';
import { AnimatingMove } from '../animation/animationTypes';
import { squareToCoords, coordsToSquare } from '../engine/chessRules';
import { Piece2D } from './pieces2d';

type Board2DProps = {
  position: Position;
  selectedSquare: Square | null;
  legalMoves: Square[];
  animatingMove: AnimatingMove | null;
  lastMove: Move | null;
  onSquareClick: (square: Square) => void;
  onMove: (move: { from: Square; to: Square }) => void;
  gameStatus: GameStatus;
};

export function Board2D({
  position,
  selectedSquare,
  legalMoves,
  animatingMove,
  lastMove,
  onSquareClick,
  gameStatus,
}: Board2DProps) {
  const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
  const ranks = ['8', '7', '6', '5', '4', '3', '2', '1'];

  const getAnimationStyle = (square: Square): React.CSSProperties => {
    if (!animatingMove) return {};
    
    const progress = Math.min((Date.now() - animatingMove.startTime) / animatingMove.duration, 1);
    
    if (animatingMove.from === square) {
      const [fromRank, fromFile] = squareToCoords(animatingMove.from);
      const [toRank, toFile] = squareToCoords(animatingMove.to);
      
      const deltaX = (toFile - fromFile) * 100;
      const deltaY = (toRank - fromRank) * 100;
      
      return {
        transform: `translate(${deltaX * progress}%, ${deltaY * progress}%)`,
        transition: 'none',
        zIndex: 50,
      };
    }
    
    return {};
  };

  return (
    <div className="w-full h-full bg-card rounded-lg shadow-lg p-4">
      <div className="w-full h-full grid grid-cols-8 grid-rows-8 gap-0 border-2 border-border rounded">
        {ranks.map((rank, rankIndex) =>
          files.map((file, fileIndex) => {
            const square = `${file}${rank}` as Square;
            const isLight = (rankIndex + fileIndex) % 2 === 0;
            const isSelected = selectedSquare === square;
            const isLegalMove = legalMoves.includes(square);
            const isLastMoveSquare = lastMove && (lastMove.from === square || lastMove.to === square);
            const [r, f] = squareToCoords(square);
            const piece = position[r][f];
            const isAnimatingFrom = animatingMove?.from === square;

            return (
              <button
                key={square}
                onClick={() => onSquareClick(square)}
                disabled={gameStatus !== 'playing'}
                className={`
                  relative aspect-square flex items-center justify-center
                  ${isLight ? 'bg-[oklch(0.85_0.02_80)]' : 'bg-[oklch(0.55_0.08_80)]'}
                  ${isLastMoveSquare ? 'after:absolute after:inset-0 after:bg-accent/30' : ''}
                  ${isSelected ? 'ring-4 ring-accent ring-inset' : ''}
                  ${isLegalMove ? 'before:absolute before:w-4 before:h-4 before:rounded-full before:bg-accent/40 before:z-10' : ''}
                  hover:brightness-110 transition-all
                  disabled:cursor-not-allowed
                `}
              >
                {piece && !isAnimatingFrom && (
                  <div className="w-full h-full flex items-center justify-center">
                    <Piece2D type={piece.type} color={piece.color} />
                  </div>
                )}
                {piece && isAnimatingFrom && (
                  <div
                    className="w-full h-full flex items-center justify-center absolute inset-0"
                    style={getAnimationStyle(square)}
                  >
                    <Piece2D type={piece.type} color={piece.color} />
                  </div>
                )}
              </button>
            );
          })
        )}
      </div>
    </div>
  );
}
