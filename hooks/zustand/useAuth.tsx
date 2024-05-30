import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
type Store = {
  isLoggedIn: boolean;
  setLoggedIn: () => void;
  path: string;
  setPath: (path: string) => void;
};

export const useAuth = create<Store>((set, get) => ({
  isLoggedIn: false,
  setLoggedIn: () => set({ path: get().path, isLoggedIn: true }),
  path: '/',
  setPath: () => set({ path: get().path, isLoggedIn: get().isLoggedIn }),
}));
