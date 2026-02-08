import { GameState, Move } from '../engine/types';
import { searchBestMove } from './search';
import { Difficulty, Personality } from '../settings/types';

export function getAiMove(
  state: GameState,
  difficulty: Difficulty,
  personality: Personality
): Move | null {
  return searchBestMove(state, difficulty, personality);
}
