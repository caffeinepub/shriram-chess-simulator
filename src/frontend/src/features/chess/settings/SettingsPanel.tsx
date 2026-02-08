import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BoardMode, Difficulty, Personality, PlayerColor } from './types';

type SettingsPanelProps = {
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
  disabled?: boolean;
  playerColorDisabled?: boolean;
};

export function SettingsPanel({
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
  disabled = false,
  playerColorDisabled = false,
}: SettingsPanelProps) {
  return (
    <Card>
      <CardHeader className="pb-2 pt-3 px-4">
        <CardTitle className="text-base">Game Settings</CardTitle>
      </CardHeader>
      <CardContent className="px-4 pb-3 pt-2 space-y-3">
        {/* Player Name - separate row */}
        <div className="space-y-1">
          <Label htmlFor="player-name" className="text-xs">Player Name</Label>
          <Input
            id="player-name"
            type="text"
            value={playerName}
            onChange={(e) => onPlayerNameChange(e.target.value)}
            placeholder="Enter your name"
            className="h-8 text-sm"
          />
        </div>

        {/* Player Color - separate row */}
        <div className="space-y-1">
          <Label htmlFor="player-color" className="text-xs">Player Color</Label>
          <Select
            value={playerColor}
            onValueChange={(value) => onPlayerColorChange(value as PlayerColor)}
            disabled={playerColorDisabled}
          >
            <SelectTrigger id="player-color" className="h-8 text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="w">White</SelectItem>
              <SelectItem value="b">Black</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Three settings in one horizontal row - no wrapping */}
        <div className="flex gap-2 flex-nowrap">
          <div className="space-y-1 flex-1 min-w-0">
            <Label htmlFor="board-mode" className="text-xs">Board Mode</Label>
            <Select
              value={boardMode}
              onValueChange={(value) => onBoardModeChange(value as BoardMode)}
              disabled={disabled}
            >
              <SelectTrigger id="board-mode" className="h-8 text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="2d">2D Board</SelectItem>
                <SelectItem value="3d">3D Board</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1 flex-1 min-w-0">
            <Label htmlFor="difficulty" className="text-xs">Difficulty Setting</Label>
            <Select
              value={difficulty}
              onValueChange={(value) => onDifficultyChange(value as Difficulty)}
              disabled={disabled}
            >
              <SelectTrigger id="difficulty" className="h-8 text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="easy">Easy</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="pro">Pro</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1 flex-1 min-w-0">
            <Label htmlFor="personality" className="text-xs">Player Mode</Label>
            <Select
              value={personality}
              onValueChange={(value) => onPersonalityChange(value as Personality)}
              disabled={disabled}
            >
              <SelectTrigger id="personality" className="h-8 text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="aggressive">Aggressive</SelectItem>
                <SelectItem value="defensive">Defensive</SelectItem>
                <SelectItem value="balanced">Balanced</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
