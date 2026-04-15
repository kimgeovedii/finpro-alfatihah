"use client";

import { motion } from "framer-motion";

export const HeroSection = () => {
    return (
        <section className="relative h-[500px] w-full rounded-[2.5rem] overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-transparent z-10" />
            <img 
                alt="Fresh Groceries" 
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBQJxz-PUNDTQJ8XmZAe4HEBpZHcm3vLqS9mhzN_BuY3xBvU5rn4eFjOgRlHIiRlAXXOcG_2JpOFvkIPhf9iI4ulT66Ef19oV8cjjkKvruNQ4bTlW6qI6vGkBYhdw3_hfK0vie5-Xg1ZELD6AFz6T-05UvESkbJk6aMWtvARRHmx4x9w4J5Z7E8rCMmwn0ClCEwRfCiCDH4RMrn07fn6Uzao1kKV-N938YHUMF_XnA7GQS7kO9YVXCjKVbMf7I9vlHEZAkGo1Bi8y4" 
            />
            <div className="relative z-20 h-full flex flex-col justify-center px-12 md:px-20 max-w-2xl text-white">
                <motion.span 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-tertiary px-4 py-1.5 rounded-full text-xs font-bold w-fit mb-6 tracking-wider uppercase"
                >
                    Limited Time Offer
                </motion.span>
                <motion.h1 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="text-5xl md:text-6xl font-heading font-black tracking-tight mb-4 leading-[1.1]"
                >
                    The Freshness of Nature at Your Door.
                </motion.h1>
                <motion.p 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-lg font-medium opacity-90 mb-8 max-w-lg"
                >
                    Curating the finest organic harvest from local branches directly to your kitchen. Quality you can trust, speed you can rely on.
                </motion.p>
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="flex gap-4"
                >
                    <button className="bg-primary hover:bg-primary-container text-white px-8 py-4 rounded-full font-bold shadow-lg transition-all active:scale-95">
                        Shop Now
                    </button>
                    <button className="bg-white/20 backdrop-blur-md hover:bg-white/30 text-white px-8 py-4 rounded-full font-bold transition-all active:scale-95">
                        View Deals
                    </button>
                </motion.div>
            </div>
            <div className="absolute bottom-8 right-12 z-20 flex gap-2">
                <div className="w-12 h-1.5 bg-white rounded-full" />
                <div className="w-1.5 h-1.5 bg-white/50 rounded-full" />
                <div className="w-1.5 h-1.5 bg-white/50 rounded-full" />
            </div>
        </section>
    );
};