import { ProductOrderCartItem } from "@/types/product.type"
import { MiniTagBox } from "./MiniTagBox"
import { Button } from "../ui/button"
import { TrashIcon } from "@heroicons/react/24/outline"
import Link from "next/link"
import { currencyFormat } from "@/constants/business.const"
import Image from "next/image"

type ProductOrderCartCardProps = {
    item: ProductOrderCartItem
    variant?: "order" | "cart"
    branchName: string
    
    onIncrease?: () => void
    onDecrease?: () => void
    onRemove?: () => void
}

export const ProductOrderCartItemCard: React.FC<ProductOrderCartCardProps> = ({ item, variant = "order", branchName, onIncrease, onDecrease, onRemove }) => {
    const discount = item.productDiscounts?.[0]?.discount

    return (
        <div className="flex flex-col md:flex-row items-center justify-between gap-3 py-3 first:pt-0 last:pb-0">
            <div className="flex items-center gap-3">
                <div className="w-14 h-14 rounded-xl bg-slate-100 flex items-center justify-center flex-shrink-0 overflow-hidden">
                    {
                        item.productImages?.[0]
                            ? <Image src={item.productImages[0].imageUrl} alt={item.productName} className="w-full h-full object-cover" width={100} height={100}/>
                            : <span className="text-2xl">🛒</span>
                    }
                </div>
                <div className="flex-1 min-w-0">
                    <p className="text-[10px] font-semibold text-emerald-600 uppercase tracking-wider">
                        {item.category.name}
                    </p>
                    <Link href={`/${branchName}/${item.slugName}`}>
                        <p className={`text-sm font-semibold text-slate-800 cursor-pointer hover:underline ${variant === "order" ? "line-clamp-3" : ""}`}>
                            {item.productName}
                        </p>
                    </Link>
                    <div className="flex flex-wrap items-center gap-2">
                        { variant === "order" && <MiniTagBox val={`${item.quantity}x`}/>}
                        <MiniTagBox val={`${(item.weight / 1000).toFixed(2)} Kg`}/>
                        {
                            variant === "cart" && discount &&
                                <>
                                    {
                                        discount.discountType === "BUY_ONE_GET_ONE_FREE" ?
                                            <MiniTagBox val="Extra One"/>
                                        : discount.discountType === "PRODUCT_DISCOUNT" ?
                                            <MiniTagBox val={
                                                discount.discountValueType === "PERCENTAGE"
                                                    ? `- ${discount.discountValue}% / item`
                                                    : `- Rp. ${discount.discountValue.toLocaleString(currencyFormat)} / item`
                                            }/>
                                        : discount.discountType === "MINIMUM_PURCHASE" ?
                                            <MiniTagBox val={
                                                discount.discountValueType === "PERCENTAGE"
                                                    ? `Min Rp. ${discount.minPurchaseAmount?.toLocaleString(currencyFormat)} • ${discount.discountValue}%`
                                                    : `Min Rp. ${discount.minPurchaseAmount?.toLocaleString(currencyFormat)} • - Rp. ${discount.discountValue.toLocaleString(currencyFormat)}`
                                            }/>
                                        :
                                            <></>
                                    }
                                </>
                        }
                    </div>
                </div>
            </div>
            <div className="text-right flex-shrink-0 flex flex-row md:flex-col justify-between w-full md:w-auto">
                <div className="text-start md:text-end">
                    {
                        variant === "cart" && item.finalPricePerItem && item.finalTotalPrice && item.discountAmount ? 
                            <>
                                <p className="text-sm font-bold text-slate-800">
                                    Rp. {item.finalTotalPrice.toLocaleString(currencyFormat)}
                                </p>
                                <div className="flex items-center gap-2 text-xs font-semibold md:justify-end">
                                    <p className="text-slate-400">
                                        Rp. {(item.discountAmount > 0 ? item.finalPricePerItem : item.basePrice).toLocaleString(currencyFormat)} / item
                                    </p>
                                    {
                                        item.discountAmount > 0 && 
                                            <p className="text-slate-400 line-through">
                                                Rp. {item.basePrice.toLocaleString(currencyFormat)}
                                            </p>
                                    }
                                </div>
                            </>
                        :
                            <>
                                {
                                    item.basePrice > 0 ?
                                        <>
                                        <p className="text-sm font-bold text-slate-800">
                                                Rp. {(item.finalTotalPrice ?? (item.basePrice * item.quantity)).toLocaleString(currencyFormat)}
                                            </p>
                                            <p className="text-xs text-slate-400 font-semibold">
                                                Rp. {item.basePrice.toLocaleString(currencyFormat)} / item
                                            </p>
                                        </>
                                    : 
                                        <p className="text-xs text-green-400 bg-green-100 px-2 py-1 rounded-lg font-semibold">
                                            Free Item
                                        </p>
                                }
                            </>
                    }
                </div>
                <div>
                    {
                        variant === "cart" && 
                            <div className="flex items-center gap-2 justify-end mt-3">
                                <Button onClick={onRemove} className="bg-transparent text-slate-400 hover:text-red-500 transition cursor-pointer"><TrashIcon className="w-5 h-5"/></Button>
                                <div className="flex items-center bg-slate-100/70 rounded-full p-1 shadow-inner gap-1">
                                    <Button onClick={onDecrease} className="bg-transparent w-5 h-5 flex items-center justify-center rounded-full text-slate-600 hover:bg-white transition">-</Button>
                                    <span className="w-5 text-center font-semibold text-slate-800 text-sm">{item.quantity}</span>
                                    <Button onClick={onIncrease} className="w-5 h-5 flex items-center justify-center rounded-full bg-emerald-600 text-white shadow hover:bg-emerald-700 transition">+</Button>
                                </div>
                            </div>
                    }
                </div>
            </div>
        </div>
    )
}