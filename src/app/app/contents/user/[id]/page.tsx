import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { Loader2 } from 'lucide-react';

import { APIFetchError, getInstance, getUserById } from '@/lib/api';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { copy, normalizeSymbols, relative, yyyyMMddHHmmss } from '@/lib/utils';
import { getUserState, getUserStatus, getUserTrustRank } from '@/lib/user';
import BackButton from '@/components/common/back-button';
import DotSeparator from '@/components/common/dot-separator';
import { ExternalLink } from '@/components/ui/external-link';
import { Page } from '@/components/ui/page';
import { StatusBadge } from '@/components/user/status-badge';
import { TrustRank } from '@/components/user/trust-rank';
import { getWebsiteFromUrl } from '@/lib/url';
import { getInstanceType } from '@/lib/world';

import type { Instance } from '@/lib/models/world';
import type { User } from '@/lib/models/user';

const UserLocation: React.FC<{ user: User }> = ({ user }) => {
  if (user.location == 'offline') {
    return;
  }

  const [instance, setInstance] = useState<Instance | null>();

  if (user.location == 'private') {
    return 'In Private';
  }

  useEffect(() => {
    void (async () => {
      setInstance(await getInstance(user.location));
    })();
  }, [user.location]);

  if (!instance) {
    return (
      <div>
        <Loader2 className="animate-spin" />
      </div>
    );
  }

  return (
    <div className="col-span-2 flex flex-col gap-1">
      <div className="font-medium">
        {user.displayName}
        {' '}
        is currently in
        {' '}
      </div>
      <div className={`
        select-text whitespace-pre-wrap text-sm text-muted-foreground
      `}
      >
        <div className={`
          scale-[.99] rounded-lg border-2 border-primary bg-primary/10 p-2
          transition
          hover:scale-100 hover:bg-primary/20
        `}
        >
          <div className="flex gap-2">
            <img className="w-28 rounded-md" src={instance.world.thumbnailImageUrl} alt={instance.world.name} />
            <div className="flex flex-col">
              <div className="text-muted-foreground">
                <span className="text-xl font-bold text-foreground">{instance.world.name}</span>
                <span> by </span>
                <span>{instance.world.authorName}</span>
              </div>
              <div>
                <span>{`#${instance.name}`}</span>
                <span>{getInstanceType(instance)}</span>
              </div>
              <div>
                <span>{instance.userCount}</span>
                <span>/</span>
                <span>{instance.capacity}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
UserLocation.displayName = 'UserLocation';

const UserPage: React.FC = () => {
  const { id } = useParams();
  const [user, setUser] = useState<User | null>();
  const navigate = useNavigate();

  if (!id) {
    return <div>id empty error</div>;
  }

  useEffect(() => {
    void (async () => {
      try {
        setUser(null);
        const data = await getUserById(id);
        setUser(data);
      }
      catch (error) {
        if (error instanceof APIFetchError) {
          if (error.response.status == 401) {
            void navigate('/');
          }
        }
      }
    })();
  }, [id]);

  if (!user) {
    return (
      <Page className="grid h-full w-full items-center justify-center">
        <Loader2 className="animate-spin" />
      </Page>
    );
  }

  return (
    <div>
      <img
        src={user.profilePicOverrideThumbnail || user.currentAvatarImageUrl}
        className="h-48 w-full object-cover"
        draggable={false}
      />
      <BackButton />
      <Page className="flex flex-col">
        <div className="flex h-16 gap-2 pl-4">
          <div className="relative w-28 self-end">
            <div className={`
              absolute bottom-0 left-0 rounded-full bg-background p-1
            `}
            >
              <Avatar className="size-24">
                <AvatarImage
                  src={user.userIcon || user.currentAvatarThumbnailImageUrl}
                  className="object-cover"
                />
                <AvatarFallback>{user.displayName.slice(0, 3)}</AvatarFallback>
              </Avatar>
              <div className={`
                absolute bottom-0 right-0 rounded-full bg-background p-1
              `}
              >
                <StatusBadge
                  status={getUserStatus(user)}
                  state={getUserState(user)}
                />
              </div>
            </div>
          </div>
          <div className="flex flex-1 items-center justify-between gap-2 pb-2">
            <div className="flex flex-col">
              <div className="flex items-center gap-2 text-2xl font-bold">
                <Tooltip>
                  <TooltipTrigger onClick={() => void copy(user.displayName)}>{user.displayName}</TooltipTrigger>
                  <TooltipContent>Click to copy</TooltipContent>
                </Tooltip>
                {user.pronouns && (
                  <div className="text-sm font-normal text-muted-foreground">
                    (
                    {user.pronouns}
                    )
                  </div>
                )}
              </div>
              <div className="flex items-center gap-1">
                <TrustRank rank={getUserTrustRank(user)} />
                {user.badges.length > 0 && (
                  <>
                    <DotSeparator />
                    {user.badges.map((badge) => (
                      <HoverCard key={`user-badge-${badge.badgeId}`}>
                        <HoverCardTrigger>
                          <img
                            src={badge.badgeImageUrl}
                            alt={badge.badgeName}
                            className="size-6"
                          />
                        </HoverCardTrigger>
                        <HoverCardContent className="flex flex-col gap-2">
                          <div className="flex items-center gap-2">
                            <img
                              src={badge.badgeImageUrl}
                              alt={badge.badgeName}
                              className="size-12"
                            />
                            <div className="flex flex-col">
                              <span className="font-bold">{badge.badgeName}</span>
                              <span className="text-xs text-muted-foreground">{yyyyMMddHHmmss(badge.assignedAt)}</span>
                            </div>
                          </div>
                          <div className="text-sm">
                            {badge.badgeDescription}
                          </div>
                        </HoverCardContent>
                      </HoverCard>
                    ))}
                  </>
                )}
              </div>
            </div>
            <div className="flex flex-wrap items-center justify-end gap-2">
              {user.bioLinks.map((href, i) => {
                const website = getWebsiteFromUrl(href);
                return (
                  <ExternalLink href={href} key={`bio-link-${i}`} variant="icon">
                    <website.icon size={20} />
                  </ExternalLink>
                );
              })}
            </div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2 pt-4">
          {location && <UserLocation user={user} />}
          <div className="col-span-2 flex flex-col gap-1">
            <div className="font-medium">Bio</div>
            <div className={`
              select-text whitespace-pre-wrap text-sm text-muted-foreground
            `}
            >
              {normalizeSymbols(user.bio)}
            </div>
          </div>
          <div className="col-span-2 flex flex-col gap-1">
            <div className="font-medium">User Id</div>
            <div className="select-all font-mono text-sm text-muted-foreground">
              {user.id}
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <div className="font-medium">Avatar Cloning</div>
            <div className="text-sm text-muted-foreground">
              {user.allowAvatarCopying ? 'Allow' : 'Deny'}
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <div className="font-medium">Date Joined</div>
            <div className="flex flex-col text-sm text-muted-foreground">
              <div>{yyyyMMddHHmmss(user.date_joined)}</div>
              <div>{relative(user.date_joined)}</div>
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <div className="font-medium">Last Login</div>
            <div className="flex flex-col text-sm text-muted-foreground">
              <div>{yyyyMMddHHmmss(user.last_login)}</div>
              <div>{relative(user.last_login)}</div>
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <div className="font-medium">Last Activity</div>
            <div className="flex flex-col text-sm text-muted-foreground">
              <div>{yyyyMMddHHmmss(user.last_activity)}</div>
              <div>{relative(user.last_activity)}</div>
            </div>
          </div>
          {user.last_mobile && (
            <div className="flex flex-col gap-1">
              <div className="font-medium">Last Mobile</div>
              <div className="flex flex-col text-sm text-muted-foreground">
                <div>{yyyyMMddHHmmss(user.last_mobile)}</div>
                <div>{relative(user.last_mobile)}</div>
              </div>
            </div>
          )}
        </div>
      </Page>
    </div>
  );
};

export default UserPage;
