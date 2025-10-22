import { Injectable } from '@angular/core';
import { NotationService } from '../../../services/notation/notation.service';
import { IntermediaryMove, MovingPiece } from '../interfaces/moves.interface';
import { SharedService } from './shared.service';

@Injectable()
export class RookService {
  constructor(
    private readonly notationService: NotationService,
    private readonly sharedService: SharedService,
  ) {}

  calculateMoves(piece: MovingPiece): IntermediaryMove[] {
    const { direction, square } = piece;

    // array for valid moves
    const moves: IntermediaryMove[] = [];
    const tempMoves: IntermediaryMove[] = [];

    // we use for loops, as predecessor move requires previous move to be valid
    // start with forward moves
    for (let x = 1; x < 9; x++) {
      const predecessor = tempMoves[tempMoves.length - 1]; // get last move pushed

      if (!predecessor) {
        tempMoves.push({
          notation: {
            x: direction * x,
            y: 0,
          },
        });

        continue;
      }

      // check the predecessor
      const absolutePredecessor = this.sharedService.localMoveToAbsoluteMove(square, predecessor);
      if (absolutePredecessor) {
        if (this.sharedService.isArrayNotationValid(absolutePredecessor.notation)) {
          console.log('notation is valid');
          tempMoves.push({
            notation: {
              x: direction * x,
              y: 0,
            },
            predecessor: this.notationService.arrayToChessNotation(absolutePredecessor.notation),
          });
        }
      }
    }

    moves.push(...tempMoves);
    tempMoves.length = 0;

    // // backward moves
    // for (let x = 1; x < 9; x++) {
    //   const predecessor = tempMoves[moves.length - 1]; // get last move pushed

    //   if (!predecessor) {
    //     tempMoves.push({
    //       notation: {
    //         x: direction * (x * -1),
    //         y: 0,
    //       },
    //     });

    //     continue;
    //   }

    //   // check the predecessor
    //   const absolutePredecessor = this.sharedService.localMoveToAbsoluteMove(square, predecessor);
    //   if (absolutePredecessor) {
    //     if (this.sharedService.isArrayNotationValid(absolutePredecessor.notation)) {
    //       console.log('notation is valid');
    //       tempMoves.push({
    //         notation: {
    //           x: direction * x,
    //           y: 0,
    //         },
    //         predecessor: this.notationService.arrayToChessNotation(absolutePredecessor.notation),
    //       });
    //     }
    //   }
    // }

    moves.push(...tempMoves);
    tempMoves.length = 0;

    const absoluteMoves = moves.map((move) => this.sharedService.localMoveToAbsoluteMove(square, move)).filter((move): move is IntermediaryMove => move !== null);
    console.log(absoluteMoves, 'moves');

    return absoluteMoves;
  }
}
