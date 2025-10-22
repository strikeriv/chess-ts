import { Injectable } from '@angular/core';
import { NotationService } from '../../../services/notation/notation.service';
import { Direction, IntermediaryMove, MovingPiece } from '../interfaces/moves.interface';
import { SharedService } from './shared.service';
import { ChessSquare } from '../../../services/notation/models/notation.model';
import { ArrayNotation } from '../../../services/notation/interfaces/notation.interface';

const ROOK_DIRECTIONS: Direction[] = [
  { dx: -1, dy: 0 }, // up (decrease row index)
  { dx: 1, dy: 0 }, // down (increase row index)
  { dx: 0, dy: 1 }, // right (increase column index)
  { dx: 0, dy: -1 }, // left (decrease column index)
];

@Injectable()
export class RookService {
  constructor(
    private readonly notationService: NotationService,
    private readonly sharedService: SharedService,
  ) {}

  calculateMoves(piece: MovingPiece): IntermediaryMove[] {
    const { square } = piece;
    const startNotation = this.notationService.chessToArrayNotation(square);

    // array for valid moves
    const moves: IntermediaryMove[] = [];

    // we use for loops, as predecessor move requires previous move to be valid
    for (const dir of ROOK_DIRECTIONS) {
      for (const move of this.traverseDirection(startNotation, dir, square)) {
        moves.push(move);
      }
    }

    const absoluteMoves = moves.filter((move): move is IntermediaryMove => move !== null);

    return absoluteMoves;
  }

  private traverseDirection(start: ArrayNotation, dir: Direction, square: ChessSquare): IntermediaryMove[] {
    const moves: IntermediaryMove[] = [];

    // iterate through all possible steps in the given direction
    for (let step = 1; step <= 7; step++) {
      const targetX = start.x + dir.dx * step;
      const targetY = start.y + dir.dy * step;

      const targetNotation: ArrayNotation = { x: targetX, y: targetY };

      // check if we are still on the board
      if (!this.sharedService.isArrayNotationValid(targetNotation)) {
        break; // oob
      }

      const predecessor = moves.at(-1);
      if (predecessor) {
        moves.push({
          notation: targetNotation,
          predecessor: this.notationService.arrayToChessNotation(predecessor.notation),
        });
      } else {
        moves.push({ notation: targetNotation });
      }
    }

    return moves;
  }
}
