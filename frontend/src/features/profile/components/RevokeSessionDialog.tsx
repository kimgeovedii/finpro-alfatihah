import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface RevokeSessionDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  deviceName: string;
}

export const RevokeSessionDialog = ({
  isOpen,
  onClose,
  onConfirm,
  deviceName,
}: RevokeSessionDialogProps) => {
  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent className="rounded-3xl border-slate-200 shadow-2xl">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-2xl font-black text-slate-900 tracking-tight">
            Logout dari Perangkat?
          </AlertDialogTitle>
          <AlertDialogDescription className="text-slate-500 font-medium text-base">
            Apakah Anda yakin ingin mengeluarkan akun Anda dari perangkat{" "}
            <span className="font-bold text-slate-900">{deviceName}</span>? 
            Sesi di perangkat tersebut akan langsung berakhir.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="gap-3 mt-4">
          <AlertDialogCancel className="rounded-2xl border-slate-200 text-slate-600 font-bold hover:bg-slate-50">
            Batal
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            className="rounded-2xl bg-red-500 hover:bg-red-600 text-white font-bold shadow-lg shadow-red-200"
          >
            Ya, Logout
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
