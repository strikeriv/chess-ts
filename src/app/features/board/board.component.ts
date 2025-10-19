import { CommonModule } from '@angular/common';
import { Component, signal, WritableSignal } from '@angular/core';
import { BoardRotation, BoardTile } from './interfaces/board.interface';
import { PieceComponent } from './piece/piece.component';
import { BoardService } from './services/board.service';
import { NotationService } from './services/notation/notation.service';
import { MovesService } from './piece/services/moves.service';
import { MoveType } from './piece/services/interfaces/moves.interface';

@Component({
  selector: 'app-board',
  standalone: true,
  imports: [CommonModule, PieceComponent],
  providers: [BoardService, NotationService, MovesService],
  templateUrl: './board.component.html',
  styleUrl: './board.component.scss',
})
export class BoardComponent {
  tiles: WritableSignal<BoardTile[][]>;

  selectedTiles: BoardTile[] = [];
  capturedTiles: BoardTile[] = [];
  hintedTiles: BoardTile[] = [];

  boardRotation = BoardRotation.NORMAL;

  constructor(
    private readonly notationService: NotationService,
    private readonly movesService: MovesService,
    private readonly boardService: BoardService,
  ) {
    const initialBoard = this.boardService.constructBoard();

    // this.tiles = signal(
    //   this.boardService.rotateBoard({
    //     tiles: initialBoard,
    //     rotation: this.boardRotation,
    //   }),
    // );

    this.tiles = signal(initialBoard);

    console.log(this.tiles()[7][0], this.tiles()[6][4], this.tiles()[3][3], this.tiles()[4][6], 'tiles');
    console.log(this.notationService.chessToArrayNotation('A1'), this.notationService.arrayToChessNotation(7, 0), 'A1');
    console.log(this.notationService.chessToArrayNotation('E2'), this.notationService.arrayToChessNotation(6, 4), 'E2');
    console.log(this.notationService.chessToArrayNotation('D5'), this.notationService.arrayToChessNotation(3, 3), 'D5');
    console.log(this.notationService.chessToArrayNotation('G4'), this.notationService.arrayToChessNotation(4, 6), 'G4');
  }

  onPieceSelected(tile: BoardTile) {
    this.clearBoard();

    if (tile.piece) {
      //tile.isSelected = true;

      console.log(tile, 'tile');
      // // calculate valid moves for selected piece
      const moves = this.movesService.calculateMovesForPiece(this.tiles(), tile);

      // // for now, highlight the valid moves
      // for (const move of moves) {
      //   const { square, type } = move;
      //   const { x, y } = this.notationService.chessToArrayNotation(square);
      //   console.log(x, y, square, 'for move');
      //   const tile = this.tiles()[x][y];

      //   if (type === MoveType.MOVE) {
      //     tile.isHint = true;
      //     this.hintedTiles.push(tile);
      //   } else if (type === MoveType.CAPTURE) {
      //     tile.isCapture = true;
      //     this.capturedTiles.push(tile);
      //   }
      // }

      // this.selectedTiles.push(tile);
    }
  }

  private clearBoard() {
    for (const tile of this.selectedTiles) {
      tile.isSelected = false;
    }

    for (const tile of this.hintedTiles) {
      tile.isHint = false;
    }

    for (const tile of this.capturedTiles) {
      tile.isCapture = false;
    }

    this.selectedTiles = [];
  }
}
