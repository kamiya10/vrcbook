import * as React from 'react';
import { Gamepad2 } from 'lucide-react';
import { cva } from 'class-variance-authority';

import { cn } from '@/lib/utils';

import type { VariantProps } from 'class-variance-authority';

export enum State {
  /**
   * The User is currently online ingame
   */
  InGame = 'online',

  /**
   * The User is currently active on another platform
   */
  Active = 'active',

  /**
   * The User is offline
   */
  Offline = 'offline',
}

export enum Status {
  JoinMe = 'join me',
  Active = 'active',
  AskMe = 'ask me',
  DoNotDistrub = 'busy',
  Offline = 'offline',
}

const statusBadgeVariants = cva(
  `inline-block size-6 rounded-full`,
  {
    variants: {
      state: {
        [State.Offline]: '',
        [State.InGame]: 'grid items-center justify-center',
        [State.Active]: '',
      },
      status: {
        [Status.JoinMe]: 'bg-blue-400',
        [Status.Active]: 'bg-green-500',
        [Status.AskMe]: 'bg-yellow-500',
        [Status.DoNotDistrub]: 'bg-red-500',
        [Status.Offline]: 'inner-border-2 inner-border-zinc-500',
      },
    },
    defaultVariants: {
      state: State.Offline,
      status: Status.Offline,
    },
  },
);

export interface StatusBadgeProps extends React.ButtonHTMLAttributes<HTMLDivElement>, VariantProps<typeof statusBadgeVariants> {
  state?: State;
  iconSize?: number;
}

const StatusBadge = React.forwardRef<HTMLDivElement, StatusBadgeProps>(
  ({ className, status, state, iconSize = 16, ...props }, ref) => {
    return (
      <div
        className={cn(statusBadgeVariants({ status, state, className }))}
        ref={ref}
        {...props}
      >
        {state == State.InGame && <Gamepad2 size={iconSize} />}
      </div>
    );
  },
);
StatusBadge.displayName = 'StatusBadge';

export { StatusBadge, statusBadgeVariants };
