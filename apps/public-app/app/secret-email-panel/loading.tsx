import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope } from '@fortawesome/free-solid-svg-icons';

export default function Loading() {
  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden animate-pulse">
        {/* Header Skeleton */}
        <div className="bg-gradient-to-r from-[#8982cf] to-[#7873b3] px-6 py-8 sm:px-10">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
              <FontAwesomeIcon icon={faEnvelope} className="text-white text-xl" />
            </div>
            <div className="ml-4">
              <div className="h-7 bg-white/30 rounded-md w-48"></div>
              <div className="h-4 bg-white/20 rounded-md w-64 mt-2"></div>
            </div>
          </div>
        </div>
        
        {/* Form Skeleton */}
        <div className="px-6 py-8 sm:px-10">
          {/* Recipient */}
          <div className="mb-6">
            <div className="h-4 bg-gray-200 rounded-md w-32 mb-2"></div>
            <div className="h-12 bg-gray-100 rounded-md w-full"></div>
          </div>
          
          {/* Subject */}
          <div className="mb-6">
            <div className="h-4 bg-gray-200 rounded-md w-20 mb-2"></div>
            <div className="h-12 bg-gray-100 rounded-md w-full"></div>
          </div>
          
          {/* Message */}
          <div className="mb-8">
            <div className="h-4 bg-gray-200 rounded-md w-24 mb-2"></div>
            <div className="h-48 bg-gray-100 rounded-md w-full"></div>
          </div>
          
          {/* Security notice */}
          <div className="mb-6 bg-yellow-50/30 rounded-lg p-4">
            <div className="flex">
              <div className="h-5 w-5 bg-yellow-200 rounded-full mr-3"></div>
              <div className="w-full">
                <div className="h-4 bg-yellow-100 rounded-md w-32 mb-2"></div>
                <div className="h-3 bg-yellow-100 rounded-md w-full mt-2"></div>
                <div className="h-3 bg-yellow-100 rounded-md w-3/4 mt-1"></div>
              </div>
            </div>
          </div>
          
          {/* Submit button */}
          <div className="flex justify-end">
            <div className="h-12 bg-gray-200 rounded-md w-36"></div>
          </div>
        </div>
      </div>
    </div>
  );
} 