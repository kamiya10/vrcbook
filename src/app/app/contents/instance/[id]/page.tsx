import { ChevronDown, Copy, ExternalLinkIcon, Loader2, LogIn } from 'lucide-react';
import { Link, useNavigate, useParams } from 'react-router';
import { useEffect, useState } from 'react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import BackButton from '@/components/common/back-button';
import { Button } from '@/components/ui/button';
import { ExternalLink } from '@/components/ui/external-link';
import { Page } from '@/components/ui/page';
import { RegionFlag } from '@/lib/constants';
import { Separator } from '@/components/ui/separator';
import { TrustRank } from '@/components/user/trust-rank';
import { UserCard } from '@/components/card/user-card';
import { WorldCard } from '@/components/card/world-card';
import { copy } from '@/lib/utils';
import { getInstance } from '@/lib/api';
import { getInstanceType } from '@/lib/world';
import { getUserTrustRank } from '@/lib/user';
import { useFriendsStore } from '@/stores/friends';

import type { Instance } from '@/lib/models/world';

const InstancePage: React.FC = () => {
  const navigate = useNavigate();
  const friendsStore = useFriendsStore();
  const { id } = useParams();

  if (!id) {
    return (
      <Page className="grid items-center justify-center">
        <div className="flex flex-col items-center">
          <div>Invalid Instance ID</div>
          <Button variant="secondary" onClick={() => void navigate(-1)}>Back</Button>
        </div>
      </Page>
    );
  }

  const [instance, setInstance] = useState<Instance | null>(null);

  useEffect(() => {
    void (async () => {
      const data = await getInstance(id);
      setInstance(data);
    })();
  }, [id]);

  if (!instance) {
    return (
      <Page className="grid h-full w-full items-center justify-center">
        <Loader2 className="animate-spin" />
      </Page>
    );
  }

  const Flag = RegionFlag[instance.region];
  const friendsInInstance = friendsStore.friends?.filter(([v]) => v.location == instance.location) ?? [];

  return (
    <div>
      <img
        src={instance.world.imageUrl}
        className="h-48 w-full object-cover"
        draggable={false}
      />
      <BackButton />
      <Page className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <Flag className="w-8 rounded-md border" />
              <span className="text-2xl font-bold">
                {`#${instance.name}`}
              </span>
              <span className="text-2xl font-bold">
                {getInstanceType(instance)}
              </span>
            </div>

            <div className="flex gap-1 text-muted-foreground">
              <HoverCard>
                <HoverCardTrigger asChild>
                  <Link
                    to={`/app/world/${instance.world.id}`}
                    className="underline decoration-dotted underline-offset-2"
                  >
                    {instance.world.name}
                  </Link>
                </HoverCardTrigger>
                <HoverCardContent className="p-0">
                  <WorldCard worldId={instance.world.id} />
                </HoverCardContent>
              </HoverCard>
              by
              <HoverCard>
                <HoverCardTrigger asChild>
                  <Link
                    to={`/app/contents/user/${instance.world.authorId}`}
                    className="underline decoration-dotted underline-offset-2"
                  >
                    {instance.world.authorName}
                  </Link>
                </HoverCardTrigger>
                <HoverCardContent>
                  <UserCard userId={instance.world.authorId} />
                </HoverCardContent>
              </HoverCard>
            </div>
          </div>
          <div className="flex gap-2">
            <div className="flex">
              <ExternalLink href={`https://vrch.at/${instance.secureName}`}>
                <Tooltip delayDuration={1000}>
                  <TooltipTrigger asChild>
                    <Button
                      variant="secondary"
                      size="icon"
                      className="rounded-r-none"
                    >
                      <ExternalLinkIcon />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    Open in external browser
                  </TooltipContent>
                </Tooltip>
              </ExternalLink>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="secondary"
                    className="rounded-l-none px-0.5"
                  >
                    <ChevronDown />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => void copy(`https://vrch.at/${instance.secureName}`)}>
                    <Copy />
                    Copy Instance URL
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => void copy(`https://vrchat.com/home/world/${instance.worldId}`)}>
                    <Copy />
                    Copy World URL
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => void copy(`https://vrchat.com/home/launch?worldId=${instance.worldId}`)}>
                    <Copy />
                    Copy World Public URL
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => void copy(`vrchat://launch?ref=vrchat.com&id=${instance.id}`)}>
                    <Copy />
                    Copy Launch URL
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <div className="flex">
              <ExternalLink href={`vrchat://launch?ref=vrchat.com&id=${instance.id}`}>
                <Button>
                  <LogIn />
                  {' '}
                  Launch
                </Button>
              </ExternalLink>
              {/* <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button className="rounded-l-none px-0.5"><ChevronDown /></Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem asChild>
                    <ExternalLink href={`vrchat://launch?ref=vrchat.com&id=${instance.id}`} unstyled>
                      <Computer />
                      Launch in Desktop Mode
                    </ExternalLink>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu> */}
            </div>
          </div>
        </div>
        <Separator className="mt-1" />
        <div className="flex gap-2 p-2">
          <div className="flex-1">
            <div className="flex flex-col gap-2">
              <div className="grid grid-cols-2 gap-2">
                <div className="flex flex-col gap-1">
                  <div className="font-medium">Users</div>
                  <div className="flex gap-1 text-sm text-muted-foreground">
                    <span>{instance.userCount}</span>
                    {friendsInInstance.length > 0 && <span>{`(${friendsInInstance.length})`}</span>}
                  </div>
                </div>
                <div className="flex flex-col gap-1">
                  <div className="font-medium">Capacity</div>
                  <div className="flex gap-1 text-sm text-muted-foreground">
                    {instance.capacity}
                  </div>
                </div>
                <div className="flex flex-col gap-1">
                  <div className="font-medium">Region</div>
                  <div className="text-sm text-muted-foreground">
                    {instance.region}
                  </div>
                </div>
                <div className="flex flex-col gap-1">
                  <div className="font-medium">Age Gate</div>
                  <div className="text-sm text-muted-foreground">
                    {instance.ageGate ? '✔️' : '✖️'}
                  </div>
                </div>
                <div className="col-span-2 flex flex-col gap-1">
                  <div className="font-medium">World Id</div>
                  <div className={`
                    select-all font-mono text-sm text-muted-foreground
                  `}
                  >
                    {instance.worldId}
                  </div>
                </div>
                <div className="col-span-2 flex flex-col gap-1">
                  <div className="font-medium">Instance Id</div>
                  <div className={`
                    select-all font-mono text-sm text-muted-foreground
                  `}
                  >
                    {instance.instanceId}
                  </div>
                </div>
              </div>
            </div>
          </div>
          {friendsInInstance.length > 0 && (
            <div className="p-2">
              <div className="font-medium">Friends in this Instance</div>
              <div className="flex flex-col">
                {friendsInInstance.map(([user]) => (
                  <div
                    key={user.id}
                    className="flex items-center gap-2 rounded-md p-1"
                  >
                    <Avatar className="size-8">
                      <AvatarImage src={user.userIcon || user.currentAvatarThumbnailImageUrl} />
                      <AvatarFallback>{user.displayName.slice(0, 3)}</AvatarFallback>
                    </Avatar>
                    <TrustRank rank={getUserTrustRank(user)}>{user.displayName}</TrustRank>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </Page>
    </div>
  );
};
InstancePage.displayName = 'InstancePage';

export default InstancePage;
