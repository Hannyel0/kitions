export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white p-4">
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
        {/* Logo placeholder */}
        <div className="flex justify-center mb-6">
          <div className="animate-pulse h-12 w-48 bg-gray-200 rounded"></div>
        </div>
        
        {/* Title */}
        <div className="animate-pulse h-8 w-56 bg-gray-200 rounded-lg mx-auto mb-3"></div>
        
        {/* Subtitle */}
        <div className="animate-pulse h-4 w-3/4 bg-gray-200 rounded mx-auto mb-8"></div>
        
        {/* Input field */}
        <div className="space-y-4 mb-8">
          <div className="animate-pulse h-5 w-24 bg-gray-200 rounded mb-2"></div>
          <div className="animate-pulse h-12 w-full bg-gray-200 rounded"></div>
        </div>
        
        {/* Reset button */}
        <div className="animate-pulse h-12 w-full bg-gray-200 rounded-lg mb-8"></div>
        
        {/* Back to login link */}
        <div className="animate-pulse h-5 w-32 bg-gray-200 rounded mx-auto"></div>
      </div>
    </div>
  );
} 