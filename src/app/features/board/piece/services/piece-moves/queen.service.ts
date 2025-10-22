import { Injectable } from '@angular/core';
import { IntermediaryMove, MovingPiece } from '../interfaces/moves.interface';
import { BishopService } from './bishop.service';
import { RookService } from './rook.service';

@Injectable()
export class QueenService {
  constructor(
    private readonly bishopService: BishopService,
    private readonly rookService: RookService,
  ) {}

  calculateMoves(piece: MovingPiece): IntermediaryMove[] {
    // combine bishop and rook moves
    const bishopMoves = this.bishopService.calculateMoves(piece);
    const rookMoves = this.rookService.calculateMoves(piece);

    return [...bishopMoves, ...rookMoves];
  }
}
