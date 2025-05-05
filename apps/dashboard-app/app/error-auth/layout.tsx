import { generateMetadata } from '../lib/metadata';
import type { Metadata } from 'next';

export const metadata: Metadata = generateMetadata(
  'Authentication Error',
  'Authentication error page for Kitions Dashboard'
);

export default function ErrorAuthLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
} 