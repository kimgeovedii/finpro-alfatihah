import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { HomeIcon, MapIcon, PhoneIcon, UserIcon } from "@heroicons/react/24/outline"
import React from "react"
import { AddressAdditionalInfoSection } from "./AddressAdditionalInfoSection"

interface Address {
    id: string
    label: string
    address: string
    receiptName: string
    phone: string
    distance: number
}

interface Props {
    address: Address[]
    appliedAddress?: string | null
    onSelect: (id: string) => void
}

export const AddressSelectionModal: React.FC<Props> = ({ address, appliedAddress, onSelect }) => {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button className="text-emerald-700 bg-white text-sm font-bold hover:text-emerald-600 transition-colors">Change</Button>
            </DialogTrigger>
            <DialogContent className="w-full max-w-[700px] rounded-2xl">
                <DialogHeader>
                    <DialogTitle className="font-bold mb-3">My Address</DialogTitle>
                </DialogHeader>
                <div className="flex flex-col gap-3 mt-2">
                    {
                        address.map(dt => {
                            const isSelected = appliedAddress === dt.id

                            return <AddressAdditionalInfoSection key={dt.id} action={() => onSelect(dt.id)} receiptName={dt.receiptName} phone={dt.phone} distance={dt.distance} label={dt.label} address={dt.address} isSelected={isSelected}/>
                        })
                    }
                </div>
            </DialogContent>
        </Dialog>
    )
}