import Image from 'next/image';

export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-8">
        <div className="text-center mb-8">
          <Image 
            src="/default-monochrome-black.svg" 
            alt="Kitions" 
            width={150} 
            height={50}
          />
        </div>
        
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#8982cf] mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Loading</h2>
          <p className="text-gray-600">Please wait...</p>
        </div>
      </div>
    </div>
  );
} 