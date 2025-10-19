import { Injectable } from '@angular/core';
import { CHESS_FILES, CHESS_RANKS, ChessSquare } from './models/notation.model';
import { ArrayNotation } from './interfaces/notation.interface';

@Injectable()
export class NotationService {
  constructor() {}

  arrayToChessNotation(x: number, y: number): ChessSquare {
    const file = CHESS_FILES[y];
    const rank = CHESS_RANKS[8 - x - 1];

    if (file === undefined || rank === undefined) {
      throw new Error(`out of bounds`);
    }

    console.log(x, y, file, rank);
    return `${file}${rank}`;
  }

  chessToArrayNotation(square: ChessSquare): ArrayNotation {
    const [file, rank] = square.split('');
    const x = CHESS_FILES.indexOf(file as any);
    const y = CHESS_RANKS.indexOf(rank as any);

    console.log('hitting');
    // console.log(file, rank, x, y);
    // console.log({
    //   x: 8 - x,
    //   y: y + 1,
    // });
    const arrayNotation = {
      x: 8 - x - 1,
      y: y + 1,
    };
    console.log(arrayNotation);
    return arrayNotation;
  }
}
