import { Injectable } from '@angular/core';
import { NotationService } from '../../../services/notation/notation.service';
import { MovingPiece, IntermediaryMove, MoveType } from '../interfaces/moves.interface';
import { SharedService } from './shared.service';

@Injectable()
export class KnightService {
  constructor(
    private readonly notationService: NotationService,
    private readonly sharedServive: SharedService,
  ) {}

  calculateMoves(piece: MovingPiece): IntermediaryMove[] {
    const { direction, square } = piece;
    const { x } = this.notationService.chessToArrayNotation(square);

    // array for valid moves
    const moves: IntermediaryMove[] = [
      {
        notation: {
          x: direction * 2,
          y: direction * 1,
        },
        type: MoveType.MOVE,
      }, // forward left
      {
        notation: {
          x: direction * 2,
          y: direction * -1,
        },
        type: MoveType.MOVE,
      }, // forward right
    ];

    // check to see if we are doing our first move. if so, allow  two spaces forward
    // only allowed on starting squares
    if (x === 1 || x === 6) {
      const localNotation = this.sharedServive.localMoveToAbsoluteMove(square, moves[0])!; // will always be valid

      moves.push({
        notation: { x: direction * 2, y: 0 },
        type: MoveType.MOVE,
        predecessor: this.notationService.arrayToChessNotation(localNotation.notation),
      });
    }

    const absoluteMoves = moves.map((move) => this.sharedServive.localMoveToAbsoluteMove(square, move)).filter((move): move is IntermediaryMove => move !== null);

    return absoluteMoves;
  }
}
