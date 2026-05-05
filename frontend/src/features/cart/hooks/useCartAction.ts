import { useDeleteCart, useDeleteCartItem, useUpdateCartItem } from "@/features/cart/hooks/useCart"
import Swal from "sweetalert2"
import { showPopUp } from "@/utils/message.util"
import { actionMessages } from "@/constants/message.const"

export const useCartActions = (onSuccess: () => void) => {
    // Call hook
    const { deleteCart, isDeleting } = useDeleteCart()
    const { deleteCartItem, isDeletingItem } = useDeleteCartItem()
    const { updateCartItem, isUpdatingItem } = useUpdateCartItem()

    // Remove cart
    const handleRemoveCart = async (cartId: string) => {
        const confirm = await Swal.fire({
            title: actionMessages.cartAskRemoveTitle,
            text: actionMessages.cartAskRemoveDesc,
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: actionMessages.confirmDeleteButton,
            confirmButtonColor: "#ef4444",
        })
        if (!confirm.isConfirmed) return

        const success = await deleteCart(cartId)
        if (success) await showPopUp(actionMessages.cartDeletedSuccessTitle, actionMessages.cartDeletedSuccessDesc, "success", "#10b981", onSuccess)
    }

    // Remove cart item
    const handleRemoveCartItem = async (cartItemId: string, productName: string) => {
        const confirm = await Swal.fire({
            title: actionMessages.productAskRemoveTitle,
            html: `<b>${productName}</b> ${actionMessages.productAskRemoveDesc}`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: actionMessages.confirmDeleteButton,
            confirmButtonColor: "#ef4444",
        })
        if (!confirm.isConfirmed) return

        const success = await deleteCartItem(cartItemId)
        if (success) await showPopUp(actionMessages.productRemoveSuccessTitle, `<b>${productName}</b> ${actionMessages.productRemoveSuccessDesc}`, "success", null, onSuccess)
    }

    // Increase cart item qty
    const handleIncrease = async (itemId: string, qty: number, stock: number) => {
        if (qty >= stock) {
            await showPopUp(actionMessages.productCartFailedAddTitle, actionMessages.productCartFailedAddDesc, "info")
            return
        }

        await updateCartItem(itemId, qty + 1)
        onSuccess()
    }

    // Decrease cart item qty or remove if qty <= 1
    const handleDecrease = async (cartItemId: string, qty: number, productName: string) => {
        if (qty <= 1) {
            const confirm = await Swal.fire({
                title: actionMessages.productAskRemoveTitle,
                html: `<b>${productName}</b> ${actionMessages.productAskRemoveDesc}`,
                icon: "warning",
                showCancelButton: true,
                confirmButtonText: actionMessages.confirmDeleteButton,
                confirmButtonColor: "#ef4444",
            })
            if (!confirm.isConfirmed) return

            const success = await deleteCartItem(cartItemId)
            if (success) await showPopUp(actionMessages.productRemoveSuccessTitle, `<b>${productName}</b> ${actionMessages.productRemoveSuccessDesc}`, "success", null, onSuccess)
        } else {
            await updateCartItem(cartItemId, qty - 1)
            onSuccess()
        }
    }

    return {
        isDeleting, isDeletingItem, isUpdatingItem,
        handleRemoveCart,
        handleRemoveCartItem,
        handleIncrease,
        handleDecrease,
    }
}