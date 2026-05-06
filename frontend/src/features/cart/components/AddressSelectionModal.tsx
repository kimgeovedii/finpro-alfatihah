import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import React from "react"
import { AddressAdditionalInfoSection } from "./AddressAdditionalInfoSection"
import { PencilSquareIcon } from "@heroicons/react/24/outline"
import { AddressData } from "@/types/address.type"

interface Props {
    address: AddressData[]
    appliedAddress?: string | null
    maxDeliveryDistance: number
    
    onSelect: (id: string) => void
}

export const AddressSelectionModal: React.FC<Props> = ({ address, appliedAddress, maxDeliveryDistance, onSelect }) => {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button className="text-emerald-700 bg-white text-sm font-bold hover:text-emerald-600 transition-colors"><PencilSquareIcon/> Change</Button>
            </DialogTrigger>
            <DialogContent className="w-[95vw] md:w-full max-w-[700px] rounded-2xl p-5">
                <DialogHeader>
                    <DialogTitle className="font-bold mb-3">My Address</DialogTitle>
                </DialogHeader>
                <div className="flex flex-col gap-3 mt-2 overflow-y-auto max-h-[75vh]">
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