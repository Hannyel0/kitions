import { generateMetadata } from '@/app/lib/metadata';
import type { Metadata } from 'next';

export const metadata: Metadata = generateMetadata(
  'Authenticating',
  'Verifying your credentials and establishing your session'
);

export default function AuthCallbackLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
} 