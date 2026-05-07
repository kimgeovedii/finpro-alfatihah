"use client";

import { motion } from "framer-motion";
import { TicketIcon, TruckIcon, SparklesIcon } from "@heroicons/react/24/outline";
import Link from "next/link";

interface VoucherCardProps {
  title: string | React.ReactNode;
  subtitle: string;
  description: string;
  icon: any;
  gradient: string;
  shadowColor: string;
}

const VoucherCard = ({ title, subtitle, description, icon: Icon, gradient, shadowColor }: VoucherCardProps) => (
  <motion.div
    whileHover={{ y: -5 }}
    className={`relative flex items-stretch overflow-hidden rounded-[2rem] bg-gradient-to-br ${gradient} text-white group cursor-pointer shadow-xl hover:shadow-${shadowColor}/20 transition-all duration-500 min-w-[85vw] lg:min-w-0 snap-center`}
  >
    <div className="p-6 md:p-10 flex-1 border-r-2 border-dashed border-white/20 relative">
      <div className="absolute -top-3 -right-3 md:-top-4 md:-right-4 w-6 h-6 md:w-8 md:h-8 bg-white rounded-full shadow-inner" />
      <div className="absolute -bottom-3 -right-3 md:-bottom-4 md:-right-4 w-6 h-6 md:w-8 md:h-8 bg-white rounded-full shadow-inner" />

      <div className="space-y-4">
        <div>
          <span className="inline-block px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-[10px] font-black uppercase tracking-widest mb-3">
            {subtitle}
          </span>
          <h4 className="text-2xl md:text-4xl font-heading font-black leading-tight">
            {title}
          </h4>
        </div>
        <p className="text-xs md:text-sm font-medium text-white/80 max-w-[200px] leading-relaxed">
          {description}
        </p>
      </div>
    </div>

    <div className="w-24 md:w-32 flex flex-col justify-center items-center bg-white/10 backdrop-blur-md group-hover:bg-white/20 transition-colors shrink-0">
      <Icon className="h-8 w-8 md:h-10 md:w-10 mb-3 group-hover:scale-110 transition-transform duration-500" />
      <span className="text-[10px] md:text-xs font-black tracking-widest uppercase">Check Now</span>
    </div>
  </motion.div>
);

export const ExclusiveVoucher = () => {
  const vouchers = [
    {
      id: 1,
      title: <>Rp 20.000 <span className="text-xl md:text-2xl opacity-80">OFF</span></>,
      subtitle: "Special Reward",
      description: "Valid for your next grocery purchase at any store",
      icon: TicketIcon,
      gradient: "from-emerald-500 to-primary",
      shadowColor: "primary",
    },
    {
      id: 2,
      title: "Free Shipping",
      subtitle: "Limited Time",
      description: "No minimum spend for new users this month",
      icon: TruckIcon,
      gradient: "from-blue-500 to-indigo-600",
      shadowColor: "indigo-500",
    },
  ];

  return (
    <section className="py-2">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center">
          <SparklesIcon className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h2 className="text-2xl md:text-3xl font-heading font-black tracking-tight text-slate-900 leading-none">
            Exclusive Vouchers
          </h2>
          <p className="text-slate-500 text-xs md:text-sm font-medium mt-1">Special deals just for you</p>
        </div>
      </div>

      <div className="flex overflow-x-auto lg:grid lg:grid-cols-2 gap-4 md:gap-8 -mx-4 px-4 snap-x snap-mandatory scrollbar-hide">
        {vouchers.map((voucher) => (
          <Link key={voucher.id} href="/cart">
            <VoucherCard 
              title={voucher.title as any}
              subtitle={voucher.subtitle}
              description={voucher.description}
              icon={voucher.icon}
              gradient={voucher.gradient}
              shadowColor={voucher.shadowColor}
            />
          </Link>
        ))}
      </div>
    </section>
  );
};
