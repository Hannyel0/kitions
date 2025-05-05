import { Metadata } from 'next';

/**
 * Base application name to be used in titles
 */
export const APP_NAME = 'Kitions';

/**
 * Default metadata for the application
 */
export const defaultMetadata: Metadata = {
  title: {
    default: APP_NAME,
    template: `%s | ${APP_NAME}`,
  },
  description: 'Connect with trusted suppliers and retailers in the Kitions network.',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://www.kitions.com',
    siteName: APP_NAME,
    title: APP_NAME,
    description: 'Connect with trusted suppliers and retailers in the Kitions network.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: APP_NAME,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: APP_NAME,
    description: 'Connect with trusted suppliers and retailers in the Kitions network.',
    images: ['/og-image.jpg'],
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_PUBLIC_APP_URL || 'https://www.kitions.com'
  ),
};

/**
 * Helper to generate metadata for specific pages
 */
export function generateMetadata(
  title: string,
  description?: string,
  overrides?: Partial<Metadata>
): Metadata {
  return {
    ...defaultMetadata,
    title: title,
    description: description || defaultMetadata.description,
    openGraph: {
      ...defaultMetadata.openGraph,
      title: title,
      description: description || defaultMetadata.openGraph?.description,
    },
    twitter: {
      ...defaultMetadata.twitter,
      title: title,
      description: description || defaultMetadata.twitter?.description,
    },
    ...overrides,
  };
} 