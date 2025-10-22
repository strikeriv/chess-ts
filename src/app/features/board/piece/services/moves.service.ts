import { Injectable } from '@angular/core';
import { Board, BoardTile } from '../../interfaces/board.interface';
import { PieceColor, PieceType } from '../../models/pieces/piece.model';
import { NotationService } from '../../services/notation/notation.service';
import { IntermediaryMove, Move, MoveType, MovingPiece } from './interfaces/moves.interface';
import { PawnService } from './piece-moves/pawn.service';
import { KnightService } from './piece-moves/knight.service';
import { RookService } from './piece-moves/rook.service';

@Injectable()
export class MovesService {
  constructor(
    private readonly notationService: NotationService,

    private readonly knightService: KnightService,
    private readonly rookService: RookService,
    private readonly pawnService: PawnService,
  ) {}

  calculateMovesForPiece(board: BoardTile[][], tile: BoardTile): Move[] {
    const piece = tile.piece!;

    const { color, type } = piece;

    const movingPiece: MovingPiece = {
      direction: color === PieceColor.WHITE ? -1 : 1,
      square: tile.square,
    };

    const moves: IntermediaryMove[] = [];

    if (type === PieceType.PAWN) {
      moves.push(...this.pawnService.calculateMoves(movingPiece));
    } else if (type === PieceType.KNIGHT) {
      moves.push(...this.knightService.calculateMoves(movingPiece));
    } else if (type === PieceType.ROOK) {
      moves.push(...this.rookService.calculateMoves(movingPiece));
    }

    return this.calculateValidMoves(board, moves, tile);
  }

  private calculateValidMoves(board: BoardTile[][], moves: IntermediaryMove[], movingTile: BoardTile): Move[] {
    const validMoves: Move[] = [];

    for (const move of moves) {
      // we check the pieces on the tiles
      const validMove = this.isMoveValid(board, validMoves, move, movingTile);
      if (validMove) {
        validMoves.push(validMove);
      }
    }

    return validMoves;
  }

  private isMoveValid(board: BoardTile[][], validMoves: Move[], move: IntermediaryMove, movingTile: BoardTile): Move | undefined {
    const { notation, type: predefinedType, predecessor } = move;
    const { x, y } = notation;

    // if there is a predecessor, check for that and make sure it's valid
    if (predecessor) {
      if (!validMoves.some((move) => move.square === predecessor)) {
        console.log(move, 'move is not valid since predecessor is invalid');
        return; // pass, since the predecessor is not valid
      }
    }

    // if the move is pre-defined, directly run the logic
    if (predefinedType) {
      if (predefinedType === MoveType.CAPTURE) {
        if (this.isCaptureMoveValid(board, validMoves, move, movingTile)) {
          return this.intermediaryMoveToMove(move, MoveType.CAPTURE);
        }
      } else if (this.isNormalMoveValid(board, validMoves, move)) {
        return this.intermediaryMoveToMove(move, MoveType.NORMAL);
      }

      return;
    }

    // otherwise, figure out what move it is
    const tile = board[x][y];

    // check if capture
    if (tile.piece) {
      console.log(tile.square, 'tile for current move');
      console.log(move, movingTile.piece!.color, 'move and color');
      if (this.isCaptureMoveValid(board, validMoves, move, movingTile)) {
        return this.intermediaryMoveToMove(move, MoveType.CAPTURE);
      }
    } else if (this.isNormalMoveValid(board, validMoves, move)) {
      return this.intermediaryMoveToMove(move, MoveType.NORMAL);
    }

    return;
  }

  private isNormalMoveValid(board: BoardTile[][], validMoves: Move[], move: IntermediaryMove): boolean {
    const { notation, predecessor } = move;
    const { x, y } = notation;

    const tile = board[x][y];

    if (this.isTileMoveValid(tile)) {
      // move is valid!
      // but.. we need to check for starting move that can do 2

      if (predecessor) {
        // check the preceding move!
        if (validMoves.some((move) => move.square === predecessor)) {
          return true;
        }
      } else {
        return true;
      }
    }

    return false;
  }

  private isCaptureMoveValid(board: BoardTile[][], validMoves: Move[], move: IntermediaryMove, movingTile: BoardTile): boolean {
    const { notation, predecessor } = move;
    const { x, y } = notation;

    const tile = board[x][y];

    // check the predecessor
    // if the prev. move is a capture, and valid, you can't capture multiple in a row
    console.log(tile.square, 'square capture move');
    if (predecessor) {
      // check if predecessor is valid move
      const predecessorValid = this.isMoveValid(board, validMoves, move, movingTile);
      if (!predecessorValid) {
        return false;
      }
    }

    if (tile.piece) {
      return tile.piece.color != movingTile.piece!.color;
    }

    return false;
  }

  // check to see if tile is occupied
  private isTileMoveValid(tile: BoardTile): boolean {
    return !tile.piece;
  }

  // intermediary move to move
  private intermediaryMoveToMove(move: IntermediaryMove, type: MoveType): Move {
    const { notation } = move;

    return {
      square: this.notationService.arrayToChessNotation(notation),
      type,
    };
  }
}
