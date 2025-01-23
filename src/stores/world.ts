import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { getWorldById } from '@/lib/api';

import type { World } from '@/lib/models/world';

export interface WorldStoreState {
  cache: string[];
  setWorld(this: void, world: World[]): void;
  setWorld(this: void, world: World): void;
  getWorld(this: void, id: string): World | null;
  fetchWorld(this: void, id: string): Promise<World>;
}

export const useWorldStore = create(
  persist<WorldStoreState>((set, get) => ({
    current: null,
    cache: [],
    setWorld(world: World | World[]) {
      const { cache } = get();

      if (Array.isArray(world)) {
        for (let index = 0; index < world.length; index++) {
          const v = world[index];

          if (!cache.includes(v.id)) {
            cache.push(v.id);
          }

          localStorage.setItem(v.id, JSON.stringify(v));
        }

        set({ cache });
        return;
      }

      if (!cache.includes(world.id)) {
        cache.push(world.id);
        set({ cache });
      }

      localStorage.setItem(world.id, JSON.stringify(world));
    },
    getWorld(id: string) {
      const { cache } = get();

      if (!cache.includes(id)) return null;

      const data = localStorage.getItem(id);

      if (!data) return null;

      return JSON.parse(data) as World;
    },
    async fetchWorld(id: string) {
      const { setWorld } = get();
      const data = await getWorldById(id);
      setWorld(data);
      return data;
    },
  }),
  { name: 'user' }),
);
