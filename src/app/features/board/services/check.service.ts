import { Injectable } from '@angular/core';
import { BoardTile, BoardTurn } from '../interfaces/board.interface';
import { PieceColor, PieceType } from '../models/pieces/piece.model';
import { Move } from '../piece/services/interfaces/moves.interface';
import { MovesService } from '../piece/services/moves.service';
import { BoardStore } from '../store/board.store';
import { ChessSquare } from './notation/models/notation.model';

@Injectable()
export class CheckService {
  turn: PieceColor = PieceColor.WHITE;
  opponentMoves: Map<string, Move[]> = new Map<string, Move[]>();

  constructor(
    private readonly movesService: MovesService,
    private readonly boardStore: BoardStore,
  ) {}

  // determines whether we are in check
  isInCheck(): boolean {
    // set turn
    this.turn = this.boardStore.getTurn() === BoardTurn.WHITE ? PieceColor.WHITE : PieceColor.BLACK;

    // first, grab the king that should be checked
    // if white just moved, king tile is black king
    const kingTile = this.findKingPosition();

    // calculate moves for all opponent pieces
    this.opponentMoves = this.turn === PieceColor.WHITE ? this.movesService.calculateAllBlackMoves() : this.movesService.calculateAllWhiteMoves();

    const seenSquares = Array.from(this.opponentMoves.values())
      .flat()
      .map((move) => move.square);

    // if the king's position is in the seen squares, it's check
    if (seenSquares.includes(kingTile.square)) {
      return true;
    }

    return false;
  }

  // finds and returns the tile of the king in check, or null if not in check
  findCheckedKingTile(): BoardTile | null {
    const kingTile = this.findKingPosition();
    const inCheck = this.isInCheck();

    return inCheck ? kingTile : null;
  }

  // returns a map of moves that takes the player out of check
  // piece on a square -> valid moves to get out of check
  // can involve capturing the checking piece, blocking the check, or moving the king
  filterCheckingMoves(): Map<ChessSquare, Move[]> {
    const kingTile = this.findKingPosition();
    const initialValidMoves = this.determineValidMoves();

    // initial valid moves only holds one-step moves to get out of check
    // we need to two final things: check if the piece is being defended.
    // if so, it can't be captured, otherwise allow king to capture.
    const validMovesWithKingCaptures = this.determineKingCaptures(initialValidMoves);

    // we also need to filer moves that can block the check, but make sure that moving that piece doesn't put the king in check again
    // if so, remove that move

    return validMovesWithKingCaptures;
  }

  // calculates the valid squares that piece(s) can move to
  // includes the piece that is checking the king, which is not normally allowed
  private determineValidMoves(): Map<ChessSquare, Move[]> {
    const kingTile = this.findKingPosition();
    const opponentMoves = kingTile.piece!.color === PieceColor.BLACK ? this.movesService.calculateAllBlackMoves() : this.movesService.calculateAllWhiteMoves();

    // we need to first determine the moves that are placing the king in check
    const checkingMoves = this.boardStore.getCheckingSquares().filter((square) => square !== kingTile.square); // can't capture king
    const checkingOrigins = new Set(this.movesService.checkingMoves.map((move) => move.origin));

    // filter out opponents moves for when they are in check
    const filteredMoves = new Map<ChessSquare, Move[]>();
    console.log(checkingOrigins, 'origins');
    Array.from(opponentMoves.entries()).forEach((movePair) => {
      const [moveSquare, moves] = movePair;

      for (const move of moves) {
        const { square } = move;

        // if king, king cannot move into check
        if (moveSquare === kingTile.square) {
          // pass current move if square is in check, since king cannot move into check
          if (checkingMoves.includes(square)) {
            console.log(moveSquare, kingTile, square, 'king move being considered');
            if (!checkingOrigins.has(square)) {
              continue;
            }
          }
        } else if (!checkingMoves.includes(square)) {
          // for any other piece, just make sure the move is capturing the checking piece
          continue;
        }

        const existing = filteredMoves.get(moveSquare);
        if (existing) {
          filteredMoves.set(moveSquare, [...existing, move]);
        } else {
          filteredMoves.set(moveSquare, [move]);
        }
      }
    });

    return filteredMoves;
  }

  private determineKingCaptures(moves: Map<ChessSquare, Move[]>): Map<ChessSquare, Move[]> {
    // to start, determine the moves available to the side who is placing in check
    const kingTile = this.findKingPosition();

    // filter our origino
    const checkingOrigins = new Set(this.movesService.checkingMoves.map((move) => move.origin));
    const checkingSideMoves = kingTile.piece!.color === PieceColor.BLACK ? this.movesService.calculateAllBlackMoves() : this.movesService.calculateAllWhiteMoves();

    // now, see if the checking side moves (side placing in check) are guarded
    // map contains guarded pieces that the king cannot capture
    const guardedSquares: Set<ChessSquare> = new Set<ChessSquare>();

    console.log(this.boardStore.getTiles());

    // now, filter out moves that capture guarded squares
    const updatedMoves = new Map<ChessSquare, Move[]>();

    // only remove moves for the king square that are in guarded squares.
    // other pieces can still capture guarded pieces to block check
    console.log(guardedSquares, 'squares that are guarded');
    moves.forEach((moveList, square) => {
      if (square === kingTile.square) {
        const filteredMoves = moveList.filter((move) => !guardedSquares.has(move.square));
        if (filteredMoves.length > 0) {
          updatedMoves.set(square, filteredMoves);
        }
      } else {
        updatedMoves.set(square, moveList);
      }
    });

    console.log(moves, 'moves before king capture logic');

    console.log(updatedMoves, 'moves after king capture logic');
    return updatedMoves;
  }

  private findKingPosition(): BoardTile {
    const tiles = this.boardStore.getTiles();

    const kingTile = tiles.flat().find((tile) => {
      return tile.piece?.type === PieceType.KING && tile.piece?.color === this.turn;
    });

    // always a king tile
    return kingTile as BoardTile;
  }
}
