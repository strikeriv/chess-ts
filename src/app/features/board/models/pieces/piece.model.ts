export type Piece = {
  type: PieceType;
  color: PieceColor;
};

export enum PieceType {
  PAWN,
  ROOK,
  KNIGHT,
  BISHOP,
  KING,
  QUEEN,
}

export type test = PieceType.PAWN;

export enum PieceColor {
  WHITE,
  BLACK,
}
