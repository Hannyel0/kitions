'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { useState } from 'react';

interface SidebarProps {
  userType: 'distributor' | 'retailer' | 'admin';
}

export default function DashboardSidebar({ userType }: SidebarProps) {
  const pathname = usePathname();
  
  const isActive = (path: string) => {
    return pathname?.includes(path);
  };

  const [expanded, setExpanded] = useState(true);
  
  const basePath = `/${userType}`;
  
  const distributorLinks = [
    { name: 'Home', path: `${basePath}/home`, icon: 'home' },
    { name: 'Waiting List', path: `${basePath}/waiting-list`, icon: 'list-check' },
    { name: 'Sales', path: `${basePath}/sales`, icon: 'chart-line' },
    { name: 'Shipment', path: `${basePath}/shipment`, icon: 'truck' },
    { name: 'Customer Management', path: `${basePath}/customers`, icon: 'users' },
    { name: 'Reports', path: `${basePath}/reports`, icon: 'file-lines' },
  ];
  
  const retailerLinks = [
    { name: 'Home', path: `${basePath}/home`, icon: 'home' },
    { name: 'Products', path: `${basePath}/products`, icon: 'box' },
    { name: 'Orders', path: `${basePath}/orders`, icon: 'shopping-cart' },
    { name: 'Distributors', path: `${basePath}/distributors`, icon: 'building' },
  ];
  
  const adminLinks = [
    { name: 'Dashboard', path: `${basePath}/home`, icon: 'home' },
    { name: 'User Management', path: `${basePath}/users`, icon: 'users' },
    { name: 'Content Moderation', path: `${basePath}/moderation`, icon: 'shield' },
    { name: 'Analytics', path: `${basePath}/analytics`, icon: 'chart-bar' },
    { name: 'System Config', path: `${basePath}/config`, icon: 'cogs' },
    { name: 'Support Tickets', path: `${basePath}/tickets`, icon: 'ticket' },
  ];
  
  let links;
  if (userType === 'distributor') {
    links = distributorLinks;
  } else if (userType === 'retailer') {
    links = retailerLinks;
  } else {
    links = adminLinks;
  }
  
  const bottomLinks = [
    { name: 'Documentation', path: `${basePath}/docs`, icon: 'book' },
    { name: 'Help Center', path: `${basePath}/help`, icon: 'circle-question' },
    { name: 'Setting', path: `${basePath}/settings`, icon: 'gear' },
  ];

  return (
    <aside className={`bg-white h-screen flex flex-col border-r border-gray-200 transition-all duration-300 ${expanded ? 'w-64' : 'w-20'}`}>
      <div className="p-4 flex items-center border-b border-gray-200">
        <div className="flex-shrink-0 mr-3">
          <div className="h-8 w-8 bg-indigo-600 rounded-lg flex items-center justify-center">
            <i className="fas fa-box text-white"></i>
          </div>
        </div>
        {expanded && (
          <span className="font-semibold text-xl text-gray-800">Kitions</span>
        )}
        <button 
          className="ml-auto text-gray-500 hover:text-gray-700"
          onClick={() => setExpanded(!expanded)}
        >
          <i className={`fas fa-${expanded ? 'chevron-left' : 'chevron-right'}`}></i>
        </button>
      </div>
      
      <nav className="flex-1 overflow-y-auto">
        <ul className="p-2">
          {links.map((link) => (
            <li key={link.path} className="mb-2">
              <Link 
                href={link.path}
                className={`flex items-center py-2 px-4 rounded-lg transition-colors ${
                  isActive(link.path) 
                    ? 'bg-indigo-100 text-indigo-600' 
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <i className={`fas fa-${link.icon} ${expanded ? 'mr-3' : 'mx-auto'}`}></i>
                {expanded && <span>{link.name}</span>}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      
      <div className="mt-auto border-t border-gray-200">
        <ul className="p-2">
          {bottomLinks.map((link) => (
            <li key={link.path} className="mb-2">
              <Link 
                href={link.path}
                className="flex items-center py-2 px-4 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
              >
                <i className={`fas fa-${link.icon} ${expanded ? 'mr-3' : 'mx-auto'}`}></i>
                {expanded && <span>{link.name}</span>}
              </Link>
            </li>
          ))}
        </ul>
        
        <Link 
          href="/logout"
          className="flex items-center py-2 px-4 my-2 mx-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
        >
          <i className={`fas fa-sign-out-alt ${expanded ? 'mr-3' : 'mx-auto'}`}></i>
          {expanded && <span>Sign Out</span>}
        </Link>
        
        <div className="p-2 mt-2">
          {expanded ? (
            <div className="p-3 bg-gray-100 rounded-lg">
              <p className="text-xs text-gray-700">Upgrade to Pro</p>
              <p className="text-xs text-gray-500 mt-1">Upgrade now to access advanced tools and analytics.</p>
              <button className="mt-2 w-full text-center py-1.5 px-4 bg-white text-indigo-600 rounded-lg text-sm font-medium border border-gray-300 hover:bg-gray-50">
                Upgrade
              </button>
            </div>
          ) : (
            <div className="flex justify-center">
              <button className="w-10 h-10 flex items-center justify-center bg-gray-100 rounded-lg text-indigo-600 hover:bg-gray-200">
                <i className="fas fa-arrow-up text-xs"></i>
              </button>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
} 