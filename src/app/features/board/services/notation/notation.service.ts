import { Injectable } from '@angular/core';
import { CHESS_FILES, CHESS_RANKS, ChessFile, ChessRank, ChessSquare } from './models/notation.model';
import { ArrayNotation } from './interfaces/notation.interface';

@Injectable()
export class NotationService {
  constructor() {}

  /**
   * Converts 2d matrix indices to chess notation
   * This is complex, because normally [0][0] would be the very top left,
   * but chess notation starts on the bottom left, so [0][0] is in fact A8, so [7][0] is A1
   */

  arrayToChessNotation(x: number, y: number): ChessSquare {
    const rank = CHESS_RANKS[7 - x]; // this swaps the positions around to make notation start from bottom left
    const file = CHESS_FILES[y];

    if (file === undefined || rank === undefined) {
      throw new Error(`out of bounds`);
    }

    return `${file}${rank}`;
  }

  chessToArrayNotation(square: ChessSquare): ArrayNotation {
    const [file, rank] = square.split('');

    const y = CHESS_FILES.indexOf(file as ChessFile);
    const x = CHESS_RANKS.indexOf(rank as ChessRank);

    if (x < 0 || x > 7 || y < 0 || y > 7) {
      throw new Error(`out of bounds`);
    }

    // reverse the swap here!
    return { x: 7 - x, y };
  }
}
