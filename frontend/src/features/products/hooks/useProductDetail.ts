import { useEffect, useState } from "react";
import { ProductDetailData } from "@/features/products/types/product.type";
import { ProductRepository } from "@/features/products/repositories/product.repository";

const productRepository = new ProductRepository();

export function useProductDetail(slugName: string) {
  const [product, setProduct] = useState<ProductDetailData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function fetchProduct() {
      try {
        setIsLoading(true);
        const data = await productRepository.getProductBySlug(slugName);
        if (isMounted) {
          setProduct(data);
          setError(null);
        }
      } catch (err) {
        if (isMounted) {
          setError((err as Error).message || "Failed to load product");
          setProduct(null);
        }
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    fetchProduct();

    return () => {
      isMounted = false;
    };
  }, [slugName]);

  return { product, isLoading, error };
}
