import { DividerLine } from "@/components/layout/DividerLine"
import { HeadingText } from "@/components/layout/HeadingText"
import { formatDate } from "@/utils/converter.util"
import { MapIcon, PhoneIcon, TruckIcon, UserIcon } from "@heroicons/react/24/outline"

type Props = {
    branchCity: string
    branchAddress: string
    storeName: string
    distance: number
    shippedAt: string
    labelCustomer: string
    addressCustomer: string 
    phoneCustomer: string
    receiptName: string
}

export const OrderManagementTableShippedSection: React.FC<Props> = ({ branchCity, branchAddress, storeName, distance, shippedAt, labelCustomer, addressCustomer, receiptName, phoneCustomer  }) => {
    return (
        <div className="flex flex-row gap-2">
            <div className="flex-1 p-2">
                <div className="border-1 rounded-lg p-4 shadow-md w-full">
                    <HeadingText level={3} children="Branch Address"/>
                    <DividerLine/>
                    <p className="text-sm font-bold">{branchCity} - {storeName}</p>
                    <p className="text-sm mb-3">{branchAddress}</p>
                    <div className="flex flex-wrap items-center gap-1 text-slate-500 text-sm">
                        <span className="text-xs font-semibold bg-slate-100 px-2 py-1 rounded-md flex gap-1">
                            <TruckIcon className="w-4 h-4"/> Shiped at {formatDate(shippedAt, true)}
                        </span>
                    </div>
                </div>
            </div>
            <div className="flex-1 p-2">
                <div className="border-1 rounded-lg p-4 shadow-md w-full">
                    <HeadingText level={3} children="Customer Address"/>
                    <DividerLine/>
                    <div>
                        <p className="text-slate-800 font-bold text-sm mb-0.5">{labelCustomer}</p>
                        <p className="text-slate-500 text-sm leading-snug mb-3">{addressCustomer}</p>
                        <div className="flex flex-wrap items-center gap-1 text-slate-500 text-sm">
                            <span className="text-xs font-semibold bg-slate-100 px-2 py-1 rounded-md flex gap-1">
                                <UserIcon className="w-4 h-4"/> {receiptName}
                            </span>
                            <span className="text-xs font-semibold bg-slate-100 px-2 py-1 rounded-md flex gap-1">
                                <PhoneIcon className="w-4 h-4"/> {phoneCustomer}
                            </span>
                            <span className="text-xs font-semibold bg-slate-100 px-2 py-1 rounded-md flex gap-1">
                                <MapIcon className="w-4 h-4"/> {distance.toFixed(2)} Km
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
