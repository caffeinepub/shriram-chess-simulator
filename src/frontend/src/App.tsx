import { useState } from 'react';
import { ThemeProvider } from 'next-themes';
import { Toaster } from '@/components/ui/sonner';
import { Board2D } from './features/chess/board2d/Board2D';
import { Board3D } from './features/chess/board3d/Board3D';
import { SettingsPanel } from './features/chess/settings/SettingsPanel';
import { GameStatusBar } from './features/chess/ui/GameStatusBar';
import { MoveHistory } from './features/chess/ui/MoveHistory';
import { NewGameButton } from './features/chess/ui/NewGameButton';
import { CapturedPiecesPanel } from './features/chess/ui/CapturedPiecesPanel';
import { WinProbabilityBar } from './features/chess/ui/WinProbabilityBar';
import { RestartConfirmDialog } from './features/chess/settings/RestartConfirmDialog';
import { QuitConfirmDialog } from './features/chess/ui/QuitConfirmDialog';
import { PreGameScreen } from './features/chess/ui/PreGameScreen';
import { QuitButton } from './features/chess/ui/QuitButton';
import { PawnPromotionOverlay } from './features/chess/ui/PawnPromotionOverlay';
import { useChessGame } from './features/chess/state/useChessGame';
import { BoardMode, Difficulty, Personality, PlayerColor } from './features/chess/settings/types';
import { Move } from './features/chess/engine/types';

type GameScreen = 'pre-game' | 'in-game';

function App() {
  const [gameScreen, setGameScreen] = useState<GameScreen>('pre-game');
  const [boardMode, setBoardMode] = useState<BoardMode>('2d');
  const [difficulty, setDifficulty] = useState<Difficulty>('medium');
  const [personality, setPersonality] = useState<Personality>('balanced');
  const [playerName, setPlayerName] = useState<string>('');
  const [playerColor, setPlayerColor] = useState<PlayerColor>('w');
  const [showRestartDialog, setShowRestartDialog] = useState(false);
  const [showQuitDialog, setShowQuitDialog] = useState(false);
  const [pendingSettings, setPendingSettings] = useState<{
    boardMode?: BoardMode;
    difficulty?: Difficulty;
    personality?: Personality;
  } | null>(null);

  const {
    position,
    gameStatus,
    currentTurn,
    isInCheck,
    moveHistory,
    selectedSquare,
    legalMoves,
    animatingMove,
    pendingPromotion,
    makeMove,
    selectSquare,
    resetGame,
    promotePawn,
    cancelPendingPromotion,
  } = useChessGame(difficulty, personality, playerColor);

  // Compute last move from move history
  const lastMove: Move | null = moveHistory.length > 0 ? moveHistory[moveHistory.length - 1] : null;

  const handleStartGame = () => {
    resetGame();
    setGameScreen('in-game');
  };

  const handleQuitGame = () => {
    resetGame();
    setGameScreen('pre-game');
  };

  const handleQuitClick = () => {
    setShowQuitDialog(true);
  };

  const handleConfirmQuit = () => {
    setShowQuitDialog(false);
    handleQuitGame();
  };

  const handleCancelQuit = () => {
    setShowQuitDialog(false);
  };

  const handleSettingChange = (
    type: 'boardMode' | 'difficulty' | 'personality',
    value: BoardMode | Difficulty | Personality
  ) => {
    // If game has started (moves made), show confirmation dialog
    if (moveHistory.length > 0) {
      setPendingSettings({ [type]: value });
      setShowRestartDialog(true);
    } else {
      // Apply immediately if no game in progress
      if (type === 'boardMode') setBoardMode(value as BoardMode);
      if (type === 'difficulty') setDifficulty(value as Difficulty);
      if (type === 'personality') setPersonality(value as Personality);
    }
  };

  const handleConfirmRestart = () => {
    if (pendingSettings) {
      if (pendingSettings.boardMode) setBoardMode(pendingSettings.boardMode);
      if (pendingSettings.difficulty) setDifficulty(pendingSettings.difficulty);
      if (pendingSettings.personality) setPersonality(pendingSettings.personality);
      setPendingSettings(null);
    }
    resetGame();
    setShowRestartDialog(false);
  };

  const handleCancelRestart = () => {
    setPendingSettings(null);
    setShowRestartDialog(false);
  };

  const handleNewGame = () => {
    resetGame();
  };

  // Show win probability bar only after 4 plies (2 moves by each player)
  const showWinProbability = moveHistory.length >= 4;

  // Player color is disabled once any move has been made
  const playerColorDisabled = moveHistory.length > 0;

  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <div className="min-h-screen bg-background text-foreground flex flex-col">
        <header className="border-b border-border bg-card">
          <div className="container mx-auto px-4 py-4">
            <h1 className="text-3xl font-bold text-center">Shriram Chess Simulator</h1>
          </div>
        </header>

        <main className="flex-1 container mx-auto px-4 py-6">
          {gameScreen === 'pre-game' ? (
            <PreGameScreen
              boardMode={boardMode}
              difficulty={difficulty}
              personality={personality}
              playerName={playerName}
              playerColor={playerColor}
              onBoardModeChange={setBoardMode}
              onDifficultyChange={setDifficulty}
              onPersonalityChange={setPersonality}
              onPlayerNameChange={setPlayerName}
              onPlayerColorChange={setPlayerColor}
              onStartGame={handleStartGame}
            />
          ) : (
            <div className="flex flex-col items-center gap-6 max-w-[800px] mx-auto">
              {/* Chess Board */}
              <div className="w-full flex flex-col items-center gap-4">
                <GameStatusBar
                  currentTurn={currentTurn}
                  isInCheck={isInCheck}
                  gameStatus={gameStatus}
                  boardMode={boardMode}
                  difficulty={difficulty}
                  personality={personality}
                />

                {/* Win Probability Bar - shown after 4 plies */}
                {showWinProbability && (
                  <div className="w-full max-w-[600px]">
                    <WinProbabilityBar
                      position={position}
                      personality={personality}
                      gameStatus={gameStatus}
                      currentTurn={currentTurn}
                    />
                  </div>
                )}

                {/* Board container with relative positioning for overlay */}
                <div className="w-full max-w-[600px] aspect-square relative">
                  {boardMode === '2d' ? (
                    <Board2D
                      position={position}
                      selectedSquare={selectedSquare}
                      legalMoves={legalMoves}
                      animatingMove={animatingMove}
                      lastMove={lastMove}
                      onSquareClick={selectSquare}
                      onMove={makeMove}
                      gameStatus={gameStatus}
                    />
                  ) : (
                    <Board3D
                      position={position}
                      selectedSquare={selectedSquare}
                      legalMoves={legalMoves}
                      animatingMove={animatingMove}
                      lastMove={lastMove}
                      onSquareClick={selectSquare}
                      onMove={makeMove}
                      gameStatus={gameStatus}
                    />
                  )}

                  {/* Pawn Promotion Overlay */}
                  {pendingPromotion && (
                    <PawnPromotionOverlay
                      onSelect={promotePawn}
                      onCancel={cancelPendingPromotion}
                    />
                  )}
                </div>

                {/* Action buttons below board */}
                <div className="flex gap-3">
                  <NewGameButton onNewGame={handleNewGame} />
                  <QuitButton onQuit={handleQuitClick} />
                </div>
              </div>

              {/* Move History */}
              <div className="w-full">
                <MoveHistory moves={moveHistory} />
              </div>

              {/* Captured Pieces */}
              <div className="w-full">
                <CapturedPiecesPanel moveHistory={moveHistory} />
              </div>
            </div>
          )}
        </main>

        <footer className="border-t border-border bg-card mt-auto">
          <div className="container mx-auto px-4 py-4 text-center text-sm text-muted-foreground">
            © 2026. Built with ♟️ using{' '}
            <a
              href="https://caffeine.ai"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-foreground"
            >
              caffeine.ai
            </a>
          </div>
        </footer>

        <RestartConfirmDialog
          open={showRestartDialog}
          onConfirm={handleConfirmRestart}
          onCancel={handleCancelRestart}
        />

        <QuitConfirmDialog
          open={showQuitDialog}
          onConfirm={handleConfirmQuit}
          onCancel={handleCancelQuit}
        />

        <Toaster />
      </div>
    </ThemeProvider>
  );
}

export default App;
