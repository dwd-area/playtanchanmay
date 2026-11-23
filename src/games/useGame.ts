import { useCallback, useEffect, useRef, useState } from 'react';
import type { GameModule } from './types';
import type { Peer } from '@/features/rooms/useRoomChannel';

export type Chan = {
  send: (event: string, data: unknown) => void;
  on: (event: string, h: (data: any, from: string) => void) => () => void;
};

/** Host = longest-present peer. The host validates actions and broadcasts the new state. */
export function useGame<S, A>(game: GameModule<S, A>, chan: Chan, peers: Peer[], me: string, players: string[]) {
  const [state, setState] = useState<S>(() => game.init(players));
  const stateRef = useRef(state);
  stateRef.current = state;
  const isHost = peers[0]?.userId === me;

  useEffect(() => chan.on('game:state', (s: S) => setState(s)), [chan]);

  useEffect(
    () =>
      chan.on('game:action', (a: A, from: string) => {
        if (!isHost) return;
        try {
          const next = game.reduce(stateRef.current, a, from);
          setState(next);
          chan.send('game:state', next);
        } catch {
          /* ignore illegal actions */
        }
      }),
    [chan, game, isHost]
  );

  // A new host (or a reconnect) re-broadcasts its state so everyone converges.
  useEffect(() => {
    if (isHost) chan.send('game:state', stateRef.current);
  }, [isHost, peers.length]);

  const dispatch = useCallback(
    (a: A) => {
      if (isHost) {
        try {
          const next = game.reduce(stateRef.current, a, me);
          setState(next);
          chan.send('game:state', next);
        } catch {
          /* illegal */
        }
      } else {
        chan.send('game:action', a);
      }
    },
    [isHost, game, me, chan]
  );

  return { state, dispatch, isHost };
}
