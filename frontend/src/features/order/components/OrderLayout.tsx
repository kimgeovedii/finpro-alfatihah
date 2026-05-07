"use client";
import { DividerLine } from "@/components/layout/DividerLine";
import { HeadingText } from "@/components/layout/HeadingText";
import { MessageBox } from "@/components/layout/MessageBox";
import { SkeletonBox } from "@/components/layout/SkeletonBox";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { OrderItemCard } from "@/features/order/components/OrderItemCard";
import { OrderSummaryCard } from "@/features/order/components/OrderSummaryCard";
import { useAllOrderData, useOrderSummary } from "@/features/order/hooks/useOrder";
import { useOrderActions } from "@/features/order/hooks/useOrderAction";
import { CloudArrowDownIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";

export function OrderLayout() {
    // Handle hook (fetch)
    const { summary, isLoadingSummary } = useOrderSummary()
    const { orders, meta, isLoading, fetchAllOrders } = useAllOrderData()
    
    // Handle hook (action)
    const { orderNumber, setOrderNumber, dateStart, setDateStart, dateEnd, setDateEnd, handleSearch, downloadTransactionHistory } = useOrderActions(fetchAllOrders)

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 w-full mx-auto">
            <div className="flex items-center justify-between">
                <div className="w-full">
                    <HeadingText level={1} children="My Transactions"/>
                    {
                        !isLoadingSummary && summary ? 
                            <OrderSummaryCard 
                                totalPrice={summary?.totalPrice ?? 0}
                                totalFinalPrice={summary?.totalFinalPrice ?? 0}
                                totalConfirmedOrder={summary?.ordersByStatus?.CONFIRMED ?? 0}
                                totalProcessingOrder={(summary?.ordersByStatus?.PROCESSING ?? 0) + (summary?.ordersByStatus?.SHIPPED ?? 0)}
                                totalWaitingOrder={(summary?.ordersByStatus?.WAITING_PAYMENT ?? 0) + (summary?.ordersByStatus?.WAITING_PAYMENT_CONFIRMATION ?? 0)}
                                totalCancelledOrder={summary?.ordersByStatus?.CANCELLED ?? 0}
                            />   
                        : 
                            // Render loading element
                            <>
                                <SkeletonBox extraClass={'min-h-[20px]'}/>
                                <div className='flex w-full gap-3'>
                                <div className='flex-1 flex flex-col'>
                                    <SkeletonBox extraClass={'min-h-[120px]'}/>
                                </div>
                                <div className='flex-1 flex flex-col'>
                                    <SkeletonBox extraClass={'min-h-[120px]'}/>
                                </div>
                                </div>
                            </>
                    }    
                    <DividerLine/>
                    <div className="flex flex-wrap items-end gap-3 mb-5 bg-white p-4 rounded-xl justify-between">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 w-full lg:w-auto">
                            <div className="col-span-2 md:col-span-2">
                                <Label className="text-xs text-slate-500 mb-1">Order Number</Label>
                                <Input placeholder="e.g. ORD-123" value={orderNumber} onChange={(e) => setOrderNumber(e.target.value)} className="w-full" />
                            </div>
                            <div className="col-span-1">
                                <Label className="text-xs text-slate-500 mb-1">Start Date</Label>
                                <Input type="date" value={dateStart} onChange={(e) => setDateStart(e.target.value)} className="w-full" />
                            </div>
                            <div className="col-span-1">
                                <Label className="text-xs text-slate-500 mb-1">End Date</Label>
                                <Input type="date" value={dateEnd} onChange={(e) => setDateEnd(e.target.value)} className="w-full" />
                            </div>
                        </div>
                        <div className="flex w-full md:w-auto gap-2">
                            <Button onClick={handleSearch} className="flex-1 md:flex-none h-9">
                                <MagnifyingGlassIcon/> Search
                            </Button>
                            <Button onClick={downloadTransactionHistory} className="flex-1 md:flex-none h-9">
                                <CloudArrowDownIcon/> Transaction History
                            </Button>
                        </div>
                    </div>
                    <div>
                        { 
                            isLoading && 
                                // Render loading element
                                <div className="flex flex-col space-y-2">
                                    <SkeletonBox extraClass={'min-h-[300px]'}/>
                                    <SkeletonBox extraClass={'min-h-[300px]'}/>
                                </div>
                        }
                        {
                            !isLoading && orders.map((dt, idx) => (
                                <OrderItemCard key={idx}
                                    orderId={dt.id} orderNumber={dt.orderNumber} status={dt.status} totalPrice={dt.totalPrice} finalPrice={dt.finalPrice} shippingCost={dt.shippingCost}
                                    paymentDeadline={dt.paymentDeadline} totalItems={dt.totalItems} productList={dt.productList} createdAt={dt.createdAt} paymentMethod={dt.payments[0]?.method}
                                    paymentStatus={dt.payments[0]?.status} paymentEvidence={dt.payments[0]?.evidence} onSuccess={fetchAllOrders}
                                />
                            ))
                        }
                        { 
                            // Render failed fetching condition
                            !isLoading && orders.length === 0 && <MessageBox context={'No orders found'} image={"/assets/empty.png"} urlButton={'/dashboard/products'} titleButton='Browse Now!' description={"It looks like you haven't made any transactions yet. Buy a product now and get an extra discount"}/>
                        }
                        {
                            // Pagination
                            meta && meta.page < meta.totalPages && <Button className="mt-4 px-4 py-1 bg-teal-700 text-white rounded-lg mx-auto block" onClick={() => fetchAllOrders(meta.page + 1)}>See More</Button> 
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}