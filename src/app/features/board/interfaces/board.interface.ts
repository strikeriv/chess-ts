import { Piece } from '../models/pieces/piece.model';
import { ChessSquare } from '../services/notation/models/notation.model';

export type Board = BoardTile[][];

export type BoardSetup = Piece[][];

export type BoardTile = {
  id: number;
  square: ChessSquare;
  color: TileColor;
  piece?: Piece;
};

export enum TileColor {
  LIGHT = 'bg-orange-300',
  DARK = 'bg-yellow-800',
}
