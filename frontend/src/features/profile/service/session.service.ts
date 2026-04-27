import { create } from "zustand";
import { ActiveSession, PaginationMeta, SessionRepository } from "../repository/session.repository";

interface SessionState {
  sessions: ActiveSession[];
  meta: PaginationMeta | null;
  isLoading: boolean;
  error: string | null;
  fetchSessions: (page?: number, limit?: number) => Promise<void>;
  revokeSession: (sessionId: string) => Promise<void>;
}

const repository = new SessionRepository();

export const useSessionStore = create<SessionState>((set, get) => ({
  sessions: [],
  meta: null,
  isLoading: false,
  error: null,

  fetchSessions: async (page = 1, limit = 5) => {
    set({ isLoading: true, error: null });
    try {
      const response = await repository.getActiveSessions(page, limit);
      set({ 
        sessions: response.data, 
        meta: response.meta,
        isLoading: false 
      });
    } catch (err: any) {
      set({ error: err.message || "Failed to fetch sessions", isLoading: false });
    }
  },

  revokeSession: async (sessionId: string) => {
    set({ isLoading: true, error: null });
    try {
      await repository.revokeSession(sessionId);
      // Update local state after successful revocation
      const updatedSessions = get().sessions.filter(s => s.id !== sessionId);
      set({ sessions: updatedSessions, isLoading: false });
    } catch (err: any) {
      set({ error: err.message || "Failed to revoke session", isLoading: false });
    }
  },
}));
