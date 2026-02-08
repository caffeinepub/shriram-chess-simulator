import { Position, GameStatus, PieceColor } from '../engine/types';
import { Personality } from '../settings/types';
import { evaluatePosition, evaluationToWinProbability } from '../ai/evaluation';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

interface WinProbabilityBarProps {
  position: Position;
  personality: Personality;
  gameStatus: GameStatus;
  currentTurn: PieceColor;
}

export function WinProbabilityBar({ position, personality, gameStatus, currentTurn }: WinProbabilityBarProps) {
  // Determine win probabilities based on game status
  let whitePercent: number;
  let blackPercent: number;

  if (gameStatus === 'checkmate') {
    // The side to move is checkmated, so the other side wins
    if (currentTurn === 'w') {
      // White is checkmated, Black wins
      whitePercent = 0;
      blackPercent = 100;
    } else {
      // Black is checkmated, White wins
      whitePercent = 100;
      blackPercent = 0;
    }
  } else if (gameStatus === 'stalemate' || gameStatus === 'draw') {
    // Draw situations
    whitePercent = 50;
    blackPercent = 50;
  } else {
    // Game is still playing - evaluate position
    const evaluation = evaluatePosition(position, personality);
    const probabilities = evaluationToWinProbability(evaluation);
    whitePercent = probabilities.white;
    blackPercent = probabilities.black;
  }

  return (
    <Card className="w-full p-3">
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="font-medium">White</span>
          <span className="font-bold text-lg">{whitePercent}%</span>
        </div>
        <Progress value={whitePercent} className="h-2" />
        <div className="flex items-center justify-between text-sm">
          <span className="font-medium">Black</span>
          <span className="font-bold text-lg">{blackPercent}%</span>
        </div>
      </div>
    </Card>
  );
}
