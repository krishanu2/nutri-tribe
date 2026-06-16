import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Return & Refund Policy — NutriTribe',
  description: 'Return and refund policy for NutriTribe orders.',
};

export default function RefundPage() {
  return (
    <div className="min-h-screen bg-ivory-grain pt-28 pb-20">
      <div className="max-w-3xl mx-auto px-6">
        <Link href="/" className="inline-flex items-center gap-2 font-body text-sm text-earthen-rust/50 hover:text-sun-harvest transition-colors mb-8">
          <ArrowLeft size={14} /> Back to Home
        </Link>

        <div className="mb-10">
          <p className="font-body text-xs font-semibold tracking-widest uppercase text-sun-harvest mb-3">Legal</p>
          <h1 className="font-display font-bold text-4xl text-earthen-rust mb-2">Return &amp; Refund Policy</h1>
          <p className="font-body text-sm text-earthen-rust/45">Last updated: May 27, 2025</p>
        </div>

        <div className="prose-legal">
          <p>Thank you for shopping at NutriTribe.</p>
          <p>If, for any reason, You are not completely satisfied with a purchase, We invite You to review our policy on refunds and returns. The following terms are applicable for any products that You purchased with Us.</p>

          <h2>Interpretation and Definitions</h2>
          <h3>Interpretation</h3>
          <p>The words with capitalized initial letters have meanings defined under the following conditions. These definitions shall apply regardless of whether they appear in singular or plural.</p>

          <h3>Definitions</h3>
          <p>For the purposes of this Return and Refund Policy:</p>
          <ul>
            <li><strong>Company</strong> refers to Origins Tribes Private Limited, KN-1266 RAMJEECHAK, DIGH Bataganj Dinapur-Cum-Khagaul Patna Bihar – 800018.</li>
            <li><strong>Goods</strong> refer to the items offered for sale on the Service.</li>
            <li><strong>Orders</strong> mean a request by You to purchase Goods from Us.</li>
            <li><strong>Service</strong> refers to the Website.</li>
            <li><strong>Website</strong> refers to NutriTribe, accessible from <a href="https://www.nutritribe.shop" target="_blank" rel="noopener noreferrer">https://www.nutritribe.shop</a></li>
            <li><strong>You</strong> means the individual using the Service, or the company, or other legal entity on behalf of which such individual is accessing the Service.</li>
          </ul>

          <h2>Your Order Cancellation Rights</h2>
          <p>You are entitled to cancel Your Order within 7 days without giving any reason. The deadline for cancellation is 7 days from the date You received the Goods or when a third party you appointed, who is not the carrier, takes possession.</p>

          <h2>Returning Goods</h2>
          <p>You are responsible for the cost and risk of returning the Goods to Us at:</p>
          <address>
            KN-1266 RAMJEECHAK, DIGH Bataganj<br />
            Dinapur-Cum-Khagaul, Patna<br />
            Bihar – 800018
          </address>
          <p>We recommend using a trackable and insured shipping method. No refunds will be issued without receiving the returned Goods.</p>

          <h2>Gifts</h2>
          <p>If the Goods were marked as a gift when purchased and shipped directly to you, you&apos;ll receive a gift credit. If not, the refund will be sent to the original purchaser.</p>
        </div>

        <LegalNav current="refund" />
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
