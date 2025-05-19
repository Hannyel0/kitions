'use client';

import React from 'react';
import { useState } from 'react';
import Image from 'next/image';

interface Customer {
  id: string;
  name: string;
  email: string;
  device: 'Mobile' | 'Tablet' | 'Desktop';
  country: string;
  dateAdded: string;
  status: 'Waiting' | 'Completed';
  profilePicture?: string;
}

interface WaitingListTableProps {
  initialCustomers: Customer[];
}

export default function WaitingListTable({ initialCustomers }: WaitingListTableProps) {
  const [customers, setCustomers] = useState<Customer[]>(initialCustomers);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<keyof Customer | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value;
    setSearchTerm(term);
    
    if (term.trim() === '') {
      setCustomers(initialCustomers);
    } else {
      const filtered = initialCustomers.filter(customer => 
        customer.name.toLowerCase().includes(term.toLowerCase()) ||
        customer.email.toLowerCase().includes(term.toLowerCase()) ||
        customer.country.toLowerCase().includes(term.toLowerCase())
      );
      setCustomers(filtered);
    }
  };
  
  const handleSort = (field: keyof Customer) => {
    const isAsc = sortField === field && sortDirection === 'asc';
    const direction = isAsc ? 'desc' : 'asc';
    
    setSortField(field);
    setSortDirection(direction);
    
    const sorted = [...customers].sort((a, b) => {
      const valueA = a[field];
      const valueB = b[field];
      
      if (valueA && valueB) {
        if (valueA < valueB) return direction === 'asc' ? -1 : 1;
        if (valueA > valueB) return direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
    
    setCustomers(sorted);
  };
  
  const getDeviceIcon = (device: string) => {
    switch (device) {
      case 'Mobile':
        return <i className="fas fa-mobile-alt text-gray-600"></i>;
      case 'Tablet':
        return <i className="fas fa-tablet-alt text-gray-600"></i>;
      case 'Desktop':
        return <i className="fas fa-desktop text-gray-600"></i>;
      default:
        return null;
    }
  };
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Completed':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
            Completed
          </span>
        );
      case 'Waiting':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            Waiting
          </span>
        );
      default:
        return null;
    }
  };
  
  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <h2 className="text-gray-800 text-lg font-medium">Waiting List</h2>
          
          <div className="flex items-center space-x-3">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <i className="fas fa-search text-gray-400"></i>
              </div>
              <input
                type="text"
                placeholder="Search"
                value={searchTerm}
                onChange={handleSearch}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 placeholder-gray-400"
              />
            </div>
            
            <div className="relative">
              <button className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500">
                <i className="fas fa-filter mr-2 text-gray-500"></i>
                Filter
                <i className="fas fa-chevron-down ml-2 text-gray-500"></i>
              </button>
            </div>
            
            <div className="relative">
              <button className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500">
                <i className="fas fa-sort mr-2 text-gray-500"></i>
                Sort
                <i className="fas fa-chevron-down ml-2 text-gray-500"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                </div>
              </th>
              <th 
                scope="col" 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('name')}
              >
                <div className="flex items-center">
                  Name
                  {sortField === 'name' && (
                    <i className={`fas fa-chevron-${sortDirection === 'asc' ? 'up' : 'down'} ml-1`}></i>
                  )}
                </div>
              </th>
              <th 
                scope="col" 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('email')}
              >
                <div className="flex items-center">
                  Email
                  {sortField === 'email' && (
                    <i className={`fas fa-chevron-${sortDirection === 'asc' ? 'up' : 'down'} ml-1`}></i>
                  )}
                </div>
              </th>
              <th 
                scope="col" 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('device')}
              >
                <div className="flex items-center">
                  Device
                  {sortField === 'device' && (
                    <i className={`fas fa-chevron-${sortDirection === 'asc' ? 'up' : 'down'} ml-1`}></i>
                  )}
                </div>
              </th>
              <th 
                scope="col" 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('country')}
              >
                <div className="flex items-center">
                  Country
                  {sortField === 'country' && (
                    <i className={`fas fa-chevron-${sortDirection === 'asc' ? 'up' : 'down'} ml-1`}></i>
                  )}
                </div>
              </th>
              <th 
                scope="col" 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('dateAdded')}
              >
                <div className="flex items-center">
                  Date Added
                  {sortField === 'dateAdded' && (
                    <i className={`fas fa-chevron-${sortDirection === 'asc' ? 'up' : 'down'} ml-1`}></i>
                  )}
                </div>
              </th>
              <th 
                scope="col" 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('status')}
              >
                <div className="flex items-center">
                  Status
                  {sortField === 'status' && (
                    <i className={`fas fa-chevron-${sortDirection === 'asc' ? 'up' : 'down'} ml-1`}></i>
                  )}
                </div>
              </th>
              <th scope="col" className="relative px-6 py-3">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {customers.map((customer) => (
              <tr key={customer.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    />
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="h-8 w-8 rounded-full overflow-hidden bg-gray-100 flex-shrink-0">
                      {customer.profilePicture ? (
                        <Image
                          src={customer.profilePicture}
                          alt={customer.name}
                          width={32}
                          height={32}
                          className="object-cover"
                        />
                      ) : (
                        <div className="h-full w-full flex items-center justify-center bg-indigo-100 text-indigo-500">
                          {customer.name.charAt(0).toUpperCase()}
                        </div>
                      )}
                    </div>
                    <div className="ml-3">
                      <div className="text-sm font-medium text-gray-900">{customer.name}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{customer.email}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center text-sm text-gray-500">
                    {getDeviceIcon(customer.device)}
                    <span className="ml-2">{customer.device}</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {customer.country}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {customer.dateAdded}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {getStatusBadge(customer.status)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button className="text-gray-400 hover:text-gray-500">
                    <i className="fas fa-ellipsis-h"></i>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div className="px-6 py-3 border-t border-gray-200 flex items-center justify-between">
        <div className="flex items-center">
          <span className="text-sm text-gray-700">
            Showing <span className="font-medium">1</span> to <span className="font-medium">{customers.length}</span> of{" "}
            <span className="font-medium">{initialCustomers.length}</span> results
          </span>
        </div>
        
        <div className="flex items-center space-x-2">
          <button className="px-3 py-1 rounded-md bg-white border border-gray-300 text-sm font-medium text-gray-500 hover:bg-gray-50">
            Previous
          </button>
          <button className="px-3 py-1 rounded-md bg-indigo-50 border border-indigo-500 text-sm font-medium text-indigo-600">
            1
          </button>
          <button className="px-3 py-1 rounded-md bg-white border border-gray-300 text-sm font-medium text-gray-500 hover:bg-gray-50">
            2
          </button>
          <button className="px-3 py-1 rounded-md bg-white border border-gray-300 text-sm font-medium text-gray-500 hover:bg-gray-50">
            3
          </button>
          <button className="px-3 py-1 rounded-md bg-white border border-gray-300 text-sm font-medium text-gray-500 hover:bg-gray-50">
            Next
          </button>
        </div>
      </div>
    </div>
  );
} 