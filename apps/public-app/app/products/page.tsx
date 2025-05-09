import ComingSoon from '../components/ComingSoon';

export default function ProductsPage() {
  return <ComingSoon pageName="Products" />;
}

export function generateMetadata() {
  return {
    title: 'Products - Kitions',
    description: 'Explore our range of products and solutions designed for retailers and brands.',
  };
} 