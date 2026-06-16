import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Shipping & Delivery Policy — NutriTribe',
  description: 'Shipping and delivery information for NutriTribe orders.',
};

export default function ShippingPage() {
  return (
    <div className="min-h-screen bg-ivory-grain pt-28 pb-20">
      <div className="max-w-3xl mx-auto px-6">
        <Link href="/" className="inline-flex items-center gap-2 font-body text-sm text-earthen-rust/50 hover:text-sun-harvest transition-colors mb-8">
          <ArrowLeft size={14} /> Back to Home
        </Link>

        <div className="mb-10">
          <p className="font-body text-xs font-semibold tracking-widest uppercase text-sun-harvest mb-3">Legal</p>
          <h1 className="font-display font-bold text-4xl text-earthen-rust mb-2">Shipping &amp; Delivery Policy</h1>
          <p className="font-body text-sm text-earthen-rust/45">Last updated: May 31, 2025</p>
        </div>

        <div className="prose-legal">
          <p>This Shipping &amp; Delivery Policy is part of our Terms and Conditions (&quot;Terms&quot;) and should be read alongside our main Terms at <Link href="/terms-and-conditions" className="text-sun-harvest hover:underline">nutritribe.shop/terms-and-conditions</Link>.</p>
          <p>Please carefully review our Shipping &amp; Delivery Policy when purchasing our products. This policy will apply to any order you place with us.</p>

          <h2>What Are My Shipping &amp; Delivery Options?</h2>

          <h3>In-Store Pickup</h3>
          <p>In-store pickup is available for all purchases. Pickups are available Monday – Friday from 9:00 AM to 8:00 PM.</p>

          <h3>Free Shipping</h3>
          <p>We offer free standard shipping on all orders.</p>
          <p>Orders are typically delivered within 5 to 9 business days from the date of dispatch, depending on the destination. Most orders are delivered within 7 days.</p>

          <p>We also offer various shipping options. In some cases, a third-party supplier may manage our inventory and be responsible for shipping your products.</p>

          <h2>Do You Deliver Internationally?</h2>
          <p>We do not offer international shipping at this time.</p>

          <h2>What Happens If My Order Is Delayed?</h2>
          <p>If delivery is delayed for any reason, we will notify you as soon as possible and advise you of a revised estimated date for delivery.</p>
        </div>

        <LegalNav current="shipping" />
      </div>
    </div>
  );
}

function LegalNav({ current }: { current: string }) {
  const links = [
    { href: '/terms-and-conditions', label: 'Terms & Conditions', key: 'terms' },
    { href: '/privacy-policy', label: 'Privacy Policy', key: 'privacy' },
    { href: '/shipping-policy', label: 'Shipping Policy', key: 'shipping' },
    { href: '/refund-policy', label: 'Refund Policy', key: 'refund' },
  ];
  return (
    <div className="mt-16 pt-8 border-t border-earthen-rust/10">
      <p className="font-body text-xs font-semibold tracking-widest uppercase text-earthen-rust/40 mb-4">Other Legal Pages</p>
      <div className="flex flex-wrap gap-3">
        {links.filter(l => l.key !== current).map(l => (
          <Link key={l.href} href={l.href}
            className="font-body text-xs font-semibold text-earthen-rust/60 hover:text-sun-harvest border border-earthen-rust/15 hover:border-sun-harvest/30 px-4 py-2 rounded-full transition-all">
            {l.label}
          </Link>
        ))}
      </div>
    </div>
  );
}
