import { Board, BoardRotation, BoardTile, TileColor } from '../../interfaces/board.interface';
import { Move } from '../../piece/services/interfaces/moves.interface';
import { ChessSquare } from '../../services/notation/models/notation.model';

export interface BoardState {
  board: Board;
  currentTurn: TileColor;
  validMoves: Map<ChessSquare, Move[]>; // square -> list of valid moves for that square

  hintedTiles: BoardTile[]; // tiles that are currently hinted
  capturedTiles: BoardTile[]; // tiles that are currently capturable
}

export const initialBoardState: BoardState = {
  board: {
    tiles: [], // generated on runtime
    rotation: BoardRotation.NORMAL,
  },
  currentTurn: TileColor.LIGHT, // white always goes first
  validMoves: new Map(), // empty map, since no moves are valid

  hintedTiles: [],
  capturedTiles: [],
};
