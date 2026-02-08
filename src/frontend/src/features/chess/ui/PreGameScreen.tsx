import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { SettingsPanel } from '../settings/SettingsPanel';
import { BoardMode, Difficulty, Personality, PlayerColor } from '../settings/types';

type PreGameScreenProps = {
  boardMode: BoardMode;
  difficulty: Difficulty;
  personality: Personality;
  playerName: string;
  playerColor: PlayerColor;
  onBoardModeChange: (mode: BoardMode) => void;
  onDifficultyChange: (difficulty: Difficulty) => void;
  onPersonalityChange: (personality: Personality) => void;
  onPlayerNameChange: (name: string) => void;
  onPlayerColorChange: (color: PlayerColor) => void;
  onStartGame: () => void;
};

export function PreGameScreen({
  boardMode,
  difficulty,
  personality,
  playerName,
  playerColor,
  onBoardModeChange,
  onDifficultyChange,
  onPersonalityChange,
  onPlayerNameChange,
  onPlayerColorChange,
  onStartGame,
}: PreGameScreenProps) {
  return (
    <div className="flex flex-col items-center gap-6 max-w-[800px] mx-auto">
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Welcome to Shriram Chess Simulator</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-center text-muted-foreground">
            Configure your game settings and click Start Game to begin.
          </p>
        </CardContent>
      </Card>

      <div className="w-full">
        <SettingsPanel
          boardMode={boardMode}
          difficulty={difficulty}
          personality={personality}
          playerName={playerName}
          playerColor={playerColor}
          onBoardModeChange={onBoardModeChange}
          onDifficultyChange={onDifficultyChange}
          onPersonalityChange={onPersonalityChange}
          onPlayerNameChange={onPlayerNameChange}
          onPlayerColorChange={onPlayerColorChange}
          disabled={false}
          playerColorDisabled={false}
        />
      </div>

      <Button onClick={onStartGame} size="lg" className="w-full max-w-xs">
        Start Game
      </Button>
    </div>
  );
}
