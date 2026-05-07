import { DividerLine } from "@/components/layout/DividerLine"
import { HeadingText } from "@/components/layout/HeadingText"
import { cardBaseClass, cardSelectedClass, cardUnselectedClass } from "@/constants/style.const"
import { AddressData } from "@/types/address.type"
import { closeAllDialogs } from "@/utils/dialog"
import { showPopUp } from "@/utils/message.util"
import { CheckIcon, ExclamationCircleIcon, HomeIcon, MapIcon, PhoneIcon, UserIcon } from "@heroicons/react/24/outline"
import React from "react"

type Props = {
    isSelected?: boolean
    maxDeliveryDistance: number
    action?: () => void
}

export const AddressAdditionalInfoSection: React.FC<Props & AddressData> = ({ label, address, receiptName, phone, distance, isSelected = false, maxDeliveryDistance, action }) => {
    // Determine if the address is select able based on branch max distance
    const isSelectAble = distance && distance < maxDeliveryDistance
    const handleClick = () => {
        if (isSelectAble) {
            action?.()
            return
        }
      
        closeAllDialogs()
        showPopUp("Failed", `Choose another address who is within range ${maxDeliveryDistance} Km`, "error")
    }

    return (
        <div onClick={handleClick} className={`${cardBaseClass} ${isSelected ? cardSelectedClass : cardUnselectedClass}`}>
            <div className="flex items-center gap-3 w-full">
                <div className="w-full">
                    <div className="flex flex-row items-center justify-between w-full relative">
                        <div className="flex gap-2">
                            <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-emerald-700 flex-shrink-0 mt-0.5">
                                <HomeIcon className="w-5 h-5"/>
                            </div>
                            <div>
                                <HeadingText level={4} children={label}/>
                                <p className="text-slate-500 text-sm leading-snug">{address}</p>
                            </div>
                        </div>
                        {
                            isSelected && 
                                <div className="w-5 h-5 rounded-full bg-emerald-700 flex items-center justify-center">
                                    <CheckIcon className="w-3 h-3 text-white"/>
                                </div>
                        }
                    </div>
                    <DividerLine/>
                    <div className="flex flex-wrap items-center gap-1 text-slate-500 text-sm">
                        <span className="mt-1 text-xs font-semibold bg-slate-100 px-2 py-1 rounded-md flex gap-1">
                            <UserIcon className="w-4 h-4"/> {receiptName}
                        </span>
                        <span className="mt-1 text-xs font-semibold bg-slate-100 px-2 py-1 rounded-md flex gap-1">
                            <PhoneIcon className="w-4 h-4"/> {phone}
                        </span>
                        <span className="mt-1 text-xs font-semibold bg-slate-100 px-2 py-1 rounded-md flex gap-1">
                            <MapIcon className="w-4 h-4"/> {distance?.toFixed(2) ?? <>-</>} Km
                        </span>
                        {
                            !isSelectAble &&
                                <span className="mt-1 text-xs text-red-500 font-semibold bg-red-100 px-2 py-1 rounded-md flex gap-1">
                                    <ExclamationCircleIcon className="w-4 h-4"/> It's too far!
                                </span>
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}