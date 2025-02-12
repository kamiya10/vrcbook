import { cva } from 'class-variance-authority';
import { openUrl } from '@tauri-apps/plugin-opener';
import { useState } from 'react';

import { cn } from '@/lib/utils';

import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from './dialog';
import { Button } from './button';
import { Card } from './card';

import type { VariantProps } from 'class-variance-authority';

const externalLinkVariants = cva(
  `cursor-pointer`,
  {
    variants: {
      variant: {
        default: 'text-primary underline underline-offset-2',
        icon: `
          text-muted-foreground transition-colors
          hover:text-accent-foreground
        `,
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
);

export interface ExternalLinkProps extends React.AnchorHTMLAttributes<HTMLDivElement>, VariantProps<typeof externalLinkVariants> {
  href: string;
  unstyled?: boolean;
};

const ExternalLink: React.FC<ExternalLinkProps> = ({ href, className, unstyled = false, variant, ...props }) => {
  const [open, setOpen] = useState(false);

  const onClick = () => {
    if (href?.startsWith('https://vrchat.com')
      || href?.startsWith('https://api.vrchat.cloud')
      || href?.startsWith('https://vrch.at')
      || href?.startsWith('vrchat://')) {
      launch();
    }
    else {
      setOpen(true);
    }
  };

  const launch = () => {
    void openUrl(href);
  };

  return (
    <>
      <span
        className={cn(unstyled ? className : externalLinkVariants({ variant, className }))}
        onClick={onClick}
        {...props}
      />
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-center">Leaving VRCBook?</DialogTitle>
            <DialogDescription className="text-center">
              This link is taking you to the following website
            </DialogDescription>
          </DialogHeader>
          <Card className="p-4">
            {href}
          </Card>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="secondary">
                Close
              </Button>
            </DialogClose>
            <DialogClose asChild>
              <Button onClick={launch}>Continue</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
ExternalLink.displayName = 'ExternalLink';

export { ExternalLink };
