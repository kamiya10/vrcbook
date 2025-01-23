import { Settings } from 'lucide-react';

import { Page, PageHeader } from '@/components/ui/page';
import { Checkbox } from '@/components/ui/checkbox';
import ThemeCard from '@/components/app/settings/theme-card';
import { useTheme } from '@/components/theme-provider';

function ThemeSetting() {
  const { setUseAcrylic, themes, useAcrylic } = useTheme();

  return (
    <div className="my-4 flex flex-col gap-2 text-sm">
      <div className="flex flex-col">
        <h2 className="text-base font-bold">Theme</h2>
        <h3 className="text-muted-foreground">The overall look and feel of the app</h3>
      </div>
      <div className="flex gap-2 overflow-x-auto">
        {themes.map((v) => (
          <ThemeCard
            key={`theme-option-${v}`}
            value={v}
            label={v.charAt(0).toUpperCase() + v.slice(1)}
          />
        ))}
      </div>
      <label className="flex items-center gap-2">
        <Checkbox checked={useAcrylic} onClick={() => void setUseAcrylic(!useAcrylic)} />
        <span>Use acrylic background effect</span>
      </label>
    </div>
  );
}

export default function SettingsPage() {
  return (
    <Page>
      <PageHeader>
        <Settings />
        Settings
      </PageHeader>
      <ThemeSetting />
    </Page>
  );
}
