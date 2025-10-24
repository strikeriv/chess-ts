import { Injectable } from '@angular/core';
import { ComponentStore } from '@ngrx/component-store';
import { BoardTile, BoardTurn } from '../interfaces/board.interface';
import { BoardService } from '../services/board.service';
import { BoardState, initialBoardState } from './interfaces/board-store.interface';
import { ChessSquare } from '../services/notation/models/notation.model';
import { Move } from '../piece/services/interfaces/moves.interface';

@Injectable() // Must be injectable
export class BoardStore extends ComponentStore<BoardState> {
  constructor(private readonly boardService: BoardService) {
    // set up initial board
    super(initialBoardState);

    // then load board
    this.updateBoard(this.boardService.constructBoard());
  }

  // set up readers
  readonly board$ = this.select((state) => state.board);
  readonly tiles$ = this.select((state) => state.board.tiles);
  readonly turn$ = this.select((state) => state.currentTurn);

  readonly validMoves$ = this.select((state) => state.validMoves);

  getTiles(): BoardTile[][] {
    return this.get().board.tiles;
  }

  getTurn(): BoardTurn {
    return this.get().currentTurn;
  }

  getSelectedTile(): BoardTile | undefined {
    return this.get().selectedTile;
  }

  getValidMoves(): Map<ChessSquare, Move[]> {
    return this.get().validMoves;
  }

  // setters
  readonly updateBoard = this.updater((state, newBoardTiles: BoardTile[][]) => ({
    ...state,
    board: {
      ...state.board,
      tiles: newBoardTiles,
    },
  }));

  readonly setCurrentTurn = this.updater((state, currentTurn: BoardTurn) => ({
    ...state,
    currentTurn,
  }));

  readonly setSelectedTile = this.updater((state, selectedTile: BoardTile | undefined) => ({
    ...state,
    selectedTile,
  }));

  readonly setValidMoves = this.updater((state, validMoves: Map<ChessSquare, Move[]>) => ({
    ...state,
    validMoves,
  }));

  readonly setHintedTiles = this.updater((state, hintedTiles: BoardTile[]) => ({
    ...state,
    hintedTiles,
  }));

  readonly setCapturedTiles = this.updater((state, capturedTiles: BoardTile[]) => ({
    ...state,
    capturedTiles,
  }));
}
