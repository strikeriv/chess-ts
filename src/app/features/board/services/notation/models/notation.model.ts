export const CHESS_FILES = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'] as const;
export const CHESS_RANKS = ['1', '2', '3', '4', '5', '6', '7', '8'] as const;

export type ChessFile = (typeof CHESS_FILES)[number];
export type ChessRank = (typeof CHESS_RANKS)[number];

export type ChessSquare = `${ChessFile}${ChessRank}`;
