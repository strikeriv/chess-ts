import { Injectable } from '@angular/core';
import { BoardStore } from '../store/board.store';
import { BoardTile, BoardTurn } from '../interfaces/board.interface';
import { PieceColor, PieceType } from '../models/pieces/piece.model';
import { MovesService } from '../piece/services/moves.service';
import { Move } from '../piece/services/interfaces/moves.interface';
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
  // basically, filters moves that do not resolve the check
  filterCheckingMoves(): Map<string, Move[]> {
    const kingTile = this.findKingPosition();
    const validMoves = new Map<string, Move[]>();

    // first, detetmine the squares that are putting the king in check
    const checkingPieces = this.determineCheckingPieces();
    console.log(checkingPieces, 'checking pieces');

    return validMoves;
  }

  private determineCheckingPieces(): Map<ChessSquare, BoardTile[]> {
    // loop through moves, find those that target the king's square

    // square of piece putting king in check, and moves that target it
    // for instance, bishop putting king in check, all diagonal moves to block/capture it
    const kingTile = this.findKingPosition();
    const checkingPieces = new Map<ChessSquare, BoardTile[]>();

    this.opponentMoves.forEach((moves, square) => {
      // console.log(moves, square, 'moves per square');
      if (moves.some((move) => move.square === kingTile.square)) {
        // this piece sees the king, get moves for square
        // will exist, since it sees king & will have valid moves since it moved there
        const movesForPiece = this.opponentMoves.get(square)!;
        console.log(movesForPiece, 'moves for piece');
        // const tile =

        // if (tile) {
        //   checkingPieces.set(square as ChessSquare, [tile]);
        // }
      }
    });

    return checkingPieces;
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
