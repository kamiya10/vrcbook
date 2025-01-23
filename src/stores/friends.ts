import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { getFriends, getInstance } from '@/lib/api';

import { useUserStore } from './user';

import type { Instance } from '@/lib/models/world';
import type { LimitedUser } from '@/lib/models/user';

type FriendTuple = [LimitedUser, Instance | null];

export interface FriendsStoreState {
  friends: FriendTuple[] | null;
  setFriend(this: void, friend: FriendTuple): void;
  fetchList(this: void): Promise<void>;
  fetchInstance(this: void, userId: string, force?: boolean): Promise<void>;
}

export const useFriendsStore = create(
  persist<FriendsStoreState>((set, get) => ({
    friends: null,
    setFriend(friend: FriendTuple) {
      let { friends } = get();

      if (!friends) {
        set({
          friends: [friend],
        });
        return;
      }

      friends = [...friends];

      const index = friends.findIndex((v) => v[0].id == friend[0].id);

      if (index >= 0) {
        friends.splice(index, 1, friend);
      }
      else {
        friends.push(friend);
      }

      set({ friends });
    },
    async fetchList() {
      const setUser = useUserStore.getState().setUser;
      const data = await getFriends();
      setUser(data);
      const friends = data.map((v) => [v, null] as FriendTuple);
      set({ friends });
    },
    async fetchInstance(userId: string, force = false) {
      const { friends, setFriend } = get();

      const friend = friends?.find((v) => v[0].id == userId);
      if (!friend) return;

      if (!force && friend[0].location == friend[1]?.location) return;
      if (!friend[0].location) {
        setFriend([friend[0], null] as FriendTuple);
        return;
      }

      const instance = await getInstance(friend[0].location);
      setFriend([friend[0], instance] as FriendTuple);
    },
  }),
  { name: 'friends' }),
);
