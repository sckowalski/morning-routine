import { create } from 'zustand'

interface ConfirmDialog {
  title: string
  message: string
  onConfirm: () => void
}

interface AppState {
  confirmDialog: ConfirmDialog | null
  showConfirm: (dialog: ConfirmDialog) => void
  hideConfirm: () => void
}

export const useAppStore = create<AppState>((set) => ({
  confirmDialog: null,
  showConfirm: (dialog) => set({ confirmDialog: dialog }),
  hideConfirm: () => set({ confirmDialog: null }),
}))
