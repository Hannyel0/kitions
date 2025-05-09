
import { Suspense } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';

import SuccessClientPage from './SuccessClientPage';


// Loading component
const LoadingFallback = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
    <div className="text-center">
      <div className="inline-block">
        <FontAwesomeIcon icon={faSpinner} className="text-[#8982cf] text-5xl animate-spin mb-4" />
      </div>
      <h1 className="text-2xl font-bold text-gray-800">Loading payment details...</h1>
      <p className="text-gray-600 mt-2">Please wait a moment while we load your information.</p>
    </div>
  </div>
);

export default function SuccessPageWrapper() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <SuccessClientPage />
    </Suspense>
  );
} 