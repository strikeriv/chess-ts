import { Injectable } from '@angular/core';
import { NotationService } from '../../../services/notation/notation.service';
import { ArrayNotation } from '../../../services/notation/interfaces/notation.interface';
import { ChessSquare } from '../../../services/notation/models/notation.model';
import { IntermediaryMove } from '../interfaces/moves.interface';

@Injectable()
export class SharedService {
  constructor(private readonly notationService: NotationService) {}

  // convert a move to it's absolute move based on tile
  // returns null when move is out of bounds (off the board)
  localMoveToAbsoluteMove(square: ChessSquare, move: IntermediaryMove): IntermediaryMove | null {
    const { notation, predecessor, type } = move;
    const { x: mX, y: mY } = notation;

    const { x, y } = this.notationService.chessToArrayNotation(square);
    const absoluteNotation: ArrayNotation = {
      x: x + mX,
      y: y + mY,
    };

    if (this.isArrayNotationValid(absoluteNotation)) {
      return {
        notation: absoluteNotation,
        predecessor,
        type,
      };
    } else {
      return null;
    }
  }

  isArrayNotationValid(notation: ArrayNotation): boolean {
    try {
      this.notationService.arrayToChessNotation(notation);

      return true;
    } catch {
      return false;
    }
  }
}
