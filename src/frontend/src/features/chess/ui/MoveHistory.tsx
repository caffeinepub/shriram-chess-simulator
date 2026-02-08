import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Move } from '../engine/types';

type MoveHistoryProps = {
  moves: Move[];
};

export function MoveHistory({ moves }: MoveHistoryProps) {
  const formatMove = (move: Move): string => {
    let notation = `${move.from}-${move.to}`;
    
    if (move.promotion) {
      notation += `=${move.promotion.toUpperCase()}`;
    }
    
    if (move.castling) {
      notation = move.castling === 'kingside' ? 'O-O' : 'O-O-O';
    }
    
    return notation;
  };

  const movePairs: [Move, Move | null][] = [];
  for (let i = 0; i < moves.length; i += 2) {
    movePairs.push([moves[i], moves[i + 1] || null]);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Move History</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] pr-4">
          {movePairs.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">No moves yet</p>
          ) : (
            <div className="space-y-1">
              {movePairs.map(([whiteMove, blackMove], index) => (
                <div key={index} className="flex items-center gap-3 text-sm">
                  <span className="text-muted-foreground w-8">{index + 1}.</span>
                  <span className="flex-1 font-mono">{formatMove(whiteMove)}</span>
                  {blackMove && (
                    <span className="flex-1 font-mono">{formatMove(blackMove)}</span>
                  )}
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
