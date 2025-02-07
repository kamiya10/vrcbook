import { LogIn, MoreVertical, Pin, PinOff, Star, UserMinus2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { cn, normalizeSymbols } from '@/lib/utils';
import { getUserStatus, getUserTrustRank } from '@/lib/user';
import { Button } from '@/components/ui/button';
import { ExternalLink } from '@/components/ui/external-link';
import { StatusBadge } from '@/components/user/status-badge';
import { TrustRank } from '@/components/user/trust-rank';
import { getInstance } from '@/lib/api';
import { useFriendsStore } from '@/stores/friends';

import LocationChip from './location-chip';

import type { Instance } from '@/lib/models/world';
import type { LimitedUser } from '@/lib/models/user';

interface FriendListItemProps extends React.HtmlHTMLAttributes<HTMLLIElement> {
  user: LimitedUser;
}

const FriendListItem: React.FC<FriendListItemProps> = ({ user, className, ...props }) => {
  const navigate = useNavigate();
  const pinned = useFriendsStore((state) => state.pinned);
  const pin = useFriendsStore((state) => state.pin);
  const unpin = useFriendsStore((state) => state.unpin);
  const [location, setLocation] = useState<Instance>();

  useEffect(() => {
    void (async () => {
      if (['private', 'offline'].includes(user.location)) return;
      const data = await getInstance(user.location);
      setLocation(data);
    })();
  }, [user.location]);

  const onClick: React.MouseEventHandler<HTMLLIElement> = (ev) => {
    if (!(ev.target instanceof HTMLLIElement)) return;
    void navigate(`/app/contents/user/${user.id}`);
  };

  return (
    <li
      className={cn(`
        flex items-center justify-between gap-2 rounded-lg p-2 transition
        [&:not(:has(:active))]:active:scale-[0.99]
        [&:not(:has(:active))]:active:opacity-80
        [&:not(:has(:hover))]:hover:bg-accent
        hover:z-10
      `, className)}
      onClick={onClick}
      {...props}
    >
      <div className="pointer-events-none flex items-center gap-2.5">
        <div className="relative">
          <Avatar>
            <AvatarImage
              src={user.userIcon || user.currentAvatarThumbnailImageUrl}
              alt={user.displayName}
            />
            <AvatarFallback>{user.displayName.slice(0, 3)}</AvatarFallback>
          </Avatar>
          <div className={`
            absolute -bottom-1 -right-1 grid rounded-full bg-background p-[3px]
          `}
          >
            <StatusBadge
              status={getUserStatus(user)}
              className="size-2.5"
            />
          </div>
        </div>
        <div className="flex flex-col">
          <TrustRank rank={getUserTrustRank(user)} className="font-bold">
            {user.displayName}
          </TrustRank>
          <div className="text-xs text-muted-foreground">{normalizeSymbols(user.statusDescription)}</div>
        </div>
      </div>
      <div className={`
        pointer-events-none flex items-center justify-end gap-2
        [&>*]:pointer-events-auto
      `}
      >
        {user.location == 'private' ? <LocationChip /> : location && <LocationChip instance={location} />}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreVertical />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            {location && (
              <DropdownMenuItem asChild>
                <ExternalLink href={`vrchat://launch?ref=vrchat.com&id=${location.id}`} unstyled>
                  <LogIn />
                  <span>Join Instance</span>
                </ExternalLink>
              </DropdownMenuItem>
            )}
            <DropdownMenuItem>
              <Star />
              <span>Favorite</span>
            </DropdownMenuItem>
            {pinned.includes(user.id)
              ? (
                  <DropdownMenuItem onClick={() => unpin(user.id)}>
                    <PinOff />
                    <span>Unpin</span>
                  </DropdownMenuItem>
                )
              : (
                  <DropdownMenuItem onClick={() => pin(user.id)}>
                    <Pin />
                    <span>Pin to top</span>
                  </DropdownMenuItem>
                )}
            <DropdownMenuItem className={`
              text-destructive
              hover:!bg-destructive/25 hover:!text-destructive-accent
            `}
            >
              <UserMinus2 />
              <span>Remove Friend</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </li>
  );
};
FriendListItem.displayName = 'FriendListItem';

export default FriendListItem;
