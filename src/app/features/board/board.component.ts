import { CommonModule } from '@angular/common';
import { Component, signal, WritableSignal } from '@angular/core';
import { BoardRotation, BoardTile } from './interfaces/board.interface';
import { PieceComponent } from './piece/piece.component';
import { BoardService } from './services/board.service';
import { NotationService } from './services/notation/notation.service';

@Component({
  selector: 'app-board',
  standalone: true,
  imports: [CommonModule, PieceComponent],
  providers: [BoardService, NotationService],
  templateUrl: './board.component.html',
  styleUrl: './board.component.scss',
})
export class BoardComponent {
  tiles: WritableSignal<BoardTile[][]>;

  selectedTiles: BoardTile[] = [];
  boardRotation = BoardRotation.NORMAL;

  constructor(
    private readonly notationService: NotationService,
    private readonly boardService: BoardService,
  ) {
    const initialBoard = this.boardService.constructBoard();

    this.tiles = signal(initialBoard);
  }

  onPieceSelected(tile: BoardTile) {
    this.deselectSelectedTiles();

    if (tile.piece) {
      tile.selected = true;

      this.selectedTiles.push(tile);
    }
  }

  private deselectSelectedTiles() {
    for (const tile of this.selectedTiles) {
      tile.selected = false;
    }

    this.selectedTiles = [];
  }
}
