import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { listMyRooms } from '@/features/rooms/api';

export default function Lobby() {
  const [rooms, setRooms] = useState<any[]>([]);
  useEffect(() => {
    listMyRooms().then(setRooms).catch(console.error);
  }, []);
  return (
    <div className="p-6">
      <h1 className="font-display text-primary">My rooms</h1>
      <ul className="mt-4 space-y-2">
        {rooms.map((r) => (
          <li key={r.id}>
            <Link className="underline" to={`/room/${r.code}`}>
              {r.name} ({r.code})
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
