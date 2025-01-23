import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { getUserById, login } from '@/lib/api';

import type { CurrentUser, LimitedUser } from '@/lib/models/user';

export interface GroupStoreState {
  current: CurrentUser | null;
  cache: string[];
  setGroup(this: void, user: LimitedUser[]): void;
  setGroup(this: void, user: LimitedUser): void;
  getGroup(this: void, id: string): LimitedUser | null;
  fetchGroup(this: void, id: string): Promise<LimitedUser>;
}

export const useGroupStore = create(
  persist<GroupStoreState>((set, get) => ({
    current: null,
    cache: [],
    setGroup(user: LimitedUser | LimitedUser[]) {
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
    getGroup(id: string) {
      const { cache } = get();

      if (!cache.includes(id)) return null;

      const data = localStorage.getItem(id);

      if (!data) return null;

      return JSON.parse(data) as LimitedUser;
    },
    async fetchCurrent() {
      const { setGroup } = get();
      const data = await login();
      if ('requiresTwoFactorAuth' in data) {
        throw new Error('Unauthenticated');
      };
      setGroup(data);
      set({ current: data });
      console.log(data);
    },
    async fetchGroup(id: string) {
      const { setGroup } = get();
      const data = await getUserById(id);
      setGroup(data);
      return data;
    },
  }),
  { name: 'user' }),
);
