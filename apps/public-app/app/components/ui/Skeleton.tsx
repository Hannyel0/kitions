import React from 'react';

interface SkeletonProps {
  className?: string;
  count?: number;
  height?: string | number;
  width?: string | number;
  circle?: boolean;
  inline?: boolean;
}

export default function Skeleton({
  className = '',
  count = 1,
  height,
  width,
  circle = false,
  inline = false,
}: SkeletonProps) {
  const style: React.CSSProperties = {
    height: height || 'auto',
    width: width || '100%',
    borderRadius: circle ? '50%' : '0.375rem'
  };

  return (
    <>
      {Array(count).fill(0).map((_, i) => (
        <div
          key={i}
          className={`animate-pulse bg-gray-200 ${inline ? 'inline-block' : 'block'} ${className}`}
          style={style}
          aria-hidden="true"
        />
      ))}
    </>
  );
}

export function SkeletonText({
  lines = 3,
  className = '',
  lastLineWidth = '70%',
}: {
  lines?: number;
  className?: string;
  lastLineWidth?: string;
}) {
  return (
    <div className={`space-y-2 w-full ${className}`}>
      {Array(lines).fill(0).map((_, i) => (
        <div 
          key={i}
          className="animate-pulse bg-gray-200 h-4 rounded"
          style={{ 
            width: i === lines - 1 && lastLineWidth ? lastLineWidth : '100%'
          }}
        />
      ))}
    </div>
  );
}

export function PricingCardSkeleton() {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
      <div className="text-center mb-6">
        <Skeleton height={24} width="30%" className="mx-auto mb-3 rounded" />
        <SkeletonText lines={2} className="mb-6" />
        <Skeleton height={32} width="50%" className="mx-auto rounded" />
      </div>
      
      <div className="space-y-3 mb-8">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex items-start">
            <Skeleton height={20} width={20} circle className="mr-2" />
            <Skeleton height={20} />
          </div>
        ))}
      </div>
      
      <Skeleton height={48} className="rounded-lg" />
    </div>
  );
}

export function ContactFormSkeleton() {
  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-lg mb-16 mx-auto max-w-6xl">
      <div className="flex flex-col md:flex-row">
        <div className="bg-gray-200 p-10 md:w-2/5">
          <Skeleton height={32} width="75%" className="mb-6 rounded" />
          <Skeleton height={16} width="80%" className="mb-12 rounded" />
          
          <div className="space-y-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex items-center">
                <Skeleton height={40} width={40} circle className="mr-4" />
                <Skeleton height={20} width="75%" />
              </div>
            ))}
          </div>
          
          <div className="mt-16 flex space-x-4">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} height={40} width={40} circle />
            ))}
          </div>
        </div>
        
        <div className="p-10 md:w-3/5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {[...Array(2)].map((_, i) => (
              <div key={i}>
                <Skeleton height={20} width="33%" className="mb-2 rounded" />
                <Skeleton height={40} className="rounded" />
              </div>
            ))}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {[...Array(2)].map((_, i) => (
              <div key={i}>
                <Skeleton height={20} width="33%" className="mb-2 rounded" />
                <Skeleton height={40} className="rounded" />
              </div>
            ))}
          </div>
          
          <div className="mb-6">
            <Skeleton height={20} width="67%" className="mb-3 rounded" />
            <div className="flex gap-6">
              {[...Array(2)].map((_, i) => (
                <div key={i} className="flex items-center">
                  <Skeleton height={24} width={24} circle className="mr-2" />
                  <Skeleton height={20} width={96} />
                </div>
              ))}
            </div>
          </div>
          
          <div className="mb-8">
            <Skeleton height={20} width="25%" className="mb-2 rounded" />
            <Skeleton height={128} className="rounded" />
          </div>
          
          <div className="text-right mt-4">
            <Skeleton height={48} width={144} className="ml-auto rounded-lg" />
          </div>
        </div>
      </div>
    </div>
  );
} 