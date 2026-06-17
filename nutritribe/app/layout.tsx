import type { Metadata } from "next";
import { Playfair_Display, Poppins } from "next/font/google";
import "./globals.css";
import Analytics from "@/components/Analytics";

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
  metadataBase: new URL("https://www.nutritribe.com"),
  title: {
    default: "NutriTribe — Premium Roasted Makhana & Healthy Fox Nuts",
    template: "%s",
  },
  description:
    "Premium roasted makhana (fox nuts) from the lily ponds of Mithila, Bihar. Gluten-free, healthy Indian snacks — buy phool makhana online from NutriTribe.",
  openGraph: {
    siteName: "NutriTribe",
    type: "website",
    locale: "en_IN",
    images: [{ url: "/logo.png" }],
  },
  twitter: {
    card: "summary_large_image",
    images: ["/logo.png"],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${playfair.variable} ${poppins.variable}`}>
      <body className="font-body antialiased">
        <Analytics />
        {children}
      </body>
    </html>
  );
}
