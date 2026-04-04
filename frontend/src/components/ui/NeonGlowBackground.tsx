"use client";

import React, { useEffect } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export const NeonGlowBackground = () => {
  // Mouse tracking logic
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth spring configuration
  const springConfig = { damping: 25, stiffness: 150 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  return (
    <motion.div
      className="pointer-events-none fixed inset-0 z-[-1]"
      style={{
        left: 0,
        top: 0,
        x: smoothX,
        y: smoothY,
        translateX: "-50%",
        translateY: "-50%",
        width: "600px",
        height: "600px",
        borderRadius: "100%",
        background: `radial-gradient(circle at center, rgba(0, 139, 139, 0.4) 0%, rgba(0, 139, 139, 0.1) 50%, transparent 75%)`,
        filter: "blur(80px)",
        opacity: 1,
      }}
    />
  );
};
