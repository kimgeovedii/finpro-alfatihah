"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeftIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselDots,
  type CarouselApi,
} from "@/components/ui/carousel";
import { ProductDetailImageGalleryProps } from "@/features/products/types/product.type";

export const ProductDetailImageGallery = ({
  productImages,
  productName,
}: ProductDetailImageGalleryProps) => {
  const sortedImages = [...productImages].sort((a, b) =>
    a.isPrimary === b.isPrimary ? 0 : a.isPrimary ? -1 : 1
  );

  const images =
    sortedImages.length > 0
      ? sortedImages
      : [{ imageUrl: "/assets/logo-apps.png", isPrimary: true }];

  const [activeIndex, setActiveIndex] = useState(0);
  const [, setApi] = useState<CarouselApi>();

  const handleApiChange = useCallback((api: CarouselApi) => {
    setApi(api);
  }, []);

  return (
    <>
      {/* Mobile layout */}
      <div className="lg:hidden relative">
        <Link
          href="/products"
          className="absolute top-4 left-4 z-20 flex items-center justify-center w-10 h-10 rounded-full bg-white/80 text-emerald-700 shadow backdrop-blur-md"
        >
          <span className="sr-only">Back</span>
          <ChevronLeftIcon className="w-6 h-6 stroke-2" />
        </Link>

        <Carousel
          opts={{ loop: true }}
          setApi={handleApiChange}
          className="w-full"
        >
          <CarouselContent className="ml-0">
            {images.map((img, idx) => (
              <CarouselItem key={idx} className="pl-0">
                <div className="relative w-full aspect-square overflow-hidden bg-slate-100">
                  <img
                    src={img.imageUrl}
                    alt={`${productName} image ${idx + 1}`}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselDots className="py-4" />
        </Carousel>
      </div>

      {/* Desktop layout */}
      <div className="hidden lg:flex flex-col gap-4 group">
        <div className="relative w-full aspect-4/5 overflow-hidden rounded-xl bg-slate-100">
          <AnimatePresence mode="wait">
            <motion.img
              key={activeIndex}
              src={images[activeIndex].imageUrl}
              alt={`${productName} image ${activeIndex + 1}`}
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            />
          </AnimatePresence>
        </div>

        {images.length > 1 && (
          <div className="flex gap-3 m-auto">
            {images.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setActiveIndex(idx)}
                className={`relative overflow-hidden shrink-0 w-16 h-16 xl:w-20 xl:h-20 rounded-lg border-2 transition-all ${
                  idx === activeIndex
                    ? "border-emerald-600 shadow-md opacity-100"
                    : "border-transparent opacity-60 hover:opacity-100"
                }`}
              >
                <img
                  src={img.imageUrl}
                  alt={`Thumbnail ${idx + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        )}
      </div>
    </>
  );
};
