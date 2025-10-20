import { Injectable } from '@angular/core';
import { BoardTile } from '../../interfaces/board.interface';
import { PieceColor, PieceType } from '../../models/pieces/piece.model';
import { NotationService } from '../../services/notation/notation.service';
import { IntermediaryMove, Move, MoveType, MovingPiece } from './interfaces/moves.interface';
import { PawnService } from './piece-moves/pawn.service';
import { KnightService } from './piece-moves/knight.service';

@Injectable()
export class MovesService {
  constructor(
    private readonly notationService: NotationService,

    private readonly knightService: KnightService,
    private readonly pawnSerive: PawnService,
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
      moves.push(...this.pawnSerive.calculateMoves(movingPiece));
    } else if (type === PieceType.KNIGHT) {
      moves.push(...this.knightService.calculateMoves(movingPiece));
    }

    return this.calculateValidMoves(board, moves, tile);
  }

  private calculateValidMoves(board: BoardTile[][], moves: IntermediaryMove[], movingTile: BoardTile): Move[] {
    const validMoves: Move[] = [];

    for (const move of moves) {
      // we check the pieces on the tiles
      const { notation, type: predefinedType } = move;
      const { x, y } = notation;

      // if the move is pre-defined, directly run the logic
      if (predefinedType) {
        if (predefinedType === MoveType.CAPTURE) {
          if (this.isCaptureMoveValid(board, move, movingTile.piece!.color)) {
            validMoves.push(this.intermediaryMoveToMove(move, MoveType.CAPTURE));
          }
        } else if (this.isNormalMoveValid(board, validMoves, move)) {
          validMoves.push(this.intermediaryMoveToMove(move, MoveType.NORMAL));
        }

        continue;
      }

      // otherwise, figure out what move it is
      const tile = board[x][y];

      // check if capture
      if (tile.piece) {
        if (this.isCaptureMoveValid(board, move, movingTile.piece!.color)) {
          validMoves.push(this.intermediaryMoveToMove(move, MoveType.CAPTURE));
        }
      } else if (this.isNormalMoveValid(board, validMoves, move)) {
        validMoves.push(this.intermediaryMoveToMove(move, MoveType.NORMAL));
      }
    }

    return validMoves;
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

  private isCaptureMoveValid(board: BoardTile[][], move: IntermediaryMove, color: PieceColor): boolean {
    const { notation } = move;
    const { x, y } = notation;

    const tile = board[x][y];

    if (tile.piece) {
      return tile.piece.color != color;
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
