import { Injectable } from '@angular/core';
import { ComponentStore } from '@ngrx/component-store';
import { BoardTile } from '../interfaces/board.interface';
import { BoardService } from '../services/board.service';
import { BoardState, initialBoardState } from './interfaces/board-store.interface';

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

  // setters
  readonly updateBoard = this.updater((state, newBoardTiles: BoardTile[][]) => ({
    ...state,
    board: {
      ...state.board,
      tiles: newBoardTiles,
    },
  }));
}
