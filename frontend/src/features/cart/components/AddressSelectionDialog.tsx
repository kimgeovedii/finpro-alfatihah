import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import React from "react"
import { AddressAdditionalInfoSection } from "./AddressAdditionalInfoSection"
import { PencilSquareIcon, XMarkIcon } from "@heroicons/react/24/outline"
import { AddressData } from "@/types/address.type"

interface Props {
    address: AddressData[]
    appliedAddress?: string | null
    maxDeliveryDistance: number
    onSelect: (id: string) => void
}

export const AddressSelectionDialog: React.FC<Props> = ({ address, appliedAddress, maxDeliveryDistance, onSelect }) => {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button className="text-emerald-700 bg-white text-sm font-bold hover:text-emerald-600 transition-colors"><PencilSquareIcon/> Change</Button>
            </DialogTrigger>
            <DialogContent className="[&>button:last-child]:hidden sm:max-w-2xl rounded-3xl border-slate-200 p-0 overflow-hidden mt-0 md:mt-10 lg:mt-0">
                <Button className="absolute right-5 top-5 z-50 rounded-full p-2 text-white backdrop-blur transition-colors bg-red-500 shadow hover:shadow-xl hover:scale-125 transition-all duration-300"
                    onClick={() => document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }))}>
                    <XMarkIcon className="w-5 h-5" />
                </Button>
                <div className="bg-linear-to-r from-emerald-800 to-emerald-600 p-6 text-white">
                    <DialogHeader>
                        <DialogTitle className="text-2xl font-extrabold tracking-tight">My Address</DialogTitle>
                        <DialogDescription className="text-emerald-50 mt-2">You can only choose a shipping destination within our store's delivery range, which is <b>{maxDeliveryDistance} km</b>.</DialogDescription>
                    </DialogHeader>
                </div>
                <div className="p-6 pt-0 space-y-4 max-h-[70vh] overflow-y-auto">
                    {
                        address.map(dt => 
                            <AddressAdditionalInfoSection key={dt.id}
                                action={() => onSelect(dt.id)}
                                {...dt}
                                isSelected={appliedAddress === dt.id}
                                maxDeliveryDistance={maxDeliveryDistance}                  
                            />
                        )
                    }
                </div>
            </DialogContent>
        </Dialog>
    )
}