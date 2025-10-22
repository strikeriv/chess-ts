import { Injectable } from '@angular/core';
import { BoardTile } from '../../interfaces/board.interface';
import { PieceColor, PieceType } from '../../models/pieces/piece.model';
import { NotationService } from '../../services/notation/notation.service';
import { BoardStore } from '../../store/board.store';
import { IntermediaryMove, Move, MoveType, MovingPiece } from './interfaces/moves.interface';
import { KnightService } from './piece-moves/knight.service';
import { PawnService } from './piece-moves/pawn.service';
import { RookService } from './piece-moves/rook.service';
import { BishopService } from './piece-moves/bishop.service';
import { QueenService } from './piece-moves/queen.service';

@Injectable()
export class MovesService {
  board: BoardTile[][];
  validMoves: Move[] = [];

  constructor(
    private readonly notationService: NotationService,
    private readonly boardStore: BoardStore,

    private readonly knightService: KnightService,
    private readonly bishopService: BishopService,
    private readonly queenService: QueenService,
    private readonly rookService: RookService,
    private readonly pawnService: PawnService,
  ) {
    this.board = this.boardStore.getTiles();
  }

  calculateMovesForPiece(tile: BoardTile): Move[] {
    // clear moves
    this.validMoves = [];

    const piece = tile.piece!;

    const { color, type } = piece;

    const movingPiece: MovingPiece = {
      direction: color === PieceColor.WHITE ? -1 : 1,
      square: tile.square,
    };

    const moves: IntermediaryMove[] = [];

    if (type === PieceType.PAWN) {
      moves.push(...this.pawnService.calculateMoves(movingPiece));
    } else if (type === PieceType.KNIGHT) {
      moves.push(...this.knightService.calculateMoves(movingPiece));
    } else if (type === PieceType.BISHOP) {
      moves.push(...this.bishopService.calculateMoves(movingPiece));
    } else if (type === PieceType.ROOK) {
      moves.push(...this.rookService.calculateMoves(movingPiece));
    } else if (type === PieceType.QUEEN) {
      // queen combines rook and bishop moves
      moves.push(...this.queenService.calculateMoves(movingPiece));
    }

    return this.calculateValidMoves(moves, tile);
  }

  private calculateValidMoves(moves: IntermediaryMove[], movingTile: BoardTile): Move[] {
    for (const move of moves) {
      // we check the pieces on the tiles
      const validMove = this.isMoveValid(move, movingTile);
      if (validMove) {
        this.validMoves.push(validMove);
      }
    }

    return this.validMoves;
  }

  private isMoveValid(move: IntermediaryMove, movingTile: BoardTile): Move | undefined {
    const { predecessor } = move;

    // if there is a predecessor, start by checking that for validity
    if (predecessor) {
      const validPredecessor = this.validMoves.find((move) => move.square === predecessor);
      if (!validPredecessor) {
        return;
      }

      // check the move type of the predecessor
      if (validPredecessor.type === MoveType.CAPTURE) {
        return; // cannot do two captures in a row
      }
    }

    // if the move is pre-defined, directly run the logic
    const moveType = this.determineMoveType(move);
    if (moveType === MoveType.CAPTURE) {
      if (this.isCaptureMoveValid(move, movingTile)) {
        return this.intermediaryMoveToMove(move, MoveType.CAPTURE);
      } else {
        return;
      }
    } else if (this.isNormalMoveValid(move)) {
      return this.intermediaryMoveToMove(move, MoveType.NORMAL);
    } else {
      return;
    }
  }

  private isNormalMoveValid(move: IntermediaryMove): boolean {
    const { notation, predecessor } = move;
    const { x, y } = notation;

    const tile = this.board[x][y];

    if (this.isTileMoveValid(tile)) {
      // move is valid!
      // but.. we need to check for starting move that can do 2

      if (predecessor) {
        // check the preceding move!
        if (this.validMoves.some((move) => move.square === predecessor)) {
          return true;
        }
      } else {
        return true;
      }
    }

    return false;
  }

  private isCaptureMoveValid(move: IntermediaryMove, movingTile: BoardTile): boolean {
    const { notation, predecessor } = move;
    const { x, y } = notation;

    const tile = this.board[x][y];

    // check the predecessor
    // if the prev. move is a capture, and valid, you can't capture multiple in a row
    if (predecessor) {
      // check if predecessor is valid move
      const predecessorMove: IntermediaryMove = {
        notation: this.notationService.chessToArrayNotation(predecessor),
      };

      const predecessorValid = this.isMoveValid(predecessorMove, movingTile);
      if (!predecessorValid) {
        return false;
      }
    }

    if (tile.piece) {
      return tile.piece.color != movingTile.piece!.color;
    }

    return false;
  }

  // determines the move type
  private determineMoveType(move: IntermediaryMove): MoveType {
    // some moves are statically set (pawn captures), so just return their type
    const { x, y } = move.notation;

    if (move.type) {
      return move.type;
    }

    const tile = this.board[x][y];
    if (tile.piece) {
      return MoveType.CAPTURE;
    } else {
      return MoveType.NORMAL;
    }
  }

  // check to see if tile is occupied
  private isTileMoveValid(tile: BoardTile): boolean {
    return !tile.piece;
  }

  // intermediary move to move
  private intermediaryMoveToMove(move: IntermediaryMove, type: MoveType): Move {
    const { notation } = move;

    return {
      square: this.notationService.arrayToChessNotation(notation),
      type,
    };
  }
}
