import { CartDetailLayout } from "@/features/cart/components/CartDetailLayout";

export default async function CartDetailPage({ params }: { params: Promise<{ cartId: string }>}) {
  const { cartId } = await params

  return <CartDetailLayout cartId={cartId}/>
}