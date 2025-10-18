import { Injectable } from '@angular/core';
import { Board, BoardTile, TileColor } from '../interfaces/board.interface';
import { NotationService } from './notation/notation.service';
import { ChessSquare } from './notation/models/notation.model';

@Injectable()
export class BoardService {
  constructor(private readonly notationService: NotationService) {}

  constructBoard(): Board {
    return Array.from({ length: 8 }).map((_, i) => this.generateBoardRow(i));
  }

  private generateBoardRow(x: number): BoardTile[] {
    return Array.from({ length: 8 }).map((_, y) => ({
      id: (x ?? 0) * (y ?? 1),
      square: this.calculateTileSquare(x, y),
      color: this.calculateTileColor(x, y),
    }));
  }

  private calculateTileColor(x: number, y: number): TileColor {
    const isDark = (x + y) % 2 !== 0;
    return isDark ? TileColor.DARK : TileColor.LIGHT;
  }

  private calculateTileSquare(x: number, y: number): ChessSquare {
    return this.notationService.arrayToChessNotation(x, y);
  }
}
