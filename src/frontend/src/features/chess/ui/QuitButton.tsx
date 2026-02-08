import { Button } from '@/components/ui/button';

type QuitButtonProps = {
  onQuit: () => void;
};

export function QuitButton({ onQuit }: QuitButtonProps) {
  return (
    <Button onClick={onQuit} variant="outline" size="default">
      Quit Game
    </Button>
  );
}
