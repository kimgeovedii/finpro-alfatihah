import { useState, useCallback } from "react";
import { usePathname } from "next/navigation";
import { useSidebarStore } from "./useSidebarStore";

export const useSidebar = () => {
  const pathname = usePathname();
  const [isExpanded, setIsExpanded] = useState(false);
  const [isPinned, setIsPinned] = useState(false);
  const { isMobileMenuOpen, closeMobileMenu } = useSidebarStore();

  const handleMouseEnter = useCallback(() => {
    if (!isPinned) setIsExpanded(true);
  }, [isPinned]);

  const handleMouseLeave = useCallback(() => {
    if (!isPinned) setIsExpanded(false);
  }, [isPinned]);

  const togglePinned = useCallback(() => {
    setIsPinned((prev) => !prev);
    setIsExpanded((prev) => !prev);
  }, []);

  return {
    pathname,
    isExpanded,
    isPinned,
    isMobileMenuOpen,
    closeMobileMenu,
    handleMouseEnter,
    handleMouseLeave,
    togglePinned,
  };
};
