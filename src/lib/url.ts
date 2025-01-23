import { SiBluesky, SiDiscord, SiGithub, SiX, SiYoutube } from '@icons-pack/react-simple-icons';
import { Globe } from 'lucide-react';

export const getWebsiteFromUrl = (url: string) => {
  const { hostname } = new URL(url);

  switch (hostname) {
    case 'bsky.app':
      return {
        icon: SiBluesky,
      };

    case 'discord.com':
      return {
        icon: SiDiscord,
      };

    case 'x.com':
    case 'twitter.com':
      return {
        icon: SiX,
      };

    case 'www.github.com':
    case 'github.com':
      return {
        icon: SiGithub,
      };

    case 'www.youtube.com':
    case 'youtube.com':
      return {
        icon: SiYoutube,
      };

    default:
      return {
        icon: Globe,
      };
  };
};
