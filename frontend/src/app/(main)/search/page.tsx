import { Suspense } from "react";
import { SearchPageView } from "@/features/search/components/SearchPageView";

export default function SearchPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SearchPageView />
    </Suspense>
  );
}
