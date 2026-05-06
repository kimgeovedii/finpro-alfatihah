import React from "react"

type CartSummaryProps = {
    totalQty: number
    totalItems: number
}

export const CartSummary: React.FC<CartSummaryProps> = ({ totalQty, totalItems }) => {
    if (totalItems === 0) return <p className="text-slate-500 mt-1">Your basket is empty</p>

    return (
        <p className="text-slate-500 mt-1">
            You've chosen <b>{totalItems} product{totalItems > 1 ? "s" : ""}</b> 
            {" "}with total <b>{totalQty} item{totalQty > 1 ? "s" : ""}</b>
        </p>
    )
}