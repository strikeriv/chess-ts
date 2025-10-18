import { Injectable } from '@angular/core';
import { CHESS_FILES, CHESS_RANKS, ChessSquare } from './models/notation.model';
import { ArrayNotation } from './interfaces/notation.interface';

@Injectable()
export class NotationService {
  constructor() {}

  arrayToChessNotation(x: number, y: number): ChessSquare {
    const file = CHESS_FILES[x];
    const rank = CHESS_RANKS[y];

    if (file === undefined || rank === undefined) {
      throw new Error(`out of bounds`);
    }

    return `${file}${rank}`;
  }

  chessToArrayNotation(square: ChessSquare): ArrayNotation {
    const [file, rank] = square.split('');

    const x = CHESS_FILES.indexOf(file as any);
    const y = CHESS_RANKS.indexOf(rank as any);

    return {
      x,
      y,
    };
  }
}
