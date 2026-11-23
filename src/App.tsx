import type { ReactNode } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { ThemeProvider } from '@/themes/ThemeProvider';
import { useSession } from '@/features/auth/useSession';
import Landing from '@/pages/Landing';
import Lobby from '@/pages/Lobby';
import Room from '@/pages/Room';
import Library from '@/pages/Library';
import AiCorner from '@/pages/AiCorner';

function Protected({ children }: { children: ReactNode }) {
  const { user, loading } = useSession();
  if (loading) return null;
  return user ? <>{children}</> : <Navigate to="/" replace />;
}

export default function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/lobby" element={<Protected><Lobby /></Protected>} />
          <Route path="/room/:code" element={<Protected><Room /></Protected>} />
          <Route path="/library" element={<Protected><Library /></Protected>} />
          <Route path="/ai" element={<Protected><AiCorner /></Protected>} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}
