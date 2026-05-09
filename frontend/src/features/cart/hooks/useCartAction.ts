import { useCheckoutCartItem, useDeleteCart, useDeleteCartItem, useUpdateCartItem } from "@/features/cart/hooks/useCart"
import Swal from "sweetalert2"
import { closeLoading, showLoading, showPopUp } from "@/utils/message.util"
import { actionMessages } from "@/constants/message.const"
import { VoucherData } from "../repositories/voucher.type"
import { useState } from "react"
import { useRouter } from 'next/navigation'
import { useEffect, useRef } from "react"
import { debouncerTimeLimit } from "@/constants/feature.const"

export const useCartActions = (onSuccess: () => void, cartId?: string) => {
    // Handle hook
    const router = useRouter()
    const { checkoutCartItem, isCheckoutItem } = useCheckoutCartItem()
    const { deleteCart, isDeleting } = useDeleteCart()
    const { deleteCartItem, isDeletingItem } = useDeleteCartItem()
    const { updateCartItem, isUpdatingItem } = useUpdateCartItem()

    // Debounce state
    const debounceTimers = useRef<Record<string, NodeJS.Timeout>>({})
    const pendingQty = useRef<Record<string, number>>({})
    const [localQty, setLocalQty] = useState<Record<string, number>>({})
    const originalQty = useRef<Record<string, number>>({})

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

        // Repo : Delete cart by id
        showLoading("Removing cart...")
        const success = await deleteCart(cartId)
        closeLoading()
        
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

        // Repo : Delete cart item by id
        showLoading("Removing product...")
        const success = await deleteCartItem(cartItemId)
        closeLoading()

        if (success) await showPopUp(actionMessages.productRemoveSuccessTitle, `<b>${productName}</b> ${actionMessages.productRemoveSuccessDesc}`, "success", null, onSuccess)
    }

    // Increase cart item qty
    const handleIncrease = async (itemId: string, qty: number, stock: number) => {
        const currentQty = pendingQty.current[itemId] ?? qty
        const newQty = currentQty + 1

        // Validate stock readiness
        if (newQty > stock) {
            await showPopUp(actionMessages.productCartFailedAddTitle, actionMessages.productCartFailedAddDesc, "info")
            return
        }

        // Update local UI
        setLocalQty(prev => ({ ...prev, [itemId]: newQty}))

        pendingQty.current[itemId] = newQty

        if (debounceTimers.current[itemId]) clearTimeout(debounceTimers.current[itemId])

        debounceTimers.current[itemId] = setTimeout(async () => {
            // Repo : update cart item by id
            showLoading("Updating quantity...")
            await updateCartItem(itemId, pendingQty.current[itemId])
            closeLoading()

            delete pendingQty.current[itemId]
            delete debounceTimers.current[itemId]

            onSuccess()
        }, debouncerTimeLimit)
    }

    // Decrease cart item qty or remove if qty <= 1
    const handleDecrease = async (cartItemId: string, qty: number, productName: string) => {
        // Save original qty before update
        if (!(cartItemId in originalQty.current)) originalQty.current[cartItemId] = qty

        const currentQty = pendingQty.current[cartItemId] ?? qty
        const newQty = currentQty - 1
    
        // Remove item if qty <= 0
        if (newQty <= 0) {
            // Cancel pending debounce
            if (debounceTimers.current[cartItemId]) {
                clearTimeout(debounceTimers.current[cartItemId])
                delete debounceTimers.current[cartItemId]
                delete pendingQty.current[cartItemId]
            }
    
            // Update local UI
            setLocalQty(prev => ({ ...prev, [cartItemId]: 0}))
    
            const confirm = await Swal.fire({
                title: actionMessages.productAskRemoveTitle,
                html: `<b>${productName}</b> ${actionMessages.productAskRemoveDesc}`,
                icon: "warning",
                showCancelButton: true,
                confirmButtonText: actionMessages.confirmDeleteButton,
                confirmButtonColor: "#ef4444",
            })
    
            // Restore qty if cancel
            if (!confirm.isConfirmed) {
                setLocalQty(prev => ({ ...prev, [cartItemId]: originalQty.current[cartItemId] }))
                return
            }
    
            // Repo : delete cart item by id
            showLoading("Removing item...")
            const success = await deleteCartItem(cartItemId)
            closeLoading()
    
            if (success) await showPopUp(actionMessages.productRemoveSuccessTitle, `<b>${productName}</b> ${actionMessages.productRemoveSuccessDesc}`, "success", null, onSuccess)
            return
        }
    
        // Update local UI
        setLocalQty(prev => ({
            ...prev,
            [cartItemId]: newQty
        }))
    
        pendingQty.current[cartItemId] = newQty
    
        if (debounceTimers.current[cartItemId]) clearTimeout(debounceTimers.current[cartItemId])
    
        debounceTimers.current[cartItemId] = setTimeout(async () => {
            // Repo : update cart item by id
            showLoading("Updating quantity...")
            await updateCartItem(cartItemId, pendingQty.current[cartItemId])
            closeLoading()
    
            delete pendingQty.current[cartItemId]
            delete debounceTimers.current[cartItemId]
    
            onSuccess()
        }, 2000)
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

        // Repo : checkout cart
        showLoading("Preparing your order...")
        const { success, redirectUrl } = await checkoutCartItem(cartId, selectedAddressId, paymentMethod, selectedVoucher?.id)
        closeLoading()
        
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

    useEffect(() => {
        return () => Object.values(debounceTimers.current).forEach(clearTimeout)
    }, [])

    return {
        selectedVoucher, selectedAddressId, setSelectedAddressId, paymentMethod, setPaymentMethod,
        isCheckoutItem, isDeletingItem, isUpdatingItem, localQty, handleApply, handleRemove, handleRemoveCart,
        handleRemoveCartItem, handleIncrease, handleDecrease, handleCheckout,
    }
}