'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { DashboardLayout } from '@/app/components/layout';
import { createBrowserClient } from '@supabase/ssr';
import {
  Search as SearchIcon,
  Filter as FilterIcon,
  Eye as EyeIcon,
  CheckCircle as CheckCircleIcon,
  Clock as ClockIcon,
  XCircle as XCircleIcon,
  AlertCircle as AlertCircleIcon,
  Banknote as BanknoteIcon,
  Plus as PlusIcon,
  Package as PackageIcon,
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

export default function Orders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedPaymentStatus, setSelectedPaymentStatus] = useState('all');
  
  useEffect(() => {
    async function fetchOrders() {
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
        
        // First, get the distributor record for this user
        const { data: distributorData, error: distributorError } = await supabase
          .from('distributors')
          .select('id')
          .eq('user_id', userId)
          .single();
        
        if (distributorError) {
          throw new Error('Could not find distributor record for this user');
        }
        
        const distributorId = distributorData.id;
        
        // Fetch orders with retailer information
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
          .order('created_at', { ascending: false });
        
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
        console.error('Error fetching orders:', error);
        setError('Failed to load orders. Please try again.');
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchOrders();
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

  const getPaymentStatusStyle = (status: Order['payment_status']) => {
    switch (status) {
      case 'paid':
        return 'bg-green-50 text-green-700';
      case 'failed':
        return 'bg-red-50 text-red-700';
      default:
        return 'bg-yellow-50 text-yellow-700';
    }
  };

  const filteredOrders = orders.filter((order) => {
    const matchesSearch = 
      order.order_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.retailer_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.retailer_email.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus =
      selectedStatus === 'all' || order.status === selectedStatus;
    
    const matchesPayment =
      selectedPaymentStatus === 'all' ||
      order.payment_status === selectedPaymentStatus;
    
    return matchesSearch && matchesStatus && matchesPayment;
  });

  if (error) {
    return (
      <div className="bg-red-50 p-4 rounded-md text-red-700 mb-4">
        {error}
      </div>
    );
  }

  return (
    <DashboardLayout userType="distributor">
      <div className="p-6">
        {error ? (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
            {error}
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-semibold text-gray-900">Orders</h1>
              <Link
                href="/distributor/orders/create"
                className="flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <PlusIcon size={16} className="mr-2" />
                Create Order
              </Link>
            </div>
  
            <div className="bg-white shadow rounded-lg overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200 flex flex-wrap gap-4 items-center">
                <div className="flex flex-wrap items-center gap-4">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search orders..."
                      className="placeholder:text-gray-400 text-gray-700 pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                      <SearchIcon size={16} />
                    </div>
                  </div>
                  <div className="relative">
                    <select
                      className="placeholder:text-gray-400 text-gray-700 pl-4 pr-8 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm appearance-none"
                      value={selectedStatus}
                      onChange={(e) => setSelectedStatus(e.target.value)}
                    >
                      <option value="all">All Status</option>
                      <option value="pending">Pending</option>
                      <option value="processing">Processing</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none">
                      <FilterIcon size={16} />
                    </div>
                  </div>
                  <div className="relative">
                    <select
                      className="placeholder:text-gray-400 text-gray-700 pl-4 pr-8 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm appearance-none"
                      value={selectedPaymentStatus}
                      onChange={(e) => setSelectedPaymentStatus(e.target.value)}
                    >
                      <option value="all">All Payments</option>
                      <option value="paid">Paid</option>
                      <option value="pending">Pending</option>
                      <option value="failed">Failed</option>
                    </select>
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none">
                      <BanknoteIcon size={16} />
                    </div>
                  </div>
                </div>
              </div>
  
              {orders.length === 0 ? (
                <div className="p-16 text-center">
                  <div className="mx-auto w-24 h-24 bg-gray-100 flex items-center justify-center rounded-full mb-6">
                    <PackageIcon className="h-12 w-12 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No orders found</h3>
                  <p className="text-gray-500 mb-6">You haven't created any orders yet.</p>
                  <Link
                    href="/distributor/orders/create"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    <PlusIcon size={16} className="mr-2" />
                    Create your first order
                  </Link>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full">
                    <thead>
                      <tr className="bg-gray-50 border-b border-gray-200">
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredOrders.map((order) => (
                        <tr key={order.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{order.order_number}</td>
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
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPaymentStatusStyle(order.payment_status)}`}>
                              <span className="capitalize">{order.payment_status}</span>
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            ${order.total.toFixed(2)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <Link
                              href={`/distributor/orders/${order.id}`}
                              className="text-blue-600 hover:text-blue-900 cursor-pointer"
                            >
                              <EyeIcon size={16} className="inline" />
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );  }