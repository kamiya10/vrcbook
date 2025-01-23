import type { LimitedUser } from './user';

export interface World {
  authorId: string;
  authorName: string;
  capacity: number;
  created_at: string;
  description: string;
  favorites: number;
  featured: boolean;
  heat: number;
  id: string;
  imageUrl: string;
  instances: [id: string, userCount: number][];
  labsPublicationDate: string;
  name: string;
  occupants: number;
  organization: 'vrchat';
  popularity: number;
  previewYoutubeId: string | null;
  privateOccupants: number;
  publicOccupants: number;
  publicationDate: string;
  recommendedCapacity: number;
  releaseStatus: 'public' | 'private' | 'hidden' | 'all';
  tags: string[];
  thumbnailImageUrl: string;
  udonProducts: string[];
  unityPackages: [
    {
      assetUrl: 'https://api.vrchat.cloud/api/1/file/file_fa926ed6-ff64-4920-94d0-5580a5496eed/73/file';
      assetVersion: 4;
      created_at: '2023-10-01T12:15:04.117Z';
      id: 'unp_2c164715-0a80-413b-bbb5-591dbfa40add';
      platform: 'android';
      pluginUrl: '';
      unitySortNumber: 20190431000;
      unityVersion: '2019.4.31f1';
    },
    {
      assetUrl: 'https://api.vrchat.cloud/api/1/file/file_fa926ed6-ff64-4920-94d0-5580a5496eed/98/file';
      assetVersion: 1;
      created_at: '2024-09-13T17:25:00.162Z';
      id: 'unp_531084ba-15e5-409d-b45a-38a8ac5f39be';
      platform: 'android';
      unitySortNumber: 20190431000;
      unityVersion: '2019.4.31f1';
    },
    {
      assetUrl: 'https://api.vrchat.cloud/api/1/file/file_fa926ed6-ff64-4920-94d0-5580a5496eed/107/file';
      assetVersion: 4;
      created_at: '2024-11-25T01:22:18.170Z';
      id: 'unp_da8c3cb6-50ca-4aa0-9c86-efbe8093ba40';
      platform: 'android';
      unitySortNumber: 20220322000;
      unityVersion: '2022.3.22f1';
      worldSignature: 'AKgJl2ZlXKOBmznzolwBUBm48hPZgg8MtUni1ShLzjmW6XSv5A==';
    },
    {
      assetUrl: 'https://api.vrchat.cloud/api/1/file/file_9b11de93-be10-4ed2-95a7-e85e8a684bb4/104/file';
      assetVersion: 4;
      created_at: '2023-10-01T11:57:10.292Z';
      id: 'unp_baa26650-9424-4096-b340-30af29db641f';
      platform: 'standalonewindows';
      pluginUrl: '';
      unitySortNumber: 20190431000;
      unityVersion: '2019.4.31f1';
    },
    {
      assetUrl: 'https://api.vrchat.cloud/api/1/file/file_9b11de93-be10-4ed2-95a7-e85e8a684bb4/129/file';
      assetVersion: 1;
      created_at: '2024-09-13T17:13:46.854Z';
      id: 'unp_81d2ace2-ba49-4edc-8eba-193b5ddd330c';
      platform: 'standalonewindows';
      unitySortNumber: 20190431000;
      unityVersion: '2019.4.31f1';
    },
    {
      assetUrl: 'https://api.vrchat.cloud/api/1/file/file_9b11de93-be10-4ed2-95a7-e85e8a684bb4/138/file';
      assetVersion: 4;
      created_at: '2024-11-25T01:07:51.387Z';
      id: 'unp_6e3e167d-889b-4ae3-99f0-a35abfd543c9';
      platform: 'standalonewindows';
      unitySortNumber: 20220322000;
      unityVersion: '2022.3.22f1';
      worldSignature: 'ANCGu8/J/0PrMv4o/tzBfmtubG9OlWNHdspiFSxJ7gmQlrUR/Q==';
    },
  ];
  updated_at: string;
  urlList: string[];
  version: number;
  visits: number;
}

export interface Instance {
  active: boolean;
  ageGate: boolean;
  canRequestInvite: boolean;
  capacity: number;
  displayName: string;
  full: boolean;
  gameServerVersion: 0;
  id: string;
  instanceId: string;
  instancePersistenceEnabled: string;
  location: string;
  n_users: number;
  name: string;
  ownerId: string;
  permanent: boolean;
  photonRegion: 'us' | 'use' | 'usx' | 'eu' | 'jp' | 'unknown';
  platforms: {
    android: number;
    ios: number;
    standalonewindows: number;
  };
  playerPersistenceEnabled: boolean;
  region: 'us' | 'use' | 'eu' | 'jp';
  secureName: string;
  shortName: string;
  tags: string[];
  type: 'public' | 'hidden' | 'friends' | 'private' | 'group';
  worldId: string;
  hidden: string;
  friends: string;
  private: string;
  queueEnabled: boolean;
  queueSize: 6;
  recommendedCapacity: 6;
  roleRestricted: boolean;
  strict: boolean;
  userCount: 6;
  world: {
    authorId: string;
    authorName: 'A';
    capacity: 8;
    recommendedCapacity: 4;
    created_at: '1970-01-01T00:00:00.000Z';
    description: string;
    favorites: number;
    featured: boolean;
    heat: number;
    id: string;
    imageUrl: string;
    labsPublicationDate: 'none';
    name: string;
    namespace: string;
    occupants: number;
    organization: string;
    popularity: number;
    previewYoutubeId: string;
    privateOccupants: number;
    publicOccupants: number;
    publicationDate: 'none';
    releaseStatus: 'public';
    tags: [
      'A',
    ];
    thumbnailImageUrl: 'A';
    unityPackages: [
      {
        id: string;
        assetUrl: string;
        assetUrlObject: {};
        assetVersion: 4;
        created_at: '2020-09-10T06:13:27.777Z';
        impostorizerVersion: '0.17.0';
        performanceRating: 'Excellent';
        platform: 'standalonewindows';
        pluginUrl: string;
        pluginUrlObject: {};
        unitySortNumber: 20180414000;
        unityVersion: '2022.3.6f1';
        worldSignature: 'AHiPAWerwCpeYrxDthF5TU2SdUWEWnm43UAn8PKRXlS8k8tVRQ==';
        impostorUrl: string;
        scanStatus: string;
        variant: string;
      },
    ];
    updated_at: '1970-01-01T00:00:00.000Z';
    urlList: [
      string,
    ];
    version: 68;
    visits: 9988675;
    udonProducts: [
      'prod_c1644b5b-3ca4-45b4-97c6-a2a0de70d469',
    ];
  };
  users: LimitedUser[];
  groupAccessType: 'public' | 'plus' | 'members';
  hasCapacityForYou: boolean;
  nonce: string;
  closedAt: '1970-01-01T00:00:00.000Z';
  hardClose: boolean;
}
