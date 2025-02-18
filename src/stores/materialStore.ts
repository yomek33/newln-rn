/* eslint-disable @typescript-eslint/no-explicit-any */
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

import { type ChatList } from "../hooks/chat";
import { getMaterialById, type Material } from "../hooks/material_api";

const defaultMaterial = (ulid: string): Material => ({
  ID: 0,
  UserID: "",
  ULID: ulid,
  Title: "",
  Content: null,
  Status: "draft",
  WordLists: [],
  PhraseLists: [],
  ChatList: null,
  CreatedAt: "",
  UpdatedAt: null,
  DeletedAt: null,
  HasPendingPhraseList: false,
  HasPendingWordList: false,
  generateStatus: null,
  WordsCount: 0,
  PhrasesCount: 0,
});

interface MaterialState {
  materials: Record<string, Material>;
  fetchMaterial: (ulid: string) => Promise<void>;
  updateMaterialData: (
    ulid: string,
    updater: (currentMaterial: Material) => Partial<Material>,
  ) => void;
}

export const useMaterialStore = create<MaterialState>()(
  immer((set, get) => ({
    materials: {},

    fetchMaterial: async (ulid: string) => {
      if (get().materials[ulid]) return; // 既に取得済みならスキップ

      try {
        const { data } = await getMaterialById(ulid);
        set((state) => {
          state.materials[ulid] = data;
        });
      } catch (error) {
        console.error("Failed to fetch material:", error);
      }
    },

    updateMaterialData: (ulid, updater) => {
      set((state) => {
        const currentMaterial: Material =
          state.materials[ulid] ?? defaultMaterial(ulid);
        const newData = updater(currentMaterial);

        // Helper function to merge lists like WordLists and PhraseLists
        const mergeLists = <T extends { ID: number; Items?: any[] }>(
          existing: T[] = [],
          updates: T[] = [],
        ): T[] =>
          updates.map((update) => {
            const existingItem =
              existing.find((e) => e.ID === update.ID) ?? update;
            return {
              ...existingItem,
              ...update,
              Items: update.Items?.length
                ? update.Items
                : (existingItem.Items ?? []),
            };
          });

        // Merging logic for chat lists
        const mergeChats = (
          existing: ChatList | null,
          updates: ChatList,
        ): ChatList => {
          if (!existing) return updates;

          const updatedChats = updates.Chats.map((newChat) => {
            const existingChat = existing.Chats.find(
              (c) => c.ID === newChat.ID,
            );
            return existingChat ? { ...existingChat, ...newChat } : newChat;
          });

          return { ...existing, ...updates, Chats: updatedChats };
        };

        state.materials[ulid] = {
          ...currentMaterial,
          ...newData,
          WordLists: newData.WordLists
            ? mergeLists(currentMaterial.WordLists, newData.WordLists)
            : currentMaterial.WordLists,
          PhraseLists: newData.PhraseLists
            ? mergeLists(currentMaterial.PhraseLists, newData.PhraseLists)
            : currentMaterial.PhraseLists,
          ChatList: newData.ChatList
            ? mergeChats(currentMaterial.ChatList, newData.ChatList)
            : currentMaterial.ChatList,
          HasPendingWordList: newData.WordLists
            ? false
            : currentMaterial.HasPendingWordList,
          HasPendingPhraseList: newData.PhraseLists
            ? false
            : currentMaterial.HasPendingPhraseList,
        };
      });
    },
  })),
);
