import { Injectable } from '@angular/core';
import { MovingPiece, IntermediaryMove, MoveType } from '../interfaces/moves.interface';
import { NotationService } from '../../../services/notation/notation.service';
import { SharedService } from './shared.service';

@Injectable()
export class PawnService {
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
          x: direction * 1,
          y: 0,
        },
        type: MoveType.NORMAL,
      }, // one step forward in correct direction for pawn
    ];

    // array for valid captures
    // is cleaned for only valid ones later
    const captures: IntermediaryMove[] = [
      {
        notation: { x: direction * 1, y: direction * 1 },
        type: MoveType.CAPTURE,
      }, // left capture
      {
        notation: { x: direction * 1, y: direction * -1 },
        type: MoveType.CAPTURE,
      }, // right capture

      // en passant moves, way too complicated for right now
      // {
      //   notation: { x: direction * 2, y: direction * -1 },
      //   type: MoveType.CAPTURE,
      // },
      // {
      //   notation: { x: direction * 2, y: direction * 1 },
      //   type: MoveType.CAPTURE,
      // },
    ];

    // check to see if we are doing our first move. if so, allow  two spaces forward
    // only allowed on starting squares
    if (x === 1 || x === 6) {
      const localNotation = this.sharedServive.localMoveToAbsoluteMove(square, moves[0])!; // will always be valid

      moves.push({
        notation: { x: direction * 2, y: 0 },
        type: MoveType.NORMAL,
        predecessor: this.notationService.arrayToChessNotation(localNotation.notation),
      });
    }

    const absoluteMoves = [...moves, ...captures].map((move) => this.sharedServive.localMoveToAbsoluteMove(square, move)).filter((move): move is IntermediaryMove => move !== null);

    return absoluteMoves;
  }
}
