import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInGuest } from '@/features/auth/guest';
import { TurnstileBox } from '@/features/auth/TurnstileBox';
import { createRoom, joinRoom } from '@/features/rooms/api';
import { useTheme } from '@/themes/ThemeProvider';

export default function Landing() {
  const nav = useNavigate();
  const { theme, setTheme } = useTheme();
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [token, setToken] = useState('');
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');

  async function go(mode: 'create' | 'join') {
    setBusy(true);
    setErr('');
    try {
      await signInGuest(name, token);
      const room = mode === 'create' ? await createRoom(`${name}'s room`) : await joinRoom(code);
      nav(`/room/${room.code}`);
    } catch (e: any) {
      setErr(e.message ?? 'Something went wrong. Refresh and try again.');
    } finally {
      setBusy(false);
    }
  }

  const input = 'w-full rounded-theme border-theme border-primary-soft bg-surface p-3 text-text';
  const btn = 'rounded-theme bg-primary px-4 py-3 font-display text-white shadow-theme disabled:opacity-50';

  return (
    <div className="mx-auto flex min-h-screen max-w-md flex-col justify-center gap-4 p-6">
      <h1 className="font-display text-3xl text-primary">PlayTogether</h1>
      <p className="text-muted">Your little corner of the internet to play together.</p>
      <input className={input} placeholder="Display name" value={name} maxLength={24} onChange={(e) => setName(e.target.value)} />
      <TurnstileBox onToken={setToken} />
      <button className={btn} disabled={busy || !name.trim()} onClick={() => go('create')}>
        Create room
      </button>
      <div className="flex gap-2">
        <input className={input} placeholder="Room code" value={code} onChange={(e) => setCode(e.target.value.toUpperCase())} />
        <button className={btn} disabled={busy || !name.trim() || !code} onClick={() => go('join')}>
          Join
        </button>
      </div>
      {err && <p className="text-sm text-accent">{err}</p>}
      <button className="text-sm text-muted underline" onClick={() => setTheme(theme === 'modern' ? 'retro' : 'modern')}>
        Switch theme ({theme})
      </button>
    </div>
  );
}
