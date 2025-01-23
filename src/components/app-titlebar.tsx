import { Copy, Minus, Square, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { getCurrentWindow } from '@tauri-apps/api/window';
import { useLocation } from 'react-router';

import { cn } from '@/lib/utils';

const win = getCurrentWindow();

export default function AppTitlebar() {
  const { pathname } = useLocation();
  const [isMaximized, setMaximized] = useState(false);

  useEffect(() => {
    const unlisten = win.listen('tauri://resize', () => {
      void (async () => setMaximized(await win.isMaximized()))();
    });

    return () => {
      void unlisten.then((f) => f());
    };
  }, []);

  return (
    <div className="z-50 flex">
      <div
        className={cn('flex flex-1 items-center px-4 drop-shadow-md',
          pathname.startsWith('/app') && 'pl-8',
        )}
        data-tauri-drag-region
      >
        VRCBook
      </div>
      <div className="grid grid-cols-[repeat(3,_theme(size.11))]">
        <button
          className={`
            grid items-center justify-center transition-colors
            hover:bg-accent
          `}
          onClick={() => void win.minimize()}
        >
          <Minus size={16} />
        </button>
        <button
          className={`
            grid items-center justify-center transition-colors
            hover:bg-accent
          `}
          onClick={() => void win.toggleMaximize()}
        >
          {
            isMaximized
              ? <Copy size={16} className="-scale-x-100" />
              : <Square size={14} />
          }
        </button>
        <button
          className={`
            grid items-center justify-center transition-colors
            hover:bg-red-500 hover:text-white
          `}
          onClick={() => void win.close()}
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
}
