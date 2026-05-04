import { BuildingOfficeIcon, CalendarDaysIcon, MapPinIcon } from "@heroicons/react/24/outline"
import React from "react"
import { AddressSelectionModal } from "./AddressSelectionModal"
import { AddressAdditionalInfoSection } from "./AddressAdditionalInfoSection"
import { BranchInfoData } from "@/types/branch.type"
import { HeadingText } from "@/components/layout/HeadingText"
import { BranchInfoCard } from "@/components/layout/BranchInfoCard"

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
            <BranchInfoCard branch={branch} roundedClass="rounded-t-3xl"/>
            <div className="p-4">
                <div className="flex justify-between items-center mb-2">
                    <HeadingText children="Delivery Address" level={2}/>
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