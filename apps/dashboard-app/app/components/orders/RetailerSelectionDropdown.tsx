'use client';

import React, { useEffect, useState, useRef } from 'react';
import { Search as SearchIcon, CheckIcon } from 'lucide-react';

interface Retailer {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
}

interface RetailerSelectionDropdownProps {
  retailers: Retailer[];
  selectedRetailerId?: string;
  onSelect: (retailerId: string) => void;
}

export function RetailerSelectionDropdown({
  retailers,
  selectedRetailerId,
  onSelect,
}: RetailerSelectionDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredRetailers = retailers.filter(
    (retailer) =>
      retailer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      retailer.email.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const selectedRetailer = retailers.find((r) => r.id === selectedRetailerId);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-left focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      >
        {selectedRetailer ? (
          <div className="flex items-center">
            <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
              <span className="text-blue-600 font-medium text-sm">
                {selectedRetailer.name.charAt(0)}
              </span>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-900">
                {selectedRetailer.name}
              </p>
              <p className="text-sm text-gray-500">{selectedRetailer.email}</p>
            </div>
          </div>
        ) : (
          <span className="cursor-pointer text-gray-500">Select a retailer</span>
        )}
      </button>
      {isOpen && (
        <div className="absolute z-10 mt-1 w-full bg-white rounded-lg shadow-lg border border-gray-200 max-h-[400px] overflow-hidden">
          <div className="p-2 border-b border-gray-200">
            <div className="relative">
              <SearchIcon
                size={18}
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                className="placeholder:text-gray-400 text-gray-800 w-full pl-9 pr-4 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Search retailers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          <div className="overflow-y-auto max-h-[332px]">
            {filteredRetailers.length > 0 ? (
              filteredRetailers.map((retailer) => (
                <button
                  key={retailer.id}
                  type="button"
                  onClick={() => {
                    onSelect(retailer.id);
                    setIsOpen(false);
                    setSearchQuery('');
                  }}
                  className={`w-full px-4 py-3 flex items-start hover:bg-gray-50 ${selectedRetailerId === retailer.id ? 'bg-blue-50' : ''}`}
                >
                  <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                    <span className="text-blue-600 font-medium text-sm">
                      {retailer.name.charAt(0)}
                    </span>
                  </div>
                  <div className="ml-3 flex-1">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-gray-900">
                        {retailer.name}
                      </p>
                      {selectedRetailerId === retailer.id && (
                        <CheckIcon size={16} className="text-blue-600" />
                      )}
                    </div>
                    <p className="text-sm text-gray-500">{retailer.email}</p>
                    <div className="mt-1 flex items-center space-x-4">
                      <span className="text-xs text-gray-500">
                        {retailer.phone}
                      </span>
                      <span className="text-xs text-gray-500 truncate">
                        {retailer.address}
                      </span>
                    </div>
                  </div>
                </button>
              ))
            ) : (
              <div className="p-4 text-center text-sm text-gray-500">
                No retailers found
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
