import Link from "next/link";
import {
  GlobeAltIcon,
  ChatBubbleLeftRightIcon,
  AtSymbolIcon,
  ChevronRightIcon,
} from "@heroicons/react/24/outline";

export const MainFooter = () => {
  return (
    <footer className="bg-surface-container-high dark:bg-slate-800 w-full rounded-t-[2.5rem] mt-16 font-body text-sm leading-relaxed relative z-10">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-12 px-12 py-16 max-w-7xl mx-auto">
        <div className="space-y-6">
          <div className="h-8 w-auto">
            <img
              alt="Alfatihah Logo"
              className="h-full w-auto object-contain"
              src="https://res.cloudinary.com/dvfywdxnt/image/upload/v1777146483/logo-apps_opuem6.png"
            />
          </div>
          <p className="text-slate-500 dark:text-slate-400">
            Delivering freshness and convenience from our curated local gardens
            to your dining table. Your health is our priority.
          </p>
          <div className="flex gap-4">
            <Link
              href="#"
              className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary"
            >
              <GlobeAltIcon className="h-5 w-5" />
            </Link>
            <Link
              href="#"
              className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary"
            >
              <ChatBubbleLeftRightIcon className="h-5 w-5" />
            </Link>
            <Link
              href="#"
              className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary"
            >
              <AtSymbolIcon className="h-5 w-5" />
            </Link>
          </div>
        </div>

        <div className="space-y-6">
          <h5 className="text-primary font-bold uppercase tracking-widest text-xs">
            Navigation
          </h5>
          <ul className="space-y-4">
            <li>
              <Link
                href="#"
                className="text-slate-500 dark:text-slate-400 hover:underline hover:text-primary transition-all duration-200"
              >
                About Us
              </Link>
            </li>
            <li>
              <Link
                href="#"
                className="text-slate-500 dark:text-slate-400 hover:underline hover:text-primary transition-all duration-200"
              >
                Branches
              </Link>
            </li>
            <li>
              <Link
                href="#"
                className="text-slate-500 dark:text-slate-400 hover:underline hover:text-primary transition-all duration-200"
              >
                Shop Organic
              </Link>
            </li>
            <li>
              <Link
                href="#"
                className="text-slate-500 dark:text-slate-400 hover:underline hover:text-primary transition-all duration-200"
              >
                Special Offers
              </Link>
            </li>
          </ul>
        </div>

        <div className="space-y-6">
          <h5 className="text-primary font-bold uppercase tracking-widest text-xs">
            Customer Service
          </h5>
          <ul className="space-y-4">
            <li>
              <Link
                href="#"
                className="text-slate-500 dark:text-slate-400 hover:underline hover:text-primary transition-all duration-200"
              >
                Help Center
              </Link>
            </li>
            <li>
              <Link
                href="#"
                className="text-slate-500 dark:text-slate-400 hover:underline hover:text-primary transition-all duration-200"
              >
                Terms of Service
              </Link>
            </li>
            <li>
              <Link
                href="#"
                className="text-slate-500 dark:text-slate-400 hover:underline hover:text-primary transition-all duration-200"
              >
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link
                href="#"
                className="text-slate-500 dark:text-slate-400 hover:underline hover:text-primary transition-all duration-200"
              >
                Refund Policy
              </Link>
            </li>
          </ul>
        </div>

        <div className="space-y-6">
          <h5 className="text-primary font-bold uppercase tracking-widest text-xs">
            Newsletter
          </h5>
          <p className="text-slate-500 dark:text-slate-400">
            Subscribe for weekly fresh harvest notifications.
          </p>
          <div className="relative">
            <input
              className="w-full bg-white dark:bg-slate-900 border-none rounded-full px-5 py-3 text-sm focus:ring-2 focus:ring-primary font-body"
              placeholder="Your email"
              type="email"
            />
            <button className="absolute right-1 top-1 bg-primary text-white w-10 h-10 rounded-full flex items-center justify-center">
              <ChevronRightIcon className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
      <div className="border-t border-slate-300/30 py-8 text-center">
        <p className="text-slate-500 dark:text-slate-400 text-xs font-medium">
          © 2024 Alfatihah Apps. All rights reserved.
        </p>
      </div>
    </footer>
  );
};
