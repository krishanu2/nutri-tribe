'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutDashboard, Package, Users2, LogOut, ChevronRight, Newspaper, ChefHat, Star, Box, BarChart3, Tag, UserCircle, FileText } from 'lucide-react';

const NAV = [
  { label: 'Dashboard',  href: '/admin',            icon: LayoutDashboard },
  { label: 'All Orders', href: '/admin/orders',     icon: Package },
  { label: 'Products',   href: '/admin/products',   icon: Box },
  { label: 'Customers',  href: '/admin/customers',  icon: UserCircle },
  { label: 'Coupons',    href: '/admin/coupons',    icon: Tag },
  { label: 'Analytics',  href: '/admin/analytics',  icon: BarChart3 },
  { label: 'Leads',      href: '/admin/leads',      icon: Users2 },
  { label: 'Reviews',    href: '/admin/reviews',    icon: Star },
  { label: 'Blog',       href: '/admin/blog',       icon: Newspaper },
  { label: 'Recipes',    href: '/admin/recipes',    icon: ChefHat },
  { label: 'Policies',   href: '/admin/policies',   icon: FileText },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const router   = useRouter();

  const handleLogout = async () => {
    await fetch('/api/admin/logout', { method: 'POST' });
    router.push('/admin/login');
  };

  return (
    <aside
      className="w-56 shrink-0 flex flex-col min-h-screen"
      style={{
        background: 'linear-gradient(160deg, #120601, #0a0200)',
        borderRight: '1px solid rgba(243,162,19,0.1)',
      }}
    >
      {/* Logo */}
      <div className="px-5 pt-7 pb-6 border-b" style={{ borderColor: 'rgba(243,162,19,0.1)' }}>
        <div className="relative w-32 h-9">
          <Image src="/logo.png" alt="NutriTribe" fill className="object-contain object-left"
            style={{ filter: 'brightness(0) invert(1)' }} />
        </div>
        <p className="font-body text-[9px] tracking-[0.3em] uppercase mt-2"
          style={{ color: 'rgba(243,162,19,0.4)' }}>
          Admin Panel
        </p>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 pt-5 space-y-1">
        {NAV.map(({ label, href, icon: Icon }) => {
          const active = href === '/admin' ? pathname === '/admin' : pathname.startsWith(href);
          return (
            <Link key={href} href={href}>
              <div className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all group ${
                active ? 'bg-[#f3a213]/15' : 'hover:bg-white/5'
              }`}>
                <Icon size={15} style={{ color: active ? '#f3a213' : 'rgba(253,251,247,0.45)' }} />
                <span
                  className="font-body font-semibold text-[13px] flex-1"
                  style={{ color: active ? '#f3a213' : 'rgba(253,251,247,0.55)' }}
                >
                  {label}
                </span>
                {active && <ChevronRight size={12} style={{ color: '#f3a213' }} />}
              </div>
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="px-3 pb-6 border-t pt-4" style={{ borderColor: 'rgba(243,162,19,0.08)' }}>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-red-900/20 transition-all group"
        >
          <LogOut size={15} className="text-red-400/60 group-hover:text-red-400 transition-colors" />
          <span className="font-body font-semibold text-[13px] text-red-400/60 group-hover:text-red-400 transition-colors">
            Sign Out
          </span>
        </button>
      </div>
    </aside>
  );
}
