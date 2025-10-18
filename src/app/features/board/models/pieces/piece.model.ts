export type Piece = {
  type: PieceType;
  color: PieceColor;
};

export enum PieceType {
  PAWN = 'p',
  ROOK = 'r',
  KNIGHT = 'n',
  BISHOP = 'b',
  KING = 'k',
  QUEEN = 'q',
}

export enum PieceColor {
  WHITE = 'w',
  BLACK = 'b',
}

// Define all of the piece objects

// Black pieces
export const WhitePawn: Piece = {
  type: PieceType.PAWN,
  color: PieceColor.WHITE,
};

export const WhiteRook: Piece = {
  type: PieceType.ROOK,
  color: PieceColor.WHITE,
};

export const WhiteKnight: Piece = {
  type: PieceType.KNIGHT,
  color: PieceColor.WHITE,
};

export const WhiteBishop: Piece = {
  type: PieceType.BISHOP,
  color: PieceColor.WHITE,
};

export const WhiteKing: Piece = {
  type: PieceType.KING,
  color: PieceColor.WHITE,
};

export const WhiteQueen: Piece = {
  type: PieceType.QUEEN,
  color: PieceColor.WHITE,
};

// Black pieces
export const BlackPawn: Piece = {
  type: PieceType.PAWN,
  color: PieceColor.BLACK,
};

export const BlackRook: Piece = {
  type: PieceType.ROOK,
  color: PieceColor.BLACK,
};

export const BlackKnight: Piece = {
  type: PieceType.KNIGHT,
  color: PieceColor.BLACK,
};

export const BlackBishop: Piece = {
  type: PieceType.BISHOP,
  color: PieceColor.BLACK,
};

export const BlackKing: Piece = {
  type: PieceType.KING,
  color: PieceColor.BLACK,
};

export const BlackQueen: Piece = {
  type: PieceType.QUEEN,
  color: PieceColor.BLACK,
};
