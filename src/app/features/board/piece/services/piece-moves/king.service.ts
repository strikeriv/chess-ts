import { Injectable } from '@angular/core';
import { NotationService } from '../../../services/notation/notation.service';
import { SharedService } from './shared.service';
import { MovingPiece, IntermediaryMove } from '../interfaces/moves.interface';

const KING_OFFSETS: { dx: number; dy: number }[] = [
  // vertical
  { dx: 1, dy: 0 },
  { dx: -1, dy: 0 },

  // horizontal
  { dx: 0, dy: 1 },
  { dx: 0, dy: -1 },

  // diagonals
  { dx: 1, dy: 1 },
  { dx: 1, dy: -1 },
  { dx: -1, dy: 1 },
  { dx: -1, dy: -1 },
];

@Injectable()
export class KingService {
  constructor(
    private readonly notationService: NotationService,
    private readonly sharedService: SharedService,
  ) {}

  calculateMoves(piece: MovingPiece): IntermediaryMove[] {
    const { square } = piece;

    // generate king moves based on offsets
    const potentialMoves: IntermediaryMove[] = KING_OFFSETS.map((offset) => ({
      notation: {
        x: offset.dx,
        y: offset.dy,
      },
    }));

    const absoluteMoves: IntermediaryMove[] = potentialMoves.map((localMove) => this.sharedService.localMoveToAbsoluteMove(square, localMove)).filter((move): move is IntermediaryMove => move !== null);

    return absoluteMoves;
  }
}
