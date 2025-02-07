import { ChevronDown, ChevronRight, ChevronsUpDown, Globe2, Home, ScrollText, Search, Settings, Shield, SmilePlus, Star, User, UserCircle2, UserRound, UserRoundPlus, UsersRound } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router';
import { useEffect, useState } from 'react';

import { getUserStatus, getUserStatusDescription, getUserTrustRank } from '@/lib/user';
import { getInstanceType } from '@/lib/world';
import { getWorldInstance } from '@/lib/api';
import { useDialogStore } from '@/stores/dialog';
import { useFavoritesStore } from '@/stores/favorites';
import { useUserStore } from '@/stores/user';

import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from './ui/collapsible';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuPortal, DropdownMenuSeparator, DropdownMenuSub, DropdownMenuSubContent, DropdownMenuSubTrigger, DropdownMenuTrigger } from './ui/dropdown-menu';
import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarHeader, SidebarMenu, SidebarMenuBadge, SidebarMenuButton, SidebarMenuItem, SidebarMenuSub, SidebarMenuSubButton, SidebarMenuSubItem, SidebarSeparator } from './ui/sidebar';
import { Badge } from './ui/badge';
import { StatusBadge } from './user/status-badge';
import { TrustRank } from './user/trust-rank';

import type { ComponentProps } from 'react';
import type { Instance } from '@/lib/models/world';

type AppSidebarProps = ComponentProps<typeof Sidebar>;

const AppSidebar: React.FC<AppSidebarProps> = (props) => {
  const dialogStore = useDialogStore();
  const favoritesStore = useFavoritesStore();
  const [currentInstance, setCurrentInstance] = useState<Instance | null>(null);

  const { pathname } = useLocation();
  const navigate = useNavigate();
  const user = useUserStore((state) => state.current);

  if (!user) {
    return void navigate('/');
  }

  useEffect(() => {
    void favoritesStore.fetchGroups();

    if (!user.presence.world.startsWith('wrld')) return;

    void (async () => {
      const data = await getWorldInstance(user.presence.world, user.presence.instance);
      setCurrentInstance(data);
    })();
  }, []);

  return (
    <Sidebar {...props} variant="inset" collapsible="icon">
      {currentInstance && (
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                isActive={pathname == `/app/instance/${currentInstance.id}`}
                className={`
                  h-auto items-stretch
                  group-data-[collapsible=icon]:!p-0
                `}
              >
                <Link
                  to={`/app/instance/${currentInstance.id}`}
                  className={`
                    flex flex-col gap-2 border-2 border-primary bg-primary/15
                    hover:!bg-primary/25
                  `}
                >
                  <div className={`
                    relative h-24 w-full overflow-hidden rounded-md
                    group-data-[collapsible=icon]:h-full
                  `}
                  >
                    <div className={`
                      absolute left-0 top-0 rounded-br-md bg-accent/60 py-0.5
                      pl-1 pr-1.5 text-xs font-bold text-accent-foreground
                    `}
                    >
                      CURRENT
                    </div>
                    <img
                      src={currentInstance.world.thumbnailImageUrl}
                      alt={currentInstance.world.name}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className={`
                    flex flex-col gap-1
                    group-data-[collapsible=icon]:hidden
                  `}
                  >
                    <div className="text-ellipsis font-bold">{currentInstance.world.name}</div>
                    <div className="flex justify-between">

                      <div className="text-xs text-muted-foreground">
                        #
                        {currentInstance.instanceId.split('~')[0]}
                        {' '}
                        {getInstanceType(currentInstance)}
                      </div>
                      <div className={`
                        flex items-center gap-1 text-xs text-muted-foreground
                      `}
                      >
                        <UsersRound size={16} />
                        <span>
                          {currentInstance.userCount}
                          /
                          {currentInstance.capacity}
                        </span>
                        {currentInstance.hardClose && (
                          <Badge
                            variant="destructive"
                            className="px-1 py-px text-2xs"
                          >
                            CLOSED
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>
      )}
      <SidebarContent className="gap-0">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={pathname == '/app'}>
                  <Link to="/app" replace>
                    <Home />
                    Home
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={pathname == '/app/game-log'}>
                  <Link to="/app/game-log" replace>
                    <ScrollText />
                    Feed
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={pathname == '/app/discover'}>
                  <Link to="/app/discover" replace>
                    <Globe2 />
                    Discover
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={pathname == '/app/search'}>
                  <Link to="/app/search" replace>
                    <Search />
                    Search
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarSeparator />
        <Collapsible defaultOpen className="group/social">
          <SidebarGroup>
            <SidebarGroupLabel asChild>
              <CollapsibleTrigger>
                Social
                <ChevronDown
                  className={`
                    ml-auto transition-transform
                    group-data-[state=open]/social:rotate-180
                  `}
                />
              </CollapsibleTrigger>
            </SidebarGroupLabel>
            <CollapsibleContent>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild isActive={pathname == '/app/social/friends'}>
                      <Link to="/app/social/friends" replace>
                        <UsersRound />
                        My Friends
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <Collapsible defaultOpen className="group/friend-favorite">
                    <SidebarMenuItem>
                      <CollapsibleTrigger asChild>
                        <SidebarMenuButton>
                          <Star />
                          <span>Favorites</span>
                          <ChevronRight
                            className={`
                              ml-auto transition-transform
                              group-data-[state=open]/friend-favorite:rotate-90
                            `}
                          />
                        </SidebarMenuButton>
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <SidebarMenuSub>
                          {favoritesStore.friend && favoritesStore.friend.map(([v], i) => (
                            <SidebarMenuSubItem key={`friend-favorite-group-${i}`}>
                              <SidebarMenuSubButton asChild isActive={pathname == `/app/social/favorites/${i}`}>
                                <Link to={`/app/social/favorites/${i}`} replace>
                                  <span>{v.displayName}</span>
                                  <SidebarMenuBadge></SidebarMenuBadge>
                                </Link>
                              </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                          ))}
                        </SidebarMenuSub>
                      </CollapsibleContent>
                    </SidebarMenuItem>
                  </Collapsible>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild isActive={pathname == '/app/social/moderation'}>
                      <Link to="/app/social/moderation" replace>
                        <Shield />
                        Moderation
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </CollapsibleContent>
          </SidebarGroup>
        </Collapsible>
        <Collapsible defaultOpen className="group/world">
          <SidebarGroup>
            <SidebarGroupLabel asChild>
              <CollapsibleTrigger>
                World
                <ChevronDown
                  className={`
                    ml-auto transition-transform
                    group-data-[state=open]/world:rotate-180
                  `}
                />
              </CollapsibleTrigger>
            </SidebarGroupLabel>
            <CollapsibleContent>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild isActive={pathname == '/app/world/own'}>
                      <Link to="/app/world/own" replace>
                        <Globe2 />
                        My Worlds
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <Collapsible defaultOpen className="group/world-favorite">
                    <SidebarMenuItem>
                      <CollapsibleTrigger asChild>
                        <SidebarMenuButton>
                          <Star />
                          <span>Favorites</span>
                          <ChevronRight
                            className={`
                              ml-auto transition-transform
                              group-data-[state=open]/world-favorite:rotate-90
                            `}
                          />
                        </SidebarMenuButton>
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <SidebarMenuSub>
                          {favoritesStore.world && favoritesStore.world.map(([v], i) => (
                            <SidebarMenuSubItem key={`world-favorite-group-${i}`}>
                              <SidebarMenuSubButton asChild isActive={pathname == `/app/world/favorites/${i}`}>
                                <Link to={`/app/world/favorites/${i}`} replace>
                                  <span>{v.displayName}</span>
                                  <SidebarMenuBadge></SidebarMenuBadge>
                                </Link>
                              </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                          ))}
                        </SidebarMenuSub>
                      </CollapsibleContent>
                    </SidebarMenuItem>
                  </Collapsible>
                </SidebarMenu>
              </SidebarGroupContent>
            </CollapsibleContent>
          </SidebarGroup>
        </Collapsible>
        <Collapsible className="group/avatar">
          <SidebarGroup>
            <SidebarGroupLabel asChild>
              <CollapsibleTrigger>
                Avatar
                <ChevronDown
                  className={`
                    ml-auto transition-transform
                    group-data-[state=open]/avatar:rotate-180
                  `}
                />
              </CollapsibleTrigger>
            </SidebarGroupLabel>
            <CollapsibleContent>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild isActive={pathname == '/app/avatar/own'}>
                      <Link to="/app/avatar/own" replace>
                        <User />
                        My Avatars
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <Collapsible defaultOpen className="group/world-favorite">
                    <SidebarMenuItem>
                      <CollapsibleTrigger asChild>
                        <SidebarMenuButton>
                          <Star />
                          <span>Favorites</span>
                          <ChevronRight
                            className={`
                              ml-auto transition-transform
                              group-data-[state=open]/world-favorite:rotate-90
                            `}
                          />
                        </SidebarMenuButton>
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <SidebarMenuSub>
                          {favoritesStore.avatar && favoritesStore.avatar.map(([v], i) => (
                            <SidebarMenuSubItem key={`avatar-favorite-group-${i}`}>
                              <SidebarMenuSubButton asChild isActive={pathname == `/app/avatar/favorites/${i}`}>
                                <Link to={`/app/avatar/favorites/${i}`} replace>
                                  <span>{v.displayName}</span>
                                  <SidebarMenuBadge></SidebarMenuBadge>
                                </Link>
                              </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                          ))}
                        </SidebarMenuSub>
                      </CollapsibleContent>
                    </SidebarMenuItem>
                  </Collapsible>
                </SidebarMenu>
              </SidebarGroupContent>
            </CollapsibleContent>
          </SidebarGroup>
        </Collapsible>
      </SidebarContent>
      <SidebarSeparator />
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton className={`
                  flex h-auto items-center
                  group-data-[collapsible=icon]:!rounded-full
                  group-data-[collapsible=icon]:!p-0
                `}
                >
                  <Avatar className="group-data-[collapsible=icon]:size-8">
                    <AvatarImage
                      src={user.userIcon || user.currentAvatarThumbnailImageUrl}
                      className="object-cover"
                    />
                    <AvatarFallback>asd</AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <TrustRank
                      rank={getUserTrustRank(user)}
                      className="font-medium"
                    >
                      {user.displayName}
                    </TrustRank>
                    <div className="flex items-center gap-1 text-xs">
                      <StatusBadge
                        status={getUserStatus(user)}
                        className="size-2"
                      />
                      <span>{getUserStatusDescription(user)}</span>
                    </div>
                  </div>
                  <ChevronsUpDown className="ml-auto" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                side="right"
                className="w-[--radix-popper-anchor-width]"
              >
                <DropdownMenuItem asChild>
                  <Link to={`/app/user/${user.id}`}>
                    <UserCircle2 />
                    <span>View Profile</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => dialogStore.setEditStatus(true)}>
                  <SmilePlus />
                  <span>Edit Status</span>
                </DropdownMenuItem>
                <DropdownMenuSub>
                  <DropdownMenuSubTrigger>
                    <UserRoundPlus />
                    <span>Switch Accounts</span>
                  </DropdownMenuSubTrigger>
                  <DropdownMenuPortal>
                    <DropdownMenuSubContent>
                      <DropdownMenuItem>
                        <UserRound />
                        <span>Account 2</span>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>
                        <UserRoundPlus />
                        <span>Add account</span>
                      </DropdownMenuItem>
                    </DropdownMenuSubContent>
                  </DropdownMenuPortal>
                </DropdownMenuSub>
                <DropdownMenuItem asChild>
                  <Link to="/app/settings">
                    <Settings />
                    <span>Settings</span>
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
};
AppSidebar.displayName = 'AppSidebar';

export default AppSidebar;
