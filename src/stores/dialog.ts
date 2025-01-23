import { create } from 'zustand';

interface DialogStoreState {
  editStatus: boolean;
  setEditStatus(this: void, open: boolean): void;
}

export const useDialogStore = create<DialogStoreState>((set) => ({
  editStatus: false,
  setEditStatus(open: boolean) {
    set({ editStatus: open });
  },
}));
