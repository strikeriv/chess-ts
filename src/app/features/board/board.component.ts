import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { BoardRotation, BoardTile } from './interfaces/board.interface';
import { PieceComponent } from './piece/piece.component';
import { MoveType } from './piece/services/interfaces/moves.interface';
import { MovesService } from './piece/services/moves.service';
import { BishopService } from './piece/services/piece-moves/bishop.service';
import { KingService } from './piece/services/piece-moves/king.service';
import { KnightService } from './piece/services/piece-moves/knight.service';
import { PawnService } from './piece/services/piece-moves/pawn.service';
import { QueenService } from './piece/services/piece-moves/queen.service';
import { RookService } from './piece/services/piece-moves/rook.service';
import { SharedService } from './piece/services/piece-moves/shared.service';
import { BoardService } from './services/board.service';
import { NotationService } from './services/notation/notation.service';
import { BoardStore } from './store/board.store';

@Component({
  selector: 'app-board',
  imports: [CommonModule, PieceComponent],
  providers: [BishopService, BoardService, BoardStore, KingService, KnightService, NotationService, MovesService, PawnService, QueenService, RookService, SharedService],
  templateUrl: './board.component.html',
  styleUrl: './board.component.scss',
})
export class BoardComponent {
  readonly tiles$ = this.boardStore.tiles$;

  selectedTile: BoardTile | undefined = undefined;

  boardRotation = BoardRotation.NORMAL;

  constructor(
    private readonly notationService: NotationService,
    private readonly movesService: MovesService,
    private readonly boardStore: BoardStore,
  ) {}

  onTileSelected(tile: BoardTile) {
    this.clearBoardFeatures();

    const isHinted = this.boardStore.getHintedTiles().find((hT) => hT.square === tile.square);
    const isCapture = this.boardStore.getHintedTiles().find((cT) => cT.square === tile.square);

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
    // we need to calculate all valid moves
    this.boardStore.setValidMoves(this.movesService.calculateAllMoves());

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
    const hintedTiles: BoardTile[] = [];
    const capturedTiles: BoardTile[] = [];

    const moves = this.boardStore.getValidMoves().get(tile.square) || [];

    // for now, highlight the valid moves
    for (const move of moves) {
      const { square, type } = move;
      const { x, y } = this.notationService.chessToArrayNotation(square);

      const tile = this.boardStore.getTiles()[x][y];

      if (type === MoveType.NORMAL) {
        tile.isHint = true;
        hintedTiles.push(tile);
      } else if (type === MoveType.CAPTURE) {
        tile.isCapture = true;
        capturedTiles.push(tile);
      }
    }

    // update store
    this.boardStore.setHintedTiles(hintedTiles);
    this.boardStore.setCapturedTiles(capturedTiles);

    this.selectedTile = tile;
  }

  private capturePieceOnTile(tile: BoardTile) {
    // player wants to capture piece on the square
    // update the piece for the tile we are moving
    const selectedTile = { ...this.selectedTile! }; // a tile is selected if there are hints on the board

    const { x: oX, y: oY } = this.notationService.chessToArrayNotation(selectedTile.square);
    const { x: nX, y: nY } = this.notationService.chessToArrayNotation(tile.square);

    // remove piece from board
    this.boardStore.getTiles()[oX][oY].piece = undefined;

    // replace piece in correct spot
    this.boardStore.getTiles()[nX][nY].piece = selectedTile.piece;

    // update variables to keep state
    this.boardStore.getTiles()[nX][nY].isHint = false;

    // update store
    this.boardStore.setHintedTiles([]);
    this.boardStore.setCapturedTiles([]);

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
    this.boardStore.getTiles()[oX][oY].piece = undefined;

    // replace piece in correct spot
    this.boardStore.getTiles()[nX][nY].piece = selectedTile.piece;

    // update variables to keep state
    this.boardStore.getTiles()[nX][nY].isCapture = false;

    // update store
    this.boardStore.setHintedTiles([]);
    this.boardStore.setCapturedTiles([]);

    // deselect the tile
    this.clearHighlightedTile();
  }

  private clearBoardFeatures() {
    for (const tile of this.boardStore.getHintedTiles()) {
      tile.isHint = false;
    }

    for (const tile of this.boardStore.getCapturedTiles()) {
      tile.isCapture = false;
    }
  }

  private clearHighlightedTile() {
    this.selectedTile!.isSelected = false;
    this.selectedTile = undefined;
  }
}
