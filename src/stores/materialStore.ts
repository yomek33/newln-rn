import { create } from "zustand";

import { getMaterialById, type Material } from "../hooks/material_api";

interface MaterialState {
  materials: Record<string, Material>;
  fetchMaterial: (ulid: string) => Promise<void>;
  updateMaterialData: (
    ulid: string,
    updater: (currentMaterial: Material) => Partial<Material>,
  ) => void;
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
    } catch (error) {
      console.error("Failed to fetch material:", error);
    }
  },
  updateMaterialData: (ulid, updater) => {
    set((state) => {
      const currentMaterial = state.materials[ulid] ?? {};
      const newData = updater(currentMaterial);
      console.log("📌 updateMaterialData: currentMaterial", currentMaterial);
      console.log("📌 updateMaterialData: newData", newData);

      // 以下は元のマージ処理
      const updatedWordLists = newData.WordLists
        ? newData.WordLists.map((newList) => {
            const existingList =
              currentMaterial.WordLists?.find(
                (list) => list.ID === newList.ID,
              ) ?? newList;
            return {
              ...existingList,
              ...newList,
              Words: newList.Words?.length
                ? newList.Words
                : (existingList.Words ?? []),
            };
          })
        : currentMaterial.WordLists;

      const updatedPhraseLists = newData.PhraseLists
        ? newData.PhraseLists.map((newList) => {
            const existingList =
              currentMaterial.PhraseLists?.find(
                (list) => list.ID === newList.ID,
              ) ?? newList;
            return {
              ...existingList,
              ...newList,
              Phrases: newList.Phrases?.length
                ? newList.Phrases
                : (existingList.Phrases ?? []),
            };
          })
        : currentMaterial.PhraseLists;

      const updatedMaterial = {
        ...currentMaterial,
        ...newData,
        WordLists: updatedWordLists,
        PhraseLists: updatedPhraseLists,
        HasPendingWordList: newData.WordLists
          ? false
          : (currentMaterial.HasPendingWordList ?? true),
        HasPendingPhraseList: newData.PhraseLists
          ? false
          : (currentMaterial.HasPendingPhraseList ?? true),
      };

      console.log("📌 updateMaterialData: updatedMaterial", updatedMaterial);
      return {
        materials: {
          ...state.materials,
          [ulid]: updatedMaterial,
        },
      };
    });
  },
}));
