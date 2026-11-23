import type { ComponentType } from 'react';
import type { ThemeName } from '@/themes/ThemeProvider';

export interface GameViewProps<S, A> {
  state: S;
  me: string;
  players: string[];
  dispatch: (action: A) => void;
}

export interface GameModule<S = any, A = any> {
  id: string;
  name: string;
  category: 'board' | 'puzzle' | 'card' | 'drawing' | 'trivia' | 'party' | 'social';
  minPlayers: number;
  maxPlayers: number;
  estMinutes: number;
  defaultTheme: ThemeName | 'inherit';
  init(players: string[]): S;
  /** Pure and deterministic. Throw on an illegal move. */
  reduce(state: S, action: A, playerId: string): S;
  View: ComponentType<GameViewProps<S, A>>;
}
