export const getOrderStatusStyle = (status: string) => {
    switch (status) {
        case "WAITING_PAYMENT":
        case "WAITING_PAYMENT_CONFIRMATION":
            return "text-orange-600 bg-orange-100"
        case "PROCESSING":
        case "SHIPPED":
            return "text-blue-600 bg-blue-100"
        case "CONFIRMED":
            return "text-emerald-600 bg-emerald-100"
        case "CANCELLED":
            return "text-red-600 bg-red-100"
        default:
            return "text-slate-600 bg-slate-100"
    }
}

export const getPaymentStatusStyle = (status: string) => {
    switch (status) {
        case "PENDING":
            return "text-orange-600 bg-orange-100"
        case "SUCCESS":
            return "text-emerald-600 bg-emerald-100"
        case "REJECTED":
            return "text-red-600 bg-red-100"
        default:
            return "text-slate-600 bg-slate-100"
    }
}