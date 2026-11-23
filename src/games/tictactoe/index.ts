import type { GameModule } from '../types';
import { init, reduce, type TTTAction, type TTTState } from './logic';
import { TicTacToeView } from './View';

export const tictactoe: GameModule<TTTState, TTTAction> = {
  id: 'tictactoe',
  name: 'Tic-Tac-Toe',
  category: 'board',
  minPlayers: 2,
  maxPlayers: 2,
  estMinutes: 3,
  defaultTheme: 'inherit',
  init,
  reduce,
  View: TicTacToeView,
};
