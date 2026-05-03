import { DividerLine } from "@/components/layout/DividerLine"
import { MapIcon, PhoneIcon, UserIcon } from "@heroicons/react/24/outline"

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
        <div className="border-1 rounded-lg p-4 shadow-md w-full">
            <div className="flex flex-col gap-2">
                <h6 className="font-bold text-sm">Branch's Address</h6>
                <div className="flex justify-between">
                    <p className="text-sm">City - Store Name</p>
                    <p className="text-sm font-bold">{branchCity} - {storeName}</p>
                </div>
                <p className="text-sm">Address</p>
                <p className="text-sm font-bold">{branchAddress}</p>
                <div className="flex justify-between">
                    <p className="text-sm">Shiped At</p>
                    <p className="text-sm font-bold">{shippedAt}</p>
                </div>
                <DividerLine/>
                <h6 className="font-bold text-sm">Customer's Address</h6>
                <div>
                    <p className="text-slate-800 font-bold text-sm mb-0.5">{labelCustomer}</p>
                    <p className="text-slate-500 text-sm leading-snug mb-1.5">{addressCustomer}</p>
                    <div className="flex flex-wrap items-center gap-1 text-slate-500 text-sm">
                        <span className="mt-1 text-xs font-semibold bg-slate-100 px-2 py-1 rounded-md flex gap-1">
                            <UserIcon className="w-4 h-4"/> {receiptName}
                        </span>
                        <span className="mt-1 text-xs font-semibold bg-slate-100 px-2 py-1 rounded-md flex gap-1">
                            <PhoneIcon className="w-4 h-4"/> {phoneCustomer}
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
