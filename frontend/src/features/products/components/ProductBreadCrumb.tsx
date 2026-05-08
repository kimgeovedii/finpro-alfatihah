import Link from "next/link";
import { ChevronRightIcon, HomeIcon } from "@heroicons/react/24/outline";

interface ProductBreadcrumbProps {
  productName: string;
  categoryName: string;
  categorySlug: string;
}

export function ProductBreadcrumb({ productName, categoryName, categorySlug }: ProductBreadcrumbProps) {
  return (
    <nav className="flex items-center gap-2 text-xs font-bold text-slate-500 overflow-x-auto pb-2 custom-scrollbar">
      <Link href="/" className="flex items-center gap-1 hover:text-primary transition-colors shrink-0">
        <HomeIcon className="w-3.5 h-3.5" />
        Home
      </Link>
      <ChevronRightIcon className="w-3 h-3 shrink-0" />
      <span className="shrink-0">Categories</span>
      <ChevronRightIcon className="w-3 h-3 shrink-0" />
      <Link href={`/categories/${categorySlug}`} className="shrink-0 hover:text-primary transition-colors">
        {categoryName}
      </Link>
      <ChevronRightIcon className="w-3 h-3 shrink-0" />
      <span className="text-primary shrink-0 truncate max-w-[150px] sm:max-w-none" title={productName}>
        {productName}
      </span>
    </nav>
  );
}
