import { create } from "zustand";

interface PlayerStore {
  ids: string[];
  activeId?: string;
  duration: number | null;
  currentTime: number;
  setId: (id: string) => void;
  setIds: (ids: string[]) => void;
  setDuration: (duration: number | null) => void;
  setCurrentTime: (currentTime: number) => void;
  reset: () => void;
}

const usePlayer = create<PlayerStore>((set) => ({
  ids: [],
  activeId: undefined,
  duration: 0,
  currentTime: 0,
  setId: (id: string) => set({ activeId: id }),
  setIds: (ids: string[]) => set({ ids: ids }),
  setDuration: (duration: number | null) => set({ duration: duration }),
  setCurrentTime: (currentTime: number) => set({ currentTime: currentTime }),
  reset: () =>
    set({ ids: [], activeId: undefined, duration: 0, currentTime: 0 }),
}));

export default usePlayer;
