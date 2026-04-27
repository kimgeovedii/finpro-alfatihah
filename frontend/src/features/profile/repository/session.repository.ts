import { apiFetch } from "@/utils/api";

export interface ActiveSession {
  id: string;
  browser: string;
  os: string;
  deviceType: string;
  ip: string;
  lastActive: string;
  isCurrentDevice: boolean;
}

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface PaginatedSessions {
  data: ActiveSession[];
  meta: PaginationMeta;
}

export class SessionRepository {
  async getActiveSessions(page: number = 1, limit: number = 5): Promise<PaginatedSessions> {
    return apiFetch<PaginatedSessions>(`/sessions/active?page=${page}&limit=${limit}`);
  }

  async revokeSession(sessionId: string): Promise<void> {
    return apiFetch(`/sessions/${sessionId}`, "delete");
  }
}
