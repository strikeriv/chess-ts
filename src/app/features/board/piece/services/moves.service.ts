import { Injectable } from '@angular/core';
import { BoardTile } from '../../interfaces/board.interface';
import { PieceColor, PieceType } from '../../models/pieces/piece.model';
import { ArrayNotation } from '../../services/notation/interfaces/notation.interface';
import { ChessSquare } from '../../services/notation/models/notation.model';
import { NotationService } from '../../services/notation/notation.service';
import { IntermediaryMove, Move, MoveType, MovingPiece } from './interfaces/moves.interface';

@Injectable()
export class MovesService {
  constructor(private readonly notationService: NotationService) {}

  calculateMovesForPiece(board: BoardTile[][], tile: BoardTile): Move[] {
    const piece = tile.piece!;

    const { color, type } = piece;

    const movingPiece: MovingPiece = {
      direction: color === PieceColor.WHITE ? -1 : 1,
      square: tile.square,
    };

    const moves: IntermediaryMove[] = [];

    if (type === PieceType.PAWN) {
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
        notation: {
          x: direction * 1,
          y: 0,
        },
        type: MoveType.MOVE,
      }, // one step forward in correct direction for pawn
    ];

    // array for valid captures
    // is cleaned for only valid ones later
    const captures: IntermediaryMove[] = [
      {
        notation: { x: direction * 1, y: direction * 1 },
        type: MoveType.CAPTURE,
      }, // left capture
      {
        notation: { x: direction * 1, y: direction * -1 },
        type: MoveType.CAPTURE,
      }, // right capture

      // en passant moves, way too complicated for right now
      // {
      //   notation: { x: direction * 2, y: direction * -1 },
      //   type: MoveType.CAPTURE,
      // },
      // {
      //   notation: { x: direction * 2, y: direction * 1 },
      //   type: MoveType.CAPTURE,
      // },
    ];

    // check to see if we are doing our first move. if so, allow  two spaces forward
    // only allowed on starting squares
    if (x === 1 || x === 6) {
      const localNotation = this.localMoveToAbsoluteMove(square, moves[0])!; // will always be valid

      moves.push({
        notation: { x: direction * 2, y: 0 },
        type: MoveType.MOVE,
        predecessor: this.notationService.arrayToChessNotation(localNotation.notation),
      });
    }

    const absoluteMoves = [...moves, ...captures].map((move) => this.localMoveToAbsoluteMove(square, move)).filter((move): move is IntermediaryMove => move !== null);

    return absoluteMoves;
  }

  private calculateValidMoves(board: BoardTile[][], moves: IntermediaryMove[], movingTile: BoardTile): Move[] {
    const validMoves: Move[] = [];

    for (const move of moves) {
      // we check the pieces on the tiles
      const { notation, type, predecessor } = move;
      const { x, y } = notation;

      const tile = board[x][y];

      if (type === MoveType.MOVE) {
        // cannot move if a piece is present already
        if (this.isTileMoveValid(tile)) {
          // move is valid!
          // but.. we need to check for starting move that can do 2

          if (predecessor) {
            // check the preceding move!
            const { x: pX, y: pY } = this.notationService.chessToArrayNotation(predecessor);

            const tile = board[pX][pY];

            // only push as long as preceding move is valid
            if (this.isTileMoveValid(tile)) {
              validMoves.push(this.intermediaryMoveToMove(move));
            }
          } else {
            validMoves.push(this.intermediaryMoveToMove(move));
          }
        }

        continue;
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

    return validMoves;
  }

  // convert a move to it's absolute move based on tile
  // returns null when move is out of bounds (off the board)
  private localMoveToAbsoluteMove(square: ChessSquare, move: IntermediaryMove): IntermediaryMove | null {
    const { notation, predecessor, type } = move;
    const { x: mX, y: mY } = notation;

    const { x, y } = this.notationService.chessToArrayNotation(square);
    const absoluteNotation: ArrayNotation = {
      x: x + mX,
      y: y + mY,
    };

    if (this.isArrayNotationValid(absoluteNotation)) {
      return {
        type,
        notation: absoluteNotation,
        predecessor,
      };
    } else {
      return null;
    }
  }

  // checks to see if move is within board bounds
  private isArrayNotationValid(notation: ArrayNotation): boolean {
    try {
      this.notationService.arrayToChessNotation(notation);

      return true;
    } catch {
      return false;
    }
  }

  // check to see if tile is occupied
  private isTileMoveValid(tile: BoardTile): boolean {
    return !tile.piece;
  }

  // intermediary move to move
  private intermediaryMoveToMove(move: IntermediaryMove): Move {
    const { notation, type } = move;

    return {
      square: this.notationService.arrayToChessNotation(notation),
      type,
    };
  }
}
