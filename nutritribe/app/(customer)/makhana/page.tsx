import { Metadata } from 'next';
import MakhanaPageClient from './MakhanaPageClient';

export const metadata: Metadata = {
  title: 'The Makhana Story | Premium Phool Makhana from Mithila, Bihar',
  description:
    "Discover the heritage, harvest and nutrition behind NutriTribe's premium 6 Suta Makhana — gluten-free fox nuts hand-picked from the lily ponds of Mithila, Bihar by the Sahni community.",
  openGraph: {
    title: 'The Makhana Story | NutriTribe',
    description:
      "Heritage, harvest & nutrition behind India's ancient superfood — premium phool makhana from Mithila, Bihar.",
    type: 'website',
  },
};

export default function MakhanaPage() {
  return <MakhanaPageClient />;
}
