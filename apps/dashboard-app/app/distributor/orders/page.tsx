'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { DashboardLayout } from '@/app/components/layout';
import { createBrowserClient } from '@supabase/ssr';
import { motion } from 'framer-motion';
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
  Calendar,
  Users,
  DollarSign,
  ShoppingCart,
  ArrowUpRight,
  MoreVertical,
  Download,
  FileText,
  Mail
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
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedPaymentStatus, setSelectedPaymentStatus] = useState('all');
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');
  
  useEffect(() => {
    async function fetchOrders() {
      try {
        setError(null);
        
        const supabase = createBrowserClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL!,
          process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
        );
        
        const { data: { session } } = await supabase.auth.getSession();
        const userId = session?.user.id;
        
        if (!userId) {
          throw new Error('User not authenticated');
        }
        
        const { data: distributorData, error: distributorError } = await supabase
          .from('distributors')
          .select('id')
          .eq('user_id', userId)
          .single();
        
        if (distributorError) {
          throw new Error('Could not find distributor record for this user');
        }
        
        const distributorId = distributorData.id;
        
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
        
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
      }
    }
    
    fetchOrders();
  }, []);

  const getStatusIcon = (status: Order['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircleIcon size={16} className="text-emerald-500" />;
      case 'processing':
        return <ClockIcon size={16} className="text-blue-500" />;
      case 'cancelled':
        return <XCircleIcon size={16} className="text-red-500" />;
      default:
        return <AlertCircleIcon size={16} className="text-amber-500" />;
    }
  };

  const getStatusStyle = (status: Order['status']) => {
    switch (status) {
      case 'completed':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'processing':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'cancelled':
        return 'bg-red-50 text-red-700 border-red-200';
      default:
        return 'bg-amber-50 text-amber-700 border-amber-200';
    }
  };

  const getPaymentStatusStyle = (status: Order['payment_status']) => {
    switch (status) {
      case 'paid':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'failed':
        return 'bg-red-50 text-red-700 border-red-200';
      default:
        return 'bg-amber-50 text-amber-700 border-amber-200';
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

  // Calculate stats
  const totalOrders = orders.length;
  const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
  const pendingOrders = orders.filter(order => order.status === 'pending').length;
  const completedOrders = orders.filter(order => order.status === 'completed').length;

  return (
    <DashboardLayout userType="distributor">
      <div className="min-h-screen bg-gradient-to-br from-violet-50 via-purple-50/30 to-fuchsia-50/40">
        {/* Hero Header Section */}
        <div className="relative overflow-hidden bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600 px-6 py-8 mx-6 mt-6 rounded-3xl">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-violet-600/90 to-purple-600/90"></div>
          
          {/* Decorative elements */}
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
            <div className="absolute -top-4 -left-4 w-20 h-20 bg-white/10 rounded-full blur-xl"></div>
            <div className="absolute top-8 right-8 w-24 h-24 bg-white/5 rounded-full blur-2xl"></div>
            <div className="absolute bottom-4 left-1/4 w-16 h-16 bg-white/10 rounded-full blur-xl"></div>
            <div className="absolute top-1/2 right-1/4 w-12 h-12 bg-white/15 rounded-full blur-lg"></div>
          </div>
          
          <div className="relative z-10 max-w-7xl mx-auto">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-6 lg:space-y-0">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-white/20 backdrop-blur-sm rounded-2xl">
                    <ShoppingCart className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold text-white mb-2">Order Management</h1>
                    <p className="text-violet-100 text-sm">Track, manage and fulfill your customer orders</p>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <motion.button
                  onClick={() => setViewMode(viewMode === 'cards' ? 'table' : 'cards')}
                  className="group relative px-4 py-2.5 bg-white/20 backdrop-blur-sm text-white font-medium rounded-xl border border-white/30 hover:bg-white/30 transition-all duration-300 flex items-center space-x-2 text-sm"
                  whileHover={{ scale: 1.05, y: -1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <FileText size={16} />
                  <span>{viewMode === 'cards' ? 'Table View' : 'Card View'}</span>
                </motion.button>
                
                <Link href="/distributor/orders/create">
                  <motion.button
                    className="group relative px-6 py-2.5 bg-white text-violet-600 font-semibold rounded-xl transition-all duration-300 flex items-center space-x-2 shadow-lg hover:shadow-xl text-sm hover:bg-violet-50"
                    whileHover={{ scale: 1.05, y: -1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <PlusIcon size={16} />
                    <span>Create Order</span>
                  </motion.button>
                </Link>
              </div>
            </div>
            
            {/* Stats Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
              <motion.div 
                className="bg-white/20 backdrop-blur-sm rounded-2xl p-5 border border-white/30"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-violet-100 text-xs font-medium">Total Orders</p>
                    <p className="text-white text-2xl font-bold">{totalOrders}</p>
                  </div>
                  <div className="p-3 bg-white/20 rounded-xl">
                    <ShoppingCart className="h-5 w-5 text-white" />
                  </div>
                </div>
              </motion.div>
              
              <motion.div 
                className="bg-white/20 backdrop-blur-sm rounded-2xl p-5 border border-white/30"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-violet-100 text-xs font-medium">Total Revenue</p>
                    <p className="text-white text-2xl font-bold">${totalRevenue.toLocaleString()}</p>
                  </div>
                  <div className="p-3 bg-emerald-500/30 rounded-xl">
                    <DollarSign className="h-5 w-5 text-emerald-200" />
                  </div>
                </div>
              </motion.div>
              
              <motion.div 
                className="bg-white/20 backdrop-blur-sm rounded-2xl p-5 border border-white/30"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
            <div className="flex items-center justify-between">
                  <div>
                    <p className="text-violet-100 text-xs font-medium">Pending</p>
                    <p className="text-white text-2xl font-bold">{pendingOrders}</p>
                  </div>
                                     <div className="p-3 bg-amber-500/30 rounded-xl">
                     <ClockIcon className="h-5 w-5 text-amber-200" />
                   </div>
                </div>
              </motion.div>
              
              <motion.div 
                className="bg-white/20 backdrop-blur-sm rounded-2xl p-5 border border-white/30"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-violet-100 text-xs font-medium">Completed</p>
                    <p className="text-white text-2xl font-bold">{completedOrders}</p>
                  </div>
                  <div className="p-3 bg-emerald-500/30 rounded-xl">
                    <CheckCircleIcon className="h-5 w-5 text-emerald-200" />
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
            </div>
  
        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-6 py-8">
          {error ? (
            <motion.div 
              className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-2xl shadow-sm"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-red-100 rounded-full">
                  <AlertCircleIcon className="h-5 w-5 text-red-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-sm">Error Loading Orders</h3>
                  <p className="text-xs">{error}</p>
                </div>
              </div>
            </motion.div>
          ) : (
            <div className="space-y-8">
              {/* Search and Filter Section */}
              <motion.div 
                className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl border border-white/60 overflow-hidden"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <div className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                    {/* Search and Filters */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
                      {/* Search */}
                      <div className="relative group">
                        <div className="absolute inset-0 bg-gradient-to-r from-violet-500 to-purple-500 rounded-2xl blur opacity-20 group-hover:opacity-30 transition-opacity duration-300"></div>
                  <div className="relative">
                    <input
                      type="text"
                            placeholder="Search orders, clients..."
                            className="w-72 pl-12 pr-4 py-3 bg-white/90 backdrop-blur-sm border border-gray-200/50 rounded-2xl text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-transparent transition-all duration-300 shadow-lg text-sm"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                          <SearchIcon
                            size={18}
                            className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-hover:text-violet-500 transition-colors duration-300"
                          />
                    </div>
                  </div>
                      
                      {/* Status Filter */}
                      <div className="relative group">
                        <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-fuchsia-500 rounded-2xl blur opacity-20 group-hover:opacity-30 transition-opacity duration-300"></div>
                        <div className="relative flex items-center space-x-3 bg-white/90 backdrop-blur-sm border border-gray-200/50 rounded-2xl px-4 py-3 shadow-lg">
                          <FilterIcon size={16} className="text-gray-500 group-hover:text-purple-500 transition-colors duration-300" />
                    <select
                      value={selectedStatus}
                      onChange={(e) => setSelectedStatus(e.target.value)}
                            className="bg-transparent text-gray-700 text-sm focus:outline-none cursor-pointer min-w-[120px]"
                    >
                      <option value="all">All Status</option>
                      <option value="pending">Pending</option>
                      <option value="processing">Processing</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                    </div>
                  </div>
                      
                      {/* Payment Filter */}
                      <div className="relative group">
                        <div className="absolute inset-0 bg-gradient-to-r from-fuchsia-500 to-pink-500 rounded-2xl blur opacity-20 group-hover:opacity-30 transition-opacity duration-300"></div>
                        <div className="relative flex items-center space-x-3 bg-white/90 backdrop-blur-sm border border-gray-200/50 rounded-2xl px-4 py-3 shadow-lg">
                          <BanknoteIcon size={16} className="text-gray-500 group-hover:text-fuchsia-500 transition-colors duration-300" />
                    <select
                      value={selectedPaymentStatus}
                      onChange={(e) => setSelectedPaymentStatus(e.target.value)}
                            className="bg-transparent text-gray-700 text-sm focus:outline-none cursor-pointer min-w-[120px]"
                    >
                      <option value="all">All Payments</option>
                      <option value="paid">Paid</option>
                      <option value="pending">Pending</option>
                      <option value="failed">Failed</option>
                    </select>
                        </div>
                      </div>
                    </div>
                    
                    {/* Results Counter */}
                    <div className="flex items-center space-x-4">
                      <div className="text-sm text-gray-600 bg-gray-100/80 px-4 py-2 rounded-full">
                        <span className="font-semibold text-violet-600">{filteredOrders.length}</span> of {totalOrders} orders
                      </div>
                      
                      <motion.button
                        className="p-2.5 bg-gray-50 border border-gray-200 rounded-xl hover:bg-gray-100 transition-colors duration-300"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        title="Export orders"
                      >
                        <Download size={16} className="text-gray-600" />
                      </motion.button>
                    </div>
                  </div>
                </div>
              </motion.div>
  
              {/* Orders Content */}
              {orders.length === 0 ? (
                <motion.div 
                  className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl border border-white/60 overflow-hidden"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                >
                  <div className="flex flex-col items-center justify-center py-20 px-6">
                    <div className="relative mx-auto w-24 h-24 mb-8">
                      <div className="absolute inset-0 bg-gradient-to-r from-violet-500 to-purple-500 rounded-full blur-lg opacity-20"></div>
                      <div className="relative bg-gradient-to-r from-violet-100 to-purple-100 rounded-full flex items-center justify-center w-full h-full">
                        <ShoppingCart className="h-12 w-12 text-violet-500" />
                      </div>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">No orders found</h3>
                    <p className="text-gray-600 mb-8 max-w-md mx-auto text-center">
                      You haven&apos;t created any orders yet. Start by creating your first order to track customer purchases.
                    </p>
                    <Link href="/distributor/orders/create">
                      <motion.button
                        className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-violet-600 to-purple-600 text-white font-semibold rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 space-x-3"
                        whileHover={{ scale: 1.05, y: -2 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <PlusIcon size={18} />
                        <span>Create your first order</span>
                      </motion.button>
                    </Link>
                  </div>
                </motion.div>
              ) : viewMode === 'cards' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {filteredOrders.map((order, index) => (
                    <motion.div
                      key={order.id}
                      className="group bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl border border-white/60 overflow-hidden hover:shadow-2xl transition-all duration-300 cursor-pointer"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1, duration: 0.3 }}
                      whileHover={{ y: -4, scale: 1.02 }}
                      onClick={() => router.push(`/distributor/orders/${order.id}`)}
                    >
                      <div className="p-6">
                        {/* Header */}
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h3 className="text-lg font-bold text-gray-900 mb-1">
                              #{order.order_number}
                            </h3>
                            <p className="text-sm text-gray-500 flex items-center">
                              <Calendar size={14} className="mr-1" />
                              {new Date(order.created_at).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <motion.button
                              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={(e) => {
                                e.stopPropagation();
                                // Handle more actions
                              }}
                            >
                              <MoreVertical size={16} />
                            </motion.button>
                          </div>
                        </div>

                        {/* Client Info */}
                        <div className="bg-gradient-to-r from-violet-50 to-purple-50 rounded-2xl p-4 mb-4">
                          <div className="flex items-start space-x-3">
                            <div className="p-2 bg-violet-100 rounded-xl">
                              <Users size={16} className="text-violet-600" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="font-semibold text-gray-900 text-sm truncate">
                                {order.retailer_name}
                              </h4>
                              <p className="text-xs text-gray-600 flex items-center mt-1">
                                <Mail size={12} className="mr-1" />
                                {order.retailer_email}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Status and Payment */}
                        <div className="flex items-center justify-between mb-4">
                          <div className={`inline-flex items-center space-x-2 px-3 py-2 rounded-xl border text-xs font-medium ${getStatusStyle(order.status)}`}>
                            {getStatusIcon(order.status)}
                            <span className="capitalize">{order.status}</span>
                          </div>
                          <div className={`inline-flex items-center px-3 py-2 rounded-xl border text-xs font-medium ${getPaymentStatusStyle(order.payment_status)}`}>
                            <span className="capitalize">{order.payment_status}</span>
                          </div>
                        </div>

                        {/* Total */}
                        <div className="flex items-center justify-between">
                          <div className="text-2xl font-bold text-gray-900">
                            ${order.total.toFixed(2)}
                          </div>
                          <Link href={`/distributor/orders/${order.id}`}>
                            <motion.button
                              className="inline-flex items-center px-4 py-2 bg-violet-600 text-white text-sm font-medium rounded-xl hover:bg-violet-700 transition-colors duration-200 space-x-2"
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={(e) => e.stopPropagation()}
                            >
                              <EyeIcon size={14} />
                              <span>View</span>
                              <ArrowUpRight size={14} />
                            </motion.button>
                  </Link>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <motion.div 
                  className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl border border-white/60 overflow-hidden"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                >
                <div className="overflow-x-auto">
                  <table className="min-w-full">
                    <thead>
                        <tr className="bg-gradient-to-r from-violet-50 to-purple-50 border-b border-gray-200/50">
                          <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Order ID</th>
                          <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Client</th>
                          <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Date</th>
                          <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                          <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Payment</th>
                          <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Total</th>
                          <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                      <tbody className="bg-white/50 divide-y divide-gray-200/50">
                        {filteredOrders.map((order, index) => (
                          <motion.tr 
                            key={order.id} 
                            className="hover:bg-white/80 transition-colors duration-200 cursor-pointer"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05, duration: 0.3 }}
                            onClick={() => router.push(`/distributor/orders/${order.id}`)}
                          >
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                              #{order.order_number}
                            </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">{order.retailer_name}</div>
                              <div className="text-xs text-gray-500">{order.retailer_email}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Date(order.created_at).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                              <div className={`inline-flex items-center space-x-2 px-3 py-1.5 rounded-xl border text-xs font-medium ${getStatusStyle(order.status)}`}>
                              {getStatusIcon(order.status)}
                                <span className="capitalize">{order.status}</span>
                              </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                              <div className={`inline-flex items-center px-3 py-1.5 rounded-xl border text-xs font-medium ${getPaymentStatusStyle(order.payment_status)}`}>
                              <span className="capitalize">{order.payment_status}</span>
                              </div>
                          </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                            ${order.total.toFixed(2)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                              <Link href={`/distributor/orders/${order.id}`}>
                                <motion.button
                                  className="p-2 text-violet-600 hover:text-violet-800 hover:bg-violet-50 rounded-lg transition-colors duration-200"
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.9 }}
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  <EyeIcon size={16} />
                                </motion.button>
                            </Link>
                          </td>
                          </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                </motion.div>
              )}
            </div>
          )}
          </div>
      </div>
    </DashboardLayout>
  );
}