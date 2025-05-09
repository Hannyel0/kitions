import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 text-center">
      <h1 className="text-6xl font-bold text-[#8982cf] mb-4">404</h1>
      <h2 className="text-2xl font-semibold text-gray-700 mb-6">Page Not Found</h2>
      <p className="text-gray-500 mb-8">We couldn&apos;t find the page you were looking for.</p>
      <Link 
        href="/"
        className="px-6 py-3 bg-[#8982cf] text-white font-semibold rounded-lg shadow hover:bg-[#7873b3] transition-colors"
      >
        Return Home
      </Link>
    </div>
  );
} 