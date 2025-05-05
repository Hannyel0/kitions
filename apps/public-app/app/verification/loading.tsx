export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white p-4">
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md text-center">
        {/* Logo placeholder */}
        <div className="flex justify-center mb-6">
          <div className="animate-pulse h-12 w-48 bg-gray-200 rounded"></div>
        </div>
        
        {/* Title */}
        <div className="animate-pulse h-8 w-64 bg-gray-200 rounded-lg mx-auto mb-4"></div>
        
        {/* Description */}
        <div className="animate-pulse h-4 w-full bg-gray-200 rounded mb-2"></div>
        <div className="animate-pulse h-4 w-3/4 bg-gray-200 rounded mx-auto mb-8"></div>
        
        {/* Verification code inputs */}
        <div className="flex justify-center space-x-3 mb-8">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="animate-pulse h-14 w-12 bg-gray-200 rounded"></div>
          ))}
        </div>
        
        {/* Timer */}
        <div className="animate-pulse h-5 w-40 bg-gray-200 rounded-lg mx-auto mb-6"></div>
        
        {/* Resend button */}
        <div className="animate-pulse h-5 w-32 bg-gray-200 rounded mx-auto mb-8"></div>
        
        {/* Verify button */}
        <div className="animate-pulse h-12 w-full bg-gray-200 rounded-lg"></div>
      </div>
    </div>
  );
} 