"use client";

import { motion } from "framer-motion";
import { TicketIcon, TruckIcon } from "@heroicons/react/24/outline";

export const ExclusiveVoucher = () => {
  return (
    <section className="py-6">
      <h2 className="text-3xl font-heading font-black tracking-tight text-primary mb-8">
        Exclusive Vouchers
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Voucher 1 */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="relative flex overflow-hidden rounded-[1.5rem] bg-gradient-to-br from-primary to-primary-container text-white group cursor-pointer shadow-lg hover:shadow-2xl transition-all"
        >
          <div className="p-8 flex-1 border-r-2 border-dashed border-white/30 relative">
            {/* Punch holes */}
            <div className="absolute -top-4 -right-4 w-8 h-8 bg-surface rounded-full" />
            <div className="absolute -bottom-4 -right-4 w-8 h-8 bg-surface rounded-full" />

            <p className="text-xs font-bold uppercase tracking-widest opacity-80 mb-2">
              Special Reward
            </p>
            <h4 className="text-3xl font-heading font-black mb-1">
              Rp 20.000 OFF
            </h4>
            <p className="text-sm font-medium opacity-90">
              Valid for your next grocery purchase
            </p>
          </div>
          <div className="p-8 flex flex-col justify-center items-center bg-white/10 backdrop-blur-sm px-10">
            <TicketIcon className="h-10 w-10 mb-2" />
            <span className="text-xs font-black tracking-tighter">COLLECT</span>
          </div>
        </motion.div>

        {/* Voucher 2 */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="relative flex overflow-hidden rounded-[1.5rem] bg-gradient-to-br from-tertiary to-tertiary-container text-white group cursor-pointer shadow-lg hover:shadow-2xl transition-all"
        >
          <div className="p-8 flex-1 border-r-2 border-dashed border-white/30 relative">
            {/* Punch holes */}
            <div className="absolute -top-4 -right-4 w-8 h-8 bg-surface rounded-full" />
            <div className="absolute -bottom-4 -right-4 w-8 h-8 bg-surface rounded-full" />

            <p className="text-xs font-bold uppercase tracking-widest opacity-80 mb-2">
              Limited Time
            </p>
            <h4 className="text-3xl font-heading font-black mb-1">
              FREE SHIPPING
            </h4>
            <p className="text-sm font-medium opacity-90">
              No minimum spend for new users
            </p>
          </div>
          <div className="p-8 flex flex-col justify-center items-center bg-white/10 backdrop-blur-sm px-10">
            <TruckIcon className="h-10 w-10 mb-2" />
            <span className="text-xs font-black tracking-tighter">COLLECT</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
