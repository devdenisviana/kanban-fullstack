const API_URL = import.meta.env.VITE_API_URL as string;
const TOKEN_KEY = "kanban_token";

export type User = { id: number; name: string; email: string };

export type Card = {
  id: number;
  title: string;
  description: string | null;
  position: number;
  columnId: number;
};

export type Column = {
  id: number;
  title: string;
  position: number;
  boardId: number;
  cards: Card[];
};

export type Board = {
  id: number;
  title: string;
  ownerId: number;
  createdAt: string;
};

export type BoardDetails = Board & { columns: Column[] };

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken(): void {
  localStorage.removeItem(TOKEN_KEY);
}

export class ApiError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const headers: Record<string, string> = {};
  const token = getToken();

  if (options.body) headers["Content-Type"] = "application/json";
  if (token) headers.Authorization = `Bearer ${token}`;

  const response = await fetch(`${API_URL}${path}`, { ...options, headers });

  if (response.status === 204) return undefined as T;

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new ApiError(response.status, data?.message ?? "Request failed");
  }

  return data as T;
}

export const api = {
  register: (name: string, email: string, password: string) =>
    request<User>("/auth/register", {
      method: "POST",
      body: JSON.stringify({ name, email, password }),
    }),

  login: (email: string, password: string) =>
    request<{ token: string; user: User }>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }),

  me: () => request<User>("/auth/me"),

  listBoards: () => request<Board[]>("/boards"),

  createBoard: (title: string) =>
    request<Board>("/boards", {
      method: "POST",
      body: JSON.stringify({ title }),
    }),

  getBoard: (id: number) => request<BoardDetails>(`/boards/${id}`),

  deleteBoard: (id: number) =>
    request<void>(`/boards/${id}`, { method: "DELETE" }),

  createCard: (columnId: number, title: string, description?: string) =>
    request<Card>("/cards", {
      method: "POST",
      body: JSON.stringify({ columnId, title, description }),
    }),

  updateCard: (
    id: number,
    data: {
      title?: string;
      description?: string | null;
      columnId?: number;
      position?: number;
    },
  ) =>
    request<Card>(`/cards/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    }),

  deleteCard: (id: number) =>
    request<void>(`/cards/${id}`, { method: "DELETE" }),
};