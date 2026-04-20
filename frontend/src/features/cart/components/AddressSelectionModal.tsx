import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { HomeIcon, PhoneIcon, UserIcon } from "@heroicons/react/24/outline"
import React from "react"

interface Address {
    id: string
    label: string
    address: string
    receiptName: string
    phone: string
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
            <DialogContent className="max-w-md rounded-2xl">
                <DialogHeader>
                    <DialogTitle className="font-bold mb-3">My Address</DialogTitle>
                </DialogHeader>
                <div className="flex flex-col gap-3 mt-2">
                    {
                        address.map(dt => {
                            const isSelected = appliedAddress === dt.id

                            return (
                                <div key={dt.id} onClick={() => onSelect(dt.id)} className={`cursor-pointer bg-white rounded-2xl p-4 border shadow-sm transition-all ${isSelected ? "border-slate-400" : "border-slate-100 hover:border-slate-200"}`}>
                                    <div className="flex items-start gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-emerald-700 flex-shrink-0 mt-0.5">
                                            <HomeIcon className="w-5 h-5"/>
                                        </div>
                                        <div>
                                            <p className="text-slate-800 font-bold text-sm mb-0.5">{dt.label}</p>
                                            <p className="text-slate-500 text-sm leading-snug mb-1.5">{dt.address}</p>
                                            <div className="flex items-center gap-2 text-slate-500 text-sm">
                                                <span className="mt-1 text-xs font-semibold text-slate-500 bg-slate-100 px-2 py-1 rounded-md flex gap-1">
                                                    <UserIcon className="w-4 h-4"/> {dt.receiptName}
                                                </span>
                                                <span className="mt-1 text-xs font-semibold text-slate-500 bg-slate-100 px-2 py-1 rounded-md flex gap-1">
                                                    <PhoneIcon className="w-4 h-4"/> {dt.phone}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )
                        })
                    }
                </div>
            </DialogContent>
        </Dialog>
    )
}