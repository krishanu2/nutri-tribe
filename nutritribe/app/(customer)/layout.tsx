import type { Metadata } from "next";
import dynamic from 'next/dynamic';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FloatingCTA from "@/components/FloatingCTA";
import MarqueeTicker from "@/components/MarqueeTicker";
import Cursor from "@/components/Cursor";
import CartDrawer from "@/components/CartDrawer";
import { CartProvider } from "@/lib/cartContext";

const IntroAnimation = dynamic(() => import('@/components/IntroAnimation'), { ssr: false });
const SmoothScroll   = dynamic(() => import('@/components/SmoothScroll'),   { ssr: false });
const ScrollProgress = dynamic(() => import('@/components/ScrollProgress'), { ssr: false });

export const metadata: Metadata = {
  title: "NutriTribe — Snack Bold. Live Rooted.",
  description:
    "Premium makhana (fox nuts) sourced from the lotus ponds of Mithila, Bihar. India's ancient superfood, reimagined for the modern palate.",
  keywords: "makhana, fox nuts, healthy snacks, Bihar, Mithila, superfood, NutriTribe",
};

export default function CustomerLayout({ children }: { children: React.ReactNode }) {
  return (
    <CartProvider>
      <ScrollProgress />
      <IntroAnimation />
      <Cursor />
      <FloatingCTA />
      <MarqueeTicker />
      <Navbar />
      <CartDrawer />
      <SmoothScroll>
        <main>{children}</main>
        <Footer />
      </SmoothScroll>
    </CartProvider>
  );
}
