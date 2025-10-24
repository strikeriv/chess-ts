import { Injectable } from '@angular/core';
import { Board, BoardTile, TileColor } from '../interfaces/board.interface';
import { BaseBoard } from '../models/board.model';
import { Piece } from '../models/pieces/piece.model';
import { ArrayNotation } from './notation/interfaces/notation.interface';
import { ChessSquare } from './notation/models/notation.model';
import { NotationService } from './notation/notation.service';

@Injectable()
export class BoardService {
  constructor(private readonly notationService: NotationService) {}

  // constructs the base board
  constructBoard(): BoardTile[][] {
    return Array.from({ length: 8 }).map((_, i) => this.generateBoardRow(i));
  }

  // rotates the board, default setup is white on top, so rotate for white on bottom
  rotateBoard(board: Board): BoardTile[][] {
    const tiles = board.tiles;
    const n = tiles.length;

    const res = Array.from({ length: n }, () => new Array(n).fill(0));

    // Move mat[i][j] to mat[n-i-1][n-j-1]
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        res[i][j] = tiles[n - i - 1][n - j - 1];
      }
    }

    // Copy result back to original matrix
    for (let i = 0; i < n; i++) {
      tiles[i] = res[i].slice();
    }

    return res;
  }

  private generateBoardRow(x: number): BoardTile[] {
    return Array.from({ length: 8 }).map((_, y) => {
      const notation: ArrayNotation = { x, y };
      const square = this.calculateTileSquare(notation);

      return {
        id: x + y,
        square,
        color: this.calculateTileColor(notation),
        piece: this.calculateTilePiece(square),

        isGuarded: false,
        isInCheck: false,

        isSelected: false,
        isCapture: false,
        isHint: false,
      };
    });
  }

  private calculateTileColor(notation: ArrayNotation): TileColor {
    const { x, y } = notation;

    const isDark = (x + y) % 2 !== 0;
    return isDark ? TileColor.DARK : TileColor.LIGHT;
  }

  private calculateTileSquare(notation: ArrayNotation): ChessSquare {
    return this.notationService.arrayToChessNotation(notation);
  }

  private calculateTilePiece(square: ChessSquare): Piece | undefined {
    return BaseBoard[square];
  }
}
