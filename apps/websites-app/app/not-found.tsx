'use client';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
      <motion.div
        whileHover={{ scale: 1.05 }}
        transition={{ type: "spring", stiffness: 300 }}
      >
        <Image
          src="/404svg.svg"
          alt="Page not found"
          width={400}
          height={400}
          className="mb-8 max-w-full h-auto"
          priority
        />
      </motion.div>
      <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-4">404 - Page Not Found</h1>
      <p className="text-gray-600 mb-6">Sorry, the page you&apos;re looking for doesn&apos;t exist.</p>
      <p className="text-gray-600 mb-6">We are currently working on it.</p>
      <Link
        href="/"
        className="bg-[#8982cf] text-white px-6 py-3 rounded-md hover:bg-[#7873b3] transition-colors"
      >
        Go back home
      </Link>
    </div>
  );
} 