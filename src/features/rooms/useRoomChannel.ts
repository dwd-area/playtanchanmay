import { useCallback, useEffect, useRef, useState } from 'react';
import type { RealtimeChannel } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';

export interface Peer { userId: string; name: string; joinedAt: number }
type Handler = (payload: any, from: string) => void;

export function useRoomChannel(roomId: string, me: { id: string; name: string }) {
  const [peers, setPeers] = useState<Peer[]>([]);
  const [status, setStatus] = useState<'connecting' | 'online' | 'offline'>('connecting');
  const chRef = useRef<RealtimeChannel | null>(null);
  const handlers = useRef(new Map<string, Set<Handler>>());

  useEffect(() => {
    const ch = supabase.channel(`room:${roomId}`, {
      config: { private: true, presence: { key: me.id }, broadcast: { self: false, ack: false } },
    });

    ch.on('presence', { event: 'sync' }, () => {
      const state = ch.presenceState<Peer>();
      setPeers(
        Object.values(state)
          .map((arr) => arr[0] as Peer)
          .sort((a, b) => a.joinedAt - b.joinedAt)
      );
    });

    ch.on('broadcast', { event: '*' }, ({ event, payload }) => {
      handlers.current.get(event)?.forEach((h) => h(payload.data, payload.from));
    });

    ch.subscribe(async (s) => {
      if (s === 'SUBSCRIBED') {
        setStatus('online');
        await ch.track({ userId: me.id, name: me.name, joinedAt: Date.now() });
      } else if (s === 'CLOSED' || s === 'CHANNEL_ERROR' || s === 'TIMED_OUT') {
        setStatus('offline');
      }
    });

    chRef.current = ch;
    return () => {
      supabase.removeChannel(ch);
      chRef.current = null;
    };
  }, [roomId, me.id, me.name]);

  const send = useCallback(
    (event: string, data: unknown) => {
      chRef.current?.send({ type: 'broadcast', event, payload: { data, from: me.id } });
    },
    [me.id]
  );

  const on = useCallback((event: string, h: Handler) => {
    if (!handlers.current.has(event)) handlers.current.set(event, new Set());
    handlers.current.get(event)!.add(h);
    return () => {
      handlers.current.get(event)?.delete(h);
    };
  }, []);

  return { peers, status, send, on };
}
