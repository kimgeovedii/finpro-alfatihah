import { HeadingText } from "@/components/layout/HeadingText"
import { cardBaseClass, cardSelectedClass, cardUnselectedClass } from "@/constants/style.const"
import { CheckIcon, HomeIcon, MapIcon, PhoneIcon, UserIcon } from "@heroicons/react/24/outline"
import React from "react"

type Props = {
    label: string
    address: string
    receiptName: string
    phone: string
    distance: number
    isSelected?: boolean
    
    action?: () => void
}

export const AddressAdditionalInfoSection: React.FC<Props> = ({ label, address, receiptName, phone, distance, isSelected = false, action }) => {
    return (
        <div onClick={action} className={`${cardBaseClass} ${isSelected ? cardSelectedClass : cardUnselectedClass}`}>
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-emerald-700 flex-shrink-0 mt-0.5">
                    <HomeIcon className="w-5 h-5"/>
                </div>
                <div>
                    <div className="flex flex-col lg:flex-row items-start justify-between w-full relative">
                        <HeadingText level={4} children={label}/>
                        {
                            isSelected && 
                                <div className="mt-2 lg:mt-0 lg:ml-2 w-5 h-5 rounded-full bg-emerald-700 flex items-center justify-center">
                                    <CheckIcon className="w-3 h-3 text-white"/>
                                </div>
                        }
                    </div>
                    <p className="text-slate-500 text-sm leading-snug mb-1.5">{address}</p>
                    <div className="flex flex-wrap items-center gap-1 text-slate-500 text-sm">
                        <span className="mt-1 text-xs font-semibold bg-slate-100 px-2 py-1 rounded-md flex gap-1">
                            <UserIcon className="w-4 h-4"/> {receiptName}
                        </span>
                        <span className="mt-1 text-xs font-semibold bg-slate-100 px-2 py-1 rounded-md flex gap-1">
                            <PhoneIcon className="w-4 h-4"/> {phone}
                        </span>
                        <span className="mt-1 text-xs font-semibold bg-slate-100 px-2 py-1 rounded-md flex gap-1">
                            <MapIcon className="w-4 h-4"/> {distance.toFixed(2)} Km
                        </span>
                    </div>
                </div>
            </div>
        </div>
    )
}