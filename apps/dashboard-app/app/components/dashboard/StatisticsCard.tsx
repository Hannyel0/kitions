'use client';

import React from 'react';
import { useState } from 'react';

interface StatisticsCardProps {
  title: string;
  value: string;
  percentChange: number;
  chartData?: {
    labels: string[];
    values: number[];
  };
  timeFrames?: string[];
}

export default function StatisticsCard({ 
  title, 
  value, 
  percentChange, 
  chartData = { labels: [], values: [] },
  timeFrames = ['1Y', '3Y', '5Y', 'All']
}: StatisticsCardProps) {
  const [activeTimeFrame, setActiveTimeFrame] = useState('1Y');
  
  // Find max value for scaling the chart
  const maxValue = Math.max(...chartData.values, 1);
  
  return (
    <div className="bg-white rounded-lg p-6 shadow-sm">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h3 className="text-gray-600 text-sm font-medium">{title}</h3>
          <div className="flex items-baseline">
            <span className="text-3xl font-bold text-gray-900">{value}</span>
            <span className={`ml-2.5 text-xs ${percentChange >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              {percentChange >= 0 ? '+' : ''}{percentChange}%
            </span>
          </div>
        </div>
        
        <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
          {timeFrames.map(frame => (
            <button
              key={frame}
              className={`text-xs px-2.5 py-1 rounded-lg transition-colors ${
                activeTimeFrame === frame 
                  ? 'bg-white shadow-sm text-gray-800' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTimeFrame(frame)}
            >
              {frame}
            </button>
          ))}
        </div>
      </div>
      
      {chartData.values.length > 0 && (
        <div className="h-36 relative">
          <div className="flex items-end justify-between h-full relative">
            {chartData.values.map((value, index) => {
              const height = (value / maxValue) * 100;
              const isHighest = value === maxValue;
              
              return (
                <div 
                  key={index}
                  className="group relative flex-1 px-1 flex flex-col justify-end"
                >
                  <div 
                    className={`relative rounded-t-sm transition-all ${
                      isHighest 
                        ? 'bg-indigo-500' 
                        : 'bg-indigo-400 group-hover:bg-indigo-500'
                    }`}
                    style={{ height: `${height}%` }}
                  >
                    {/* Tooltip */}
                    <div className="opacity-0 group-hover:opacity-100 absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                      {value}
                    </div>
                    
                    {/* For stacked bar effect (e.g. for direct sales vs waiting list) */}
                    {isHighest && (
                      <div className="absolute bottom-full w-full rounded-t-sm bg-yellow-400" style={{ height: '15%' }}></div>
                    )}
                  </div>
                  <div className="text-xs text-gray-500 text-center mt-1">
                    {chartData.labels[index]}
                  </div>
                </div>
              );
            })}
          </div>
          
          {/* Grid lines */}
          <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
            <div className="h-px w-full bg-gray-100"></div>
            <div className="h-px w-full bg-gray-100"></div>
            <div className="h-px w-full bg-gray-100"></div>
            <div className="h-px w-full bg-gray-100"></div>
          </div>
        </div>
      )}
      
      {/* Legend */}
      <div className="mt-4 flex items-center text-xs">
        <div className="flex items-center mr-4">
          <span className="h-2 w-2 bg-indigo-500 rounded-full mr-1.5"></span>
          <span className="text-gray-600">Direct Sales</span>
          <span className="ml-2 text-gray-900 font-medium">$19,321</span>
        </div>
        <div className="flex items-center">
          <span className="h-2 w-2 bg-yellow-400 rounded-full mr-1.5"></span>
          <span className="text-gray-600">Waiting List Registration</span>
          <span className="ml-2 text-gray-900 font-medium">$19,235</span>
        </div>
      </div>
    </div>
  );
} 