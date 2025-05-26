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
  payment_status?: 'paid' | 'pending' | 'failed';
  total: number;
  retailer_id: string;
  retailer_name: string;
  retailer_email: string;
}

export function RecentOrders() {
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
        
        // Fetch recent orders (limit to 5 most recent)
        const { data: ordersData, error: ordersError } = await supabase
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
          .limit(5); // Limit to 5 most recent orders
        
        if (ordersError) throw ordersError;
        
        // Transform the data to match our Order interface
        const transformedOrders = ordersData.map((order: any) => ({
          id: order.id,
          order_number: order.order_number,
          created_at: order.created_at,
          status: order.status || 'pending',
          payment_status: order.payment_status || 'pending',
          total: order.total || 0,
          retailer_id: order.retailer_id,
          retailer_name: order.retailers?.users?.business_name || 'Unknown Business',
          retailer_email: order.retailers?.users?.email || '',
        }));
        
        setOrders(transformedOrders);
      } catch (error) {
        console.error('Error fetching recent orders:', error);
        setError('Failed to load recent orders.');
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchRecentOrders();
  }, []);

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
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {orders.map((order) => (
              <tr key={order.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {order.order_number}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{order.retailer_name}</div>
                  <div className="text-sm text-gray-500">{order.retailer_email}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(order.created_at).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusStyle(order.status)}`}>
                    {getStatusIcon(order.status)}
                    <span className="ml-1 capitalize">{order.status}</span>
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  ${order.total.toFixed(2)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <Link
                    href={`/distributor/orders/${order.id}`}
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
      <div className="bg-gray-50 px-6 py-3 flex items-center justify-between border-t border-gray-200">
        <div className="text-sm text-gray-500">
          Showing <span className="font-medium">{orders.length}</span> of <span className="font-medium">{orders.length}</span> recent orders
        </div>
        <Link
          href="/distributor/orders"
          className="text-sm font-medium text-blue-600 hover:text-blue-900"
        >
          View all orders
        </Link>
      </div>
    </div>
  );
}
