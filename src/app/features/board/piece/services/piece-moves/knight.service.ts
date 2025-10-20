import { Injectable } from '@angular/core';
import { IntermediaryMove, MovingPiece } from '../interfaces/moves.interface';
import { SharedService } from './shared.service';

@Injectable()
export class KnightService {
  constructor(private readonly sharedServive: SharedService) {}

  calculateMoves(piece: MovingPiece): IntermediaryMove[] {
    const { direction, square } = piece;

    // array for valid moves
    const moves: IntermediaryMove[] = [
      // forward moves
      {
        notation: {
          x: direction * 2,
          y: direction * 1,
        },
      }, // far forward left
      {
        notation: {
          x: direction * 2,
          y: direction * -1,
        },
      }, // far forward right
      {
        notation: {
          x: direction * 1,
          y: direction * 2,
        },
      }, // close forward left
      {
        notation: {
          x: direction * 1,
          y: direction * -2,
        },
      }, // close forward right

      // backward moves
      {
        notation: {
          x: direction * -1,
          y: direction * 2,
        },
      }, // close backward left
      {
        notation: {
          x: direction * -1,
          y: direction * -2,
        },
      }, // close backward right
      {
        notation: {
          x: direction * -2,
          y: direction * 1,
        },
      }, // far backward left
      {
        notation: {
          x: direction * -2,
          y: direction * -1,
        },
      }, // far backward right
    ];

    const absoluteMoves = moves.map((move) => this.sharedServive.localMoveToAbsoluteMove(square, move)).filter((move): move is IntermediaryMove => move !== null);

    return absoluteMoves;
  }
}
