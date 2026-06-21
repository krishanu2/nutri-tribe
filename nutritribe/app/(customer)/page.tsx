import dynamic from 'next/dynamic';
import { db } from '@/lib/db';
import HeroSection from '@/components/sections/home/HeroSection';
import TrustBar from '@/components/sections/home/TrustBar';
import MakhanaSpotlight from '@/components/sections/home/MakhanaSpotlight';
import ProductShowcase from '@/components/sections/home/ProductShowcase';
import ValuesSection from '@/components/sections/home/ValuesSection';
import CultureBanner from '@/components/sections/home/CultureBanner';
import StatsSection from '@/components/sections/home/StatsSection';
import TestimonialsSection from '@/components/sections/home/TestimonialsSection';
import InstagramTeaser from '@/components/sections/home/InstagramTeaser';
import SectionDivider from '@/components/SectionDivider';

const JourneyTracker = dynamic(() => import('@/components/JourneyTracker'), { ssr: false });

const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: "Where does NutriTribe's makhana come from?",
      acceptedAnswer: {
        '@type': 'Answer',
        text: "NutriTribe's makhana is sourced from the lily ponds of Mithila, Bihar — the region that produces almost all of India's makhana, hand-harvested by local Sahni families.",
      },
    },
    {
      '@type': 'Question',
      name: 'What is makhana made from?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Makhana are the seeds of the Euryale ferox plant, also known as the Prickly Lily or fox nut plant, harvested from lily ponds and roasted to create a light, crunchy snack.',
      },
    },
    {
      '@type': 'Question',
      name: 'How much protein does makhana have?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Makhana contains around 10g of protein per 100g, while being naturally low in fat and gluten-free — making it one of the healthiest Indian snacks available.',
      },
    },
    {
      '@type': 'Question',
      name: "Is NutriTribe's makhana gluten-free and healthy?",
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. All NutriTribe makhana is 100% natural, gluten-free, roasted not fried, and free from artificial preservatives — a guilt-free snack for every day.',
      },
    },
  ],
};

export const revalidate = 60;

export default async function Home() {
  const products = await db.product.findMany({
    where: { status: 'PUBLISHED' },
    orderBy: { sortOrder: 'asc' },
  }).catch(() => []);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <JourneyTracker />
      <HeroSection />
      <TrustBar />
      <SectionDivider variant="lotus" />
      <MakhanaSpotlight />
      <SectionDivider variant="makhana" />
      <ProductShowcase products={products} />
      <SectionDivider variant="logo" darkBg={false} />
      <ValuesSection />
      <SectionDivider variant="lotus" darkBg={true} />
      <CultureBanner />
      <SectionDivider variant="makhana" />
      <StatsSection />
      <SectionDivider variant="logo" darkBg={true} />
      <TestimonialsSection />
      <SectionDivider variant="lotus" />
      <InstagramTeaser />
    </>
  );
}
