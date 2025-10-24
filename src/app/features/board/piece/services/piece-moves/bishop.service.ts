import { Injectable } from '@angular/core';
import { ArrayNotation } from '../../../services/notation/interfaces/notation.interface';
import { NotationService } from '../../../services/notation/notation.service';
import { Direction, IntermediaryMove, MovingPiece } from '../interfaces/moves.interface';
import { SharedService } from './shared.service';

const BISHOP_DIRECTIONS: Direction[] = [
  { dx: -1, dy: -1 }, // forward left diagonal
  { dx: -1, dy: 1 }, // forward right diagonal

  { dx: 1, dy: -1 }, // backward left diagonal
  { dx: 1, dy: 1 }, // backward right diagonal
];

@Injectable()
export class BishopService {
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
    for (const dir of BISHOP_DIRECTIONS) {
      for (const move of this.traverseDirection(startNotation, dir)) {
        moves.push(move);
      }
    }

    const absoluteMoves = moves.filter((move): move is IntermediaryMove => move !== null);

    return absoluteMoves;
  }

  private traverseDirection(start: ArrayNotation, dir: Direction): IntermediaryMove[] {
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

          origin: this.notationService.arrayToChessNotation(start),
          predecessor: this.notationService.arrayToChessNotation(predecessor.notation),
        });
      } else {
        moves.push({ notation: targetNotation, origin: this.notationService.arrayToChessNotation(start) });
      }
    }

    return moves;
  }
}
