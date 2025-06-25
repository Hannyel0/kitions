'use client';

import React, { useState, useEffect, useCallback } from 'react';
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
  Mail,
  Package,
  Truck,
  MapPin,
  Phone,
  Building
} from 'lucide-react';

// Skeleton component for loading state
function DistributorOrdersSkeleton() {
  return (
    <DashboardLayout userType="distributor">
      <div className="bg-gradient-to-br from-violet-50 via-purple-50/30 to-fuchsia-50/40 -m-6 p-6 min-h-full">
        {/* Hero Header Skeleton */}
        <div className="relative overflow-hidden bg-gradient-to-r from-violet-600 via-[#8982cf] to-purple-600 px-6 py-8 rounded-3xl mb-6 animate-pulse">
          <div className="relative z-10 max-w-7xl mx-auto">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-6 lg:space-y-0">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-white/20 backdrop-blur-sm rounded-2xl">
                  <div className="h-6 w-6 bg-white/30 rounded"></div>
                </div>
                <div>
                  <div className="h-8 w-64 bg-white/30 rounded mb-2"></div>
                  <div className="h-4 w-48 bg-white/20 rounded"></div>
                </div>
              </div>
            </div>
            
            {/* Stats Cards Skeleton */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="bg-white/20 backdrop-blur-sm rounded-2xl p-5 border border-white/30">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="h-3 w-16 bg-white/30 rounded mb-2"></div>
                      <div className="h-6 w-12 bg-white/40 rounded"></div>
                    </div>
                    <div className="p-3 bg-white/20 rounded-xl">
                      <div className="h-5 w-5 bg-white/30 rounded"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Tabs Skeleton */}
        <div className="mb-8 bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl border border-white/60 overflow-hidden">
          <div className="p-2">
            <div className="flex space-x-1">
              <div className="flex-1 h-16 bg-gray-200 rounded-2xl animate-pulse"></div>
              <div className="flex-1 h-16 bg-gray-200 rounded-2xl animate-pulse"></div>
            </div>
          </div>
        </div>

        {/* Content Skeleton */}
        <div className="space-y-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl border border-white/60 p-6 animate-pulse">
              <div className="h-32 bg-gray-200 rounded-2xl"></div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}

interface PartnershipRequest {
  id: string;
  retailer_id: string;
  status: 'pending' | 'accepted' | 'rejected';
  created_at: string;
  retailer: {
    id: string;
    business_name: string;
    email: string;
    phone: string;
    address: string;
  };
}

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
  placed_by_type: 'retailer' | 'distributor';
  placed_by_user_name?: string;
}

export default function DistributorOrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [partnershipRequests, setPartnershipRequests] = useState<PartnershipRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [activeTab, setActiveTab] = useState<'orders' | 'requests'>('orders');
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');
        
        const supabase = createBrowserClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL!,
          process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
        );

  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
        
        const { data: { session } } = await supabase.auth.getSession();
        const userId = session?.user.id;
        
        if (!userId) {
          throw new Error('User not authenticated');
        }
        
      // Get distributor record
        const { data: distributorData, error: distributorError } = await supabase
          .from('distributors')
          .select('id')
          .eq('user_id', userId)
          .single();
        
        if (distributorError) {
        throw new Error(`Could not find distributor record for this user: ${distributorError.message}`);
      }

      if (!distributorData?.id) {
        throw new Error('No distributor record found for this user');
        }
        
        const distributorId = distributorData.id;
        
      // Fetch partnership requests using database function
      const { data: requestsData, error: requestsError } = await supabase
        .rpc('get_partnership_requests_for_distributor', { 
          distributor_user_id: userId 
        });

      if (requestsError) {
        throw new Error(`Failed to fetch partnership requests: ${requestsError.message}`);
      }

      // Transform the function results into our expected format
      const transformedRequests: PartnershipRequest[] = requestsData?.map((request: any) => ({
        id: request.relationship_id,
        retailer_id: request.retailer_id,
        status: request.status,
        created_at: request.created_at,
        retailer: {
          id: request.retailer_id,
          business_name: request.business_name || 'Unknown Business',
          email: request.email || 'No Email',
          phone: request.phone || 'No Phone',
          address: request.business_address || 'No Address',
        }
      })) || [];

      // Fetch orders
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
          placed_by_type,
          placed_by_user_id,
            retailers (
              id,
              user_id,
              users (
                email,
                business_name
              )
          ),
          placed_by_user:users!placed_by_user_id (
            business_name,
            first_name,
            last_name
            )
          `)
          .eq('distributor_id', distributorId)
          .order('created_at', { ascending: false });
        
      if (ordersError) {
        throw new Error(`Failed to fetch orders: ${ordersError.message}`);
      }
        
      // Transform orders
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const transformedOrders = ordersData?.map((order: any) => ({
          id: order.id,
          order_number: order.order_number,
          created_at: order.created_at,
          status: order.status || 'pending',
          payment_status: order.payment_status || 'pending',
          total: order.total || 0,
          retailer_id: order.retailer_id,
          retailer_name: order.retailers?.users?.business_name || 'Unknown Business',
          retailer_email: order.retailers?.users?.email || '',
        placed_by_type: order.placed_by_type || 'distributor',
        placed_by_user_name: order.placed_by_user?.business_name || 
                             `${order.placed_by_user?.first_name || ''} ${order.placed_by_user?.last_name || ''}`.trim() ||
                             'Unknown User',
      })) || [];

      setPartnershipRequests(transformedRequests);
        setOrders(transformedOrders);

    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load data';
      console.error('❌ Error fetching data:', err);
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [supabase]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handlePartnershipAction = async (requestId: string, action: 'accept' | 'reject') => {
    try {
      const { error } = await supabase
        .from('relationships')
        .update({ status: action === 'accept' ? 'accepted' : 'rejected' })
        .eq('id', requestId);

      if (error) throw error;

      setSuccessMessage(`Partnership request ${action}ed successfully!`);
      setTimeout(() => setSuccessMessage(null), 5000);
      
      // Refresh data
      fetchData();

    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : `Failed to ${action} request`;
      setError(errorMessage);
      setTimeout(() => setError(null), 5000);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'text-amber-700 bg-amber-50 border-amber-200';
      case 'accepted': return 'text-emerald-700 bg-emerald-50 border-emerald-200';
      case 'rejected': return 'text-red-700 bg-red-50 border-red-200';
      case 'processing': return 'text-blue-700 bg-blue-50 border-blue-200';
      case 'completed': return 'text-emerald-700 bg-emerald-50 border-emerald-200';
      case 'cancelled': return 'text-red-700 bg-red-50 border-red-200';
      default: return 'text-gray-700 bg-gray-50 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <ClockIcon size={14} />;
      case 'accepted': return <CheckCircleIcon size={14} />;
      case 'rejected': return <XCircleIcon size={14} />;
      case 'processing': return <ClockIcon size={14} />;
      case 'completed': return <CheckCircleIcon size={14} />;
      case 'cancelled': return <XCircleIcon size={14} />;
      default: return <AlertCircleIcon size={14} />;
    }
  };

  // Filter data based on active tab
  const filteredRequests = partnershipRequests.filter(request => {
    const matchesSearch = request.retailer.business_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.retailer.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || request.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.order_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.retailer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.retailer_email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Calculate stats
  const totalOrders = orders.length;
  const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
  const pendingRequests = partnershipRequests.filter(req => req.status === 'pending').length;
  const acceptedPartnerships = partnershipRequests.filter(req => req.status === 'accepted').length;

  // Show loading skeleton while data is loading
  if (isLoading) {
    return <DistributorOrdersSkeleton />;
  }

  return (
    <DashboardLayout userType="distributor">
      <div className="bg-gradient-to-br from-violet-50 via-purple-50/30 to-fuchsia-50/40 -m-6 p-6 min-h-full">
        
        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-800 font-semibold">Error: {error}</p>
          </div>
        )}

        {/* Success Message */}
        {successMessage && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-green-800 font-semibold">{successMessage}</p>
          </div>
        )}

        {/* Hero Header Section */}
        <div className="relative overflow-hidden bg-gradient-to-r from-violet-600 via-[#8982cf] to-purple-600 px-6 py-8 rounded-3xl mb-6">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-violet-600/90 to-[#8982cf]/90"></div>
          
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
                    <Package className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold text-white mb-2">Orders & Partnerships</h1>
                    <p className="text-violet-100 text-sm">Manage your orders and retailer partnerships</p>
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
                    className="group relative px-4 py-2.5 bg-white/20 backdrop-blur-sm text-white font-medium rounded-xl border border-white/30 hover:bg-white/30 transition-all duration-300 flex items-center space-x-2 text-sm"
                    whileHover={{ scale: 1.05, y: -1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <PlusIcon size={16} />
                    <span>New Order</span>
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
                    <p className="text-violet-100 text-xs font-medium">Pending Requests</p>
                    <p className="text-white text-2xl font-bold">{pendingRequests}</p>
                  </div>
                                     <div className="p-3 bg-amber-500/30 rounded-xl">
                    <ClockIcon size={16} className="text-amber-200" />
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
                    <p className="text-violet-100 text-xs font-medium">Active Partners</p>
                    <p className="text-white text-2xl font-bold">{acceptedPartnerships}</p>
                  </div>
                  <div className="p-3 bg-blue-500/30 rounded-xl">
                    <Users className="h-5 w-5 text-blue-200" />
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
            </div>
  
        {/* Main Content */}
        <div className="max-w-7xl mx-auto">
          {/* Tabs */}
            <motion.div 
            className="mb-8 bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl border border-white/60 overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <div className="p-2">
              <div className="flex space-x-1">
                <button
                  onClick={() => setActiveTab('orders')}
                  className={`flex-1 flex items-center justify-center space-x-2 px-6 py-4 rounded-2xl font-semibold transition-all duration-300 ${
                    activeTab === 'orders'
                      ? 'bg-gradient-to-r from-[#8982cf] to-purple-600 text-white shadow-lg'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-white/50'
                  }`}
                >
                  <Package size={20} />
                  <span>Orders</span>
                  {orders.length > 0 && (
                    <span className="bg-white/20 text-white text-xs rounded-full px-2 py-1 min-w-[20px] h-5 flex items-center justify-center">
                      {orders.length}
                    </span>
                  )}
                </button>
                <button
                  onClick={() => setActiveTab('requests')}
                  className={`flex-1 flex items-center justify-center space-x-2 px-6 py-4 rounded-2xl font-semibold transition-all duration-300 ${
                    activeTab === 'requests'
                      ? 'bg-gradient-to-r from-[#8982cf] to-purple-600 text-white shadow-lg'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-white/50'
                  }`}
                >
                  <Users size={20} />
                  <span>Partnership Requests</span>
                  {pendingRequests > 0 && (
                    <span className="bg-red-500 text-white text-xs rounded-full px-2 py-1 min-w-[20px] h-5 flex items-center justify-center">
                      {pendingRequests}
                    </span>
                  )}
                </button>
              </div>
              </div>
            </motion.div>

          {/* Search and Filter */}
              <motion.div 
            className="mb-8 bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl border border-white/60 overflow-hidden"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
              >
                <div className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                    {/* Search and Filters */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
                      {/* Search */}
                      <div className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-r from-[#8982cf] to-purple-500 rounded-2xl blur opacity-20 group-hover:opacity-30 transition-opacity duration-300"></div>
                  <div className="relative">
                    <input
                      type="text"
                        placeholder={activeTab === 'orders' ? 'Search orders...' : 'Search by business name or email...'}
                        className="w-72 pl-12 pr-4 py-3 bg-white/90 backdrop-blur-sm border border-gray-200/50 rounded-2xl text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#8982cf]/50 focus:border-transparent transition-all duration-300 shadow-lg text-sm"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                          <SearchIcon
                            size={18}
                        className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-hover:text-[#8982cf] transition-colors duration-300"
                          />
                    </div>
                  </div>
                      
                      {/* Status Filter */}
                      <div className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-r from-[#8982cf] to-purple-500 rounded-2xl blur opacity-20 group-hover:opacity-30 transition-opacity duration-300"></div>
                    <div className="relative">
                    <select
                        className="pl-12 pr-8 py-3 bg-white/90 backdrop-blur-sm border border-gray-200/50 rounded-2xl text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#8982cf]/50 focus:border-transparent transition-all duration-300 shadow-lg text-sm appearance-none cursor-pointer"
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                    >
                      <option value="all">All Status</option>
                        {activeTab === 'orders' ? (
                          <>
                      <option value="pending">Pending</option>
                      <option value="processing">Processing</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                          </>
                        ) : (
                          <>
                            <option value="pending">Pending</option>
                            <option value="accepted">Accepted</option>
                            <option value="rejected">Rejected</option>
                          </>
                        )}
                    </select>
                      <FilterIcon
                        size={18}
                        className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-hover:text-[#8982cf] transition-colors duration-300"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Content Area */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            {activeTab === 'requests' ? (
              <div className="space-y-6">
                {filteredRequests.length > 0 ? (
                  <div className="space-y-6">
                    {filteredRequests.map((request, index) => (
                      <motion.div
                        key={request.id}
                        className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl border border-white/60 overflow-hidden"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 * index }}
                      >
                        <div className="p-8">
                          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-6 lg:space-y-0">
                            {/* Request Info */}
                            <div className="flex-1">
                              <div className="flex items-start justify-between mb-6">
                                <div className="flex items-center space-x-4">
                                  <div className="p-3 bg-gradient-to-r from-[#8982cf] to-purple-600 rounded-2xl">
                                    <Building className="h-6 w-6 text-white" />
                                  </div>
                                  <div>
                                    <h3 className="text-xl font-bold text-gray-900 mb-1">
                                      {request.retailer.business_name}
                                    </h3>
                                    <div className="flex items-center space-x-2">
                                      <span className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(request.status)}`}>
                                        {getStatusIcon(request.status)}
                                        <span className="capitalize">{request.status}</span>
                                      </span>
                                      <span className="text-gray-500 text-sm">
                                        {new Date(request.created_at).toLocaleDateString()}
                                      </span>
                                    </div>
                        </div>
                      </div>
                    </div>
                    
                              {/* Contact Details */}
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                                <div className="flex items-center space-x-3 p-4 bg-gray-50/80 rounded-2xl">
                                  <Mail className="h-5 w-5 text-[#8982cf]" />
                                  <div>
                                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Email</p>
                                    <p className="text-sm font-semibold text-gray-900">{request.retailer.email}</p>
                                  </div>
                                </div>
                                <div className="flex items-center space-x-3 p-4 bg-gray-50/80 rounded-2xl">
                                  <Phone className="h-5 w-5 text-[#8982cf]" />
                                  <div>
                                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Phone</p>
                                    <p className="text-sm font-semibold text-gray-900">{request.retailer.phone}</p>
                                  </div>
                                </div>
                                <div className="flex items-center space-x-3 p-4 bg-gray-50/80 rounded-2xl">
                                  <MapPin className="h-5 w-5 text-[#8982cf]" />
                                  <div>
                                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Address</p>
                                    <p className="text-sm font-semibold text-gray-900">{request.retailer.address}</p>
                                  </div>
                                </div>
                              </div>
                      </div>
                      
                            {/* Action Buttons */}
                            {request.status === 'pending' && (
                              <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3 lg:ml-6">
                                <motion.button
                                  onClick={() => handlePartnershipAction(request.id, 'accept')}
                                  className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center space-x-2"
                                  whileHover={{ scale: 1.05, y: -2 }}
                                  whileTap={{ scale: 0.95 }}
                                >
                                  <CheckCircleIcon size={18} />
                                  <span>Accept</span>
                                </motion.button>
                      <motion.button
                                  onClick={() => handlePartnershipAction(request.id, 'reject')}
                                  className="px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center space-x-2"
                                  whileHover={{ scale: 1.05, y: -2 }}
                        whileTap={{ scale: 0.95 }}
                      >
                                  <XCircleIcon size={18} />
                                  <span>Reject</span>
                      </motion.button>
                    </div>
                            )}
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
                  >
                    <div className="p-12 text-center">
                      <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-r from-[#8982cf] to-purple-600 rounded-3xl flex items-center justify-center">
                        <Users className="h-12 w-12 text-white" />
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">No Partnership Requests</h3>
                      <p className="text-gray-600 mb-6">
                        You don&apos;t have any partnership requests at the moment. When retailers send you partnership requests, they&apos;ll appear here.
                      </p>
                    </div>
                  </motion.div>
                )}
                  </div>
            ) : (
              <div className="space-y-6">
                {filteredOrders.length > 0 ? (
                  <div className="space-y-6">
                  {filteredOrders.map((order, index) => (
                    <motion.div
                      key={order.id}
                        className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl border border-white/60 overflow-hidden"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 * index }}
                      >
                        <div className="p-8">
                          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-6 lg:space-y-0">
                            {/* Order Info */}
                            <div className="flex-1">
                              <div className="flex items-start justify-between mb-6">
                                <div className="flex items-center space-x-4">
                                  <div className="p-3 bg-gradient-to-r from-[#8982cf] to-purple-600 rounded-2xl">
                                    <Package className="h-6 w-6 text-white" />
                                  </div>
                          <div>
                                    <h3 className="text-xl font-bold text-gray-900 mb-1">
                                      Order #{order.order_number}
                            </h3>
                                    <div className="flex items-center space-x-2">
                                      <span className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(order.status)}`}>
                                        {getStatusIcon(order.status)}
                                        <span className="capitalize">{order.status}</span>
                                      </span>
                                      <span className="text-gray-500 text-sm">
                              {new Date(order.created_at).toLocaleDateString()}
                                      </span>
                                    </div>
                                  </div>
                          </div>
                                <div className="text-right">
                                  <p className="text-2xl font-bold text-gray-900">${order.total.toLocaleString()}</p>
                                  <p className="text-sm text-gray-500">Total Amount</p>
                          </div>
                        </div>

                              {/* Order Details */}
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                                <div className="flex items-center space-x-3 p-4 bg-gray-50/80 rounded-2xl">
                                  <Building className="h-5 w-5 text-[#8982cf]" />
                                  <div>
                                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Retailer</p>
                                    <p className="text-sm font-semibold text-gray-900">{order.retailer_name}</p>
                                  </div>
                                </div>
                                <div className="flex items-center space-x-3 p-4 bg-gray-50/80 rounded-2xl">
                                  <Mail className="h-5 w-5 text-[#8982cf]" />
                                  <div>
                                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Contact</p>
                                    <p className="text-sm font-semibold text-gray-900">{order.retailer_email}</p>
                            </div>
                            </div>
                          </div>
                        </div>

                            {/* Action Buttons */}
                            <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3 lg:ml-6">
                          <Link href={`/distributor/orders/${order.id}`}>
                            <motion.button
                                  className="px-6 py-3 bg-gradient-to-r from-[#8982cf] to-purple-600 text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center space-x-2"
                                  whileHover={{ scale: 1.05, y: -2 }}
                              whileTap={{ scale: 0.95 }}
                            >
                                  <EyeIcon size={18} />
                                  <span>View Details</span>
                            </motion.button>
                  </Link>
                            </div>
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
                  >
                    <div className="p-12 text-center">
                      <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-r from-[#8982cf] to-purple-600 rounded-3xl flex items-center justify-center">
                        <Package className="h-12 w-12 text-white" />
                              </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">No Orders Found</h3>
                      <p className="text-gray-600 mb-6">
                        {searchTerm || statusFilter !== 'all' 
                          ? 'No orders match your current search criteria.' 
                          : 'You don\'t have any orders yet. When retailers place orders, they\'ll appear here.'
                        }
                      </p>
                      <Link href="/distributor/orders/create">
                                <motion.button
                          className="px-6 py-3 bg-gradient-to-r from-[#8982cf] to-purple-600 text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center space-x-2 mx-auto"
                          whileHover={{ scale: 1.05, y: -2 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <PlusIcon size={18} />
                          <span>Create New Order</span>
                                </motion.button>
                            </Link>
                </div>
                </motion.div>
              )}
            </div>
          )}
          </motion.div>
          </div>
      </div>
    </DashboardLayout>
  );
}