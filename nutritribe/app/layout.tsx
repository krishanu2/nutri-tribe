import type { Metadata } from "next";
import { Playfair_Display, Poppins } from "next/font/google";
import "./globals.css";
import dynamic from 'next/dynamic';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FloatingCTA from "@/components/FloatingCTA";
import MarqueeTicker from "@/components/MarqueeTicker";
import Cursor from "@/components/Cursor";
import CartDrawer from "@/components/CartDrawer";
import { CartProvider } from "@/lib/cartContext";

const IntroAnimation  = dynamic(() => import('@/components/IntroAnimation'),  { ssr: false });
const SmoothScroll    = dynamic(() => import('@/components/SmoothScroll'),    { ssr: false });
const ScrollProgress  = dynamic(() => import('@/components/ScrollProgress'),  { ssr: false });

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["400", "600", "700"],
  style: ["normal", "italic"],
  display: "swap",
});

const poppins = Poppins({
  subsets: ["latin"],
  variable: "--font-body",
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "NutriTribe — Snack Bold. Live Rooted.",
  description:
    "Premium makhana (fox nuts) sourced from the lotus ponds of Mithila, Bihar. India's ancient superfood, reimagined for the modern palate.",
  keywords: "makhana, fox nuts, healthy snacks, Bihar, Mithila, superfood, NutriTribe",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${playfair.variable} ${poppins.variable}`}>
      <body className="font-body bg-ivory-grain text-earthen-rust antialiased">
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
      </body>
    </html>
  );
}
