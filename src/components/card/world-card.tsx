import { useEffect, useState } from 'react';

import { Card } from '@/components/ui/card';
import { normalizeSymbols } from '@/lib/utils';
import { useWorldStore } from '@/stores/world';

type WorldCardProps = Readonly<{
  worldId: string;
}>;

const WorldCard: React.FC<WorldCardProps> = ({ worldId }) => {
  const cache = useWorldStore((state) => state.getWorld)(worldId);
  const fetchWorld = useWorldStore((state) => state.fetchWorld);
  const [world, setWorld] = useState(cache);

  useEffect(() => {
    if (world) return;

    void (async () => {
      const data = await fetchWorld(worldId);
      setWorld(data);
    })();
  }, []);

  if (!world) {
    return <Card></Card>;
  }

  return (
    <div className="flex max-w-80 flex-col text-sm">
      <img src={world.thumbnailImageUrl} className="h-40 w-full object-cover" />
      <div className="flex flex-col gap-2 p-4">
        <div className="flex flex-col">
          <span className="font-medium">{world.name}</span>
          <span className="text-muted-foreground">
            by
            {' '}
            {world.authorName}
          </span>
        </div>
        <div className="line-clamp-3 text-xs text-muted-foreground">
          {normalizeSymbols(world.description)}
        </div>
      </div>
    </div>
  );
};
WorldCard.displayName = 'WorldCard';

export {
  WorldCard,
};
