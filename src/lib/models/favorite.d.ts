export interface FavoriteGroup {
  displayName: string;
  id: string;
  name: string;
  ownerDisplayName: string;
  ownerId: string;
  tags: string[];
  type: 'world' | 'friend' | 'avatar';
  visibility: 'public' | 'friends' | 'private';
}

export interface FavoriteWorld {
  authorId: string;
  authorName: string;
  capacity: number;
  description: string;
  recommendedCapacity: number;
  created_at: string;
  favorites: number;
  favoriteGroup: string;
  favoriteId: string;
  featured: boolean;
  visits: number;
  heat: number;
  id: string;
  imageUrl: string;
  labsPublicationDate: 'none';
  name: string;
  occupants: number;
  organization: string;
  popularity: number;
  previewYoutubeId: string;
  publicationDate: string;
  releaseStatus: 'public';
  tags: string[];
  thumbnailImageUrl: string;
  unityPackages: [
    {
      id: string;
      assetUrl: string;
      assetUrlObject: { };
      assetVersion: 4;
      created_at: string;
      impostorizerVersion: string;
      performanceRating: 'Excellent';
      platform: 'standalonewindows';
      pluginUrl: string;
      pluginUrlObject: { };
      unitySortNumber: number;
      unityVersion: string;
      worldSignature: string;
      impostorUrl: string;
      scanStatus: string;
      variant: string;
    },
  ];
  updated_at: string;
  urlList: string[];
  udonProducts: string[];
  version: number;
}
