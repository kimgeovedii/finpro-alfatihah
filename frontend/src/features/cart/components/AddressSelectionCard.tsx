import { BuildingOfficeIcon } from "@heroicons/react/24/outline"
import { CalendarDays, MapPin } from "lucide-react"
import React from "react"
import { AddressSelectionModal } from "./AddressSelectionModal"
import { AddressAdditionalInfoSection } from "./AddressAdditionalInfoSection"
import { BranchInfoData } from "@/types/branch.type"

interface DeliveryAddress {
    id: string
    label: string
    address: string
    receiptName: string
    phone: string
    distance: number
    isPrimary: boolean
}

type Props = {
    branch: BranchInfoData
    addressList: DeliveryAddress[]
    selectedAddressId: string | null
    
    onSelect: (addressId: string) => void
}

export const AddressSelectionCard: React.FC<Props> = ({ branch, addressList, selectedAddressId, onSelect }) => {
    const selectedAddress = addressList.find(a => a.id === selectedAddressId) ?? null

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
                        <div className={`inline-block font-semibold ${branch.statusOpen === "Closed" ? "bg-red-400" : "bg-green-400"} px-2 py-0.5 rounded-md`}>
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
            <div className="p-4">
                <div className="flex justify-between items-center mb-2">
                    <h5 className="font-bold">Delivery Address</h5>
                    <AddressSelectionModal
                        address={addressList}
                        appliedAddress={selectedAddressId}
                        onSelect={onSelect}
                    />
                </div>
                {
                    selectedAddress && 
                        <AddressAdditionalInfoSection
                            receiptName={selectedAddress.receiptName}
                            phone={selectedAddress.phone}
                            distance={selectedAddress.distance}
                            label={selectedAddress.label}
                            address={selectedAddress.address}
                        />
                }
            </div>
        </div>
    )
}