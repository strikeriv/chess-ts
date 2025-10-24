import { Injectable } from '@angular/core';
import { Direction, IntermediaryMove, MovingPiece } from '../interfaces/moves.interface';
import { SharedService } from './shared.service';

const KNIGHT_OFFSETS: Direction[] = [
  { dx: 2, dy: 1 },
  { dx: 2, dy: -1 },
  { dx: -2, dy: 1 },
  { dx: -2, dy: -1 },

  { dx: 1, dy: 2 },
  { dx: 1, dy: -2 },
  { dx: -1, dy: 2 },
  { dx: -1, dy: -2 },
];

@Injectable()
export class KnightService {
  constructor(private readonly sharedService: SharedService) {}

  calculateMoves(piece: MovingPiece): IntermediaryMove[] {
    const { square } = piece;

    // generate knight moves based on offsets
    const potentialMoves: IntermediaryMove[] = KNIGHT_OFFSETS.map((offset) => ({
      notation: {
        x: offset.dx,
        y: offset.dy,
      },
      origin: square,
    }));

    const absoluteMoves: IntermediaryMove[] = potentialMoves.map((localMove) => this.sharedService.localMoveToAbsoluteMove(square, localMove)).filter((move): move is IntermediaryMove => move !== null);

    return absoluteMoves;
  }
}
