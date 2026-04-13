import React from "react";

type CartSummaryProps = {
  totalProducts: number
  totalItems: number
}

export const CartSummary: React.FC<CartSummaryProps> = ({ totalProducts, totalItems }) => {
    return (
        <p className="text-slate-500 mt-1">
            You've chosen <b>{totalProducts} Product{totalProducts > 1 ? "s" : ""}</b> 
            {" "}with total <b>{totalItems} Piece{totalItems > 1 ? "s" : ""}</b>
        </p>
    )
}