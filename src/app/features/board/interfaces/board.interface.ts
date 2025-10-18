import { Piece } from '../models/pieces/piece.model';
import { ChessSquare } from '../services/notation/models/notation.model';

export type Board = {
  tiles: BoardTile[][];
  rotation: BoardRotation;
};

export enum BoardRotation {
  NORMAL,
  REVERSED,
}

export type BoardSetup = Piece[][];

export type BoardTile = {
  id: number;
  square: ChessSquare;
  color: TileColor;
  selected: boolean;
  piece?: Piece;
};

export enum TileColor {
  LIGHT = 'bg-orange-300',
  DARK = 'bg-yellow-800',
}
