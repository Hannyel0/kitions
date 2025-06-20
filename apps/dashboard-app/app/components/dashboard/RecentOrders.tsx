'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { createBrowserClient } from '@supabase/ssr';
import { 
  CheckCircle as CheckCircleIcon, 
  Clock as ClockIcon, 
  XCircle as XCircleIcon, 
  AlertCircle as AlertCircleIcon,
  Eye as EyeIcon
} from 'lucide-react';

interface Order {
  id: string;
  order_number: string;
  created_at: string;
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
  payment_status: 'pending' | 'paid' | 'failed';
  total: number;
  retailer_id: string;
  retailer_name: string;
  retailer_email: string;
  distributor_name?: string;
  distributor_email?: string;
}

interface RecentOrdersProps {
  userType?: 'retailer' | 'distributor';
}

export function RecentOrders({ userType = 'distributor' }: RecentOrdersProps) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchRecentOrders() {
      try {
        setIsLoading(true);
        setError(null);
        
        const supabase = createBrowserClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL!,
          process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
        );
        
        // Get user session
        const { data: { session } } = await supabase.auth.getSession();
        const userId = session?.user.id;
        
        if (!userId) {
          throw new Error('User not authenticated');
        }
        
        let ordersData;
        let ordersError;

        if (userType === 'retailer') {
          // Get the retailer record for this user
          const { data: retailerData, error: retailerError } = await supabase
            .from('retailers')
            .select('id')
            .eq('user_id', userId)
            .single();
          
          if (retailerError) {
            throw new Error('Could not find retailer record for this user');
          }
          
          const retailerId = retailerData.id;
          
          // Fetch recent orders for this retailer (limit to 5 most recent)
          const result = await supabase
            .from('orders')
            .select(`
              id,
              order_number,
              created_at,
              status,
              payment_status,
              total,
              retailer_id,
              distributor_id,
              distributors (
                id,
                user_id,
                users (
                  email,
                  business_name
                )
              )
            `)
            .eq('retailer_id', retailerId)
            .order('created_at', { ascending: false })
            .limit(5);
          
          ordersData = result.data;
          ordersError = result.error;
        } else {
          // Get the distributor record for this user
          const { data: distributorData, error: distributorError } = await supabase
            .from('distributors')
            .select('id')
            .eq('user_id', userId)
            .single();
          
          if (distributorError) {
            throw new Error('Could not find distributor record for this user');
          }
          
          const distributorId = distributorData.id;
          
          // Fetch recent orders for this distributor (limit to 5 most recent)
          const result = await supabase
            .from('orders')
            .select(`
              id,
              order_number,
              created_at,
              status,
              payment_status,
              total,
              retailer_id,
              retailers (
                id,
                user_id,
                users (
                  email,
                  business_name
                )
              )
            `)
            .eq('distributor_id', distributorId)
            .order('created_at', { ascending: false })
            .limit(5);
          
          ordersData = result.data;
          ordersError = result.error;
        }
        
        if (ordersError) throw ordersError;
        
        if (!ordersData) {
          setOrders([]);
          return;
        }
        
        // Transform the data to match our Order interface
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const transformedOrders = ordersData.map((order: any) => {
          if (userType === 'retailer') {
            return {
              id: order.id,
              order_number: order.order_number,
              created_at: order.created_at,
              status: (order.status || 'pending') as Order['status'],
              payment_status: (order.payment_status || 'pending') as Order['payment_status'],
              total: order.total || 0,
              retailer_id: order.retailer_id,
              retailer_name: 'Your Order', // For retailer view, it's their own order
              retailer_email: '',
              distributor_name: order.distributors?.users?.business_name || 'Unknown Distributor',
              distributor_email: order.distributors?.users?.email || '',
            };
          } else {
            return {
              id: order.id,
              order_number: order.order_number,
              created_at: order.created_at,
              status: (order.status || 'pending') as Order['status'],
              payment_status: (order.payment_status || 'pending') as Order['payment_status'],
              total: order.total || 0,
              retailer_id: order.retailer_id,
              retailer_name: order.retailers?.users?.business_name || 'Unknown Business',
              retailer_email: order.retailers?.users?.email || '',
            };
          }
        });
        
        setOrders(transformedOrders);
      } catch (error) {
        console.error('Error fetching recent orders:', error);
        setError('Failed to load recent orders.');
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchRecentOrders();
  }, [userType]);

  const getStatusIcon = (status: Order['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircleIcon size={16} className="text-green-500" />;
      case 'processing':
        return <ClockIcon size={16} className="text-blue-500" />;
      case 'cancelled':
        return <XCircleIcon size={16} className="text-red-500" />;
      default:
        return <AlertCircleIcon size={16} className="text-yellow-500" />;
    }
  };

  const getStatusStyle = (status: Order['status']) => {
    switch (status) {
      case 'completed':
        return 'bg-green-50 text-green-700';
      case 'processing':
        return 'bg-blue-50 text-blue-700';
      case 'cancelled':
        return 'bg-red-50 text-red-700';
      default:
        return 'bg-yellow-50 text-yellow-700';
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#8982cf]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 p-4 rounded-md text-red-700 mb-4">
        {error}
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No recent orders found.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
      {/* Mobile view */}
      <div className="block sm:hidden">
        <div className="divide-y divide-gray-200">
          {orders.map((order) => (
            <div key={order.id} className="p-4 hover:bg-gray-50">
              <div className="flex items-center justify-between mb-2">
                <div className="text-sm font-medium text-gray-900">{order.order_number}</div>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusStyle(order.status)}`}>
                  {getStatusIcon(order.status)}
                  <span className="ml-1 capitalize">{order.status}</span>
                </span>
              </div>
              <div className="text-sm text-gray-600 mb-1">
                {userType === 'retailer' ? order.distributor_name : order.retailer_name}
              </div>
              <div className="flex items-center justify-between text-sm text-gray-500">
                <span>{new Date(order.created_at).toLocaleDateString()}</span>
                <div className="flex items-center space-x-2">
                  <span className="font-medium text-gray-900">${order.total.toFixed(2)}</span>
                  <Link
                    href={`/${userType}/orders/${order.id}`}
                    className="text-blue-600 hover:text-blue-900"
                  >
                    <EyeIcon size={16} />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Desktop view */}
      <div className="hidden sm:block overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
              <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {userType === 'retailer' ? 'Distributor' : 'Client'}
              </th>
              <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
              <th className="px-4 lg:px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {orders.map((order) => (
              <tr key={order.id} className="hover:bg-gray-50">
                <td className="px-4 lg:px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {order.order_number}
                </td>
                <td className="px-4 lg:px-6 py-4 whitespace-nowrap">
                  {userType === 'retailer' ? (
                    <>
                      <div className="text-sm font-medium text-gray-900">{order.distributor_name}</div>
                      <div className="text-sm text-gray-500 hidden lg:block">{order.distributor_email}</div>
                    </>
                  ) : (
                    <>
                      <div className="text-sm font-medium text-gray-900">{order.retailer_name}</div>
                      <div className="text-sm text-gray-500 hidden lg:block">{order.retailer_email}</div>
                    </>
                  )}
                </td>
                <td className="px-4 lg:px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(order.created_at).toLocaleDateString()}
                </td>
                <td className="px-4 lg:px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusStyle(order.status)}`}>
                    {getStatusIcon(order.status)}
                    <span className="ml-1 capitalize">{order.status}</span>
                  </span>
                </td>
                <td className="px-4 lg:px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  ${order.total.toFixed(2)}
                </td>
                <td className="px-4 lg:px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <Link
                    href={`/${userType}/orders/${order.id}`}
                    className="text-blue-600 hover:text-blue-900"
                  >
                    <EyeIcon size={16} className="inline" />
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {/* Footer */}
      <div className="bg-gray-50 px-4 sm:px-6 py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between border-t border-gray-200 gap-2">
        <div className="text-sm text-gray-500 text-center sm:text-left">
          Showing <span className="font-medium">{orders.length}</span> of <span className="font-medium">{orders.length}</span> recent orders
        </div>
        <Link
          href={`/${userType}/orders`}
          className="text-sm font-medium text-blue-600 hover:text-blue-900 text-center sm:text-right"
        >
          View all orders
        </Link>
      </div>
    </div>
  );
}
