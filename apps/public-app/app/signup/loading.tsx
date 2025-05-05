export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white p-4">
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
        {/* Logo placeholder */}
        <div className="flex justify-center mb-6">
          <div className="animate-pulse h-12 w-48 bg-gray-200 rounded"></div>
        </div>
        
        {/* Title */}
        <div className="animate-pulse h-8 w-40 bg-gray-200 rounded-lg mx-auto mb-6"></div>
        
        {/* Input fields */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <div className="animate-pulse h-5 w-24 bg-gray-200 rounded mb-2"></div>
            <div className="animate-pulse h-12 w-full bg-gray-200 rounded"></div>
          </div>
          <div>
            <div className="animate-pulse h-5 w-24 bg-gray-200 rounded mb-2"></div>
            <div className="animate-pulse h-12 w-full bg-gray-200 rounded"></div>
          </div>
        </div>
        
        <div className="space-y-4 mb-6">
          <div>
            <div className="animate-pulse h-5 w-24 bg-gray-200 rounded mb-2"></div>
            <div className="animate-pulse h-12 w-full bg-gray-200 rounded"></div>
          </div>
          <div>
            <div className="animate-pulse h-5 w-24 bg-gray-200 rounded mb-2"></div>
            <div className="animate-pulse h-12 w-full bg-gray-200 rounded"></div>
          </div>
        </div>
        
        {/* Terms checkbox */}
        <div className="flex items-start mb-6">
          <div className="animate-pulse h-5 w-5 bg-gray-200 rounded mr-3 mt-1"></div>
          <div className="animate-pulse h-5 w-full bg-gray-200 rounded"></div>
        </div>
        
        {/* Signup button */}
        <div className="animate-pulse h-12 w-full bg-gray-200 rounded-lg mb-6"></div>
        
        {/* Social signup options */}
        <div className="animate-pulse h-5 w-48 bg-gray-200 rounded-lg mx-auto mb-6"></div>
        
        <div className="flex justify-center space-x-4 mb-6">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="animate-pulse h-12 w-12 bg-gray-200 rounded-full"></div>
          ))}
        </div>
        
        {/* Login link */}
        <div className="animate-pulse h-5 w-64 bg-gray-200 rounded-lg mx-auto"></div>
      </div>
    </div>
  );
} 