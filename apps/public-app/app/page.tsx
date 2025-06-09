import Hero from '@/app/components/Hero';
import AccessSection from '@/app/components/AccessSection';
import TargetAudienceSection from '@/app/components/TargetAudienceSection';
import { generateMetadata as createMetadata, pageMetadata } from '@/app/lib/metadata';
import { Metadata } from 'next';

export const metadata: Metadata = createMetadata(
  pageMetadata.home.title,
  pageMetadata.home.description
);

export default function Home() {
  return (
    <main>
      <Hero />
      <AccessSection />
      <TargetAudienceSection />
    </main>
  );
}
