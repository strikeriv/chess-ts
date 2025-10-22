import { CommonModule } from '@angular/common';
import { Component, signal, WritableSignal } from '@angular/core';
import { BoardRotation, BoardTile } from './interfaces/board.interface';
import { PieceComponent } from './piece/piece.component';
import { BoardService } from './services/board.service';
import { NotationService } from './services/notation/notation.service';
import { MovesService } from './piece/services/moves.service';
import { MoveType } from './piece/services/interfaces/moves.interface';
import { PawnService } from './piece/services/piece-moves/pawn.service';
import { SharedService } from './piece/services/piece-moves/shared.service';
import { KnightService } from './piece/services/piece-moves/knight.service';
import { RookService } from './piece/services/piece-moves/rook.service';

@Component({
  selector: 'app-board',
  imports: [CommonModule, PieceComponent],
  providers: [BoardService, KnightService, NotationService, MovesService, PawnService, RookService, SharedService],
  templateUrl: './board.component.html',
  styleUrl: './board.component.scss',
})
export class BoardComponent {
  tiles: WritableSignal<BoardTile[][]>;

  capturedTiles: BoardTile[] = [];
  hintedTiles: BoardTile[] = [];

  selectedTile: BoardTile | undefined = undefined;

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
  }

  onTileSelected(tile: BoardTile) {
    this.clearBoardFeatures();

    const isHinted = this.hintedTiles.find((hT) => hT.square === tile.square);
    const isCapture = this.capturedTiles.find((cT) => cT.square === tile.square);

    if (isHinted) {
      this.movePieceToTile(tile);
    } else if (isCapture) {
      this.capturePieceOnTile(tile);
    } else if (tile.piece) {
      this.onPieceSelected(tile);
    } else {
      // do nothing
      this.clearBoardFeatures();
    }
  }

  private onPieceSelected(tile: BoardTile): void {
    // TODO: there's a bug here when deselecting and selecting the same piece multiple tiles
    // fix at some time idk
    if (this.selectedTile) {
      if (this.selectedTile.square === tile.square) {
        // deselect the piece, since you clicked on the same one
        this.clearHighlightedTile();
      } else {
        this.clearHighlightedTile();

        tile.isSelected = true;
      }
    } else {
      tile.isSelected = true;
    }

    //calculate valid moves for selected piece
    // clear previous
    this.hintedTiles = [];
    this.capturedTiles = [];

    const moves = this.movesService.calculateMovesForPiece(this.tiles(), tile);

    // for now, highlight the valid moves
    for (const move of moves) {
      const { square, type } = move;
      const { x, y } = this.notationService.chessToArrayNotation(square);

      const tile = this.tiles()[x][y];

      if (type === MoveType.NORMAL) {
        tile.isHint = true;
        this.hintedTiles.push(tile);
      } else if (type === MoveType.CAPTURE) {
        tile.isCapture = true;
        this.capturedTiles.push(tile);
      }
    }

    this.selectedTile = tile;
  }

  private capturePieceOnTile(tile: BoardTile) {
    // player wants to capture piece on the square
    // update the piece for the tile we are moving
    const selectedTile = { ...this.selectedTile! }; // a tile is selected if there are hints on the board

    const { x: oX, y: oY } = this.notationService.chessToArrayNotation(selectedTile.square);
    const { x: nX, y: nY } = this.notationService.chessToArrayNotation(tile.square);

    // remove piece from board
    this.tiles()[oX][oY].piece = undefined;

    // replace piece in correct spot
    this.tiles()[nX][nY].piece = selectedTile.piece;

    // update variables to keep state
    this.tiles()[nX][nY].isHint = false;
    this.hintedTiles = [];
    this.capturedTiles = [];

    // deselect the tile
    this.clearHighlightedTile();
  }

  private movePieceToTile(tile: BoardTile): void {
    // player wants to move to this square
    // update the piece for the tile we are moving
    const selectedTile = { ...this.selectedTile! }; // a tile is selected if there are hints on the board

    const { x: oX, y: oY } = this.notationService.chessToArrayNotation(selectedTile.square);
    const { x: nX, y: nY } = this.notationService.chessToArrayNotation(tile.square);

    // remove piece from board
    this.tiles()[oX][oY].piece = undefined;

    // replace piece in correct spot
    this.tiles()[nX][nY].piece = selectedTile.piece;

    // update variables to keep state
    this.tiles()[nX][nY].isCapture = false;
    this.hintedTiles = [];
    this.capturedTiles = [];

    // deselect the tile
    this.clearHighlightedTile();
  }

  private clearBoardFeatures() {
    for (const tile of this.hintedTiles) {
      tile.isHint = false;
    }

    for (const tile of this.capturedTiles) {
      tile.isCapture = false;
    }
  }

  private clearHighlightedTile() {
    this.selectedTile!.isSelected = false;
    this.selectedTile = undefined;
  }
}
