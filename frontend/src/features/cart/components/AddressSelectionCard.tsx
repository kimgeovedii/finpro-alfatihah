import React from "react"
import { AddressAdditionalInfoSection } from "./AddressAdditionalInfoSection"
import { HeadingText } from "@/components/layout/HeadingText"
import { BranchInfoCard } from "@/components/layout/BranchInfoCard"
import { AddressData, BranchData } from "@/types/address.type"
import { AddressSelectionDialog } from "./AddressSelectionDialog"

type Props = {
    branch: BranchData
    addressList: AddressData[]
    selectedAddressId: string | null
    maxDeliveryDistance: number
    onSelect: (addressId: string) => void
}

export const AddressSelectionCard: React.FC<Props> = ({ branch, addressList, selectedAddressId, maxDeliveryDistance, onSelect }) => {
    const selectedAddress = (() => {
        const primary = addressList.find(dt => dt.isPrimary && dt.isWithinRange)
        if (primary) return primary

        return addressList.find(dt => dt.isWithinRange) ?? null
    })()

    return (
        <div className="bg-white rounded-3xl border border-slate-200">
            <BranchInfoCard branch={branch} roundedClass="rounded-t-3xl"/>
            <div className="p-4">
                <div className="flex justify-between items-center mb-2">
                    <HeadingText children="Delivery Address" level={2}/>
                    <AddressSelectionDialog
                        address={addressList}
                        appliedAddress={selectedAddressId}
                        onSelect={onSelect}
                        maxDeliveryDistance={maxDeliveryDistance}
                    />
                </div>
                {
                    selectedAddress && 
                        <AddressAdditionalInfoSection
                            {...selectedAddress}
                            maxDeliveryDistance={maxDeliveryDistance}                  
                        />
                }
            </div>
        </div>
    )
}