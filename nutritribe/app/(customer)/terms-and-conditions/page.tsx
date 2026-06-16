import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Terms & Conditions — NutriTribe',
  description: 'Terms and Conditions for using NutriTribe services.',
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-ivory-grain pt-28 pb-20">
      <div className="max-w-3xl mx-auto px-6">
        <Link href="/" className="inline-flex items-center gap-2 font-body text-sm text-earthen-rust/50 hover:text-sun-harvest transition-colors mb-8">
          <ArrowLeft size={14} /> Back to Home
        </Link>

        <div className="mb-10">
          <p className="font-body text-xs font-semibold tracking-widest uppercase text-sun-harvest mb-3">Legal</p>
          <h1 className="font-display font-bold text-4xl text-earthen-rust mb-2">Terms &amp; Conditions</h1>
          <p className="font-body text-sm text-earthen-rust/45">Last updated: May 27, 2025</p>
        </div>

        <div className="prose-legal">
          <p>Please read these terms and conditions carefully before using Our Service.</p>

          <h2>Interpretation and Definitions</h2>
          <h3>Interpretation</h3>
          <p>The words with the initial letter capitalized have meanings defined under the following conditions. The following definitions shall have the same meaning regardless of whether they appear in singular or plural.</p>

          <h3>Definitions</h3>
          <p>For the purposes of these Terms and Conditions:</p>
          <ul>
            <li><strong>Affiliate</strong> means an entity that controls, is controlled by or is under common control with a party.</li>
            <li><strong>Country</strong> refers to: Bihar, India</li>
            <li><strong>Company</strong> (referred to as either &quot;the Company&quot;, &quot;We&quot;, &quot;Us&quot; or &quot;Our&quot;) refers to Origins Tribes Private Limited, KN-1266 RAMJEECHAK, DIGH Bataganj, Dinapur-Cum-Khagaul, Patna, Bihar – 800018.</li>
            <li><strong>Device</strong> means any device that can access the Service such as a computer, cellphone or digital tablet.</li>
            <li><strong>Service</strong> refers to the Website.</li>
            <li><strong>Terms and Conditions</strong> (also referred as &quot;Terms&quot;) mean these Terms and Conditions that form the entire agreement between You and the Company.</li>
            <li><strong>Third-party Social Media Service</strong> means any services or content provided by a third-party displayed or made available through the Service.</li>
            <li><strong>Website</strong> refers to NutriTribe, accessible from <a href="https://www.nutritribe.shop" target="_blank" rel="noopener noreferrer">https://www.nutritribe.shop</a></li>
            <li><strong>You</strong> means the individual or entity using the Service.</li>
          </ul>

          <h2>Acknowledgment</h2>
          <p>These Terms govern the use of this Service and form the agreement between You and the Company. Your access to the Service is conditioned on Your acceptance of and compliance with these Terms. By using the Service, You agree to be bound by these Terms. If You disagree, please do not use the Service.</p>
          <p>You must be over 18 to use the Service. Use by those under 18 is not permitted.</p>
          <p>Use of the Service is also subject to Our Privacy Policy.</p>

          <h2>Links to Other Websites</h2>
          <p>Our Service may contain links to third-party websites. We are not responsible for their content, privacy policies, or practices.</p>

          <h2>Termination</h2>
          <p>We may terminate or suspend Your access immediately, without notice, for any reason including if You violate these Terms.</p>

          <h2>Limitation of Liability</h2>
          <p>Our total liability under any provision shall not exceed the amount paid by You through the Service or $100 USD if no purchase was made.</p>
          <p>We shall not be liable for any indirect, incidental or consequential damages under any circumstance.</p>

          <h2>&quot;AS IS&quot; and &quot;AS AVAILABLE&quot; Disclaimer</h2>
          <p>The Service is provided &quot;AS IS&quot; and &quot;AS AVAILABLE&quot;. We disclaim all warranties including merchantability, fitness for a particular purpose, and non-infringement.</p>

          <h2>Governing Law</h2>
          <p>These Terms are governed by the laws of Bihar, India, excluding conflict of law rules.</p>

          <h2>Disputes Resolution</h2>
          <p>For any disputes, please contact Us first to attempt informal resolution.</p>

          <h2>For European Union (EU) Users</h2>
          <p>If You are an EU consumer, You will benefit from any mandatory provisions of the law of the country in which You reside.</p>

          <h2>United States Legal Compliance</h2>
          <p>You represent and warrant that You are not located in any country subject to U.S. embargo or listed on any U.S. government list of prohibited parties.</p>

          <h2>Severability and Waiver</h2>
          <h3>Severability</h3>
          <p>If any part of these Terms is found to be invalid or unenforceable, the rest shall remain in effect.</p>
          <h3>Waiver</h3>
          <p>Failure to enforce any part of these Terms shall not be deemed a waiver of future rights.</p>

          <h2>Translation Interpretation</h2>
          <p>If these Terms are translated, the English version shall prevail in case of conflict.</p>

          <h2>Changes to These Terms and Conditions</h2>
          <p>We may update these Terms at any time. Material changes will be notified at least 30 days in advance.</p>
          <p>By continuing to use the Service, You agree to the updated Terms. If You do not agree, please stop using the Service.</p>
        </div>

        <LegalNav current="terms" />
      </div>
    </div>
  );
}

function LegalNav({ current }: { current: string }) {
  const links = [
    { href: '/terms-and-conditions', label: 'Terms & Conditions' },
    { href: '/privacy-policy', label: 'Privacy Policy' },
    { href: '/shipping-policy', label: 'Shipping Policy' },
    { href: '/refund-policy', label: 'Refund Policy' },
  ];
  return (
    <div className="mt-16 pt-8 border-t border-earthen-rust/10">
      <p className="font-body text-xs font-semibold tracking-widest uppercase text-earthen-rust/40 mb-4">Other Legal Pages</p>
      <div className="flex flex-wrap gap-3">
        {links.filter(l => !l.href.includes(current === 'terms' ? 'terms' : current === 'privacy' ? 'privacy' : current === 'shipping' ? 'shipping' : 'refund')).map(l => (
          <Link key={l.href} href={l.href}
            className="font-body text-xs font-semibold text-earthen-rust/60 hover:text-sun-harvest border border-earthen-rust/15 hover:border-sun-harvest/30 px-4 py-2 rounded-full transition-all">
            {l.label}
          </Link>
        ))}
      </div>
    </div>
  );
}
