import dynamic from 'next/dynamic';
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

export default function Home() {
  return (
    <>
      <JourneyTracker />
      <HeroSection />
      <TrustBar />
      <SectionDivider variant="lotus" />
      <MakhanaSpotlight />
      <SectionDivider variant="makhana" />
      <ProductShowcase />
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
