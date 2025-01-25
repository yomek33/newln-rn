import { fetchWithToken } from "./fetch";
import { type Chat, type Phrase, type Word } from "./phares_api";

export interface Material {
  ID: number;
  UserID: string;
  Title: string;
  Content: string | null;
  Status: "draft" | "published";
  Words: Word[] | null;
  Phrases: Phrase[] | null;
  Chats: Chat[] | null;
  CreatedAt: string;
  UpdatedAt: string | null;
  DeletedAt?: string | null;
}

//  GET /api/phrases: 全てのPhraseデータを取得
export const getMaterials = async (): Promise<Material[]> => {
  return fetchWithToken<Material[]>("http://localhost:8080/api/materials", {
    method: "GET",
  });
};

// POST /api/materials: 新しいMaterialデータを作成
export const createMaterial = async (
  material: Omit<Material, "id" | "words" | "phrases" | "chats">,
): Promise<Material> => {
  return fetchWithToken<Material>("http://localhost:8080/api/materials", {
    method: "POST",
    body: material,
  });
};

//  GET /api/materials/[id]: 特定のMaterialデータを取得
export const getMaterialById = async (id: number): Promise<Material> => {
  return fetchWithToken<Material>(`http://localhost:8080/api/materials/${id}`, {
    method: "GET",
  });
};
