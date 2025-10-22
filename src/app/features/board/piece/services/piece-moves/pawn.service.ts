import { Injectable } from '@angular/core';
import { MovingPiece, IntermediaryMove, MoveType } from '../interfaces/moves.interface';
import { NotationService } from '../../../services/notation/notation.service';
import { SharedService } from './shared.service';

const PAWN_FORWARD_MOVE = { dx: 1, dy: 0, type: MoveType.NORMAL };
const PAWN_CAPTURE_LEFT = { dx: 1, dy: 1, type: MoveType.CAPTURE };
const PAWN_CAPTURE_RIGHT = { dx: 1, dy: -1, type: MoveType.CAPTURE };
const PAWN_DOUBLE_STEP = { dx: 2, dy: 0, type: MoveType.NORMAL };

@Injectable()
export class PawnService {
  constructor(
    private readonly notationService: NotationService,
    private readonly sharedService: SharedService,
  ) {}

  calculateMoves(piece: MovingPiece): IntermediaryMove[] {
    const { direction, square } = piece;

    const startNotation = this.notationService.chessToArrayNotation(square);
    const isStartingRank = (direction === 1 && startNotation.x === 1) || (direction === -1 && startNotation.x === 6);

    const potentialMoves: IntermediaryMove[] = [];

    const oneStepMove: IntermediaryMove = {
      notation: {
        x: PAWN_FORWARD_MOVE.dx * direction,
        y: PAWN_FORWARD_MOVE.dy * direction,
      },
      type: PAWN_FORWARD_MOVE.type,
    };
    potentialMoves.push(oneStepMove);

    // check for two-step move from starting rank
    if (isStartingRank) {
      const absoluteOneStep = this.sharedService.localMoveToAbsoluteMove(square, oneStepMove);

      // as long as one step is valid, we can consider two-step
      if (absoluteOneStep) {
        const absolutePredecessorSquare = this.notationService.arrayToChessNotation(absoluteOneStep.notation);

        if (absolutePredecessorSquare) {
          const twoStepMove: IntermediaryMove = {
            notation: {
              x: PAWN_DOUBLE_STEP.dx * direction,
              y: PAWN_DOUBLE_STEP.dy * direction,
            },
            type: PAWN_DOUBLE_STEP.type,
            predecessor: absolutePredecessorSquare,
          };
          potentialMoves.push(twoStepMove);
        }
      }
    }

    // calculate captures now
    const captures = [PAWN_CAPTURE_LEFT, PAWN_CAPTURE_RIGHT].map((captureOffset) => ({
      notation: {
        x: captureOffset.dx * direction,
        y: captureOffset.dy * direction,
      },
      type: captureOffset.type,
    }));

    potentialMoves.push(...captures);

    const absoluteMoves = potentialMoves.map((localMove) => this.sharedService.localMoveToAbsoluteMove(square, localMove)).filter((move): move is IntermediaryMove => move !== null);

    return absoluteMoves;
  }
}
