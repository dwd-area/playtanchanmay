import { useState } from 'react';
import { askAi } from '@/features/ai/api';

export default function AiCorner() {
  const [out, setOut] = useState('');
  return (
    <div className="p-6">
      <button
        className="rounded-theme bg-primary px-4 py-2 text-white"
        onClick={async () => {
          try {
            setOut(JSON.stringify(await askAi('challenge', {}), null, 2));
          } catch (e: any) {
            setOut(e.message);
          }
        }}
      >
        Random challenge
      </button>
      <pre className="mt-4 whitespace-pre-wrap text-muted">{out}</pre>
    </div>
  );
}
