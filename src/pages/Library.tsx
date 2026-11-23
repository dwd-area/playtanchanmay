import { GAMES } from '@/games/registry';

export default function Library() {
  return (
    <div className="grid gap-4 p-6 sm:grid-cols-2">
      {GAMES.map((g) => (
        <div key={g.id} className="rounded-theme border-theme border-primary-soft bg-surface p-4">
          <h2 className="font-display text-primary">{g.name}</h2>
          <p className="text-muted">
            {g.minPlayers}–{g.maxPlayers} players · ~{g.estMinutes} min
          </p>
        </div>
      ))}
    </div>
  );
}
