import React from "react"

type Props = {
    title: string
    val: React.ReactNode
    colorClass?: string
}

export const StatsTitleValueText: React.FC<Props> = ({ title, val, colorClass }) => {
    return (
        <>
            <h3 className={`${colorClass} text-sm md:text-md text-lg font-semibold text-slate-500 group-hover:text-emerald-600 transition-colors uppercase tracking-wider`}>{title}</h3>
            <p className={`${colorClass} text-xl md:text-2xl text-3xl font-bold mt-1 text-slate-800`}>{val}</p>
        </>
    )
}