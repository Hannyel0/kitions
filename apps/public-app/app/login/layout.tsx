import { generateMetadata } from '../lib/metadata';
import type { Metadata } from 'next';

export const metadata: Metadata = generateMetadata(
  'Log In',
  'Log in to your Kitions account to connect with suppliers and retailers.'
);

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
} 