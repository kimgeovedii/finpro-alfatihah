import React from "react"

type Props = {
    title: string
    val: React.ReactNode
    colorClass?: string
}

export const StatsTitleValueText: React.FC<Props> = ({ title, val, colorClass }) => {
    return (
        <>
            <h3 className={`${colorClass} font-semibold text-slate-500 group-hover:text-emerald-600 transition-colors uppercase tracking-wider`}>{title}</h3>
            <p className={`${colorClass} text-3xl font-bold mt-2 text-slate-800`}>{val}</p>
        </>
    )
}