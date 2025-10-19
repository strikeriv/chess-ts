import { Injectable } from '@angular/core';
import { Board, BoardTile } from '../../interfaces/board.interface';
import { PieceColor, PieceType } from '../../models/pieces/piece.model';
import { NotationService } from '../../services/notation/notation.service';
import { IntermediaryMove, Move, MoveType, MovingPiece } from './interfaces/moves.interface';
import { ChessSquare } from '../../services/notation/models/notation.model';

@Injectable()
export class MovesService {
  constructor(private readonly notationService: NotationService) {}

  calculateMovesForPiece(board: BoardTile[][], tile: BoardTile): Move[] {
    const piece = tile.piece!;

    const { color, type } = piece;

    const movingPiece: MovingPiece = {
      direction: color === PieceColor.WHITE ? 1 : -1,
      square: tile.square,
    };

    const moves: IntermediaryMove[] = [];

    if (type === PieceType.PAWN) {
      // calculate moves for a pawn!
      moves.push(...this.calculatePawnMoves(movingPiece));
    }

    return this.calculateValidMoves(board, moves, tile);
  }

  private calculatePawnMoves(piece: MovingPiece): IntermediaryMove[] {
    const { direction, square } = piece;
    const { x, y } = this.notationService.chessToArrayNotation(square);

    // array for valid moves
    const moves: IntermediaryMove[] = [
      {
        x: direction * 1,
        y: 0,
        type: MoveType.MOVE,
      }, // one step forward in correct direction for pawn
    ];

    // array for valid captures
    // is cleaned for only valid ones later
    const captures: IntermediaryMove[] = [
      {
        x: direction * 1,
        y: direction * 1,
        type: MoveType.CAPTURE,
      }, // left capture
      {
        x: direction * 1,
        y: direction * -1,
        type: MoveType.CAPTURE,
      }, // right capture

      // en passant moves
      {
        x: direction * 2,
        y: direction * -1,
        type: MoveType.CAPTURE,
      },
      {
        x: direction * 2,
        y: direction * 1,
        type: MoveType.CAPTURE,
      },
    ];

    // check to see if we are doing our first move. if so, allow  two spaces forward
    // only allowed on starting squares
    if (x === 1 || x === 6) {
      const { x: pX, y: pY } = this.moveToAbsolute(square, moves[0]);

      moves.push({
        x: direction * 2,
        y: 0,
        type: MoveType.MOVE,
        predecessor: this.notationService.arrayToChessNotation(pX, pY),
      });
    }

    const absoluteMoves = [...moves, ...captures].map((move) => {
      const { x: mX, y: mY } = move;
      return {
        ...move,
        x: x + mX,
        y: y + mY,
      };
    });

    console.log(absoluteMoves, 'yo');
    return absoluteMoves;
  }

  private calculateValidMoves(board: BoardTile[][], moves: IntermediaryMove[], movingTile: BoardTile): Move[] {
    const validMoves: Move[] = [];

    for (const move of moves) {
      // we check the pieces on the tiles
      const { x, y, type, predecessor } = move;

      const tile = board[x][y];

      if (type === MoveType.MOVE) {
        // cannot move if a piece is present already
        if (this.isTileMoveValid(tile)) {
          // move is valid!
          // but.. we need to check for starting move that can do 2

          if (predecessor) {
            // check the preceding move!
            const { x: pX, y: pY } = this.notationService.chessToArrayNotation(predecessor);

            const tile = board[pY][pX];

            // only push as long as preceding move is valid
            if (this.isTileMoveValid(tile)) {
              validMoves.push(this.intermediaryToMove(move));
            }
          }

          validMoves.push(this.intermediaryToMove(move));

          continue;
        }
      }

      // move is a capture
      // can only capture if piece is opposite color, and when a piece exists
      if (tile.piece) {
        const color = tile.piece.color;

        if (color != movingTile.piece!.color) {
          validMoves.push(this.intermediaryToMove(move));
        }
      }
    }

    console.log(validMoves, 'moves');
    return validMoves;
  }

  // convert a move to it's absolute move based on tile
  private moveToAbsolute(square: ChessSquare, move: IntermediaryMove): IntermediaryMove {
    const { x, y } = this.notationService.chessToArrayNotation(square);
    const { x: mX, y: mY } = move;

    return {
      ...move,
      x: x + mX,
      y: y + mY,
    };
  }

  // check to see if tile is occupied
  private isTileMoveValid(tile: BoardTile): boolean {
    return !tile.piece;
  }

  // intermediary move to move
  private intermediaryToMove(move: IntermediaryMove): Move {
    const { x, y, type } = move;

    return {
      square: this.notationService.arrayToChessNotation(x, y),
      type,
    };
  }
}
