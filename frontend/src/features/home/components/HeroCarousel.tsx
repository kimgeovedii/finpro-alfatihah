"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const slides = [
  {
    id: 1,
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBQJxz-PUNDTQJ8XmZAe4HEBpZHcm3vLqS9mhzN_BuY3xBvU5rn4eFjOgRlHIiRlAXXOcG_2JpOFvkIPhf9iI4ulT66Ef19oV8cjjkKvruNQ4bTlW6qI6vGkBYhdw3_hfK0vie5-Xg1ZELD6AFz6T-05UvESkbJk6aMWtvARRHmx4x9w4J5Z7E8rCMmwn0ClCEwRfCiCDH4RMrn07fn6Uzao1kKV-N938YHUMF_XnA7GQS7kO9YVXCjKVbMf7I9vlHEZAkGo1Bi8y4",
    tag: "Limited Time Offer",
    title: "The Freshness of Nature at Your Door.",
    description: "Curating the finest organic harvest from local branches directly to your kitchen. Quality you can trust, speed you can rely on.",
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80",
    tag: "Fresh Arrival",
    title: "Farm to Table in Hours.",
    description: "Discover our new seasonal produce section. Support local farmers while getting the freshest ingredients for your family meals.",
  },
  {
    id: 3,
    image: "https://images.unsplash.com/photo-1604719312566-8912e9227c6a?auto=format&fit=crop&q=80",
    tag: "Exclusive Member Deal",
    title: "Stock Up & Save More.",
    description: "Get up to 30% off on all pantry essentials when you buy in bulk. Offer valid for a limited time at participating branches.",
  }
];

export const HeroCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <section className="relative h-[300px] md:h-[500px] w-full rounded-[2.5rem] overflow-hidden group mb-8">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="absolute inset-0"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent z-10" />
          <img
            src={slides[currentIndex].image}
            alt={slides[currentIndex].title}
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="relative z-20 h-full flex flex-col justify-center px-8 md:px-20 max-w-2xl text-white">
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-tertiary px-4 py-1.5 rounded-full text-xs font-bold w-fit mb-4 md:mb-6 tracking-wider uppercase"
            >
              {slides[currentIndex].tag}
            </motion.span>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-3xl md:text-5xl lg:text-6xl font-heading font-black tracking-tight mb-4 leading-[1.1]"
            >
              {slides[currentIndex].title}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-sm md:text-lg font-medium opacity-90 mb-6 md:mb-8 max-w-lg hidden sm:block"
            >
              {slides[currentIndex].description}
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex gap-4"
            >
              <button className="bg-primary hover:bg-primary-container text-white px-6 py-3 md:px-8 md:py-4 rounded-full font-bold shadow-lg transition-all active:scale-95 text-sm md:text-base">
                Shop Now
              </button>
              <button className="bg-white/20 backdrop-blur-md hover:bg-white/30 text-white px-6 py-3 md:px-8 md:py-4 rounded-full font-bold transition-all active:scale-95 text-sm md:text-base hidden sm:block">
                View Deals
              </button>
            </motion.div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation Arrows */}
      <div className="absolute inset-y-0 left-4 md:left-8 z-20 flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
        <button 
          onClick={prevSlide}
          className="bg-black/30 hover:bg-black/50 backdrop-blur-md text-white p-2 rounded-full transition-colors"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
      </div>
      <div className="absolute inset-y-0 right-4 md:right-8 z-20 flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
        <button 
          onClick={nextSlide}
          className="bg-black/30 hover:bg-black/50 backdrop-blur-md text-white p-2 rounded-full transition-colors"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>

      {/* Dots */}
      <div className="absolute bottom-6 md:bottom-8 right-8 md:right-12 z-20 flex gap-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`h-1.5 rounded-full transition-all ${
              index === currentIndex ? "w-12 bg-white" : "w-2 bg-white/50 hover:bg-white/80"
            }`}
          />
        ))}
      </div>
    </section>
  );
};
