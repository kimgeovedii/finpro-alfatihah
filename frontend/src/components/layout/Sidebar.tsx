"use client"
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { HomeIcon, BriefcaseIcon, ClipboardDocumentCheckIcon, ServerStackIcon, Cog6ToothIcon, GlobeAmericasIcon, ShoppingCartIcon, ArrowsRightLeftIcon, CubeIcon } from '@heroicons/react/24/outline'
import { useAuthService } from '@/features/auth/service/auth.service'

const NAV_ITEMS = [
  {
    title: 'Dashboard',
    href: '/dashboard',
    icon: <HomeIcon className="w-5 h-5" />
  },
  {
    title: 'Products',
    href: '/dashboard/products',
    icon: <CubeIcon className="w-5 h-5" />
  },
  {
    title: 'Cart',
    href: '/cart',
    icon: <ShoppingCartIcon className="w-5 h-5" />
  },
  {
    title: 'My Transaction',
    href: '/transaction',
    icon: <ArrowsRightLeftIcon className="w-5 h-5" />
  },
  {
    title: 'Manage Order',
    href: '/manage-order',
    icon: <ClipboardDocumentCheckIcon className="w-5 h-5" />
  },
  {
    title: 'Manage Project',
    href: '/manage-project',
    icon: <BriefcaseIcon className="w-5 h-5" />
  },
  {
    title: 'Tracking Document',
    href: '/tracking',
    icon: <ClipboardDocumentCheckIcon className="w-5 h-5" />
  },
  {
    title: 'Master Data',
    href: '/master-data',
    icon: <ServerStackIcon className="w-5 h-5" />
  },
  {
    title: 'Settings',
    href: '/settings',
    icon: <Cog6ToothIcon className="w-5 h-5" />
  }
]

export const Sidebar = () => {
  const cartItems = useAuthService((state) => state.cartItems)
  const pathname = usePathname()

  return (
    <aside className="fixed inset-y-0 left-0 z-50 w-64 bg-white/70 backdrop-blur-3xl border-r border-white/60 shadow-[4px_0_24px_rgba(0,0,0,0.02)] transition-transform duration-300 md:translate-x-0 hidden md:block">
      <div className="flex h-16 items-center px-6 border-b border-emirald-100/50">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-tr from-emerald-500 to-green-400 text-white shadow-sm">
            <GlobeAmericasIcon className="h-5 w-5" />
          </div>
          <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-700 to-teal-600">Alfatihah</span>
        </div>
      </div>
      <div className="flex flex-col gap-1 px-4 py-8 overflow-y-auto h-[calc(100vh-4rem)]">
        <p className="px-2 text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Main Menu</p>
        {
          NAV_ITEMS.map(dt => {
            const isActive = dt.href === '/dashboard' ? pathname === '/dashboard' : pathname === dt.href || pathname.startsWith(`${dt.href}/`)
            const isCart = dt.href === '/cart'
            const totalItems = cartItems || 0

            return (
              <Link key={dt.href} href={dt.href} className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group ${
                  isActive ? 'bg-emerald-50 text-emerald-700 shadow-sm border border-emerald-100/50' : 'text-slate-600 hover:bg-slate-50 hover:text-emerald-600'
                }`}
              >
                <div className={`${isActive ? 'text-emerald-600' : 'text-slate-400 group-hover:text-emerald-500'} transition-colors duration-200`}>{dt.icon}</div>
                <span className="tracking-wide">{dt.title}</span>
                {
                  isCart && totalItems > 0 && 
                    <span className="ml-auto text-xs font-semibold bg-emerald-500 text-white px-2 py-0.5 rounded-full shadow-sm">
                      {totalItems}
                    </span>
                }
                { isActive && !isCart && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-sm"></div> }
              </Link>
            )
          })
        }
      </div>
    </aside>
  )
}
