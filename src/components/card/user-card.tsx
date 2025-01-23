import { useEffect, useState } from 'react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card } from '@/components/ui/card';
import { getUserTrustRank } from '@/lib/user';
import { normalizeSymbols } from '@/lib/utils';
import { useUserStore } from '@/stores/user';

import { TrustRank } from '../user/trust-rank';

type UserCardProps = Readonly<{
  userId: string;
}>;

const UserCard: React.FC<UserCardProps> = ({ userId }) => {
  const cache = useUserStore((state) => state.getUser)(userId);
  const fetchUser = useUserStore((state) => state.fetchUser);
  const [user, setUser] = useState(cache);

  useEffect(() => {
    if (user) return;

    void (async () => {
      const data = await fetchUser(userId);
      setUser(data);
    })();
  }, []);

  if (!user) {
    return <Card></Card>;
  }

  return (
    <div className="flex max-w-80 flex-col gap-2">
      <div className="flex items-center gap-2">
        <Avatar className="size-8">
          <AvatarImage src={user.userIcon || user.currentAvatarThumbnailImageUrl} />
          <AvatarFallback>{user.displayName.slice(0, 3)}</AvatarFallback>
        </Avatar>
        <TrustRank className="font-medium" rank={getUserTrustRank(user)}>
          {user.displayName}
        </TrustRank>
      </div>
      <div className="line-clamp-3 text-sm text-muted-foreground">
        {normalizeSymbols(user.bio)}
      </div>
    </div>
  );
};
UserCard.displayName = 'UserCard';

export {
  UserCard,
};
