import ComingSoon from '../components/ComingSoon';
import { generateMetadata as createMetadata, pageMetadata } from '@/app/lib/metadata';
import { Metadata } from 'next';

export const metadata: Metadata = createMetadata(
  pageMetadata.forRetailers.title,
  pageMetadata.forRetailers.description
);

export default function ForRetailersPage() {
  return <ComingSoon pageName="For Retailers" />;
} 