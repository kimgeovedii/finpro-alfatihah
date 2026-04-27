import { ProductDetail } from "@/features/products/components/ProductDetail";

export default async function ProductDetailPage({ params }: { 
  params: Promise<{ "store-name": string; "slug-name": string }>
}) {
  const { "store-name": storeName, "slug-name": slugName } = await params

  return <ProductDetail storeName={decodeURIComponent(storeName)} slugName={decodeURIComponent(slugName)}/>
}