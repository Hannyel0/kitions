import ComingSoon from '../components/ComingSoon';

export default function AboutPage() {
  return <ComingSoon pageName="About Us" />;
}

export function generateMetadata() {
  return {
    title: 'About Us - Kitions',
    description: 'Learn more about Kitions, our mission, vision, and the team behind our platform.',
  };
} 