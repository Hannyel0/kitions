export default function Loading() {
  return (
    <main className="pt-24 min-h-screen bg-white relative overflow-hidden">
      {/* Background styles similar to main page */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-white via-white to-[#f5f3ff] opacity-100"></div>
      </div>
      
      <div className="container mx-auto px-4 py-8 relative z-10">
        {/* Heading skeleton */}
        <div className="animate-pulse mx-auto mb-6 w-3/4 h-14 bg-gray-200 rounded-lg"></div>
        <div className="animate-pulse mx-auto mb-2 w-1/2 h-4 bg-gray-200 rounded-lg"></div>
        <div className="animate-pulse mx-auto mb-8 w-2/5 h-4 bg-gray-200 rounded-lg"></div>
        
        {/* Pricing cards skeleton */}
        <div className="mb-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Generate 3 pricing card skeletons */}
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                {/* Card heading */}
                <div className="text-center mb-6">
                  <div className="animate-pulse mx-auto mb-3 w-1/3 h-6 bg-gray-200 rounded"></div>
                  <div className="animate-pulse mx-auto mb-6 w-5/6 h-20 bg-gray-200 rounded"></div>
                  <div className="animate-pulse mx-auto w-1/2 h-8 bg-gray-200 rounded"></div>
                </div>
                
                {/* Feature list */}
                <div className="space-y-3 mb-8">
                  {[...Array(5)].map((_, j) => (
                    <div key={j} className="flex items-start">
                      <div className="animate-pulse h-5 w-5 mr-2 bg-gray-200 rounded-full"></div>
                      <div className="animate-pulse h-5 w-full bg-gray-200 rounded"></div>
                    </div>
                  ))}
                </div>
                
                {/* Button */}
                <div className="animate-pulse mx-auto h-12 w-full bg-gray-200 rounded-lg"></div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Contact form skeleton */}
        <div className="bg-white rounded-lg overflow-hidden shadow-lg mb-16 mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row">
            {/* Left column */}
            <div className="bg-gray-200 p-10 md:w-2/5">
              <div className="animate-pulse mb-6 h-8 w-3/4 bg-gray-300 rounded"></div>
              <div className="animate-pulse mb-12 h-4 w-4/5 bg-gray-300 rounded"></div>
              
              <div className="space-y-6">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="flex items-center">
                    <div className="animate-pulse h-10 w-10 bg-gray-300 rounded-full"></div>
                    <div className="animate-pulse ml-4 h-5 w-3/4 bg-gray-300 rounded"></div>
                  </div>
                ))}
              </div>
              
              {/* Social media icons */}
              <div className="mt-16 flex space-x-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="animate-pulse h-10 w-10 bg-gray-300 rounded-full"></div>
                ))}
              </div>
            </div>
            
            {/* Right column - form fields */}
            <div className="p-10 md:w-3/5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                {[...Array(2)].map((_, i) => (
                  <div key={i}>
                    <div className="animate-pulse mb-2 h-5 w-1/3 bg-gray-200 rounded"></div>
                    <div className="animate-pulse h-10 w-full bg-gray-200 rounded"></div>
                  </div>
                ))}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                {[...Array(2)].map((_, i) => (
                  <div key={i}>
                    <div className="animate-pulse mb-2 h-5 w-1/3 bg-gray-200 rounded"></div>
                    <div className="animate-pulse h-10 w-full bg-gray-200 rounded"></div>
                  </div>
                ))}
              </div>
              
              <div className="mb-6">
                <div className="animate-pulse mb-3 h-5 w-2/3 bg-gray-200 rounded"></div>
                <div className="flex gap-6">
                  {[...Array(2)].map((_, i) => (
                    <div key={i} className="flex items-center">
                      <div className="animate-pulse h-6 w-6 bg-gray-200 rounded-full"></div>
                      <div className="animate-pulse ml-2 h-5 w-24 bg-gray-200 rounded"></div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="mb-8">
                <div className="animate-pulse mb-2 h-5 w-1/4 bg-gray-200 rounded"></div>
                <div className="animate-pulse h-32 w-full bg-gray-200 rounded"></div>
              </div>
              
              <div className="text-right mt-4">
                <div className="animate-pulse inline-block h-12 w-36 bg-gray-200 rounded-lg"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
} 