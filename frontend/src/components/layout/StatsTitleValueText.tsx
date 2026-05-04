import React from "react"
import { HeadingText } from "./HeadingText"

type Props = {
    title: string
    val: React.ReactNode
    colorClass?: string
}

export const StatsTitleValueText: React.FC<Props> = ({ title, val, colorClass }) => {
    return (
        <>
            <HeadingText level={2} children={
                <span className={`${colorClass} text-slate-500 group-hover:text-emerald-600 transition-colors uppercase tracking-wider`}>{title}</span>
            }/>
            <p className={`${colorClass} text-xl md:text-2xl text-3xl font-bold mt-1 text-slate-800`}>{val}</p>
        </>
    )
}