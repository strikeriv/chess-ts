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
    const { x } = this.notationService.chessToArrayNotation(square);

    // array for valid moves
    const moves: IntermediaryMove[] = [
      {
        x: 0,
        y: direction * 1,
        type: MoveType.MOVE,
      }, // one step forward in correct direction for pawn
    ];

    // array for valid captures
    // is cleaned for only valid ones later
    const captures: IntermediaryMove[] = [
      // {
      //   x: direction * 1,
      //   y: direction * 1,
      //   type: MoveType.CAPTURE,
      // }, // left capture
      // {
      //   x: direction * 1,
      //   y: direction * -1,
      //   type: MoveType.CAPTURE,
      // }, // right capture
      // // en passant moves
      // {
      //   x: direction * 2,
      //   y: direction * -1,
      //   type: MoveType.CAPTURE,
      // },
      // {
      //   x: direction * 2,
      //   y: direction * 1,
      //   type: MoveType.CAPTURE,
      // },
    ];

    // check to see if we are doing our first move. if so, allow  two spaces forward
    // only allowed on starting squares
    // if (x === 1 || x === 6) {
    //   const { x: pX, y: pY } = this.localMoveToAbsoluteMove(square, moves[0]);
    //   console.log(moves[0], pX, pY, this.notationService.arrayToChessNotation(pX, pY), 'intermediaty');
    //   moves.push({
    //     x: direction * 2,
    //     y: 0,
    //     type: MoveType.MOVE,
    //     predecessor: this.notationService.arrayToChessNotation(pX, pY),
    //   });
    // }

    const absoluteMoves = [...moves, ...captures].map((move) => this.localMoveToAbsoluteMove(square, move));
    console.log(absoluteMoves, 'moves');
    return absoluteMoves;
  }

  private calculateValidMoves(board: BoardTile[][], moves: IntermediaryMove[], movingTile: BoardTile): Move[] {
    const validMoves: Move[] = [];

    console.log(moves, 'moves here');
    for (const move of moves) {
      // we check the pieces on the tiles
      const { x, y, type, predecessor } = move;

      const tile = board[x][y];

      if (type === MoveType.MOVE) {
        // cannot move if a piece is present already
        console.log(tile, 'tile');
        if (this.isTileMoveValid(tile)) {
          // move is valid!
          // but.. we need to check for starting move that can do 2

          if (predecessor) {
            // check the preceding move!
            console.log(move, 'has predecessor!');
            const { x: pX, y: pY } = this.notationService.chessToArrayNotation(predecessor);

            const tile = board[pX][pY];
            // only push as long as preceding move is valid
            if (this.isTileMoveValid(tile)) {
              validMoves.push(this.intermediaryMoveToMove(move));
            }
          }

          validMoves.push(this.intermediaryMoveToMove(move));

          continue;
        }
      }

      // move is a capture
      // can only capture if piece is opposite color, and when a piece exists
      if (tile.piece) {
        const color = tile.piece.color;

        if (color != movingTile.piece!.color) {
          validMoves.push(this.intermediaryMoveToMove(move));
        }
      }
    }

    console.log(validMoves, 'moves');
    return validMoves;
  }

  // convert a move to it's absolute move based on tile
  private localMoveToAbsoluteMove(square: ChessSquare, move: IntermediaryMove): IntermediaryMove {
    const { x, y } = this.notationService.chessToArrayNotation(square);
    console.log(x, y, square);
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
  private intermediaryMoveToMove(move: IntermediaryMove): Move {
    const { x, y, type } = move;

    return {
      square: this.notationService.arrayToChessNotation(x, y),
      type,
    };
  }
}
