import { Metadata } from 'next';
import OurStoryPageClient from './OurStoryPageClient';

export const metadata: Metadata = {
  title: 'Our Story | NutriTribe — Rooted in Mithila, Bihar',
  description:
    "From the lily ponds of Mithila to your snack bowl — the story of NutriTribe, the Sahni families behind our harvest, and our mission to bring premium gluten-free fox nuts to the world.",
  openGraph: {
    title: 'Our Story | NutriTribe',
    description:
      "The heritage and people behind NutriTribe's premium makhana — rooted in Mithila, Bihar.",
    type: 'website',
  },
};

export default function OurStoryPage() {
  return <OurStoryPageClient />;
}
