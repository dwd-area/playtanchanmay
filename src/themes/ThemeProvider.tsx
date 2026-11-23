import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';

export type ThemeName = 'modern' | 'retro';
export type Mode = 'light' | 'dark';

const Ctx = createContext<{
  theme: ThemeName;
  mode: Mode;
  setTheme: (t: ThemeName) => void;
  setMode: (m: Mode) => void;
}>(null as never);

export const useTheme = () => useContext(Ctx);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<ThemeName>(() => (localStorage.getItem('pt-theme') as ThemeName) || 'modern');
  const [mode, setMode] = useState<Mode>(() => (localStorage.getItem('pt-mode') as Mode) || 'light');

  useEffect(() => {
    const el = document.documentElement;
    el.dataset.theme = theme;
    el.dataset.mode = mode;
    localStorage.setItem('pt-theme', theme);
    localStorage.setItem('pt-mode', mode);
  }, [theme, mode]);

  return <Ctx.Provider value={{ theme, mode, setTheme, setMode }}>{children}</Ctx.Provider>;
}
