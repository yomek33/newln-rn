import { create } from "zustand";

import { getMaterialById, type Material } from "../hooks/material_api";

interface MaterialState {
  materials: Record<string, Material>;
  fetchMaterial: (ulid: string) => Promise<void>;
}

export const useMaterialStore = create<MaterialState>((set) => ({
  materials: {},

  fetchMaterial: async (ulid: string) => {
    try {
      const { data } = await getMaterialById(ulid);
      set((state) => ({
        materials: {
          ...state.materials,
          [ulid]: data,
        },
      }));
      //console.log("Fetched material:", JSON.stringify(data, null, 2));
    } catch (error) {
      console.error("Failed to fetch material:", error);
    }
  },
}));
