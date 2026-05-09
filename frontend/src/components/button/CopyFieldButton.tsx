import { DocumentDuplicateIcon } from "@heroicons/react/24/outline"
import React from "react"
import Swal from "sweetalert2"
import { Button } from "../ui/button"
import { showPopUp } from "@/utils/message.util"

type Props = {
    label: string
    value: string
    customClass?: string
}

export const CopyFieldButton: React.FC<Props> = ({ label, value, customClass = "text-md font-semibold" }) => {
    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(value)

            Swal.fire({
                icon: "success",
                title: "Copied!",
                text: `${label} copied successfully`,
                timer: 1500,
                showConfirmButton: false,
            })
        } catch (err) {
            showPopUp("Failed", "Failed to copy", "error")
        }
    }

    return (
        <div className="flex items-center gap-1 my-3">
            <Button onClick={handleCopy} className="text-xs px-3 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 transition cursor-pointer" title={`Copy ${label}`}>
                <DocumentDuplicateIcon className="w-4 h-4"/>
            </Button>
            <h5 className={`${customClass} text-slate-800 break-all`}>{value}</h5>
        </div>
    )
}