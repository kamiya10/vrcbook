import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { getUserById, login } from '@/lib/api';

import type { CurrentUser, LimitedUser } from '@/lib/models/user';

export interface UserStoreState {
  current: CurrentUser | null;
  cache: string[];
  setUser(this: void, user: LimitedUser[]): void;
  setUser(this: void, user: LimitedUser): void;
  getUser(this: void, id: string): LimitedUser | null;
  fetchCurrent(this: void): Promise<void>;
  fetchUser(this: void, id: string): Promise<LimitedUser>;
}

export const useUserStore = create(
  persist<UserStoreState>((set, get) => ({
    current: null,
    cache: [],
    setUser(user: LimitedUser | LimitedUser[]) {
      const { cache } = get();

      if (Array.isArray(user)) {
        for (let index = 0; index < user.length; index++) {
          const v = user[index];

          if (!cache.includes(v.id)) {
            cache.push(v.id);
          }

          localStorage.setItem(v.id, JSON.stringify(v));
        }

        set({ cache });
        return;
      }

      if (!cache.includes(user.id)) {
        cache.push(user.id);
        set({ cache });
      }

      localStorage.setItem(user.id, JSON.stringify(user));
    },
    getUser(id: string) {
      const { cache } = get();

      if (!cache.includes(id)) return null;

      const data = localStorage.getItem(id);

      if (!data) return null;

      return JSON.parse(data) as LimitedUser;
    },
    async fetchCurrent() {
      const { setUser } = get();
      const data = await login();
      if ('requiresTwoFactorAuth' in data) {
        throw new Error('Unauthenticated');
      };
      setUser(data);
      set({ current: data });
      console.log(data);
    },
    async fetchUser(id: string) {
      const { setUser } = get();
      const data = await getUserById(id);
      setUser(data);
      return data;
    },
  }),
  { name: 'user' }),
);
