import ComingSoon from '../components/ComingSoon';

export default function BlogPage() {
  return <ComingSoon pageName="Blog" />;
}

export function generateMetadata() {
  return {
    title: 'Blog - Kitions',
    description: 'Insights, news, and updates from Kitions about retail, brands, and e-commerce.',
  };
} 