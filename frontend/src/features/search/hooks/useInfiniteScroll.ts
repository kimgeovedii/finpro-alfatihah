"use client";

import { useEffect, useRef, useCallback } from "react";

interface UseInfiniteScrollProps {
  loadMore: () => void;
  hasMore: boolean;
  isLoading: boolean;
}

export const useInfiniteScroll = ({ loadMore, hasMore, isLoading }: UseInfiniteScrollProps) => {
  const observerTarget = useRef<HTMLDivElement>(null);

  const handleObserver = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const [target] = entries;
      if (target.isIntersecting && hasMore && !isLoading) {
        loadMore();
      }
    },
    [loadMore, hasMore, isLoading]
  );

  useEffect(() => {
    const observer = new IntersectionObserver(handleObserver, {
      root: null,
      rootMargin: "100px",
      threshold: 0.1,
    });

    const currentTarget = observerTarget.current;
    if (currentTarget) {
      observer.observe(currentTarget);
    }

    return () => {
      if (currentTarget) observer.disconnect();
    };
  }, [handleObserver]);

  return { observerTarget };
};
