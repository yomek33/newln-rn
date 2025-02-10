import { create } from "zustand";

import { getMaterials, type Material } from "../hooks/material_api";

export type MaterialPreview = Pick<
  Material,
  | "ULID"
  | "Title"
  | "Content"
  | "Status"
  | "CreatedAt"
  | "WordsCount"
  | "PhrasesCount"
>;

interface MaterialListState {
  materials: MaterialPreview[] | null;
  setMaterials: (materials: MaterialPreview[] | null) => void;
  fetchMaterials: () => Promise<void>;
  addMaterial: (material: MaterialPreview) => void;
}

export const useMaterialStore = create<MaterialListState>((set) => ({
  materials: null,
  setMaterials: (materials: MaterialPreview[] | null) => {
    set({ materials });
  },
  fetchMaterials: async () => {
    try {
      console.log("Fetching materials...");
      const data = await getMaterials();
      const previews = data.data.map((item: Material) => ({
        ULID: item.ULID,
        Title: item.Title,
        Content: item.Content,
        Status: item.Status,
        CreatedAt: item.CreatedAt,
        WordsCount: item.WordsCount,
        PhrasesCount: item.PhrasesCount,
      }));
      set({ materials: previews });
    } catch (error) {
      console.error("Failed to fetch materials:", error);
    }
  },
  addMaterial: (material: MaterialPreview) => {
    set((state) => ({
      materials: state.materials ? [material, ...state.materials] : [material],
    }));
  },
}));
