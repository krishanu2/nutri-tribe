import type { Metadata } from "next";
import dynamic from 'next/dynamic';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FloatingCTA from "@/components/FloatingCTA";
import MarqueeTicker from "@/components/MarqueeTicker";
import Cursor from "@/components/Cursor";
import CartDrawer from "@/components/CartDrawer";
import MobileBottomNav from "@/components/MobileBottomNav";
import SearchOverlay from "@/components/SearchOverlay";
import { CartProvider } from "@/lib/cartContext";
import { WishlistProvider } from "@/lib/wishlistContext";
import { SearchProvider } from "@/lib/searchContext";

const IntroAnimation = dynamic(() => import('@/components/IntroAnimation'), { ssr: false });
const SmoothScroll   = dynamic(() => import('@/components/SmoothScroll'),   { ssr: false });
const ScrollProgress = dynamic(() => import('@/components/ScrollProgress'), { ssr: false });

export const metadata: Metadata = {
  title: "NutriTribe — Snack Bold. Live Rooted.",
  description:
    "Premium roasted makhana (fox nuts) sourced from the lily ponds of Mithila, Bihar. Buy phool makhana online — gluten-free, healthy Indian snacks reimagined for the modern palate.",
  keywords:
    "makhana, fox nuts, premium roasted makhana, buy phool makhana online, healthy fox nuts, gluten-free indian snacks, 6 suta makhana, Bihar, Mithila, superfood, NutriTribe",
  openGraph: {
    title: "NutriTribe — Snack Bold. Live Rooted.",
    description:
      "Premium roasted makhana (fox nuts) sourced from the lily ponds of Mithila, Bihar. India's ancient superfood, reimagined for the modern palate.",
    type: "website",
  },
};

export default function CustomerLayout({ children }: { children: React.ReactNode }) {
  return (
    <CartProvider>
      <WishlistProvider>
        <SearchProvider>
          <ScrollProgress />
          <IntroAnimation />
          <Cursor />
          <FloatingCTA />
          <MarqueeTicker />
          <Navbar />
          <CartDrawer />
          <SearchOverlay />
          <SmoothScroll>
            <main className="pb-16 md:pb-0">{children}</main>
            <Footer />
          </SmoothScroll>
          <MobileBottomNav />
        </SearchProvider>
      </WishlistProvider>
    </CartProvider>
  );
}
