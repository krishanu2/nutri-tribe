import { Metadata } from 'next';
import CorporateGiftingPageClient from './CorporateGiftingPageClient';

export const metadata: Metadata = {
  title: 'Corporate Gifting | Premium Makhana Gift Boxes — NutriTribe',
  description:
    "Delight your team and clients with NutriTribe's premium makhana gift boxes — healthy, gluten-free Indian snacks beautifully packaged for corporate gifting and festive occasions.",
  openGraph: {
    title: 'Corporate Gifting | NutriTribe',
    description:
      'Premium makhana gift boxes for corporate gifting and festive occasions.',
    type: 'website',
  },
};

export default function CorporateGiftingPage() {
  return <CorporateGiftingPageClient />;
}
