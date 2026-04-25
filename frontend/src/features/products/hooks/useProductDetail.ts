import { useCallback, useEffect, useState } from "react";
import { ProductDetailData } from "@/features/products/types/product.type";
import { ProductRepository } from "@/features/products/repositories/product.repository";

const productRepository = new ProductRepository();

export function useProductDetail(slugName: string, storeName: string) {
  const [product, setProduct] = useState<ProductDetailData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchProduct = useCallback(async () => {
    try {
      setIsLoading(true)
      const data = await productRepository.getProductBySlug(slugName, storeName)
      setProduct(data)
      setError(null)
    } catch (err) {
      setError((err as Error).message || "Failed to load product")
      setProduct(null)
    } finally {
      setIsLoading(false)
    }
  }, [slugName, storeName])

  useEffect(() => {
    let isMounted = true

    fetchProduct().then(() => {
      if (!isMounted) setProduct(null)
    })

    return () => {
      isMounted = false
    }
  }, [fetchProduct])

  return { product, isLoading, error, fetchProduct }
}
