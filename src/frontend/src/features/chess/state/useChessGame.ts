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
import { Difficulty, Personality } from '../settings/types';
import { AnimatingMove } from '../animation/animationTypes';

// Shared animation duration constant for smoother animations
const ANIMATION_DURATION = 600;

export function useChessGame(difficulty: Difficulty, personality: Personality) {
  const [gameState, setGameState] = useState<GameState>(createInitialGameState());
  const [selectedSquare, setSelectedSquare] = useState<Square | null>(null);
  const [legalMoves, setLegalMoves] = useState<Square[]>([]);
  const [gameStatus, setGameStatus] = useState<GameStatus>('playing');
  const [animatingMove, setAnimatingMove] = useState<AnimatingMove | null>(null);
  const [pendingPromotion, setPendingPromotion] = useState<Move | null>(null);
  const [isAiThinking, setIsAiThinking] = useState(false);

  // Check game status
  useEffect(() => {
    const status = getGameStatus(gameState);
    setGameStatus(status);
  }, [gameState]);

  // AI move
  useEffect(() => {
    if (gameState.turn === 'b' && gameStatus === 'playing' && !isAiThinking && !animatingMove) {
      setIsAiThinking(true);
      
      // Add slight delay for better UX
      setTimeout(() => {
        const aiMove = getAiMove(gameState, difficulty, personality);
        if (aiMove) {
          executeMove(aiMove);
        }
        setIsAiThinking(false);
      }, 300);
    }
  }, [gameState.turn, gameStatus, isAiThinking, animatingMove, difficulty, personality]);

  const selectSquare = useCallback((square: Square) => {
    if (gameStatus !== 'playing' || gameState.turn !== 'w' || animatingMove || isAiThinking) return;

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
  }, [gameState, selectedSquare, legalMoves, gameStatus, animatingMove, isAiThinking]);

  const makeMove = useCallback((move: Move) => {
    if (gameStatus !== 'playing' || gameState.turn !== 'w' || animatingMove || isAiThinking) return;
    
    if (needsPromotion(gameState, move)) {
      setPendingPromotion(move);
    } else {
      executeMove(move);
    }
  }, [gameState, gameStatus, animatingMove, isAiThinking]);

  const executeMove = useCallback((move: Move, promotionPiece?: PieceType) => {
    // Start animation
    setAnimatingMove({
      from: move.from,
      to: move.to,
      startTime: Date.now(),
      duration: ANIMATION_DURATION,
    });

    // Apply move after animation completes
    setTimeout(() => {
      // If promotion piece is provided, add it to the move
      const moveWithPromotion = promotionPiece ? { ...move, promotion: promotionPiece } : move;
      const newState = applyMove(gameState, moveWithPromotion);
      setGameState(newState);
      setAnimatingMove(null);
    }, ANIMATION_DURATION);
  }, [gameState]);

  const promotePawn = useCallback((pieceType: PieceType) => {
    if (pendingPromotion) {
      executeMove(pendingPromotion, pieceType);
      setPendingPromotion(null);
    }
  }, [pendingPromotion, executeMove]);

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
    makeMove,
    selectSquare,
    resetGame,
    promotePawn,
  };
}
