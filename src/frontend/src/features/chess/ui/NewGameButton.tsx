import { Button } from '@/components/ui/button';
import { RotateCcw } from 'lucide-react';

type NewGameButtonProps = {
  onNewGame: () => void;
};

export function NewGameButton({ onNewGame }: NewGameButtonProps) {
  return (
    <Button onClick={onNewGame} size="lg" className="gap-2">
      <RotateCcw className="w-4 h-4" />
      New Game
    </Button>
  );
}
