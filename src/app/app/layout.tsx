import { Outlet } from 'react-router';
import { Sidebar } from 'lucide-react';

import DelayedUnmount from '@/components/render/delayed-unmount';
import EditStatusDialog from '@/components/dialog/edit-status';
import { useDialogStore } from '@/stores/dialog';

import { SidebarInset, SidebarProvider, SidebarTrigger } from '../../components/ui/sidebar';
import AppSidebar from '../../components/app-sidebar';

function SidebarToggle() {
  return (
    <SidebarTrigger className="fixed left-0.5 top-0.5 z-50" variant="ghost">
      <Sidebar />
    </SidebarTrigger>
  );
}

export default function Layout() {
  const dialogStore = useDialogStore();
  return (
    <>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <SidebarToggle />
          <Outlet />
        </SidebarInset>
      </SidebarProvider>
      <DelayedUnmount delay={500} show={dialogStore.editStatus}>
        <EditStatusDialog open={dialogStore.editStatus} setOpen={dialogStore.setEditStatus} />
      </DelayedUnmount>
    </>
  );
}
