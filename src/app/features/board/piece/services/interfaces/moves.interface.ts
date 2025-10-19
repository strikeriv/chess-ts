import { ChessSquare } from '../../../services/notation/models/notation.model';

export interface MovingPiece {
  direction: number; // for board rotation, make sure it goes right way
  square: ChessSquare; // square so we can keep track where it is
}

export interface IntermediaryMove {
  x: number;
  y: number;
  type: MoveType;
  predecessor?: ChessSquare; // used to make sure previous square is valid
}

export enum MoveType {
  MOVE,
  CAPTURE,
}

export type Move = {
  square: ChessSquare;
  type: MoveType;
};
