import { BuildingOfficeIcon, HomeIcon, MapIcon, PhoneIcon, UserIcon } from "@heroicons/react/24/outline"
import { CalendarDays, MapPin } from "lucide-react"
import React, { useState } from "react"
import { AddressSelectionModal } from "./AddressSelectionModal"

type BranchInfo = {
    name: string
    address: string
    schedule: string
    imageUrl?: string
    statusOpen: string
}

interface DeliveryAddress {
    id: string
    label: string
    address: string
    receiptName: string
    phone: string
    distance: number
}

type Props = {
    branch: BranchInfo
    addressList: DeliveryAddress[]
}

export const AddressSelectionCard: React.FC<Props> = ({ branch, addressList }) => {
    const [selectedAddressId, setSelectedAddressId] = useState<string | null>(addressList[0]?.id || null)

    const selectedAddress = addressList.find(a => a.id === selectedAddressId)

    return (
        <div className="bg-white rounded-3xl">
            <div className="relative rounded-t-3xl overflow-hidden p-6 flex flex-col gap-4" style={{ background: "linear-gradient(135deg, #0f6e56 0%, #085041 100%)" }}>
                <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: "repeating-linear-gradient(45deg, #fff 0, #fff 1px, transparent 0, transparent 50%)", backgroundSize: "12px 12px" }}/>
                <div className="relative flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center text-white">
                        <BuildingOfficeIcon className="w-5 h-5"/>
                    </div>
                    <div>
                        <p className="text-white text-lg font-bold mb-0">{branch.name}</p>
                        <div className="inline-block text-[11px] font-semibold bg-green-600 px-2 py-0.5 rounded-md">
                            <p className="text-white text-xs">{branch.statusOpen}</p>
                        </div>
                    </div>
                </div>
                <div className="relative flex flex-col gap-3">
                    <div className="flex items-center gap-3 text-white/80 text-sm">
                        <div className="w-7 h-7 rounded-lg bg-white/15 flex items-center justify-center flex-shrink-0">
                            <MapPin className="w-3.5 h-3.5 text-white"/>
                        </div>
                        <span>{branch.address}</span>
                    </div>
                    <div className="flex items-center gap-3 text-white/80 text-xs">
                        <div className="w-7 h-7 rounded-lg bg-white/15 flex items-center justify-center flex-shrink-0">
                            <CalendarDays className="w-3.5 h-3.5 text-white"/>
                        </div>
                        <span>{branch.schedule}</span>
                    </div>
                </div>
            </div>
            <div className="flex justify-between items-center my-3 px-3">
                <h5 className="font-bold">Delivery Address</h5>
                <AddressSelectionModal
                    address={addressList}
                    appliedAddress={selectedAddressId}
                    onSelect={(id) => setSelectedAddressId(id)}
                />
            </div>
            {
                selectedAddress && (
                    <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm m-4">
                        <div className="flex items-start gap-3">
                            <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-emerald-700 flex-shrink-0 mt-0.5">
                                <HomeIcon className="w-5 h-5"/>
                            </div>
                            <div>
                                <p className="text-slate-800 font-bold text-sm mb-0.5">{selectedAddress.label}</p>
                                <p className="text-slate-500 text-sm leading-snug mb-1.5">{selectedAddress.address}</p>
                                <div className="flex items-center gap-2 text-slate-500 text-sm">
                                    <span className="mt-1 text-xs font-semibold bg-slate-100 px-2 py-1 rounded-md flex gap-1">
                                        <UserIcon className="w-4 h-4"/> {selectedAddress.receiptName}
                                    </span>
                                    <span className="mt-1 text-xs font-semibold bg-slate-100 px-2 py-1 rounded-md flex gap-1">
                                        <PhoneIcon className="w-4 h-4"/> {selectedAddress.phone}
                                    </span>
                                    <span className="mt-1 text-xs font-semibold bg-slate-100 px-2 py-1 rounded-md flex gap-1">
                                        <MapIcon className="w-4 h-4"/> {selectedAddress.distance} Km
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                )
            }
        </div>
    )
}