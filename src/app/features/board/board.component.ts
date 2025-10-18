import { CommonModule } from '@angular/common';
import { Component, signal, WritableSignal } from '@angular/core';
import { Board, BoardTile } from './interfaces/board.interface';
import { PieceComponent } from './piece/piece.component';
import { BoardService } from './services/board.service';
import { ChessSquare } from './services/notation/models/notation.model';
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
  board: WritableSignal<Board>;

  constructor(
    private readonly notationService: NotationService,
    private readonly boardService: BoardService,
  ) {
    const initialBoard = this.boardService.constructBoard();

    this.board = signal(initialBoard);
  }

  onPieceSelected(tile: BoardTile) {
    // update the tile color to be selected
    const newBoard = [...this.board().tiles];

    const { x, y } = this.notationService.chessToArrayNotation(tile.square);

    console.log(x, y);
    newBoard[x][y].selected = true;

    this.board.set({
      ...this.board(),
      tiles: newBoard,
    });
  }

  movePieceOnBoard(square: ChessSquare) {
    const arrayNotation = this.notationService.chessToArrayNotation(square);

    console.log(arrayNotation);
  }

  // private deselectAllPieces(): void {
  //   for (let rank of this.board()) {
  //     for (let tile of rank) {
  //       tile.selected = false;
  //     }
  //   }
  // }
}
