import { PieceType, PieceColor } from '../engine/types';

type Piece3DProps = {
  type: PieceType;
  color: PieceColor;
  position: [number, number, number];
};

export function Piece3D({ type, color, position }: Piece3DProps) {
  const pieceColor = color === 'w' ? '#f5f5f5' : '#2c2c2c';
  const accentColor = color === 'w' ? '#e0e0e0' : '#1a1a1a';
  // Light gray top for black pieces to improve top-view contrast
  const topAccentColor = color === 'w' ? '#e0e0e0' : '#b0b0b0';
  
  const getPieceGeometry = () => {
    switch (type) {
      case 'p':
        // Pawn: Simple circular top - smallest footprint
        return (
          <group>
            <mesh castShadow position={[0, 0, 0]}>
              <cylinderGeometry args={[0.16, 0.2, 0.15, 16]} />
              <meshStandardMaterial color={pieceColor} metalness={0.2} roughness={0.6} />
            </mesh>
            <mesh castShadow position={[0, 0.12, 0]}>
              <cylinderGeometry args={[0.14, 0.16, 0.25, 16]} />
              <meshStandardMaterial color={pieceColor} metalness={0.2} roughness={0.6} />
            </mesh>
            <mesh castShadow position={[0, 0.32, 0]}>
              <sphereGeometry args={[0.16, 16, 16]} />
              <meshStandardMaterial color={topAccentColor} metalness={0.2} roughness={0.6} />
            </mesh>
          </group>
        );
      
      case 'r':
        // Rook: Square top with 4 corner towers - distinctive square silhouette
        return (
          <group>
            <mesh castShadow position={[0, 0, 0]}>
              <cylinderGeometry args={[0.22, 0.26, 0.2, 4]} />
              <meshStandardMaterial color={pieceColor} metalness={0.2} roughness={0.6} />
            </mesh>
            <mesh castShadow position={[0, 0.2, 0]}>
              <cylinderGeometry args={[0.2, 0.22, 0.35, 4]} />
              <meshStandardMaterial color={pieceColor} metalness={0.2} roughness={0.6} />
            </mesh>
            <mesh castShadow position={[0, 0.48, 0]}>
              <cylinderGeometry args={[0.22, 0.2, 0.12, 4]} />
              <meshStandardMaterial color={topAccentColor} metalness={0.2} roughness={0.6} />
            </mesh>
            {/* Four corner towers for clear square silhouette */}
            {[
              [0.14, 0.14],
              [-0.14, 0.14],
              [-0.14, -0.14],
              [0.14, -0.14],
            ].map(([x, z], i) => (
              <mesh
                key={i}
                castShadow
                position={[x, 0.66, z]}
              >
                <boxGeometry args={[0.1, 0.22, 0.1]} />
                <meshStandardMaterial color={topAccentColor} metalness={0.2} roughness={0.6} />
              </mesh>
            ))}
          </group>
        );
      
      case 'n':
        // Knight: Redesigned with clear L-shape and horse-head profile
        return (
          <group>
            {/* Base */}
            <mesh castShadow position={[0, 0, 0]}>
              <cylinderGeometry args={[0.2, 0.24, 0.2, 16]} />
              <meshStandardMaterial color={pieceColor} metalness={0.2} roughness={0.6} />
            </mesh>
            {/* Lower body */}
            <mesh castShadow position={[0, 0.2, 0]}>
              <cylinderGeometry args={[0.16, 0.2, 0.2, 16]} />
              <meshStandardMaterial color={pieceColor} metalness={0.2} roughness={0.6} />
            </mesh>
            {/* Neck - angled forward */}
            <mesh castShadow position={[0, 0.42, 0.1]}>
              <cylinderGeometry args={[0.12, 0.14, 0.3, 12]} />
              <meshStandardMaterial color={pieceColor} metalness={0.2} roughness={0.6} />
            </mesh>
            {/* Head base - forward position */}
            <mesh castShadow position={[0, 0.6, 0.22]}>
              <boxGeometry args={[0.16, 0.2, 0.24]} />
              <meshStandardMaterial color={topAccentColor} metalness={0.2} roughness={0.6} />
            </mesh>
            {/* Snout - extends forward creating L-shape from top */}
            <mesh castShadow position={[0, 0.58, 0.38]}>
              <boxGeometry args={[0.12, 0.14, 0.16]} />
              <meshStandardMaterial color={topAccentColor} metalness={0.2} roughness={0.6} />
            </mesh>
            {/* Ear - left side for asymmetry */}
            <mesh castShadow position={[-0.1, 0.72, 0.2]}>
              <coneGeometry args={[0.06, 0.14, 8]} />
              <meshStandardMaterial color={topAccentColor} metalness={0.2} roughness={0.6} />
            </mesh>
            {/* Ear - right side */}
            <mesh castShadow position={[0.1, 0.72, 0.2]}>
              <coneGeometry args={[0.06, 0.14, 8]} />
              <meshStandardMaterial color={topAccentColor} metalness={0.2} roughness={0.6} />
            </mesh>
            {/* Mane accent on back of neck */}
            <mesh castShadow position={[0, 0.5, 0.02]}>
              <boxGeometry args={[0.18, 0.12, 0.08]} />
              <meshStandardMaterial color={topAccentColor} metalness={0.2} roughness={0.6} />
            </mesh>
          </group>
        );
      
      case 'b':
        // Bishop: Diagonal cross/X pattern on top
        return (
          <group>
            <mesh castShadow position={[0, 0, 0]}>
              <cylinderGeometry args={[0.2, 0.24, 0.2, 16]} />
              <meshStandardMaterial color={pieceColor} metalness={0.2} roughness={0.6} />
            </mesh>
            <mesh castShadow position={[0, 0.2, 0]}>
              <cylinderGeometry args={[0.17, 0.2, 0.28, 16]} />
              <meshStandardMaterial color={pieceColor} metalness={0.2} roughness={0.6} />
            </mesh>
            <mesh castShadow position={[0, 0.48, 0]}>
              <cylinderGeometry args={[0.15, 0.17, 0.22, 16]} />
              <meshStandardMaterial color={pieceColor} metalness={0.2} roughness={0.6} />
            </mesh>
            {/* Diagonal cross bars forming X from top view */}
            <mesh castShadow position={[0, 0.72, 0]} rotation={[0, Math.PI / 4, 0]}>
              <boxGeometry args={[0.32, 0.08, 0.08]} />
              <meshStandardMaterial color={topAccentColor} metalness={0.3} roughness={0.5} />
            </mesh>
            <mesh castShadow position={[0, 0.72, 0]} rotation={[0, -Math.PI / 4, 0]}>
              <boxGeometry args={[0.32, 0.08, 0.08]} />
              <meshStandardMaterial color={topAccentColor} metalness={0.3} roughness={0.5} />
            </mesh>
            {/* Center sphere */}
            <mesh castShadow position={[0, 0.82, 0]}>
              <sphereGeometry args={[0.1, 16, 16]} />
              <meshStandardMaterial color={topAccentColor} metalness={0.4} roughness={0.4} />
            </mesh>
          </group>
        );
      
      case 'q':
        // Queen: 8-pointed star pattern from top
        return (
          <group>
            <mesh castShadow position={[0, 0, 0]}>
              <cylinderGeometry args={[0.24, 0.28, 0.2, 16]} />
              <meshStandardMaterial color={pieceColor} metalness={0.2} roughness={0.6} />
            </mesh>
            <mesh castShadow position={[0, 0.2, 0]}>
              <cylinderGeometry args={[0.2, 0.24, 0.32, 16]} />
              <meshStandardMaterial color={pieceColor} metalness={0.2} roughness={0.6} />
            </mesh>
            <mesh castShadow position={[0, 0.48, 0]}>
              <cylinderGeometry args={[0.18, 0.2, 0.24, 16]} />
              <meshStandardMaterial color={pieceColor} metalness={0.2} roughness={0.6} />
            </mesh>
            {/* 8 crown points in star pattern - very distinctive from top */}
            {[0, Math.PI / 4, Math.PI / 2, (3 * Math.PI) / 4, Math.PI, (5 * Math.PI) / 4, (3 * Math.PI) / 2, (7 * Math.PI) / 4].map((angle, i) => (
              <mesh
                key={i}
                castShadow
                position={[Math.cos(angle) * 0.18, 0.78, Math.sin(angle) * 0.18]}
              >
                <coneGeometry args={[0.07, 0.22, 8]} />
                <meshStandardMaterial color={topAccentColor} metalness={0.3} roughness={0.5} />
              </mesh>
            ))}
            {/* Center jewel */}
            <mesh castShadow position={[0, 0.72, 0]}>
              <sphereGeometry args={[0.11, 16, 16]} />
              <meshStandardMaterial color={topAccentColor} metalness={0.4} roughness={0.4} />
            </mesh>
          </group>
        );
      
      case 'k':
        // King: Plus/cross pattern from top with 4 arms
        return (
          <group>
            <mesh castShadow position={[0, 0, 0]}>
              <cylinderGeometry args={[0.24, 0.28, 0.2, 16]} />
              <meshStandardMaterial color={pieceColor} metalness={0.2} roughness={0.6} />
            </mesh>
            <mesh castShadow position={[0, 0.2, 0]}>
              <cylinderGeometry args={[0.2, 0.24, 0.32, 16]} />
              <meshStandardMaterial color={pieceColor} metalness={0.2} roughness={0.6} />
            </mesh>
            <mesh castShadow position={[0, 0.48, 0]}>
              <cylinderGeometry args={[0.18, 0.2, 0.26, 16]} />
              <meshStandardMaterial color={pieceColor} metalness={0.2} roughness={0.6} />
            </mesh>
            {/* Crown base ring */}
            <mesh castShadow position={[0, 0.7, 0]}>
              <cylinderGeometry args={[0.2, 0.18, 0.1, 16]} />
              <meshStandardMaterial color={topAccentColor} metalness={0.2} roughness={0.6} />
            </mesh>
            {/* Large cross - vertical arm */}
            <mesh castShadow position={[0, 0.92, 0]}>
              <boxGeometry args={[0.1, 0.4, 0.1]} />
              <meshStandardMaterial color={topAccentColor} metalness={0.3} roughness={0.5} />
            </mesh>
            {/* Large cross - horizontal arm */}
            <mesh castShadow position={[0, 0.92, 0]}>
              <boxGeometry args={[0.36, 0.1, 0.1]} />
              <meshStandardMaterial color={topAccentColor} metalness={0.3} roughness={0.5} />
            </mesh>
            {/* Additional cross depth for 3D plus from top */}
            <mesh castShadow position={[0, 0.92, 0]}>
              <boxGeometry args={[0.1, 0.1, 0.36]} />
              <meshStandardMaterial color={topAccentColor} metalness={0.3} roughness={0.5} />
            </mesh>
          </group>
        );
      
      default:
        return null;
    }
  };

  return (
    <group position={position}>
      {getPieceGeometry()}
    </group>
  );
}
