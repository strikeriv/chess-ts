import { Injectable } from '@angular/core';
import { NotationService } from '../../../services/notation/notation.service';
import { IntermediaryMove, MovingPiece } from '../interfaces/moves.interface';
import { SharedService } from './shared.service';
import { ChessSquare } from '../../../services/notation/models/notation.model';

@Injectable()
export class RookService {
  constructor(
    private readonly notationService: NotationService,
    private readonly sharedService: SharedService,
  ) {}

  calculateMoves(piece: MovingPiece): IntermediaryMove[] {
    const { square } = piece;

    // array for valid moves
    const moves: IntermediaryMove[] = [];

    // we use for loops, as predecessor move requires previous move to be valid
    // start with forward moves
    for (let a = 1; a <= 4; a++) {
      const tempMoves: IntermediaryMove[] = [];

      // calculate vars

      // by default, calculate upwards
      let x = -1;
      let y = 0;

      if (a === 2) {
        // rightwards
        x = 0;
        y = 1;
      } else if (a === 3) {
        // leftwards
        x = 0;
        y = -1;
      } else if (a === 4) {
        // downwards
        x = 1;
      }

      console.log(x, y, 'after calc');
      for (let z = 1; z <= 8; z++) {
        // swap x direction if needed

        const predecessor = tempMoves.at(-1);
        const move = this.generateMoveForDirection(x, y, z, square, predecessor);

        if (move) {
          tempMoves.push(move);
        }
      }

      moves.push(...tempMoves);
    }

    const absoluteMoves = moves.map((move) => this.sharedService.localMoveToAbsoluteMove(square, move)).filter((move): move is IntermediaryMove => move !== null);

    return absoluteMoves;
  }

  private generateMoveForDirection(xDirection: number, yDirection: number, z: number, square: ChessSquare, predecessor?: IntermediaryMove): IntermediaryMove | undefined {
    if (!predecessor) {
      return {
        notation: {
          x: xDirection * z,
          y: yDirection * z,
        },
      };
    }

    // check the predecessor
    const absolutePredecessor = this.sharedService.localMoveToAbsoluteMove(square, predecessor);
    if (absolutePredecessor) {
      if (this.sharedService.isArrayNotationValid(absolutePredecessor.notation)) {
        return {
          notation: {
            x: xDirection * z,
            y: yDirection * z,
          },
          predecessor: this.notationService.arrayToChessNotation(absolutePredecessor.notation),
        };
      }
    }

    return;
  }
}
