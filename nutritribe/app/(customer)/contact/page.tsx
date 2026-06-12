import { Metadata } from 'next';
import ContactPageClient from './ContactPageClient';

export const metadata: Metadata = {
  title: 'Contact Us | NutriTribe',
  description:
    "Get in touch with NutriTribe for queries about our premium roasted makhana, healthy fox nuts, bulk orders, or partnerships. We'd love to hear from you.",
  openGraph: {
    title: 'Contact Us | NutriTribe',
    description: 'Get in touch with NutriTribe — questions, orders, partnerships and more.',
    type: 'website',
  },
};

export default function ContactPage() {
  return <ContactPageClient />;
}
