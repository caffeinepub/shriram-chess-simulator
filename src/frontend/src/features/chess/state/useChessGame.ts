import { useState, useEffect, useCallback } from 'react';
import {
  createInitialGameState,
  getLegalMoves,
  applyMove,
  getGameStatus,
  isKingInCheck,
  needsPromotion,
} from '../engine/chessRules';
import { GameState, Square, Move, PieceColor, PieceType, GameStatus } from '../engine/types';
import { getAiMove } from '../ai/getAiMove';
import { Difficulty, Personality, PlayerColor } from '../settings/types';
import { AnimatingMove } from '../animation/animationTypes';

// Shared animation duration constant for smoother animations
const ANIMATION_DURATION = 600;

export function useChessGame(difficulty: Difficulty, personality: Personality, playerColor: PlayerColor) {
  const [gameState, setGameState] = useState<GameState>(createInitialGameState());
  const [selectedSquare, setSelectedSquare] = useState<Square | null>(null);
  const [legalMoves, setLegalMoves] = useState<Square[]>([]);
  const [gameStatus, setGameStatus] = useState<GameStatus>('playing');
  const [animatingMove, setAnimatingMove] = useState<AnimatingMove | null>(null);
  const [pendingPromotion, setPendingPromotion] = useState<Move | null>(null);
  const [isAiThinking, setIsAiThinking] = useState(false);

  // Derive AI color as opposite of player color
  const aiColor: PieceColor = playerColor === 'w' ? 'b' : 'w';

  // Check game status
  useEffect(() => {
    const status = getGameStatus(gameState);
    setGameStatus(status);
  }, [gameState]);

  // AI move - triggers when it's AI's turn
  useEffect(() => {
    if (gameState.turn === aiColor && gameStatus === 'playing' && !isAiThinking && !animatingMove && !pendingPromotion) {
      setIsAiThinking(true);
      
      // Add slight delay for better UX
      setTimeout(() => {
        const aiMove = getAiMove(gameState, difficulty, personality);
        if (aiMove) {
          // Check if AI move needs promotion
          if (needsPromotion(gameState, aiMove)) {
            // AI always promotes to queen
            executeMove({ ...aiMove, promotion: 'q' });
          } else {
            executeMove(aiMove);
          }
        }
        setIsAiThinking(false);
      }, 300);
    }
  }, [gameState.turn, gameStatus, isAiThinking, animatingMove, pendingPromotion, difficulty, personality, aiColor]);

  const selectSquare = useCallback((square: Square) => {
    // Block interaction while promotion is pending
    if (pendingPromotion) return;
    
    // Only allow player to move on their turn
    if (gameStatus !== 'playing' || gameState.turn !== playerColor || animatingMove || isAiThinking) return;

    // If clicking the same square, deselect
    if (selectedSquare === square) {
      setSelectedSquare(null);
      setLegalMoves([]);
      return;
    }

    // If a square is selected and clicking a legal move, make the move
    if (selectedSquare && legalMoves.includes(square)) {
      const move: Move = { from: selectedSquare, to: square };
      
      // Check if promotion is needed
      if (needsPromotion(gameState, move)) {
        setPendingPromotion(move);
      } else {
        executeMove(move);
      }
      
      setSelectedSquare(null);
      setLegalMoves([]);
      return;
    }

    // Select new square
    const moves = getLegalMoves(gameState, square);
    if (moves.length > 0) {
      setSelectedSquare(square);
      setLegalMoves(moves);
    } else {
      setSelectedSquare(null);
      setLegalMoves([]);
    }
  }, [gameState, selectedSquare, legalMoves, gameStatus, animatingMove, isAiThinking, playerColor, pendingPromotion]);

  const makeMove = useCallback((move: Move) => {
    // Block interaction while promotion is pending
    if (pendingPromotion) return;
    
    // Only allow player to move on their turn
    if (gameStatus !== 'playing' || gameState.turn !== playerColor || animatingMove || isAiThinking) return;
    
    if (needsPromotion(gameState, move)) {
      setPendingPromotion(move);
    } else {
      executeMove(move);
    }
  }, [gameState, gameStatus, animatingMove, isAiThinking, playerColor, pendingPromotion]);

  const executeMove = useCallback((move: Move) => {
    // Start animation
    setAnimatingMove({
      from: move.from,
      to: move.to,
      startTime: Date.now(),
      duration: ANIMATION_DURATION,
    });

    // Apply move after animation completes
    setTimeout(() => {
      const newState = applyMove(gameState, move);
      setGameState(newState);
      setAnimatingMove(null);
    }, ANIMATION_DURATION);
  }, [gameState]);

  const promotePawn = useCallback((pieceType: PieceType) => {
    if (pendingPromotion) {
      const moveWithPromotion = { ...pendingPromotion, promotion: pieceType };
      executeMove(moveWithPromotion);
      setPendingPromotion(null);
    }
  }, [pendingPromotion, executeMove]);

  const cancelPendingPromotion = useCallback(() => {
    setPendingPromotion(null);
    setSelectedSquare(null);
    setLegalMoves([]);
  }, []);

  const resetGame = useCallback(() => {
    setGameState(createInitialGameState());
    setSelectedSquare(null);
    setLegalMoves([]);
    setAnimatingMove(null);
    setPendingPromotion(null);
    setIsAiThinking(false);
  }, []);

  return {
    position: gameState.position,
    gameStatus,
    currentTurn: gameState.turn,
    isInCheck: isKingInCheck(gameState.position, gameState.turn),
    moveHistory: gameState.moveHistory,
    selectedSquare,
    legalMoves,
    animatingMove,
    pendingPromotion,
    makeMove,
    selectSquare,
    resetGame,
    promotePawn,
    cancelPendingPromotion,
  };
}
