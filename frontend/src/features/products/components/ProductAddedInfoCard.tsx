type Props = {
    currentCartQty: number
}

export const ProductAddedInfoCard: React.FC<Props> = ({ currentCartQty }) => {
    return (
        <div className="p-4 bg-green-200 rounded-2xl md:mb-4">
          <p>You've got <b>{currentCartQty}</b> of this item in your cart!</p>
        </div>
    )
}