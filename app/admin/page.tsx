'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  BarChart3,
  ShoppingBag,
  Users,
  DollarSign,
  TrendingUp,
  Package,
  Clock,
  CheckCircle,
  AlertCircle,
  Download,
  Filter,
  Eye,
  Edit,
  Settings,
} from 'lucide-react';
import {
  Card,
  CardContent,
  Typography,
  Button,
  Chip,
  LinearProgress,
  Alert,
} from '@mui/material';
// Removed MUI Grid in favor of CSS grid for compatibility
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

interface DashboardStats {
  totalRevenue: number;
  totalOrders: number;
  totalCustomers: number;
  conversionRate: number;
  averageOrderValue: number;
  pendingOrders: number;
}

interface RecentOrder {
  id: string;
  orderNumber: string;
  customerName: string;
  date: string;
  amount: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
}

interface TopProduct {
  id: string;
  title: string;
  sales: number;
  revenue: number;
  stock: number;
}

export default function AdminHome() {
  const [stats, setStats] = useState<DashboardStats>({
    totalRevenue: 0,
    totalOrders: 0,
    totalCustomers: 0,
    conversionRate: 0,
    averageOrderValue: 0,
    pendingOrders: 0,
  });
  
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([]);
  const [topProducts, setTopProducts] = useState<TopProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('7days');

  useEffect(() => {
    fetchDashboardData();
  }, [timeRange]);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/admin/dashboard?range=${timeRange}`);
      const data = await response.json();
      
      setStats(data.stats);
      setRecentOrders(data.recentOrders || []);
      setTopProducts(data.topProducts || []);
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const salesData = [
    { day: 'Mon', sales: 4200 },
    { day: 'Tue', sales: 3800 },
    { day: 'Wed', sales: 5100 },
    { day: 'Thu', sales: 4800 },
    { day: 'Fri', sales: 6200 },
    { day: 'Sat', sales: 5900 },
    { day: 'Sun', sales: 7200 },
  ];

  const revenueData = [
    { month: 'Jan', revenue: 42000 },
    { month: 'Feb', revenue: 48000 },
    { month: 'Mar', revenue: 52000 },
    { month: 'Apr', revenue: 49000 },
    { month: 'May', revenue: 61000 },
    { month: 'Jun', revenue: 78000 },
  ];

  const categoryData = [
    { name: 'Electronics', value: 35, color: '#667eea' },
    { name: 'Accessories', value: 25, color: '#ed64a6' },
    { name: 'Workspace', value: 20, color: '#48bb78' },
    { name: 'Audio', value: 15, color: '#ecc94b' },
    { name: 'Other', value: 5, color: '#a0aec0' },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered': return 'success';
      case 'shipped': return 'primary';
      case 'processing': return 'warning';
      case 'pending': return 'default';
      case 'cancelled': return 'error';
      default: return 'default';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-linear-to-b from-gray-50 to-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-48 mb-8"></div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {[...Array(4)].map((_, i) => (
                <div key={i}>
                  <Card className="h-40 bg-gray-200 rounded-2xl"></Card>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-b from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8"
        >
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-gray-600">Welcome back, Administrator</p>
          </div>
          
          <div className="flex items-center gap-4 mt-4 md:mt-0">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="border rounded-lg px-4 py-2 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="7days">Last 7 days</option>
              <option value="30days">Last 30 days</option>
              <option value="90days">Last 90 days</option>
              <option value="year">This year</option>
            </select>
            
            <Button
              startIcon={<Download className="w-4 h-4" />}
              variant="outlined"
              size="small"
            >
              Export
            </Button>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
          {[
            {
              title: 'Total Revenue',
              value: `$${stats.totalRevenue.toLocaleString()}`,
              icon: DollarSign,
              color: 'green',
              change: '+12.5%',
              loading: loading,
            },
            {
              title: 'Total Orders',
              value: stats.totalOrders.toLocaleString(),
              icon: ShoppingBag,
              color: 'blue',
              change: '+8.2%',
              loading: loading,
            },
            {
              title: 'Total Customers',
              value: stats.totalCustomers.toLocaleString(),
              icon: Users,
              color: 'purple',
              change: '+15.3%',
              loading: loading,
            },
            {
              title: 'Pending Orders',
              value: stats.pendingOrders.toString(),
              icon: Clock,
              color: 'orange',
              change: '-3.1%',
              loading: loading,
            },
          ].map((stat, index) => (
            <div key={stat.title}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="rounded-2xl shadow-sm hover:shadow-md transition-shadow h-full">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className={`p-3 bg-${stat.color}-100 rounded-xl`}>
                        <stat.icon className={`w-6 h-6 text-${stat.color}-600`} />
                      </div>
                      <Chip
                        label={stat.change}
                        size="small"
                        color={stat.change.startsWith('+') ? 'success' : 'error'}
                        variant="outlined"
                      />
                    </div>
                    
                    <Typography variant="h4" className="font-bold mb-1">
                      {stat.value}
                    </Typography>
                    
                    <Typography variant="body2" color="textSecondary">
                      {stat.title}
                    </Typography>
                    
                    <LinearProgress 
                      variant="determinate" 
                      value={70} 
                      className={`mt-4 rounded-full h-2 bg-${stat.color}-100`}
                      classes={{
                        bar: `bg-${stat.color}-600`
                      }}
                    />
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          ))}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 mb-8">
          {/* Sales Chart */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="rounded-2xl shadow-sm h-full">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <Typography variant="h6" className="font-bold">
                        Sales Overview
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        Daily sales performance
                      </Typography>
                    </div>
                    <Button
                      startIcon={<Filter className="w-4 h-4" />}
                      size="small"
                      variant="outlined"
                    >
                      Filter
                    </Button>
                  </div>
                  
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={salesData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        <XAxis dataKey="day" />
                        <YAxis />
                        <Tooltip />
                        <Line
                          type="monotone"
                          dataKey="sales"
                          stroke="#667eea"
                          strokeWidth={3}
                          dot={{ r: 4 }}
                          activeDot={{ r: 6 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Category Distribution */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card className="rounded-2xl shadow-sm h-full">
                <CardContent className="p-6">
                  <div className="mb-6">
                    <Typography variant="h6" className="font-bold">
                      Category Distribution
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Sales by product category
                    </Typography>
                  </div>
                  
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={categoryData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {categoryData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-8"
        >
          <Card className="rounded-2xl shadow-sm">
            <CardContent className="p-6">
              <Typography variant="h6" className="font-bold mb-6">
                Quick Actions
              </Typography>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                {[
                  {
                    title: 'Manage Orders',
                    description: 'View and update orders',
                    icon: ShoppingBag,
                    color: 'blue',
                    href: '/admin/orders',
                  },
                  {
                    title: 'Manage Products',
                    description: 'Add or edit products',
                    icon: Package,
                    color: 'green',
                    href: '/admin/inventory',
                  },
                  {
                    title: 'View Customers',
                    description: 'Customer management',
                    icon: Users,
                    color: 'purple',
                    href: '/admin/customers',
                  },
                  {
                    title: 'Analytics',
                    description: 'Detailed reports',
                    icon: BarChart3,
                    color: 'orange',
                    href: '/admin/analytics',
                  },
                ].map((action, index) => (
                  <div key={action.title}>
                    <Link href={action.href}>
                      <Card className="p-4 hover:shadow-md transition-shadow cursor-pointer border-2 border-transparent hover:border-purple-200">
                        <div className={`inline-flex p-3 bg-${action.color}-100 rounded-lg mb-3`}>
                          <action.icon className={`w-6 h-6 text-${action.color}-600`} />
                        </div>
                        <Typography variant="subtitle1" className="font-bold mb-1">
                          {action.title}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          {action.description}
                        </Typography>
                      </Card>
                    </Link>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Recent Orders & Top Products */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
          {/* Recent Orders */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Card className="rounded-2xl shadow-sm">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <Typography variant="h6" className="font-bold">
                        Recent Orders
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        Latest customer orders
                      </Typography>
                    </div>
                    <Link href="/admin/orders">
                      <Button variant="text" color="primary">
                        View All
                      </Button>
                    </Link>
                  </div>
                  
                  <div className="space-y-4">
                    {recentOrders.length > 0 ? (
                      recentOrders.slice(0, 5).map((order) => (
                        <div
                          key={order.id}
                          className="flex items-center justify-between p-4 border rounded-lg hover:shadow-sm transition-shadow"
                        >
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                              <ShoppingBag className="w-5 h-5 text-gray-600" />
                            </div>
                            <div>
                              <Typography variant="subtitle2" className="font-bold">
                                #{order.orderNumber}
                              </Typography>
                              <Typography variant="body2" color="textSecondary">
                                {order.customerName}
                              </Typography>
                            </div>
                          </div>
                          
                          <div className="text-right">
                            <Typography variant="subtitle2" className="font-bold">
                              ${order.amount.toFixed(2)}
                            </Typography>
                            <Chip
                              label={order.status}
                              size="small"
                              color={getStatusColor(order.status) as any}
                              variant="outlined"
                            />
                          </div>
                        </div>
                      ))
                    ) : (
                      <Alert severity="info" className="rounded-xl">
                        No recent orders found
                      </Alert>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Top Products */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <Card className="rounded-2xl shadow-sm">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <Typography variant="h6" className="font-bold">
                        Top Products
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        Best selling items
                      </Typography>
                    </div>
                    <Link href="/admin/inventory">
                      <Button variant="text" color="primary">
                        Manage
                      </Button>
                    </Link>
                  </div>
                  
                  <div className="space-y-4">
                    {topProducts.length > 0 ? (
                      topProducts.slice(0, 5).map((product) => (
                        <div
                          key={product.id}
                          className="flex items-center justify-between p-3 border rounded-lg hover:shadow-sm transition-shadow"
                        >
                          <div className="flex-1">
                            <Typography variant="subtitle2" className="font-bold truncate">
                              {product.title}
                            </Typography>
                            <Typography variant="caption" color="textSecondary">
                              {product.sales} sales
                            </Typography>
                          </div>
                          
                          <div className="text-right">
                            <Typography variant="subtitle2" className="font-bold">
                              ${product.revenue.toFixed(0)}
                            </Typography>
                            <Typography variant="caption" color="textSecondary">
                              Stock: {product.stock}
                            </Typography>
                          </div>
                        </div>
                      ))
                    ) : (
                      <Alert severity="info" className="rounded-xl">
                        No product data available
                      </Alert>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}