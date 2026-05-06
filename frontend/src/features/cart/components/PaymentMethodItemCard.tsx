import { HeadingText } from "@/components/layout/HeadingText"
import { Button } from "@/components/ui/button"
import { cardBaseClass, cardSelectedClass, cardUnselectedClass } from "@/constants/style.const"
import { PaymentMethodType } from "@/types/global.type"
import { CheckIcon } from "@heroicons/react/24/outline"

interface Props {
    value: PaymentMethodType
    selected: PaymentMethodType
    icon: React.ReactNode
    title: string
    description: string
    onSelect: (method: PaymentMethodType) => void
}

export const PaymentMethodItemCard: React.FC<Props> = ({ value, selected, onSelect, icon, title, description }) => {
    const isSelected = selected === value

    return (
        <Button onClick={() => onSelect(value)} className={`${cardBaseClass} ${isSelected ? cardSelectedClass : cardUnselectedClass}`}>
            {
                isSelected && 
                    <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-emerald-700 flex items-center justify-center">
                        <CheckIcon className="w-3 h-3 text-white"/>
                    </div>
            }
            <div className={isSelected ? "text-emerald-700" : "text-slate-400"}>{icon}</div>
            <div>
                <HeadingText level={4} children={<span className={isSelected ? "text-slate-800" : "text-slate-500"}>{title}</span>}/>
                <p className={`text-xs ${isSelected ? "text-slate-500" : "text-slate-400"}`}>{description}</p>
            </div>
        </Button>
    )
}