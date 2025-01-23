export interface Badge {
  assignedAt: string;
  badgeDescription: string;
  badgeId: string;
  badgeImageUrl: string;
  badgeName: string;
  hidden: boolean;
  showcased: boolean;
  updatedAt: string;
}

export interface SteamDetails {
  avatar: string;
  avatarfull: string;
  avatarhash: string;
  avatarmedium: string;
  communityvisibilitystate: 3;
  loccityid: 45108;
  loccountrycode: 'TW';
  locstatecode: '04';
  personaname: string;
  personastate: 1;
  personastateflags: 3072;
  primaryclanid: string;
  profilestate: 1;
  profileurl: string;
  realname: string;
  steamid: string;
  timecreated: 1537671863;
}

export interface LimitedUser {
  bio: string;
  bioLinks: string[];
  currentAvatarImageUrl: string;
  currentAvatarThumbnailImageUrl: string;
  currentAvatarTags: string[];
  developerType: 'none' | 'trusted' | 'internal' | 'moderator';
  displayName: string;
  fallbackAvatar: string;
  id: string;
  isFriend: boolean;
  last_platform: 'standalonewindows';
  last_login: string;
  profilePicOverride: string;
  pronouns: string;
  status: 'offline' | 'busy' | 'ask me' | 'active' | 'join me';
  statusDescription: string;
  tags: string[];
  userIcon: string;
  location: string;
  friendKey: string;
}

export interface User extends LimitedUser {
  ageVerificationStatus: 'hidden' | 'verified' | '18+';
  allowAvatarCopying: boolean;
  badges: Badge[];
  date_joined: string;
  friendKey: string;
  friendRequestStatus: string;
  instanceId: string;
  last_activity: string;
  last_mobile: string;
  location: string;
  note: string;
  platform: string;
  profilePicOverrideThumbnail: string;
  state: 'offline' | 'active' | 'online';
  travelingToInstance: string;
  travelingToLocation: string;
  travelingToWorld: string;
  worldId: string;
}

export interface CurrentUser extends User {
  acceptedPrivacyVersion: 2;
  acceptedTOSVersion: 10;
  accountDeletionDate: null;
  accountDeletionLog: null;
  activeFriends: string[];
  ageVerified: boolean;
  contentFilters: [];
  currentAvatar: string;
  currentAvatarAssetUrl: string;
  emailVerified: boolean;
  fallbackAvatar: string;
  friendGroupNames: [];
  friends: string[];
  googleDetails: {};
  googleId: '';
  hasBirthday: boolean;
  hasEmail: boolean;
  hasLoggedInFromClient: boolean;
  hasPendingEmail: boolean;
  hideContentFilterSettings: boolean;
  homeLocation: string;
  isAdult: boolean;
  isBoopingEnabled: boolean;
  obfuscatedEmail: string;
  obfuscatedPendingEmail: '';
  oculusId: '';
  offlineFriends: string[];
  onlineFriends: string[];
  pastDisplayNames: [
    {
      displayName: string;
      reverted: boolean;
      updated_at: string;
    },
  ];
  picoId: '';
  presence: {
    avatarThumbnail: string;
    currentAvatarTags: string;
    debugflag: string;
    displayName: string;
    groups: string[];
    id: string;
    instance: string;
    instanceType: 'hidden';
    isRejoining: '0';
    platform: string;
    profilePicOverride: string;
    status: 'active';
    travelingToInstance: '';
    travelingToWorld: '';
    userIcon: '';
    world: string;
  };
  queuedInstance: null;
  receiveMobileInvitations: boolean;
  statusFirstTime: boolean;
  statusHistory: string[];
  steamDetails: SteamDetails;
  steamId: string;
  twoFactorAuthEnabled: boolean;
  twoFactorAuthEnabledDate: string;
  unsubscribe: boolean;
  updated_at: string;
  userLanguage: 'Japanese';
  userLanguageCode: 'zh-HK';
  username: 'kamiya927';
  viveId: '';
}
