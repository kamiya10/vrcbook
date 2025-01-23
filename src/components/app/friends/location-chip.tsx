import { Link } from 'react-router';

import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';
import { RegionFlag } from '@/lib/constants';
import { WorldCard } from '@/components/card/world-card';

import type { Instance } from '@/lib/models/world';

type LocationChipProps = Readonly<{
  instance?: Instance;
}>;

const LocationChip: React.FC<LocationChipProps> = ({ instance }) => {
  if (!instance) {
    return (
      <span
        className={`
          pointer-events-none flex items-center gap-2 rounded-full border
          bg-muted px-2 py-0.5 text-xs text-muted-foreground opacity-75
        `}
      >
        In Private
      </span>
    );
  }

  const Flag = RegionFlag[instance.region];

  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <Link
          to={`/app/instance/${instance.location}`}
          className={`
            flex items-center gap-2 rounded-full border bg-muted px-2 py-0.5
            text-xs text-muted-foreground
          `}
        >
          <Flag className="h-3 overflow-hidden rounded" />
          <span className="flex items-center gap-1">
            <span className="max-w-32 truncate text-card-foreground">
              {instance.world.name}
            </span>
            <span>{`#${instance.name}`}</span>
          </span>
        </Link>
      </HoverCardTrigger>
      <HoverCardContent className="p-0">
        <WorldCard worldId={instance.world.id} />
      </HoverCardContent>
    </HoverCard>
  );
};

LocationChip.displayName = 'LocationChip';

export default LocationChip;
