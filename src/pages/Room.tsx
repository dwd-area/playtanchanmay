import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { joinRoom } from '@/features/rooms/api';
import { useSession } from '@/features/auth/useSession';
import { useRoomChannel } from '@/features/rooms/useRoomChannel';
import { ChatPanel } from '@/features/chat/ChatPanel';
import { GameContainer } from '@/games/GameContainer';
import { GAMES, getGame } from '@/games/registry';

export default function Room() {
  const { code } = useParams();
  const { user } = useSession();
  const [room, setRoom] = useState<{ id: string; name: string } | null>(null);
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user) return;
    joinRoom(code!).then(setRoom).catch((e) => setError(e.message));
    supabase
      .from('profiles')
      .select('display_name')
      .eq('id', user.id)
      .single()
      .then(({ data }) => setName(data?.display_name ?? 'Guest'));
  }, [code, user?.id]);

  if (error) return <p className="p-6">{error}</p>;
  if (!room || !user || !name) return null;
  return <RoomInner room={room} userId={user.id} name={name} />;
}

function RoomInner({ room, userId, name }: { room: { id: string; name: string }; userId: string; name: string }) {
  const { peers, status, send, on } = useRoomChannel(room.id, { id: userId, name });
  const chan = useMemo(() => ({ send, on }), [send, on]);
  const [gameId, setGameId] = useState<string | null>(null);
  const hostId = peers[0]?.userId;

  useEffect(() => on('room:game', (id: string | null) => setGameId(id)), [on]);

  // The host re-announces the current game so late joiners and reconnects catch up.
  useEffect(() => {
    if (hostId === userId) send('room:game', gameId);
  }, [hostId, peers.length]);

  const pick = (id: string | null) => {
    setGameId(id);
    send('room:game', id);
  };

  const game = gameId ? getGame(gameId) : null;
  const players = peers.map((p) => p.userId).slice(0, game?.maxPlayers ?? 10);
  const ready = !!game && players.length >= game.minPlayers;

  return (
    <div className="grid min-h-screen gap-4 p-4 lg:grid-cols-[1fr_320px]">
      <main>
        <h1 className="font-display text-primary">
          {room.name} <small className="text-muted">({status})</small>
        </h1>

        {!game &&
          GAMES.map((g) => (
            <button
              key={g.id}
              className="mr-2 mt-4 rounded-theme bg-primary px-4 py-2 text-white"
              onClick={() => pick(g.id)}
            >
              Start {g.name}
            </button>
          ))}

        {game && !ready && <p className="mt-4 text-muted">Waiting for {game.minPlayers} players…</p>}

        {game && ready && (
          <>
            <GameContainer key={players.join(',')} game={game} me={userId} chan={chan} peers={peers} players={players} />
            <button className="mt-3 text-sm underline" onClick={() => pick(null)}>
              Back to room
            </button>
          </>
        )}
      </main>

      <aside className="space-y-3 rounded-theme bg-surface p-3">
        <div>
          <h2 className="font-display text-sm text-primary">Online ({peers.length})</h2>
          <ul>
            {peers.map((p) => (
              <li key={p.userId}>
                ● {p.name}
                {p.userId === userId ? ' (you)' : ''}
              </li>
            ))}
          </ul>
        </div>
        <ChatPanel roomId={room.id} userId={userId} chan={chan} />
      </aside>
    </div>
  );
}
