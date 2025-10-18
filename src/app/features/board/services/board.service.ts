import { Injectable } from '@angular/core';
import { Board, BoardTile, TileColor } from '../interfaces/board.interface';
import { NotationService } from './notation/notation.service';
import { ChessSquare } from './notation/models/notation.model';
import { BaseBoard } from '../models/board.model';
import { Piece } from '../models/pieces/piece.model';

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
      const square = this.calculateTileSquare(x, y);

      return {
        id: (x ?? 0) * (y ?? 1),
        selected: false,
        square: this.calculateTileSquare(x, y),
        color: this.calculateTileColor(x, y),
        piece: this.calculateTilePiece(square),
      };
    });
  }

  private calculateTileColor(x: number, y: number): TileColor {
    const isDark = (x + y) % 2 !== 0;
    return isDark ? TileColor.DARK : TileColor.LIGHT;
  }

  private calculateTileSquare(x: number, y: number): ChessSquare {
    return this.notationService.arrayToChessNotation(x, y);
  }

  private calculateTilePiece(square: ChessSquare): Piece | undefined {
    return BaseBoard[square];
  }
}
