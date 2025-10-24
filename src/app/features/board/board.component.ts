import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { BoardRotation, BoardTile, BoardTurn, TextColor, TileColor } from './interfaces/board.interface';
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
import { Subject, takeUntil } from 'rxjs';
import { CheckService } from './services/check.service';
import { SoundService } from './services/sound.service';
import { Sounds } from './interfaces/sound.interface';

@Component({
  selector: 'app-board',
  imports: [CommonModule, PieceComponent],
  providers: [BishopService, BoardService, BoardStore, CheckService, KingService, KnightService, NotationService, MovesService, PawnService, QueenService, RookService, SharedService, SoundService],
  templateUrl: './board.component.html',
  styleUrl: './board.component.scss',
})
export class BoardComponent implements OnInit, OnDestroy {
  readonly tiles$ = this.boardStore.tiles$;
  readonly turn$ = this.boardStore.turn$;

  turnText = 'White';
  boardRotation = BoardRotation.NORMAL;

  private readonly destroySubscriptions$ = new Subject<void>();

  constructor(
    private readonly notationService: NotationService,
    private readonly soundService: SoundService,
    private readonly movesService: MovesService,
    private readonly checkService: CheckService,
    private readonly boardStore: BoardStore,
  ) {
    this.boardStore.setValidMoves(this.movesService.calculateAllMoves());
  }

  ngOnInit(): void {
    this.turn$.pipe(takeUntil(this.destroySubscriptions$)).subscribe((currentTurn) => {
      this.turnText = currentTurn === BoardTurn.WHITE ? 'White' : 'Black';
    });
  }

  ngOnDestroy(): void {
    this.destroySubscriptions$.next();
    this.destroySubscriptions$.complete();
  }

  onTileSelected(tile: BoardTile) {
    const { isHint, isCapture } = tile;

    if (isHint) {
      this.movePieceToTile(tile);
    } else if (isCapture) {
      this.capturePieceOnTile(tile);
    } else if (tile.piece) {
      this.onPieceSelected(tile);
    } else {
      // do nothing
      this.clearBoardFeatures();
      this.clearSelectedTile();
    }

    // if a capture or move was made, clear board features
    if (isHint || isCapture) {
      this.clearBoardFeatures();
      this.clearSelectedTile();

      // we also check for checks
      const inCheck = this.checkService.isInCheck();

      if (inCheck) {
        this.boardStore.setValidMoves(this.checkService.filterCheckingMoves());
      } else {
        this.boardStore.setValidMoves(this.movesService.calculateAllMoves());
      }
    }
  }

  private onPieceSelected(tile: BoardTile): void {
    const doShowFeatures = this.updateSelectedTile(tile);
    if (!doShowFeatures) return;

    const moves = this.boardStore.getValidMoves().get(tile.square) || [];
    for (const move of moves) {
      const { square, type, isCheckingMove } = move;
      const { x, y } = this.notationService.chessToArrayNotation(square);

      const moveTile = this.boardStore.getTiles()[x][y];

      if (isCheckingMove) {
        continue;
      }

      if (type === MoveType.NORMAL) {
        moveTile.isHint = true;
      } else if (type === MoveType.CAPTURE) {
        // if (moveTile.isGuarded) {
        //   // check if opposing piece
        //   if (moveTile.piece!.color === tile.piece!.color) {
        //     continue;
        //   }
        // }

        // if (moveTile.color !== tile.color) {
        //   moveTile.isCapture = true;
        //   capturedTiles.push(moveTile);
        // }

        moveTile.isCapture = true;
      }

      console.log(moveTile, 'tile that has been updated');
    }
  }

  private capturePieceOnTile(tile: BoardTile) {
    // player wants to capture piece on the square
    // update the piece for the tile we are moving
    console.log('capturing');
    const selectedTile = { ...this.boardStore.getSelectedTile()! }; // a tile is selected if there are hints on the board

    const { x: oX, y: oY } = this.notationService.chessToArrayNotation(selectedTile.square);
    const { x: nX, y: nY } = this.notationService.chessToArrayNotation(tile.square);

    // remove piece from board
    this.boardStore.getTiles()[oX][oY].piece = undefined;

    // replace piece in correct spot
    const newTile = this.boardStore.getTiles()[nX][nY];
    newTile.piece = selectedTile.piece;

    // update variables to keep state
    newTile.isHint = false;
    newTile.isGuarded = false;

    this.updateTurn();

    this.soundService.playSound(Sounds.CAPTURE);

    // clear selected tile
    this.clearSelectedTile();
  }

  private movePieceToTile(tile: BoardTile): void {
    // player wants to move to this square
    // update the piece for the tile we are moving
    const selectedTile = { ...this.boardStore.getSelectedTile()! }; // a tile is selected if there are hints on the board

    const { x: oX, y: oY } = this.notationService.chessToArrayNotation(selectedTile.square);
    const { x: nX, y: nY } = this.notationService.chessToArrayNotation(tile.square);

    // remove piece from board
    this.boardStore.getTiles()[oX][oY].piece = undefined;

    // replace piece in correct spot
    this.boardStore.getTiles()[nX][nY].piece = selectedTile.piece;

    // update variables to keep state
    this.boardStore.getTiles()[nX][nY].isCapture = false;

    this.updateTurn();

    this.soundService.playSound(Sounds.MOVE);

    // clear selected tile
    this.clearSelectedTile();
  }

  private updateTurn(): void {
    const currentTurn = this.boardStore.getTurn();
    const newTurn = currentTurn === BoardTurn.WHITE ? BoardTurn.BLACK : BoardTurn.WHITE;

    this.boardStore.setCurrentTurn(newTurn);
  }

  private clearBoardFeatures() {
    for (let rank of this.boardStore.getTiles()) {
      for (let tile of rank) {
        tile.isHint = false;
        tile.isCapture = false;
        tile.isGuarded = false;
      }
    }
  }

  private updateSelectedTile(tile: BoardTile): boolean {
    const currentlySelectedTile = this.boardStore.getSelectedTile();
    if (currentlySelectedTile) {
      this.clearSelectedTile();

      // handle the edge case where the same tile is selected
      if (currentlySelectedTile.square === tile.square) return false;
    }

    // otherwise, no tile is selected
    this.selectTile(tile);

    // check if the tile has a piece of the current turn
    const currentTurn = this.boardStore.getTurn();
    if ((tile.piece?.color as unknown as BoardTurn) !== currentTurn) {
      return false;
    }

    return true;
  }

  private selectTile(tile: BoardTile) {
    // make sure no other tile is selected
    this.clearSelectedTile();

    tile.isSelected = true;
    this.boardStore.setSelectedTile(tile);
  }

  private clearSelectedTile() {
    const selectedTile = this.boardStore.getSelectedTile();
    if (selectedTile) {
      selectedTile.isSelected = false;
      this.boardStore.setSelectedTile(undefined);
    }
  }

  // misc stuff for board
  getTextColorClass(tile: BoardTile): string {
    return tile.color === TileColor.LIGHT ? TextColor.LIGHT : TextColor.DARK;
  }

  indexToFile(index: number): string {
    return String.fromCodePoint('a'.codePointAt(0)! + index);
  }

  indexToRank(index: number): string {
    return String.fromCodePoint('8'.codePointAt(0)! - index);
  }
}
