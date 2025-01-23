import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { getFavoriteGroups } from '@/lib/api';

import type { FavoriteGroup } from '@/lib/models/favorite';

type FavoriteTuple = [FavoriteGroup, string[] | null];

export interface FavoritesStoreState {
  friend: FavoriteTuple[] | null;
  avatar: FavoriteTuple[] | null;
  world: FavoriteTuple[] | null;
  fetchGroups(this: void): Promise<void>;
}

export const useFavoritesStore = create(
  persist<FavoritesStoreState>((set, get) => ({
    friend: null,
    avatar: null,
    world: null,
    async fetchGroups() {
      const state = get();
      const groups = await getFavoriteGroups();

      const friend = groups.filter((v) => v.type == 'friend').map((v) => [v, state.friend?.[1] ?? null] as FavoriteTuple);
      const avatar = groups.filter((v) => v.type == 'avatar').map((v) => [v, state.avatar?.[1] ?? null] as FavoriteTuple);
      const world = groups.filter((v) => v.type == 'world').map((v) => [v, state.world?.[1] ?? null] as FavoriteTuple);

      set({ friend, avatar, world });
    },
    fetch() {

    },
  }),
  { name: 'favorites' }),
);
