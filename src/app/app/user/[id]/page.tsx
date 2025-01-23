import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { Loader2 } from 'lucide-react';

import { APIFetchError, getUserById } from '@/lib/api';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { getUserState, getUserStatus, getUserTrustRank } from '@/lib/user';
import BackButton from '@/components/common/back-button';
import { ExternalLink } from '@/components/ui/external-link';
import { Page } from '@/components/ui/page';
import { StatusBadge } from '@/components/user/status-badge';
import { TrustRank } from '@/components/user/trust-rank';
import { getWebsiteFromUrl } from '@/lib/url';
import { normalizeSymbols } from '@/lib/utils';

import type { User } from '@/lib/models/user';

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
              <div className="text-2xl font-bold">
                {user.displayName}
                {' '}
              </div>
              <div className="">
                {user.pronouns}
                <TrustRank rank={getUserTrustRank(user)} />
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
        <div className="p-2">
          <div className="font-medium">Bio</div>
          <div className={`
            select-text whitespace-pre-wrap text-sm text-muted-foreground
          `}
          >
            {normalizeSymbols(user.bio)}
          </div>
        </div>
      </Page>
    </div>
  );
};

export default UserPage;
