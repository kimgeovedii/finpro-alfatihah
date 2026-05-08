import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { BanknotesIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { currencyFormat } from "@/constants/business.const";
import Image from "next/image"

type Props = {
    imageUrl: string
    finalPrice: number
    paymentId: string
    status: string
    onValidatePaymentEvidence: (paymentId: string, isConfirm: boolean) => void
}   

export const PaymentConfirmationDialog: React.FC<Props> = ({ imageUrl, finalPrice, paymentId, onValidatePaymentEvidence, status }) => {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button className="bg-orange-400 text-white font-semibold text-xs px-3 mx-auto block">
                    <BanknotesIcon className="w-5 h-5"/>
                </Button>
            </DialogTrigger>
            <DialogContent className="[&>button:last-child]:hidden sm:max-w-2xl rounded-3xl border-slate-200 p-0 overflow-hidden mt-4">
                <Button className="absolute right-5 top-5 z-50 rounded-full p-2 text-white backdrop-blur transition-colors bg-red-500 shadow hover:shadow-xl hover:scale-125 transition-all duration-300"
                    onClick={() => document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }))}>
                    <XMarkIcon className="w-5 h-5" />
                </Button>
                <div className="bg-linear-to-r from-emerald-800 to-emerald-600 p-6 text-white">
                    <DialogHeader>
                        <DialogTitle className="text-2xl font-extrabold tracking-tight">Payment Confirmation</DialogTitle>
                        <DialogDescription className="text-emerald-50 mt-2">If you reject the customer's payment, they must to reupload the evidence again.</DialogDescription>
                    </DialogHeader>
                </div>
                <div className="p-6 pt-0 space-y-8 min-h-auto max-h-[70vh] overflow-y-auto text-center">
                    <Image src={imageUrl} className="w-full max-w-[200px] max-h-[200px] mx-auto h-full mb-2 rounded-lg" alt={imageUrl} width={100} height={100}/>
                    <p className="mb-0">Transaction Amount</p>
                    <p className="font-bold mb-4">Rp {finalPrice.toLocaleString(currencyFormat)}</p>
                    {
                        status === "WAITING_PAYMENT_CONFIRMATION" && 
                            <div className="flex flex-wrap gap-2">
                                <div className="flex-1">
                                    <Button className="w-full bg-red-100 text-red-500 border-1 border-red-500 hover:bg-red-500 hover:text-white cursor-pointer" onClick={(e) => onValidatePaymentEvidence(paymentId, false)}>Reject</Button>
                                </div>
                                <div className="flex-1">
                                    <Button className="w-full bg-green-100 text-green-500 border-1 border-green-500 hover:bg-green-500 hover:text-white cursor-pointer mb-2" onClick={(e) => onValidatePaymentEvidence(paymentId, true)}>Confirm</Button>
                                </div>
                            </div>
                    }
                </div>
            </DialogContent>
        </Dialog>
    );
}