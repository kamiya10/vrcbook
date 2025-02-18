import { ArrowDownAZ, Clock, Loader2, Pin, SortAsc, SortDesc, Users2 } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';

import { Page, PageHeader } from '@/components/ui/page';
import { Select, SelectContent, SelectItem, SelectTrigger } from '@/components/ui/select';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Button } from '@/components/ui/button';
import FriendListItem from '@/components/app/friends/friend-list-item';
import { useFriendsStore } from '@/stores/friends';

import type { LimitedUser } from '@/lib/models/user';

const SortMode = {
  alphabetical: {
    icon: ArrowDownAZ,
    label: 'Alphabetical',
  },
  update: {
    icon: Clock,
    label: 'Last Update',
  },
};

const FriendsList: React.FC<{ list: LimitedUser[]; pinned: LimitedUser[] }> = ({ list, pinned }) => {
  const ref = useRef<HTMLUListElement>(null);

  const virtualizer = useVirtualizer({
    count: list.length + pinned.length,
    estimateSize: (i) => {
      if (!pinned.length) return 64;
      if (i == 0) return 32;
      if (i == pinned.length + 1) return 48;
      return 64;
    },
    getScrollElement: () => ref.current,
    getItemKey: (i) => {
      if (!pinned.length) return `friend-list-item-${list[i].id}`;
      if (i == 0) return 'friend-list-title-pinned';
      if (i == pinned.length + 1) return 'friend-list-title-all';
      if (i > 0 && i <= pinned.length) return `friend-list-item-${pinned[i - 1].id}`;
      return `friend-list-item-${list[i - pinned.length - 2].id}`;
    },
    overscan: 1,
  });

  return (
    <ul
      ref={ref}
      className="max-h-full flex-1 overflow-y-auto overflow-x-hidden"
    >
      <div
        className="relative w-full"
        style={{
          height: `${virtualizer.getTotalSize()}px`,
        }}
      >
        {virtualizer.getVirtualItems().map((v) => {
          if (pinned.length && v.index == 0) {
            return (
              <div
                key={v.key}
                className={`
                  absolute left-0 top-0 flex h-8 w-full items-center gap-2
                  text-sm
                `}
                style={{
                  transform: `translateY(${v.start}px)`,
                }}
              >
                <Pin size={18} />
                Pinned Friends (
                {pinned.length}
                )
              </div>
            );
          }

          if (pinned.length && v.index > 0 && v.index <= pinned.length) {
            return (
              <FriendListItem
                key={v.key}
                user={pinned[v.index - 1]}
                className="absolute left-0 top-0 w-full"
                style={{
                  height: `${v.size}px`,
                  transform: `translateY(${v.start}px)`,
                }}
              />
            );
          }

          if (pinned.length && v.index == pinned.length + 1) {
            return (
              <div
                key={v.key}
                className={`
                  absolute left-0 top-0 flex h-12 w-full items-center gap-2 pt-4
                  text-sm
                `}
                style={{
                  transform: `translateY(${v.start}px)`,
                }}
              >
                <Users2 size={18} />
                All Friends (
                {list.length}
                )
              </div>
            );
          }

          return (
            <FriendListItem
              key={v.key}
              user={list[pinned.length ? v.index - pinned.length - 2 : v.index]}
              className="absolute left-0 top-0 w-full"
              style={{
                height: `${v.size}px`,
                transform: `translateY(${v.start}px)`,
              }}
            />
          );
        })}
      </div>
    </ul>
  );
};

const FriendsPage: React.FC = () => {
  const friendsStore = useFriendsStore();
  const [updating, setUpdating] = useState(false);
  const [sortMode, setSortMode] = useState<keyof typeof SortMode>('update');
  const [sortAscending, setSortAscending] = useState(false);

  const updateList = async () => {
    try {
      setUpdating(true);
      await friendsStore.fetchList();
    }
    catch (error) {
      console.error(error);
    }
    finally {
      setUpdating(false);
    }
  };

  useEffect(() => {
    void updateList();
    const timer = window.setInterval(
      () => void updateList(),
      300_000,
    );
    return () => window.clearInterval(timer);
  }, []);

  if (!friendsStore.friends) {
    return (
      <div className="grid items-center justify-center">
        <Loader2 className="animate-spin" />
      </div>
    );
  }

  const currentSortMode = SortMode[sortMode];

  const allList = friendsStore.friends.filter(([v]) => !friendsStore.pinned.includes(v.id));

  const pinnedList = friendsStore.pinned.map((val) => friendsStore.friends!.find(([v]) => v.id == val)![0]);

  const sortedList = (sortMode == 'update'
    ? sortAscending
      ? [...allList].reverse()
      : allList
    : [...allList].sort(([a], [b]) => (+(a.displayName > b.displayName) - 1 || 1) * (+sortAscending - 1 || 1))
  ).map((v) => v[0]);

  return (
    <Page className="flex flex-col gap-2">
      <PageHeader className="justify-between">
        <div className="flex items-center gap-2">
          <span>Friends</span>
          <span>{`(${friendsStore.friends.length})`}</span>
          {updating && <Loader2 className="animate-spin" />}
        </div>
        <div className="flex items-center gap-2">
          <div>
            <Tooltip delayDuration={1000}>
              <TooltipTrigger asChild>
                <Button variant="outline" size="icon" onClick={() => setSortAscending(!sortAscending)}>
                  {sortAscending ? <SortAsc /> : <SortDesc />}
                </Button>
              </TooltipTrigger>
              <TooltipContent>{sortAscending ? 'Ascending' : 'Descending'}</TooltipContent>
            </Tooltip>
          </div>
          <div>
            <Select value={sortMode} onValueChange={(v: keyof typeof SortMode) => setSortMode(v)}>
              <SelectTrigger className="flex gap-2 font-normal">
                <div className="flex items-center gap-2">
                  <currentSortMode.icon size={18} />
                  {currentSortMode.label}
                </div>
              </SelectTrigger>
              <SelectContent>
                {Object.entries(SortMode).map(([value, mode]) => (
                  <SelectItem value={value} key={`sort-mode-${value}`}>
                    <div className="flex items-center gap-2">
                      <mode.icon size={18} />
                      {mode.label}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </PageHeader>
      <FriendsList list={sortedList} pinned={pinnedList} />
    </Page>
  );
};
FriendsPage.displayName = 'FriendsPage';

export default FriendsPage;
