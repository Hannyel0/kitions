import ComingSoon from '../components/ComingSoon';
import { generateMetadata as createMetadata, pageMetadata } from '@/app/lib/metadata';
import { Metadata } from 'next';

export const metadata: Metadata = createMetadata(
  pageMetadata.forDistributors.title,
  pageMetadata.forDistributors.description
);

export default function ForDistributorsPage() {
  return <ComingSoon pageName="For Distributors" />;
} 