export type Cell = 'X' | 'O' | null;

export interface TTTState {
  board: Cell[];
  players: [string, string];
  turn: 0 | 1;
  winner: string | 'draw' | null;
}

export type TTTAction = { type: 'play'; index: number } | { type: 'reset' };

const LINES = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8],
  [0, 3, 6], [1, 4, 7], [2, 5, 8],
  [0, 4, 8], [2, 4, 6],
];

export const init = (players: string[]): TTTState => ({
  board: Array(9).fill(null),
  players: [players[0], players[1]],
  turn: 0,
  winner: null,
});

export function reduce(s: TTTState, a: TTTAction, pid: string): TTTState {
  if (a.type === 'reset') return init(s.players);
  if (s.winner) throw new Error('game over');
  if (s.players[s.turn] !== pid) throw new Error('not your turn');
  if (a.index < 0 || a.index > 8 || s.board[a.index]) throw new Error('illegal move');

  const board = [...s.board];
  board[a.index] = s.turn === 0 ? 'X' : 'O';
  const won = LINES.some(([x, y, z]) => board[x] && board[x] === board[y] && board[x] === board[z]);
  const winner = won ? pid : board.every(Boolean) ? 'draw' : null;
  return { ...s, board, turn: s.turn === 0 ? 1 : 0, winner };
}
