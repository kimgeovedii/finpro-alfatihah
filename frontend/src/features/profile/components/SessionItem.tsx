import { Laptop, Smartphone, Monitor, LogOut, ShieldCheck } from "lucide-react";
import { ActiveSession } from "../repository/session.repository";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";

interface SessionItemProps {
  session: ActiveSession;
  onRevoke: (session: ActiveSession) => void;
}

export const SessionItem = ({ session, onRevoke }: SessionItemProps) => {
  const getIcon = () => {
    switch (session.deviceType) {
      case "mobile":
        return <Smartphone className="w-6 h-6" />;
      case "tablet":
        return <Smartphone className="w-6 h-6 rotate-90" />;
      default:
        return <Laptop className="w-6 h-6" />;
    }
  };

  return (
    <div className={`flex items-center justify-between p-5 rounded-[2rem] border transition-all ${
      session.isCurrentDevice 
        ? "bg-primary/5 border-primary/20 ring-1 ring-primary/10" 
        : "bg-white border-slate-100 hover:border-primary/20 hover:shadow-xl hover:shadow-primary/5"
    }`}>
      <div className="flex items-center gap-5">
        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-colors ${
          session.isCurrentDevice ? "bg-primary text-white" : "bg-slate-50 text-slate-400"
        }`}>
          {getIcon()}
        </div>
        
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h4 className="font-black text-slate-900 tracking-tight">
              {session.os} / {session.browser}
            </h4>
            {session.isCurrentDevice && (
              <Badge className="bg-primary hover:bg-primary text-[10px] font-black uppercase tracking-wider rounded-full py-0.5 px-2">
                Perangkat Ini
              </Badge>
            )}
          </div>
          
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-slate-500 font-medium">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-primary/60" />
              <span>IP: {session.ip}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-1 h-1 rounded-full bg-slate-300" />
              <span>Login: {format(new Date(session.lastActive), "d MMM yyyy, HH:mm")}</span>
            </div>
          </div>
        </div>
      </div>

      {!session.isCurrentDevice && (
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onRevoke(session)}
          className="w-12 h-12 rounded-2xl text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all active:scale-90"
        >
          <LogOut className="w-5 h-5" />
        </Button>
      )}
    </div>
  );
};
