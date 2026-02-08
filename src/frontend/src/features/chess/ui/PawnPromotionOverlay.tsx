import { PieceType } from '../engine/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface PawnPromotionOverlayProps {
  onSelect: (pieceType: PieceType) => void;
  onCancel?: () => void;
}

export function PawnPromotionOverlay({ onSelect, onCancel }: PawnPromotionOverlayProps) {
  const promotionOptions: { type: PieceType; label: string; symbol: string }[] = [
    { type: 'q', label: 'Queen', symbol: '♕' },
    { type: 'r', label: 'Rook', symbol: '♖' },
    { type: 'b', label: 'Bishop', symbol: '♗' },
    { type: 'n', label: 'Knight', symbol: '♘' },
  ];

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <Card className="w-full max-w-md mx-4 shadow-2xl border-2">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Pawn Promotion</CardTitle>
          <CardDescription className="text-center">
            Choose a piece to promote your pawn
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-3">
            {promotionOptions.map(({ type, label, symbol }) => (
              <Button
                key={type}
                onClick={() => onSelect(type)}
                variant="outline"
                size="lg"
                className="h-24 flex flex-col gap-2 hover:bg-accent hover:scale-105 transition-all"
              >
                <span className="text-5xl">{symbol}</span>
                <span className="text-sm font-medium">{label}</span>
              </Button>
            ))}
          </div>
          {onCancel && (
            <Button
              onClick={onCancel}
              variant="ghost"
              className="w-full mt-4"
            >
              Cancel
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
