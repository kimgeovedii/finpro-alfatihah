import Link from "next/link";
import Image from "next/image";
import {
  MapPinIcon,
  ShoppingCartIcon,
  UserIcon,
} from "@heroicons/react/24/outline";

export const MainNavbar = () => {
  return (
    <nav className="sticky top-0 w-full z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl shadow-[0px_12px_32px_rgba(23,29,27,0.06)]">
      <div className="flex justify-between items-center w-full px-8 py-4 max-w-7xl mx-auto">
        <div className="flex items-center gap-8">
          <Link href="/" className="block h-10 w-auto">
            <img
              alt="Alfatihah Logo"
              className="h-full w-auto object-contain"
              src="https://lh3.googleusercontent.com/aida/ADBb0uimlng99U9JLfa5UWHTmoO9UdJ4FHWo48gGueGV9XYnWqPfL-eVfqFA2xs_AfnUt40QKNeCDDtLp4K6aKVqkdUD3MDxQSkND5xWjQ6RlmyM885AhuTr6r7FtX3O73hRCYywbmfnILCPaW475jKQIyuP4skB9CUk899byIzFzGcKth9h5BMSJ67-87dhO_fmzkTWBkjUvJbKtCmhCF0CBfuUuQ6e-TZcqT0cn5SPX2PqJz31UCLTLMr-rpQmYFKTYY_-OUm010ezsQ"
            />
          </Link>
          <div className="hidden md:flex items-center gap-6">
            <Link
              href="/"
              className="text-primary border-b-2 border-primary pb-1 font-heading font-semibold tracking-tight active:scale-95 transition-transform"
            >
              Home
            </Link>
            <Link
              href="#"
              className="text-slate-600 dark:text-slate-400 font-medium hover:text-primary-container transition-colors duration-300"
            >
              Shop
            </Link>
            <Link
              href="#"
              className="text-slate-600 dark:text-slate-400 font-medium hover:text-primary-container transition-colors duration-300"
            >
              Categories
            </Link>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="hidden lg:flex items-center gap-2 px-4 py-2 bg-surface-container-low rounded-full">
            <MapPinIcon className="h-4 w-4 text-primary" />
            <span className="text-xs font-semibold text-primary">
              Awakmu ng kene...
            </span>
          </div>
          <div className="flex items-center gap-5 text-primary dark:text-primary-container">
            <button className="active:scale-95 transition-transform">
              <MapPinIcon className="h-5 w-5" />
            </button>
            <button className="active:scale-95 transition-transform relative">
              <ShoppingCartIcon className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 bg-tertiary text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
                2
              </span>
            </button>
            <button className="active:scale-95 transition-transform">
              <UserIcon className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};
