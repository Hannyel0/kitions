import DistributorsHero from '../components/DistributorsHero';
import DistributorsValueProp from '../components/DistributorsValueProp';
import DistributorsFeatures from '../components/DistributorsFeatures';
import DistributorsCTA from '../components/DistributorsCTA';
import { generateMetadata as createMetadata, pageMetadata } from '@/app/lib/metadata';
import { Metadata } from 'next';

export const metadata: Metadata = createMetadata(
  pageMetadata.forDistributors.title,
  pageMetadata.forDistributors.description
);

export default function ForDistributorsPage() {
  return (
    <>
      <DistributorsHero />
      <DistributorsValueProp />
      <DistributorsFeatures />
      <DistributorsCTA />
    </>
  );
} 