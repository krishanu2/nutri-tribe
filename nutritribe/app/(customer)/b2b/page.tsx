import { Metadata } from 'next';
import B2BPageClient from './B2BPageClient';

export const metadata: Metadata = {
  title: 'B2B & Bulk Orders | Premium Makhana Wholesale — NutriTribe',
  description:
    'Partner with NutriTribe for bulk orders of premium roasted makhana and healthy, gluten-free fox nuts. Wholesale pricing for retailers, cafes, gyms and corporate pantries.',
  openGraph: {
    title: 'B2B & Bulk Orders | NutriTribe',
    description:
      'Wholesale and bulk pricing on premium makhana for retailers, cafes, gyms and corporate pantries.',
    type: 'website',
  },
};

export default function B2BPage() {
  return <B2BPageClient />;
}
