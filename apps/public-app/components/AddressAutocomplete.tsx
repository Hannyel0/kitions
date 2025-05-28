'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { MapPin, ChevronDown } from 'lucide-react';

interface AddressAutocompleteProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  className?: string;
}

interface AddressSuggestion {
  id: string;
  place_name: string;
  text: string;
}

export default function AddressAutocomplete({
  value,
  onChange,
  placeholder = "123 Business St, City, State, ZIP",
  required = false,
  className = ""
}: AddressAutocompleteProps) {
  const [suggestions, setSuggestions] = useState<AddressSuggestion[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  const accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN || '';

  // Debounce function
  const debounce = useCallback((func: Function, delay: number) => {
    let timeoutId: NodeJS.Timeout;
    return (...args: any[]) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func.apply(null, args), delay);
    };
  }, []);

  // Fetch address suggestions from Mapbox Geocoding API
  const fetchSuggestions = useCallback(async (query: string) => {
    if (!query.trim() || !accessToken) {
      setSuggestions([]);
      setIsOpen(false);
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json?access_token=${accessToken}&country=us&types=address&limit=5&autocomplete=true`
      );
      
      if (response.ok) {
        const data = await response.json();
        const addressSuggestions = data.features.map((feature: any) => ({
          id: feature.id,
          place_name: feature.place_name,
          text: feature.text
        }));
        setSuggestions(addressSuggestions);
        setIsOpen(addressSuggestions.length > 0);
      }
    } catch (error) {
      console.error('Error fetching address suggestions:', error);
      setSuggestions([]);
      setIsOpen(false);
    } finally {
      setIsLoading(false);
    }
  }, [accessToken]);

  // Debounced version of fetchSuggestions
  const debouncedFetchSuggestions = useCallback(
    debounce(fetchSuggestions, 300),
    [fetchSuggestions]
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    onChange(newValue);
    debouncedFetchSuggestions(newValue);
  };

  const handleSuggestionClick = (suggestion: AddressSuggestion) => {
    onChange(suggestion.place_name);
    setIsOpen(false);
    setSuggestions([]);
  };

  const handleInputFocus = () => {
    if (suggestions.length > 0) {
      setIsOpen(true);
    }
  };

  const handleInputBlur = () => {
    // Delay closing to allow for suggestion clicks
    setTimeout(() => {
      setIsOpen(false);
    }, 200);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="relative">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
        <MapPin className="h-5 w-5 text-gray-400" />
      </div>
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={handleInputChange}
        onFocus={handleInputFocus}
        onBlur={handleInputBlur}
        required={required}
        autoComplete="address-line1"
        className={`w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8982cf] focus:border-transparent transition-all duration-200 ${className}`}
        placeholder={placeholder}
      />
      
      {/* Loading indicator */}
      {isLoading && (
        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[#8982cf]"></div>
        </div>
      )}
      
      {/* Dropdown arrow */}
      {!isLoading && (
        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
          <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
        </div>
      )}

      {/* Suggestions dropdown */}
      {isOpen && suggestions.length > 0 && (
        <div
          ref={dropdownRef}
          className="absolute z-20 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto"
        >
          {suggestions.map((suggestion, index) => (
            <button
              key={suggestion.id}
              type="button"
              onClick={() => handleSuggestionClick(suggestion)}
              className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors duration-150 border-b border-gray-100 last:border-b-0 focus:outline-none focus:bg-gray-50"
              style={{
                animationDelay: `${index * 50}ms`
              }}
            >
              <div className="flex items-center">
                <MapPin className="h-4 w-4 text-gray-400 mr-3 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-gray-900 truncate">
                    {suggestion.place_name}
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
} 