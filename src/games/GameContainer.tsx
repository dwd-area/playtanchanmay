import { useTheme } from '@/themes/ThemeProvider';
import type { Peer } from '@/features/rooms/useRoomChannel';
import type { GameModule } from './types';
import { useGame, type Chan } from './useGame';

interface Props {
  game: GameModule;
  me: string;
  players: string[];
  peers: Peer[];
  chan: Chan;
  themeOverride?: 'modern' | 'retro';
}

export function GameContainer({ game, me, players, peers, chan, themeOverride }: Props) {
  const { theme } = useTheme();
  const effective = themeOverride ?? (game.defaultTheme === 'inherit' ? theme : game.defaultTheme);
  const { state, dispatch } = useGame(game, chan, peers, me, players);
  const View = game.View;

  return (
    <div data-theme={effective} className="relative mt-4 rounded-theme bg-surface p-4 text-text">
      <View state={state} me={me} players={players} dispatch={dispatch} />
    </div>
  );
}
