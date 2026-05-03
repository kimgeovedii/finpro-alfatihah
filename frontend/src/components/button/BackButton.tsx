import { ArrowLeftIcon } from "@heroicons/react/24/outline"
import React from "react"
import { Button } from "../ui/button"
import Link from "next/link"

type Props = {
    url: string
}

export const BackButton: React.FC<Props> = ({ url }) => {
    return (
        <Link href={`/${url}`}>
            <Button variant="destructive" className="text-md px-3 py-5 mb-3">
                <ArrowLeftIcon className="w-4 h-4" /> Back
            </Button>
        </Link>
    )
}