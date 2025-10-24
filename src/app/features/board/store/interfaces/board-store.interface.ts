import { Board, BoardRotation, BoardTile, BoardTurn } from '../../interfaces/board.interface';
import { Move } from '../../piece/services/interfaces/moves.interface';
import { ChessSquare } from '../../services/notation/models/notation.model';

export interface BoardState {
  board: Board;
  currentTurn: BoardTurn;

  selectedTile?: BoardTile; // currently selected tile

  validMoves: Map<ChessSquare, Move[]>; // square -> list of valid moves for that square
  checkingSquares: ChessSquare[]; // squares that are putting the king in check

  hintedTiles: BoardTile[]; // tiles that are currently hinted
  capturedTiles: BoardTile[]; // tiles that are currently capturable
}

export const initialBoardState: BoardState = {
  board: {
    tiles: [], // generated on runtime
    rotation: BoardRotation.NORMAL,
  },
  currentTurn: BoardTurn.WHITE, // white always goes first

  selectedTile: undefined,
  validMoves: new Map(), // empty map, since no moves are valid
  checkingSquares: [],

  hintedTiles: [],
  capturedTiles: [],
};
