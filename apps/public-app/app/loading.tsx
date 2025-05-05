export default function Loading() {
  return (
    <main className="pt-24 min-h-screen bg-white">
      <div className="container mx-auto px-4 py-8">
        {/* Hero section skeleton */}
        <div className="flex flex-col items-center mb-12">
          <div className="animate-pulse w-3/4 h-16 bg-gray-200 rounded-lg mb-6"></div>
          <div className="animate-pulse w-1/2 h-5 bg-gray-200 rounded mb-2"></div>
          <div className="animate-pulse w-2/5 h-5 bg-gray-200 rounded mb-8"></div>
          <div className="animate-pulse w-48 h-12 bg-gray-200 rounded-full"></div>
        </div>
        
        {/* Features section skeleton */}
        <div className="mb-16">
          <div className="animate-pulse w-1/3 h-10 bg-gray-200 rounded-lg mx-auto mb-8"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="p-6 rounded-lg border border-gray-200">
                <div className="animate-pulse h-12 w-12 bg-gray-200 rounded-full mb-4"></div>
                <div className="animate-pulse h-6 w-3/4 bg-gray-200 rounded mb-3"></div>
                <div className="animate-pulse h-20 w-full bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        </div>
        
        {/* CTA banner skeleton */}
        <div className="py-16 px-8 bg-gray-100 rounded-xl mb-16">
          <div className="flex flex-col items-center">
            <div className="animate-pulse w-2/3 h-10 bg-gray-200 rounded-lg mb-6"></div>
            <div className="animate-pulse w-3/4 h-5 bg-gray-200 rounded mb-8"></div>
            <div className="animate-pulse w-48 h-12 bg-gray-200 rounded-full"></div>
          </div>
        </div>
      </div>
    </main>
  );
} 