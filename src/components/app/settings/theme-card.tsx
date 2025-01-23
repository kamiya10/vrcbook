import { Check } from 'lucide-react';

import DarkThemeImage from '@/assets/img/theme-dark.png';
import LightThemeImage from '@/assets/img/theme-light.png';
import SystemThemeImage from '@/assets/img/theme-system.png';
import { cn } from '@/lib/utils';
import { useTheme } from '@/components/theme-provider';

import type { Theme } from '@/components/theme-provider';

const ThemeImages = {
  light: LightThemeImage,
  dark: DarkThemeImage,
  system: SystemThemeImage,
} as Record<Theme, string>;

type ThemeCardProps = Readonly<{
  value: Theme;
  label: string;
}>;

const ThemeCard: React.FC<ThemeCardProps> = ({ value, label }) => {
  const { theme, setTheme } = useTheme();

  return (
    <div
      className={cn(
        `
          m-1 overflow-hidden rounded-lg outline outline-1 outline-border
          data-[active]:bg-accent data-[active]:text-accent-foreground
          data-[active]:outline-2 data-[active]:outline-primary
        `,
      )}
      data-active={value === theme ? '' : null}
      onClick={() => setTheme(value)}
    >
      <img src={ThemeImages[value]} alt="" />
      <div className={cn('flex items-center gap-2 p-2 text-sm',
        value === theme && 'font-bold',
      )}
      >
        {value === theme && <Check size={16} strokeWidth={3} />}
        <span>{label}</span>
      </div>
    </div>
  );
};
ThemeCard.displayName = 'ThemeCard';

export default ThemeCard;
