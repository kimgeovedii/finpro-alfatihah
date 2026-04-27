"use client";

import { useEffect, useState } from "react";
import { useSessionStore } from "../service/session.service";
import { SessionItem } from "./SessionItem";
import { RevokeSessionDialog } from "./RevokeSessionDialog";
import { Shield, RefreshCw, Smartphone, Laptop, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ActiveSession } from "../repository/session.repository";

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

export const ActiveSessions = () => {
  const { sessions, meta, isLoading, error, fetchSessions, revokeSession } = useSessionStore();
  const [selectedSession, setSelectedSession] = useState<ActiveSession | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 5;

  useEffect(() => {
    fetchSessions(currentPage, limit);
  }, [fetchSessions, currentPage]);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= (meta?.totalPages || 1)) {
      setCurrentPage(page);
    }
  };

  const handleRevoke = async () => {
    if (selectedSession) {
      await revokeSession(selectedSession.id);
      setSelectedSession(null);
      // Refresh current page
      fetchSessions(currentPage, limit);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-3">
            <Shield className="w-7 h-7 text-primary" />
            Manajemen Sesi & Perangkat
          </h3>
          <p className="text-slate-500 font-medium mt-1">
            Lihat dan kelola perangkat yang sedang login menggunakan akun Anda.
          </p>
        </div>
        <Button
          variant="outline"
          onClick={() => fetchSessions(currentPage, limit)}
          disabled={isLoading}
          className="rounded-2xl border-slate-200 font-bold gap-2 self-start sm:self-auto hover:bg-slate-50 transition-all active:scale-95"
        >
          <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-100 p-4 rounded-2xl flex items-center gap-3 text-red-600 font-bold">
          <AlertCircle className="w-5 h-5" />
          {error}
        </div>
      )}

      <div className="grid gap-4">
        {isLoading && sessions.length === 0 ? (
          [...Array(3)].map((_, i) => (
            <div key={i} className="flex items-center justify-between p-5 rounded-[2rem] border border-slate-100">
              <div className="flex items-center gap-5">
                <Skeleton className="w-14 h-14 rounded-2xl bg-slate-100" />
                <div className="space-y-2">
                  <Skeleton className="h-5 w-48 bg-slate-100 rounded-lg" />
                  <Skeleton className="h-4 w-32 bg-slate-100 rounded-lg" />
                </div>
              </div>
            </div>
          ))
        ) : sessions.length > 0 ? (
          <>
            {sessions.map((session) => (
              <SessionItem
                key={session.id}
                session={session}
                onRevoke={(s) => setSelectedSession(s)}
              />
            ))}
            
            {meta && meta.totalPages > 1 && (
              <div className="mt-6 flex justify-center">
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious 
                        onClick={() => handlePageChange(currentPage - 1)}
                        className={`cursor-pointer ${currentPage === 1 ? "opacity-50 pointer-events-none" : ""}`}
                      />
                    </PaginationItem>
                    
                    {[...Array(meta.totalPages)].map((_, i) => (
                      <PaginationItem key={i}>
                        <PaginationLink
                          isActive={currentPage === i + 1}
                          onClick={() => handlePageChange(i + 1)}
                          className="cursor-pointer"
                        >
                          {i + 1}
                        </PaginationLink>
                      </PaginationItem>
                    ))}

                    <PaginationItem>
                      <PaginationNext 
                        onClick={() => handlePageChange(currentPage + 1)}
                        className={`cursor-pointer ${currentPage === meta.totalPages ? "opacity-50 pointer-events-none" : ""}`}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-20 bg-slate-50 rounded-[3rem] border border-dashed border-slate-200">
            <div className="w-20 h-20 bg-white rounded-3xl shadow-xl shadow-slate-200/50 flex items-center justify-center mx-auto mb-6 text-slate-200">
              <Shield className="w-10 h-10" />
            </div>
            <h4 className="text-xl font-bold text-slate-800">Tidak ada sesi aktif</h4>
            <p className="text-slate-500 max-w-xs mx-auto mt-2">
              Sepertinya Anda tidak memiliki sesi aktif lainnya.
            </p>
          </div>
        )}
      </div>

      <div className="p-6 bg-amber-50 rounded-[2.5rem] border border-amber-100/50 flex gap-5">
        <div className="w-12 h-12 rounded-2xl bg-amber-100 flex items-center justify-center text-amber-600 shrink-0">
          <Shield className="w-6 h-6" />
        </div>
        <div>
          <h4 className="font-bold text-amber-900">Tips Keamanan</h4>
          <p className="text-amber-800/70 text-sm font-medium leading-relaxed mt-1">
            Jika Anda melihat perangkat yang tidak dikenal, segera lakukan <b>Logout</b> pada perangkat tersebut dan ubah password akun Anda untuk menjaga keamanan data.
          </p>
        </div>
      </div>

      <RevokeSessionDialog
        isOpen={!!selectedSession}
        onClose={() => setSelectedSession(null)}
        onConfirm={handleRevoke}
        deviceName={selectedSession ? `${selectedSession.os} / ${selectedSession.browser}` : ""}
      />
    </div>
  );
};
