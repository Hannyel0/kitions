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
    default: 'Kitions — Connect Distributors & Retailers',
    template: `%s | ${APP_NAME}`,
  },
  description: 'The leading B2B marketplace connecting food distributors and retailers. Streamline your supply chain, discover new products, and grow your business with Kitions.',
  keywords: [
    'B2B marketplace',
    'food distribution',
    'wholesale',
    'retailers',
    'distributors',
    'supply chain',
    'inventory management',
    'food service',
    'procurement',
    'Kitions'
  ],
  authors: [{ name: 'Kitions' }],
  creator: 'Kitions',
  publisher: 'Kitions',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://www.kitions.com',
    siteName: 'Kitions',
    title: 'Kitions — Connect Distributors & Retailers',
    description: 'The leading B2B marketplace connecting food distributors and retailers. Streamline your supply chain, discover new products, and grow your business with Kitions.',
    images: [
      {
        url: '/preview-cover.png',
        width: 1200,
        height: 630,
        alt: 'Kitions - B2B marketplace connecting food distributors and retailers',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Kitions — Connect Distributors & Retailers',
    description: 'The leading B2B marketplace connecting food distributors and retailers. Streamline your supply chain, discover new products, and grow your business.',
    images: ['/preview-cover.png'],
    creator: '@kitions',
    site: '@kitions',
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_PUBLIC_APP_URL || 'https://www.kitions.com'
  ),
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
  },
};

/**
 * Helper to generate metadata for specific pages
 */
export function generateMetadata(
  title: string,
  description?: string,
  overrides?: Partial<Metadata>
): Metadata {
  const pageTitle = `${title} | ${APP_NAME}`;
  const pageDescription = description || (defaultMetadata.description as string);
  
  return {
    ...defaultMetadata,
    title: pageTitle,
    description: pageDescription,
    openGraph: {
      ...defaultMetadata.openGraph,
      title: pageTitle,
      description: pageDescription,
      ...overrides?.openGraph,
    },
    twitter: {
      ...defaultMetadata.twitter,
      title: pageTitle,
      description: pageDescription,
      ...overrides?.twitter,
    },
    ...overrides,
  };
}

/**
 * Predefined metadata for common pages
 */
export const pageMetadata = {
  home: {
    title: 'Kitions — Connect Distributors & Retailers',
    description: 'The leading B2B marketplace connecting food distributors and retailers. Streamline your supply chain, discover new products, and grow your business with Kitions.',
  },
  forDistributors: {
    title: 'For Distributors — Expand Your Reach',
    description: 'Reach more retailers, streamline orders, and grow your distribution business with Kitions. Join thousands of distributors already using our platform.',
  },
  forRetailers: {
    title: 'For Retailers — Find Quality Suppliers',
    description: 'Discover verified distributors, compare products, and manage your inventory efficiently. Join retailers who trust Kitions for their supply needs.',
  },
  about: {
    title: 'About Us — Our Mission',
    description: 'Learn about Kitions mission to revolutionize the food distribution industry by connecting distributors and retailers through innovative technology.',
  },
  partnership: {
    title: 'Partnership — Grow Together',
    description: 'Partner with Kitions to expand your business reach. Explore partnership opportunities and join our growing network of food industry professionals.',
  },
  blog: {
    title: 'Blog — Industry Insights',
    description: 'Stay updated with the latest trends, tips, and insights in food distribution, retail, and supply chain management from the Kitions team.',
  },
  products: {
    title: 'Products — Browse Our Catalog',
    description: 'Explore thousands of quality products from verified distributors. Find exactly what your business needs in our comprehensive product catalog.',
  },
  login: {
    title: 'Login — Access Your Account',
    description: 'Login to your Kitions account to manage your business, track orders, and connect with partners in our B2B marketplace.',
  },
  signup: {
    title: 'Sign Up — Join Kitions',
    description: 'Join Kitions today and start connecting with distributors or retailers. Sign up for free and transform your business operations.',
  },
}; 