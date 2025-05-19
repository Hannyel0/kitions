'use client';

import React from 'react';
import { useState } from 'react';

interface ConversionChartProps {
  percentage: number;
  percentChange: number;
  purchasedCount: number;
  registeredCount: number;
  dateOptions?: string[];
}

export default function ConversionChart({ 
  percentage, 
  percentChange, 
  purchasedCount, 
  registeredCount,
  dateOptions = ['Dec 2024']
}: ConversionChartProps) {
  const [selectedDate, setSelectedDate] = useState(dateOptions[0]);
  
  // Calculate circle values
  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;
  
  return (
    <div className="bg-white rounded-lg p-6 shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-gray-700 font-medium">Conversion</h3>
        
        <div className="relative">
          <select 
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="appearance-none bg-gray-100 text-gray-700 text-sm rounded-lg py-1.5 px-3 pr-8 focus:outline-none focus:ring-2 focus:ring-indigo-300"
          >
            {dateOptions.map(date => (
              <option key={date} value={date}>{date}</option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
              <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
            </svg>
          </div>
        </div>
      </div>
      
      <div className="flex justify-center">
        <div className="relative h-44 w-44 flex items-center justify-center">
          {/* Background circle */}
          <svg className="absolute w-full h-full" viewBox="0 0 180 180">
            <circle 
              cx="90" 
              cy="90" 
              r={radius} 
              fill="none" 
              stroke="#F3F4F6" 
              strokeWidth="12" 
            />
          </svg>
          
          {/* Progress circle */}
          <svg className="absolute w-full h-full -rotate-90" viewBox="0 0 180 180">
            <circle 
              cx="90" 
              cy="90" 
              r={radius} 
              fill="none" 
              stroke="#6366F1" 
              strokeWidth="12" 
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              strokeLinecap="round"
            />
            <circle 
              cx="90" 
              cy={90 - radius} 
              r="6" 
              fill="#F59E0B" 
            />
          </svg>
          
          {/* Percentage text */}
          <div className="text-center">
            <div className="text-4xl font-bold text-gray-900">{percentage}%</div>
            <div className={`text-xs ${percentChange >= 0 ? 'text-red-500' : 'text-green-500'}`}>
              {percentChange >= 0 ? '+' : ''}{percentChange}% from last month
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-6 space-y-3">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <span className="h-3 w-3 bg-indigo-500 rounded-full mr-2"></span>
            <span className="text-sm text-gray-700">Purchased</span>
          </div>
          <span className="text-sm font-medium text-gray-900">{purchasedCount.toLocaleString()}</span>
        </div>
        
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <span className="h-3 w-3 bg-yellow-500 rounded-full mr-2"></span>
            <span className="text-sm text-gray-700">Registered</span>
          </div>
          <span className="text-sm font-medium text-gray-900">{registeredCount.toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
} 