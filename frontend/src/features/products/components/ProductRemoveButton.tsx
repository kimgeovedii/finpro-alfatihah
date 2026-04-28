import { TrashIcon } from "@heroicons/react/24/outline"
import { motion } from "framer-motion"

type Props = {
    onRemoveFromCart: () => void
    isLoading: boolean
}

export const ProductRemoveButton: React.FC<Props> = ({ onRemoveFromCart, isLoading }) => {
    return (
        <motion.button onClick={onRemoveFromCart} disabled={isLoading} whileTap={{ scale: 0.96 }}
          className="w-full bg-linear-to-r from-red-800 to-red-600 text-white py-4 rounded-[1.5rem] font-bold text-lg flex items-center justify-center gap-3 shadow-lg shadow-red-700/20 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {
            isLoading ? 
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            : 
              <TrashIcon className="w-6 h-6"/>
          }
          { isLoading ? "Loading..." : "Remove" }
        </motion.button>
    )
}