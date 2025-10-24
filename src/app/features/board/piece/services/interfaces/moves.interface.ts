import { ArrayNotation } from '../../../services/notation/interfaces/notation.interface';
import { ChessSquare } from '../../../services/notation/models/notation.model';

export interface MovingPiece {
  direction: number; // for board rotation, make sure it goes right way
  square: ChessSquare; // square so we can keep track where it is
}

export interface IntermediaryMove {
  notation: ArrayNotation;
  type?: MoveType; // optional pre-defined move. mostly used for pawns

  origin: ChessSquare; // what square the move comes from
  predecessor?: ChessSquare; // used to make sure previous square is valid for the move

  isCheckingMove?: boolean;
}

export interface Direction {
  dx: number; // change in x (row)
  dy: number; // change in y (column)
}

export enum MoveType {
  NORMAL = 1,
  CAPTURE = 2,
}

export type Move = {
  square: ChessSquare;
  type: MoveType;

  origin: ChessSquare;
  predecessor?: ChessSquare;

  // used for check
  isCheckingMove?: boolean;
};
