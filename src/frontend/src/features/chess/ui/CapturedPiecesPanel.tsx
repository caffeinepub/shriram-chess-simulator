import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Move, PieceType } from '../engine/types';
import { Piece2D } from '../board2d/pieces2d';
import { squareToCoords } from '../engine/chessRules';

type CapturedPiecesPanelProps = {
  moveHistory: Move[];
};

export function CapturedPiecesPanel({ moveHistory }: CapturedPiecesPanelProps) {
  // Derive captured pieces from move history
  const capturedByWhite: PieceType[] = [];
  const capturedByBlack: PieceType[] = [];

  moveHistory.forEach((move, index) => {
    // Determine which player made the move (white moves on even indices, black on odd)
    const isWhiteMove = index % 2 === 0;
    
    if (move.captured) {
      if (isWhiteMove) {
        capturedByWhite.push(move.captured);
      } else {
        capturedByBlack.push(move.captured);
      }
    }
  });

  // Sort pieces by value for better display
  const pieceOrder: Record<PieceType, number> = { p: 1, n: 3, b: 3, r: 5, q: 9, k: 0 };
  capturedByWhite.sort((a, b) => pieceOrder[a] - pieceOrder[b]);
  capturedByBlack.sort((a, b) => pieceOrder[a] - pieceOrder[b]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Captured Pieces</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <h3 className="text-sm font-medium text-muted-foreground">Captured by White</h3>
          <div className="flex flex-wrap gap-1 min-h-[40px] p-2 bg-muted/30 rounded">
            {capturedByWhite.length > 0 ? (
              capturedByWhite.map((pieceType, index) => (
                <div key={index} className="text-2xl">
                  <Piece2D type={pieceType} color="b" />
                </div>
              ))
            ) : (
              <span className="text-xs text-muted-foreground">None</span>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <h3 className="text-sm font-medium text-muted-foreground">Captured by Black</h3>
          <div className="flex flex-wrap gap-1 min-h-[40px] p-2 bg-muted/30 rounded">
            {capturedByBlack.length > 0 ? (
              capturedByBlack.map((pieceType, index) => (
                <div key={index} className="text-2xl">
                  <Piece2D type={pieceType} color="w" />
                </div>
              ))
            ) : (
              <span className="text-xs text-muted-foreground">None</span>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
