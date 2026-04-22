import { formatDate } from "@/utils/converter.util"

type Props = {
    confirmedAt?: string | null
}

export const OrderManagementTableOrderDeliveredSection: React.FC<Props> = ({ confirmedAt }) => {
    return (
        <div className="border-1 rounded-lg p-4 shadow-md w-full">
            <div className="flex justify-between">
                <p className="text-sm">Confirmed At</p>
                <p className="text-sm font-bold">{confirmedAt ? formatDate(confirmedAt, true) : <>-</>}</p>
            </div>
        </div>
    )
}
