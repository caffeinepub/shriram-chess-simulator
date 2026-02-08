import { useRef, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';
import { Position, Square, GameStatus, Move } from '../engine/types';
import { AnimatingMove } from '../animation/animationTypes';
import { squareToCoords } from '../engine/chessRules';
import { Piece3D } from './pieces3d';

type Board3DProps = {
  position: Position;
  selectedSquare: Square | null;
  legalMoves: Square[];
  animatingMove: AnimatingMove | null;
  lastMove: Move | null;
  onSquareClick: (square: Square) => void;
  onMove: (move: { from: Square; to: Square }) => void;
  gameStatus: GameStatus;
};

export function Board3D({
  position,
  selectedSquare,
  legalMoves,
  animatingMove,
  lastMove,
  onSquareClick,
  onMove,
  gameStatus,
}: Board3DProps) {
  return (
    <div className="w-full h-full bg-card rounded-lg shadow-lg overflow-hidden">
      <Canvas shadows>
        <PerspectiveCamera makeDefault position={[0, 8, 8]} fov={50} />
        <OrbitControls
          enablePan={false}
          minDistance={6}
          maxDistance={15}
          maxPolarAngle={Math.PI / 2.2}
        />
        
        <ambientLight intensity={0.5} />
        <directionalLight
          position={[5, 12, 5]}
          intensity={1.0}
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
          shadow-camera-left={-6}
          shadow-camera-right={6}
          shadow-camera-top={6}
          shadow-camera-bottom={-6}
        />
        <pointLight position={[-5, 8, -5]} intensity={0.3} />
        
        <Board3DScene
          position={position}
          selectedSquare={selectedSquare}
          legalMoves={legalMoves}
          animatingMove={animatingMove}
          lastMove={lastMove}
          onSquareClick={onSquareClick}
          onMove={onMove}
          gameStatus={gameStatus}
        />
      </Canvas>
    </div>
  );
}

function Board3DScene({
  position,
  selectedSquare,
  legalMoves,
  animatingMove,
  lastMove,
  onSquareClick,
  gameStatus,
}: Board3DProps) {
  const getPosition3D = (rank: number, file: number): [number, number, number] => {
    return [file - 3.5, 0, rank - 3.5];
  };

  const getAnimatedPosition = (square: Square): [number, number, number] | null => {
    if (!animatingMove || animatingMove.from !== square) return null;
    
    const progress = Math.min((Date.now() - animatingMove.startTime) / animatingMove.duration, 1);
    
    // Quintic ease-in-out for smoother motion
    const eased = progress < 0.5
      ? 16 * progress * progress * progress * progress * progress
      : 1 - Math.pow(-2 * progress + 2, 5) / 2;
    
    const [fromRank, fromFile] = squareToCoords(animatingMove.from);
    const [toRank, toFile] = squareToCoords(animatingMove.to);
    
    const [fromX, fromY, fromZ] = getPosition3D(fromRank, fromFile);
    const [toX, toY, toZ] = getPosition3D(toRank, toFile);
    
    // Smooth arc with refined height
    const arcHeight = 0.8 + Math.abs(toX - fromX) * 0.1 + Math.abs(toZ - fromZ) * 0.1;
    const yOffset = Math.sin(eased * Math.PI) * arcHeight;
    
    // Subtle rotation during movement
    const rotationY = eased * Math.PI * 0.15;
    
    return [
      fromX + (toX - fromX) * eased,
      fromY + yOffset,
      fromZ + (toZ - fromZ) * eased,
    ];
  };

  return (
    <group>
      {/* Board squares */}
      {Array.from({ length: 8 }).map((_, rank) =>
        Array.from({ length: 8 }).map((_, file) => {
          const isLight = (rank + file) % 2 === 0;
          const square = String.fromCharCode(97 + file) + (8 - rank);
          const isSelected = selectedSquare === square;
          const isLegalMove = legalMoves.includes(square);
          const isLastMoveSquare = lastMove && (lastMove.from === square || lastMove.to === square);
          const [x, y, z] = getPosition3D(rank, file);

          return (
            <mesh
              key={`${rank}-${file}`}
              position={[x, -0.1, z]}
              receiveShadow
              onClick={() => gameStatus === 'playing' && onSquareClick(square as Square)}
            >
              <boxGeometry args={[0.95, 0.2, 0.95]} />
              <meshStandardMaterial
                color={
                  isSelected
                    ? '#d4af37'
                    : isLegalMove
                    ? '#90EE90'
                    : isLastMoveSquare
                    ? '#c9a959'
                    : isLight
                    ? '#f0d9b5'
                    : '#b58863'
                }
                metalness={0.1}
                roughness={0.7}
              />
            </mesh>
          );
        })
      )}

      {/* Pieces */}
      {position.map((row, rank) =>
        row.map((piece, file) => {
          if (!piece) return null;
          
          const square = String.fromCharCode(97 + file) + (8 - rank);
          const animatedPos = getAnimatedPosition(square as Square);
          const [x, y, z] = animatedPos || getPosition3D(rank, file);
          
          if (animatingMove && animatingMove.from === square && !animatedPos) {
            return null;
          }

          return (
            <Piece3D
              key={`${rank}-${file}`}
              type={piece.type}
              color={piece.color}
              position={[x, y + 0.1, z]}
            />
          );
        })
      )}
    </group>
  );
}
