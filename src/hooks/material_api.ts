import { fetchWithToken } from "./fetch";
import { type Chat, type Phrase, type Word } from "./phares_api";


export interface Material {
  ID: number;
  UserID: string;
  LocalULID: string;
  Title: string;
  Content: string | null;
  Status: "draft" | "published";
  WordLists: WordLists[] | null;
  PhraseLists: PhraseLists[] | null;
  ChatList: Chat[] | null;
  CreatedAt: string;
  UpdatedAt: string | null;
  DeletedAt?: string | null;
}

export interface WordLists {
  ID: number;
  Title: string;
  Words: Word[];
  GenerateStatus: string;
}
export interface PhraseLists {
  ID: number;
  Title: string;
  Phrases: Phrase[];
  GenerateStatus: string;
}

// GET /api/materials: Retrieve all Material data
export const getMaterials = async (): Promise<{
  data: Material[];
  status: number;
}> => {
  return fetchWithToken<Material[]>("http://localhost:8080/api/materials", {
    method: "GET",
  });
};

// POST /api/materials: Create a new Material entry
export const createMaterial = async (
  material: Pick<Material, "Title" | "Content">,
): Promise<{ data: Material; status: number }> => {
  return fetchWithToken<Material>("http://localhost:8080/api/materials", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: material,
  });
};

// GET /api/materials/[id]: Retrieve a specific Material by ID
export const getMaterialById = async (
  ulid: string,
): Promise<{ data: Material; status: number }> => {
  console.log("getMaterialById", ulid);
  return fetchWithToken<Material>(
    `http://localhost:8080/api/materials/${ulid}`,
    {
      method: "GET",
    },
  );
};