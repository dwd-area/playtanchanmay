import { useEffect, useRef, useState } from 'react';
import type { Chan } from '@/games/useGame';
import { fetchMessages, sendMessage } from './api';

export function ChatPanel({ roomId, userId, chan }: { roomId: string; userId: string; chan: Chan }) {
  const [msgs, setMsgs] = useState<any[]>([]);
  const [text, setText] = useState('');
  const end = useRef<HTMLDivElement>(null);

  const load = () => fetchMessages(roomId).then(setMsgs).catch(console.error);

  // Load history on mount, and reload whenever someone announces a new message.
  useEffect(() => {
    load();
    return chan.on('chat:new', load);
  }, [roomId, chan]);

  useEffect(() => {
    end.current?.scrollIntoView({ behavior: 'smooth' });
  }, [msgs.length]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!text.trim()) return;
    const t = text;
    setText('');
    try {
      await sendMessage(roomId, userId, t);
      await load();                 // show my own message immediately
      chan.send('chat:new', null);  // tell everyone else to reload
    } catch {
      setText(t);
    }
  }

  return (
    <div className="flex h-96 flex-col">
      <div className="flex-1 space-y-1 overflow-y-auto">
        {msgs.map((m) => (
          <div key={m.id}>
            <b className="text-primary">{m.profiles?.display_name ?? '?'}</b>: {m.body}
          </div>
        ))}
        <div ref={end} />
      </div>
      <form onSubmit={submit} className="mt-2 flex gap-2">
        <input
          className="flex-1 rounded-theme bg-surface-2 p-2"
          value={text}
          maxLength={500}
          onChange={(e) => setText(e.target.value)}
        />
        <button className="rounded-theme bg-primary px-3 text-white">Send</button>
      </form>
    </div>
  );
}