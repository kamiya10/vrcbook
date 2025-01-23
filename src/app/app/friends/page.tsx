import { ArrowDownAZ, Clock, Loader2, SortAsc, SortDesc } from 'lucide-react';
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

const FriendsList: React.FC<{ list: LimitedUser[] }> = ({ list }) => {
  const ref = useRef<HTMLUListElement>(null);

  const virtualizer = useVirtualizer({
    count: list.length,
    estimateSize: () => 64,
    getScrollElement: () => ref.current,
    getItemKey: (i) => `friend-list-${list[i].id}`,
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
        {virtualizer.getVirtualItems().map((v) => (
          <FriendListItem
            key={v.key}
            user={list[v.index]}
            className="absolute left-0 top-0 w-full"
            style={{
              height: `${v.size}px`,
              transform: `translateY(${v.start}px)`,
            }}
          />
        ))}
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

  const sortedList = (sortMode == 'update'
    ? sortAscending
      ? [...friendsStore.friends].reverse()
      : friendsStore.friends
    : [...friendsStore.friends].sort(([a], [b]) => (+(a.displayName > b.displayName) - 1 || 1) * (+sortAscending - 1 || 1))
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
      <FriendsList list={sortedList} />
    </Page>
  );
};
FriendsPage.displayName = 'FriendsPage';

export default FriendsPage;
