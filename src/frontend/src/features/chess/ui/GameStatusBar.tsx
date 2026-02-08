import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { PieceColor, GameStatus } from '../engine/types';
import { BoardMode, Difficulty, Personality } from '../settings/types';
import { AlertCircle, Crown } from 'lucide-react';

type GameStatusBarProps = {
  currentTurn: PieceColor;
  isInCheck: boolean;
  gameStatus: GameStatus;
  boardMode: BoardMode;
  difficulty: Difficulty;
  personality: Personality;
};

export function GameStatusBar({
  currentTurn,
  isInCheck,
  gameStatus,
  boardMode,
  difficulty,
  personality,
}: GameStatusBarProps) {
  const getStatusMessage = () => {
    if (gameStatus === 'checkmate') {
      return currentTurn === 'w' ? 'Black wins by checkmate!' : 'White wins by checkmate!';
    }
    if (gameStatus === 'stalemate') {
      return 'Game drawn by stalemate';
    }
    if (gameStatus === 'draw') {
      return 'Game drawn';
    }
    return null;
  };

  const statusMessage = getStatusMessage();

  return (
    <Card className="w-full">
      <CardContent className="pt-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            {gameStatus === 'playing' ? (
              <>
                <Badge variant={currentTurn === 'w' ? 'default' : 'secondary'} className="text-sm">
                  {currentTurn === 'w' ? 'White' : 'Black'} to move
                </Badge>
                {isInCheck && (
                  <Badge variant="destructive" className="flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    Check!
                  </Badge>
                )}
              </>
            ) : (
              <Badge variant="outline" className="flex items-center gap-1 text-sm">
                <Crown className="w-3 h-3" />
                {statusMessage}
              </Badge>
            )}
          </div>

          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span>{boardMode === '2d' ? '2D' : '3D'}</span>
            <span>•</span>
            <span>Difficulty: {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}</span>
            <span>•</span>
            <span>Mode: {personality.charAt(0).toUpperCase() + personality.slice(1)}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
