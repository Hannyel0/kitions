import ComingSoon from '../../components/ComingSoon';

export default function PublicPage() {
  return <ComingSoon pageName="Public Data" />;
}

export function generateMetadata() {
  return {
    title: 'Public Data - Kitions',
    description: 'Public data information for Kitions websites and services. Coming soon!',
  };
} 