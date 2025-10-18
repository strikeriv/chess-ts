import { Injectable } from '@angular/core';
import { CHESS_FILES, CHESS_RANKS, ChessSquare } from './models/notation.model';

@Injectable()
export class NotationService {
  constructor() {}

  arrayToChessNotation(x: number, y: number): ChessSquare {
    const file = CHESS_FILES[y];
    const rank = CHESS_RANKS[x];

    if (file === undefined || rank === undefined) {
      throw new Error(`Coordinates (${x}, ${y}) are out of board bounds.`);
    }

    return `${file}${rank}`;
  }
}
