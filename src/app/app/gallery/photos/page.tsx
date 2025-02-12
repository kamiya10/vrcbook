import { Copy, ExternalLinkIcon, Grid2x2, Grid3x3, Save, SortAsc, SortDesc, Trash2, Upload } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

import { Page, PageHeader } from '@/components/ui/page';
import { Button } from '@/components/ui/button';
import { ExternalLink } from '@/components/ui/external-link';
import { cn } from '@/lib/utils';
import { getGalleryPhotos } from '@/lib/api';

import type { File } from '@/lib/models/file';

const GalleryPhotosPage: React.FC = () => {
  const [prints, setPrints] = useState<File[]>([]);
  const [sortAscending, setSortAscending] = useState<boolean>(false);
  const [largeGrid, setLargeGrid] = useState<boolean>(false);

  useEffect(() => {
    void (async () => {
      setPrints(await getGalleryPhotos());
    })();
  }, []);

  const sorted = useMemo(() => sortAscending ? prints : [...prints].reverse(), [prints, sortAscending]);

  return (
    <Page className="flex flex-col gap-4">
      <PageHeader>
        Photos
        (
        {prints.length}
        )
      </PageHeader>
      <div className="flex justify-between">
        <div className="flex items-center gap-2">
          <Button>
            <Upload />
            <span>Upload</span>
          </Button>
          <span>Recommended 1920 × 1080px (16:9)</span>
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={() => setSortAscending(!sortAscending)} size="icon" variant="outline">
            {sortAscending ? <SortAsc /> : <SortDesc />}
          </Button>
          <Button onClick={() => setLargeGrid(!largeGrid)} size="icon" variant="outline">
            {largeGrid ? <Grid2x2 /> : <Grid3x3 />}
          </Button>
        </div>
      </div>
      <div className={cn(`grid gap-3`, largeGrid
        ? `grid-cols-[repeat(auto-fit,_minmax(24rem,_1fr))]`
        : `grid-cols-[repeat(auto-fit,_minmax(12rem,_1fr))]`)}
      >
        {sorted.map((v) => (
          <div
            key={`photo-${v.id}`}
            className="group relative overflow-hidden rounded-md"
          >
            <img
              src={`https://api.vrchat.cloud/api/1/file/${v.id}/1/file`}
              alt={v.id}
            />
            <div className={cn(`
              absolute inset-0 flex items-center justify-center gap-2 rounded-md
              bg-black/60 opacity-0 transition-opacity
              group-hover:opacity-100
            `, largeGrid && 'flex-col')}
            >
              <Button size={largeGrid ? 'default' : 'icon'}>
                <Copy />
                {largeGrid && 'Copy'}
              </Button>
              <ExternalLink href={`https://api.vrchat.cloud/api/1/file/${v.id}/1/file`}>
                <Button size={largeGrid ? 'default' : 'icon'}>
                  <ExternalLinkIcon />
                  {largeGrid && 'Open in browser'}
                </Button>
              </ExternalLink>
              <Button size={largeGrid ? 'default' : 'icon'}>
                <Save />
                {largeGrid && 'Save to disk'}
              </Button>
              <Button variant="destructive" size={largeGrid ? 'default' : 'icon'}>
                <Trash2 />
                {largeGrid && 'Delete'}
              </Button>
            </div>
          </div>
        ))}
      </div>
    </Page>
  );
};
GalleryPhotosPage.displayName = 'PrintsPage';

export default GalleryPhotosPage;
