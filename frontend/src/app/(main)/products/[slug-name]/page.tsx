import { ProductDetail } from "@/features/products/components/ProductDetail";

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ "slug-name": string }>;
}) {
  const { "slug-name": slugName } = await params;
  return <ProductDetail slugName={slugName} />;
}
