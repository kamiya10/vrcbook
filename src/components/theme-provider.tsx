import { Effect, getCurrentWindow } from '@tauri-apps/api/window';
import { createContext, useContext, useEffect, useState } from 'react';

export type Theme = 'dark' | 'light' | 'system';

const win = getCurrentWindow();

type ThemeProviderProps = {
  children: React.ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
};

type ThemeProviderState = {
  theme: Theme;
  themes: Theme[];
  useAcrylic: boolean;
  setTheme: (theme: Theme) => void;
  setUseAcrylic: (state: boolean) => Promise<void>;
};

const initialState: ThemeProviderState = {
  theme: 'system',
  themes: ['light', 'dark', 'system'],
  useAcrylic: false,
  setTheme: () => null,
  setUseAcrylic: () => Promise.resolve(),
};

const ThemeProviderContext = createContext<ThemeProviderState>(initialState);

export function ThemeProvider({
  children,
  defaultTheme = 'system',
  storageKey = 'vite-ui-theme',
  ...props
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(
    () => (localStorage.getItem(storageKey) as Theme) || defaultTheme,
  );
  const [useAcrylic, setUseAcrylic] = useState<boolean>(
    () => (localStorage.getItem(`acrylic`)) === 'true',
  );

  useEffect(() => {
    const root = window.document.documentElement;

    root.classList.remove('light', 'dark');

    if (theme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)')
        .matches
        ? 'dark'
        : 'light';

      root.classList.add(systemTheme);
      return;
    }

    root.classList.add(theme);
  }, [theme]);

  useEffect(() => {
    const root = window.document.documentElement;

    root.classList.remove('acrylic');

    if (useAcrylic) {
      root.classList.add('acrylic');
    }
  }, [useAcrylic]);

  const value = {
    theme,
    setTheme: (theme: Theme) => {
      localStorage.setItem(storageKey, theme);
      setTheme(theme);
    },
    useAcrylic,
    setUseAcrylic: async (state: boolean) => {
      if (state) {
        await win.setEffects({
          effects: [Effect.Acrylic],
        });
      }
      else {
        await win.clearEffects();
      }

      setUseAcrylic(state);
    },
    themes: ['light', 'dark', 'system'] as Theme[],
  };

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext);

  if (context === undefined)
    throw new Error('useTheme must be used within a ThemeProvider');

  return context;
};
