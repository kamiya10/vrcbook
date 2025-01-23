import * as React from 'react';

import { cn } from '@/lib/utils';

type Props = React.HTMLAttributes<HTMLDivElement>;

export function Page({ children, className, ...props }: Props) {
  return (
    <div
      className={cn('relative h-full p-4 pb-0', className)}
      {...props}
    >
      {children}
    </div>
  );
}

export function PageHeader({ children, className, ...props }: Props) {
  return (
    <h1
      className={cn('flex items-center gap-2 text-xl font-bold', className)}
      {...props}
    >
      {children}
    </h1>
  );
}
