import { useCheckoutCartItem, useDeleteCart, useDeleteCartItem, useUpdateCartItem } from "@/features/cart/hooks/useCart"
import Swal from "sweetalert2"
import { showPopUp } from "@/utils/message.util"
import { actionMessages } from "@/constants/message.const"
import { VoucherData } from "../repositories/voucher.type"
import { useState } from "react"
import { useRouter } from 'next/navigation'

export const useCartActions = (onSuccess: () => void, cartId?: string) => {
    // Call hook
    const router = useRouter()
    const { checkoutCartItem, isCheckoutItem } = useCheckoutCartItem()
    const { deleteCart, isDeleting } = useDeleteCart()
    const { deleteCartItem, isDeletingItem } = useDeleteCartItem()
    const { updateCartItem, isUpdatingItem } = useUpdateCartItem()

    // Selection state
    const [selectedVoucher, setSelectedVoucher] = useState<VoucherData | null>(null)
    const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null)
    const [paymentMethod, setPaymentMethod] = useState<"MANUAL" | "GATEWAY">("MANUAL")

    // Apply / remove voucher
    const handleApply = (voucher: VoucherData) => setSelectedVoucher(voucher)
    const handleRemove = () => setSelectedVoucher(null)

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

    // Checkout
    const handleCheckout = async () => {
        if (!cartId) return
        if (!selectedAddressId) {
            await showPopUp(actionMessages.orderCreateFailed, actionMessages.orderAskAddress, "warning")
            return
        }

        const confirmResult = await Swal.fire({
            icon: "question",
            title: actionMessages.cartAskCheckoutTitle,
            text: actionMessages.cartAskCheckoutDesc,
            showCancelButton: true,
            confirmButtonColor: "#10b981",
            cancelButtonColor: "#ef4444",
            confirmButtonText: actionMessages.confirmCheckout,
            cancelButtonText: "Cancel",
        })
        if (!confirmResult.isConfirmed) return

        const { success, redirectUrl } = await checkoutCartItem(cartId, selectedAddressId, paymentMethod, selectedVoucher?.id)
        if (!success) {
            Swal.fire({
                icon: "error",
                title: "Checkout failed",
                text: "Something went wrong",
                confirmButtonColor: "#ef4444",
            })
            return
        }

        if (paymentMethod === "GATEWAY" && redirectUrl) {
            window.location.href = redirectUrl
            return
        }

        Swal.fire({
            icon: "success",
            title: "Order placed!",
            text: "Your order has been submitted.",
            confirmButtonColor: "#10b981",
        }).then(() => router.push("/transaction"))
    }

    return {
        selectedVoucher, selectedAddressId, setSelectedAddressId, paymentMethod, setPaymentMethod,
        isCheckoutItem, isDeletingItem, isUpdatingItem,
        handleApply, handleRemove, handleRemoveCart,
        handleRemoveCartItem, handleIncrease, handleDecrease,
        handleCheckout,
    }
}