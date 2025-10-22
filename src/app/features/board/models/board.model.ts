import { ChessSquare } from '../services/notation/models/notation.model';
import { BlackBishop, BlackKing, BlackKnight, BlackPawn, BlackQueen, BlackRook, Piece, WhiteBishop, WhiteKing, WhiteKnight, WhitePawn, WhiteQueen, WhiteRook } from './pieces/piece.model';

export const BaseBoard: Partial<Record<ChessSquare, Piece>> = {
  // white
  A1: WhiteRook,
  B1: WhiteKnight,
  C1: WhiteBishop,
  D1: WhiteKing,
  E1: WhiteQueen,
  F1: WhiteBishop,
  G1: WhiteKnight,
  H1: WhiteRook,
  A2: WhitePawn,
  B2: WhitePawn,
  C2: WhitePawn,
  D2: WhitePawn,
  E2: WhitePawn,
  F2: WhitePawn,
  G2: WhitePawn,
  H2: WhitePawn,

  // E4: WhiteRook,

  // black
  A8: BlackRook,
  B8: BlackKnight,
  C8: BlackBishop,
  D8: BlackQueen,
  E8: BlackKing,
  F8: BlackBishop,
  G8: BlackKnight,
  H8: BlackRook,
  A7: BlackPawn,
  B7: BlackPawn,
  C7: BlackPawn,
  D7: BlackPawn,
  E7: BlackPawn,
  F7: BlackPawn,
  G7: BlackPawn,
  H7: BlackPawn,
};
