import { ChessSquare } from '../services/notation/models/notation.model';
import { BlackBishop, BlackKing, BlackKnight, BlackPawn, BlackQueen, BlackRook, Piece, WhiteBishop, WhiteKing, WhiteKnight, WhitePawn, WhiteQueen, WhiteRook } from './pieces/piece.model';

export const BaseBoard: Partial<Record<ChessSquare, Piece>> = {
  // white
  A1: WhiteRook,
  A2: WhiteKnight,
  A3: WhiteBishop,
  A4: WhiteKing,
  A5: WhiteQueen,
  A6: WhiteBishop,
  A7: WhiteKnight,
  A8: WhiteRook,
  B1: WhitePawn,
  B2: WhitePawn,
  B3: WhitePawn,
  B4: WhitePawn,
  B5: WhitePawn,
  B6: WhitePawn,
  B7: WhitePawn,
  B8: WhitePawn,

  // black
  H8: BlackRook,
  H7: BlackKnight,
  H6: BlackBishop,
  H5: BlackQueen,
  H4: BlackKing,
  H3: BlackBishop,
  H2: BlackKnight,
  H1: BlackRook,
  G8: BlackPawn,
  G7: BlackPawn,
  G6: BlackPawn,
  G5: BlackPawn,
  G4: BlackPawn,
  G3: BlackPawn,
  G2: BlackPawn,
  G1: BlackPawn,
};
