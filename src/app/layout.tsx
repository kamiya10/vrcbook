import { Outlet } from 'react-router';

import { Toaster } from '@/components/ui/sonner';

import AppTitlebar from '../components/app-titlebar';

export default function AppLayout() {
  return (
    <>
      <div className="grid grid-rows-[theme(size.8)_calc(100svh-theme(size.8))]">
        <AppTitlebar />
        <Outlet />
      </div>
      <Toaster />
    </>
  );
}
