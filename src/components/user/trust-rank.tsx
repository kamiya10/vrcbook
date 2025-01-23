import * as React from 'react';
import { cva } from 'class-variance-authority';

import { cn } from '@/lib/utils';

import type { VariantProps } from 'class-variance-authority';

export enum TrustRanks {
  Visitor = 'visitor',
  NewUser = 'new',
  User = 'user',
  KnownUser = 'known',
  TrustedUser = 'trusted',
}

const TrustRankLabel = {
  [TrustRanks.Visitor]: 'Visitor',
  [TrustRanks.NewUser]: 'New User',
  [TrustRanks.User]: ' User',
  [TrustRanks.KnownUser]: 'Knwon User',
  [TrustRanks.TrustedUser]: 'Trusted User',
};

const trustRankVariants = cva(
  `text-sm`,
  {
    variants: {
      rank: {
        [TrustRanks.Visitor]:
          `
            text-zinc-500
            dark:text-zinc-400
          `,
        [TrustRanks.NewUser]:
          `
            text-blue-500
            dark:text-blue-400
          `,
        [TrustRanks.User]:
          `
            text-emerald-500
            dark:text-emerald-400
          `,
        [TrustRanks.KnownUser]:
          `
            text-orange-500
            dark:text-orange-400
          `,
        [TrustRanks.TrustedUser]: 'text-purple-500 dark:text-purple-400',
      },
    },
    defaultVariants: {
      rank: TrustRanks.Visitor,
    },
  },
);

export type TrustRankProps = React.ButtonHTMLAttributes<HTMLDivElement> & VariantProps<typeof trustRankVariants>;

const TrustRank = React.forwardRef<HTMLDivElement, TrustRankProps>(
  ({ className, rank = TrustRanks.Visitor, children, ...props }, ref) => {
    return (
      <div
        className={cn(trustRankVariants({ rank, className }))}
        ref={ref}
        {...props}
      >
        {children ?? TrustRankLabel[rank!]}
      </div>
    );
  },
);
TrustRank.displayName = 'TrustRank';

export { TrustRank, trustRankVariants };
