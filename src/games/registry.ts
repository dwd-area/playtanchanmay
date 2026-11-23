import type { GameModule } from './types';
import { tictactoe } from './tictactoe';

// Add new games here, one line each.
export const GAMES: GameModule[] = [tictactoe];
export const getGame = (id: string) => GAMES.find((g) => g.id === id);
