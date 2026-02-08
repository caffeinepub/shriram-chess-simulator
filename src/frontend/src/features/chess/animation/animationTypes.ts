import { Square } from '../engine/types';

export type AnimatingMove = {
  from: Square;
  to: Square;
  startTime: number;
  duration: number;
};
