import React from 'react';

interface QuickActionCardProps {
  icon: string;
  title: string;
  description: string;
  onClick: () => void;
}

export default function QuickActionCard({ icon, title, description, onClick }: QuickActionCardProps) {
  return (
    <div className="bg-gray-50 rounded-lg p-6 hover:bg-gray-100 transition-colors cursor-pointer" onClick={onClick}>
      <div className="mb-4 h-12 w-12 rounded-full bg-indigo-100 flex items-center justify-center">
        <i className={`fas fa-${icon} text-indigo-600 text-xl`}></i>
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-1">{title}</h3>
      <p className="text-sm text-gray-600">{description}</p>
    </div>
  );
} 