import { ChevronDown, Copy, ExternalLinkIcon, Loader2, LogIn } from 'lucide-react';
import { Link, useNavigate, useParams } from 'react-router';
import { useEffect, useState } from 'react';

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { copy, relative, yyyyMMddHHmmss } from '@/lib/utils';
import BackButton from '@/components/common/back-button';
import { Button } from '@/components/ui/button';
import DotSeparator from '@/components/common/dot-separator';
import { ExternalLink } from '@/components/ui/external-link';
import { Page } from '@/components/ui/page';
import { Separator } from '@/components/ui/separator';
import { UserCard } from '@/components/card/user-card';
import { getWorldById } from '@/lib/api';
import { useFriendsStore } from '@/stores/friends';

import type { World } from '@/lib/models/world';

const WorldPage: React.FC = () => {
  const navigate = useNavigate();
  const friendsStore = useFriendsStore();
  const { id } = useParams();

  if (!id) {
    return (
      <Page className="grid items-center justify-center">
        <div className="flex flex-col items-center">
          <div>Invalid World ID</div>
          <Button variant="secondary" onClick={() => void navigate(-1)}>Back</Button>
        </div>
      </Page>
    );
  }

  const [world, setWorld] = useState<World | null>(null);

  useEffect(() => {
    void (async () => {
      const data = await getWorldById(id);
      setWorld(data);
    })();
  }, [id]);

  if (!world) {
    return (
      <Page className="grid h-full w-full items-center justify-center">
        <Loader2 className="animate-spin" />
      </Page>
    );
  }

  return (
    <div>
      <img
        src={world.imageUrl}
        className="h-48 w-full object-cover"
        draggable={false}
      />
      <BackButton />
      <Page className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold">
                {world.name}
              </span>
            </div>

            <div className="flex gap-1 text-muted-foreground">
              by
              <HoverCard>
                <HoverCardTrigger asChild>
                  <Link
                    to={`/app/contents/user/${world.authorId}`}
                    className="underline decoration-dotted underline-offset-2"
                  >
                    {world.authorName}
                  </Link>
                </HoverCardTrigger>
                <HoverCardContent>
                  <UserCard userId={world.authorId} />
                </HoverCardContent>
              </HoverCard>
              <DotSeparator />
              <div className={`
                font-medium text-blue-500
                dark:text-blue-400
              `}
              >
                PC
              </div>
              <div className={`
                font-medium text-green-500
                dark:text-green-400
              `}
              >
                Quest
              </div>
              {' '}
              players in this world
            </div>
          </div>
          <div className="flex gap-2">
            <div className="flex">
              <ExternalLink href={`https://vrchat.com/home/world/${world.id}`}>
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
                  <DropdownMenuItem onClick={() => void copy(`https://vrchat.com/home/world/${world.id}`)}>
                    <Copy />
                    Copy World URL
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => void copy(`https://vrchat.com/home/launch?worldId=${world.id}`)}>
                    <Copy />
                    Copy World Public URL
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <div className="flex">
              <ExternalLink href={`vrchat://launch?ref=vrchat.com&id=${world.id}`}>
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
                <div className="col-span-2 flex flex-col gap-1">
                  <div className="font-medium">Description</div>
                  <div className="select-text text-sm text-muted-foreground">
                    {world.description}
                  </div>
                </div>
                <div className="col-span-2 flex flex-col gap-1">
                  <div className="font-medium">World Id</div>
                  <div className={`
                    select-all font-mono text-sm text-muted-foreground
                  `}
                  >
                    {world.id}
                  </div>
                </div>
                <div className="flex flex-col gap-1">
                  <div className="font-medium">Heat</div>
                  <div className="text-sm text-muted-foreground">
                    {'🔥'.repeat(world.heat)}
                    {` (${world.heat})`}
                  </div>
                </div>
                <div className="flex flex-col gap-1">
                  <div className="font-medium">Popularity</div>
                  <div className="text-sm text-muted-foreground">
                    {'✨'.repeat(world.popularity)}
                    {` (${world.popularity})`}
                  </div>
                </div>
                <div className="flex flex-col gap-1">
                  <div className="font-medium">Users</div>
                  <div className="flex gap-1 text-sm text-muted-foreground">
                    <span>{world.occupants}</span>
                  </div>
                </div>
                <div className="flex flex-col gap-1">
                  <div className="font-medium">Capacity</div>
                  <div className="flex gap-1 text-sm text-muted-foreground">
                    {world.capacity}
                  </div>
                </div>
                <div className="flex flex-col gap-1">
                  <div className="font-medium">Last Update</div>
                  <div className="flex gap-1 text-sm text-muted-foreground">
                    {yyyyMMddHHmmss(world.updated_at)}
                    {relative(world.updated_at)}
                  </div>
                </div>
                <div className="flex flex-col gap-1">
                  <div className="font-medium">Created At</div>
                  <div className="flex gap-1 text-sm text-muted-foreground">
                    {yyyyMMddHHmmss(world.created_at)}
                    {relative(world.created_at)}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div>
            {world.instances}
          </div>
        </div>
      </Page>
    </div>
  );
};
WorldPage.displayName = 'InstancePage';

export default WorldPage;
