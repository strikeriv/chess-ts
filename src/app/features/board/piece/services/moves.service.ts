import { Injectable } from '@angular/core';
import { Board, BoardTile } from '../../interfaces/board.interface';
import { PieceColor, PieceType } from '../../models/pieces/piece.model';
import { NotationService } from '../../services/notation/notation.service';
import { Move, MoveType, MovingPiece } from './interfaces/moves.interface';

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

    const moves: Move[] = [];

    if (type === PieceType.PAWN) {
      // calculate moves for a pawn!
      moves.push(...this.calculatePawnMoves(movingPiece));
    }

    return this.calculateValidMoves(board, moves, tile);
  }

  private calculatePawnMoves(piece: MovingPiece): Move[] {
    const { direction, square } = piece;
    const { x, y } = this.notationService.chessToArrayNotation(square);

    // array for valid moves
    const moves: number[][] = [
      [direction * 1, 0, MoveType.MOVE], // one step forward in correct direction for pawn
    ];

    // array for valid captures
    // is cleaned for only valid ones later
    const captures: number[][] = [
      [direction * 1, direction * 1, MoveType.CAPTURE], // left capture
      [direction * 1, direction * -1, MoveType.CAPTURE], // right capture
      // en passant moves
      [direction * 2, direction * -1, MoveType.CAPTURE], // left capture
      [direction * 2, direction * 1, MoveType.CAPTURE], // right capture
    ];

    // check to see if we are doing our first move. if so, allow  two spaces forward
    // only allowed on starting squares
    console.log(x, 'hmm');
    if (x === 1 || x === 6) {
      moves.push([direction * 2, 0, MoveType.MOVE]);
    }

    const absoluteMoves = [...moves, ...captures].map((move) => {
      const [moveX, moveY] = move;
      return [x + moveX, y + moveY, move[2]];
    });

    return absoluteMoves.map((move) => ({
      square: this.notationService.arrayToChessNotation(move[0], move[1]),
      type: move[2],
    }));
  }

  private calculateValidMoves(board: BoardTile[][], moves: Move[], movingTile: BoardTile): Move[] {
    const validMoves: Move[] = [];

    for (const move of moves) {
      // we check the pieces on the tiles
      const { square, type } = move;
      const { x, y } = this.notationService.chessToArrayNotation(square);

      const tile = board[x][y];

      if (type === MoveType.MOVE) {
        // cannot move if a piece is present already
        if (!tile.piece) {
          // move is valid!
          validMoves.push(move);
        }

        continue;
      }

      // move is a capture
      // can only capture if piece is opposite color, and when a piece exists
      if (tile.piece) {
        const color = tile.piece.color;

        if (color != movingTile.piece!.color) {
          validMoves.push(move);
        }
      }
    }

    console.log(validMoves, 'moves');
    return validMoves;
  }
}
