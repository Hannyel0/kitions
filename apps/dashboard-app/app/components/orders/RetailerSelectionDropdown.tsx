'use client';

import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search as SearchIcon, CheckIcon, ChevronDown } from 'lucide-react';

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
      <motion.button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-3 py-2 bg-white/60 backdrop-blur-sm border border-white/30 rounded-xl text-left focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent cursor-pointer hover:bg-white/80 transition-all duration-300 text-sm"
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
      >
        <div className="flex items-center justify-between">
          {selectedRetailer ? (
            <div className="flex items-center">
              <div className="h-8 w-8 rounded-full bg-blue-500/20 backdrop-blur-sm flex items-center justify-center flex-shrink-0 border border-blue-300/30">
                <span className="text-blue-700 font-medium text-sm">
                  {selectedRetailer.name.charAt(0)}
                </span>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-900">
                  {selectedRetailer.name}
                </p>
                <p className="text-xs text-gray-600">{selectedRetailer.email}</p>
              </div>
            </div>
          ) : (
            <span className="text-gray-500 text-sm">Select a retailer</span>
          )}
          <ChevronDown 
            size={16} 
            className={`text-gray-500 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} 
          />
        </div>
      </motion.button>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            className="absolute z-50 mt-2 w-full bg-white/90 backdrop-blur-md rounded-xl shadow-xl border border-white/30 max-h-[400px] overflow-hidden"
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2, ease: [0.19, 1, 0.22, 1] }}
          >
            <div className="p-3 border-b border-white/30">
              <div className="relative">
                <SearchIcon
                  size={16}
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                />
                <input
                  type="text"
                  className="w-full pl-9 pr-3 py-2 bg-white/60 backdrop-blur-sm border border-white/30 rounded-lg text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all duration-300"
                  placeholder="Search retailers..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            
            <div className="overflow-y-auto max-h-[332px]">
              {filteredRetailers.length > 0 ? (
                filteredRetailers.map((retailer) => (
                  <motion.button
                    key={retailer.id}
                    type="button"
                    onClick={() => {
                      onSelect(retailer.id);
                      setIsOpen(false);
                      setSearchQuery('');
                    }}
                    className={`w-full px-4 py-3 flex items-start hover:bg-white/60 backdrop-blur-sm transition-all duration-200 ${
                      selectedRetailerId === retailer.id ? 'bg-blue-50/80 backdrop-blur-sm' : ''
                    }`}
                    whileHover={{ x: 2 }}
                  >
                    <div className="h-8 w-8 rounded-full bg-blue-500/20 backdrop-blur-sm flex items-center justify-center flex-shrink-0 border border-blue-300/30">
                      <span className="text-blue-700 font-medium text-sm">
                        {retailer.name.charAt(0)}
                      </span>
                    </div>
                    <div className="ml-3 flex-1 text-left">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-gray-900">
                          {retailer.name}
                        </p>
                        {selectedRetailerId === retailer.id && (
                          <CheckIcon size={16} className="text-blue-600" />
                        )}
                      </div>
                      <p className="text-xs text-gray-600 mb-1">{retailer.email}</p>
                      <div className="flex items-center space-x-3">
                        {retailer.phone && (
                          <span className="text-xs text-gray-500">
                            {retailer.phone}
                          </span>
                        )}
                        {retailer.address && (
                          <span className="text-xs text-gray-500 truncate">
                            {retailer.address}
                          </span>
                        )}
                      </div>
                    </div>
                  </motion.button>
                ))
              ) : (
                <div className="p-4 text-center">
                  <p className="text-sm text-gray-500">No retailers found</p>
                  {searchQuery && (
                    <p className="text-xs text-gray-400 mt-1">
                      Try adjusting your search terms
                    </p>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
