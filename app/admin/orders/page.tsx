
'use client';
import type { ReactElement } from 'react';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Search,
  Filter,
  Download,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  Truck,
  Package,
} from 'lucide-react';
import {
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  Select,
  MenuItem,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  IconButton,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';

interface Order {
  _id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  items: Array<{
    title: string;
    quantity: number;
    price: number;
  }>;
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  paymentMethod: string;
  shippingAddress: {
    address: string;
    city: string;
    state: string;
    country: string;
    zipCode: string;
  };
  createdAt: string;
  updatedAt: string;
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/orders');
      const data = await response.json();
      setOrders(data.orders || []);
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (orderId: string, newStatus: Order['status']) => {
    try {
      const response = await fetch(`/api/admin/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        fetchOrders(); // Refresh orders
      }
    } catch (error) {
      console.error('Failed to update order status:', error);
    }
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.orderNumber.toLowerCase().includes(search.toLowerCase()) ||
      order.customerName.toLowerCase().includes(search.toLowerCase()) ||
      order.customerEmail.toLowerCase().includes(search.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusIcon = (status: Order['status']): ReactElement | undefined => {
    switch (status) {
      case 'pending': return <Clock className="w-4 h-4 text-yellow-600" />;
      case 'processing': return <Package className="w-4 h-4 text-blue-600" />;
      case 'shipped': return <Truck className="w-4 h-4 text-purple-600" />;
      case 'delivered': return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'cancelled': return <XCircle className="w-4 h-4 text-red-600" />;
      default: return undefined;
    }
  };

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'pending': return 'warning';
      case 'processing': return 'info';
      case 'shipped': return 'primary';
      case 'delivered': return 'success';
      case 'cancelled': return 'error';
      default: return 'default';
    }
  };

  const handleViewOrder = (order: Order) => {
    setSelectedOrder(order);
    setDialogOpen(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-linear-to-b from-gray-50 to-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-48 mb-8"></div>
            <div className="h-64 bg-gray-200 rounded-lg"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-b from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Orders Management</h1>
              <p className="text-gray-600">Manage and track customer orders</p>
            </div>
            
            <div className="flex items-center gap-4 mt-4 md:mt-0">
              <Button
                startIcon={<Download className="w-4 h-4" />}
                variant="outlined"
                size="small"
              >
                Export
              </Button>
            </div>
          </div>

          {/* Filters */}
          <Card className="rounded-2xl shadow-sm mb-8">
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Search Orders
                  </label>
                  <TextField
                    fullWidth
                    placeholder="Search by order #, customer, email..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    size="small"
                    InputProps={{
                      startAdornment: <Search className="w-5 h-5 text-gray-400 mr-2" />,
                    }}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status Filter
                  </label>
                  <Select
                    fullWidth
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    size="small"
                    startAdornment={<Filter className="w-5 h-5 text-gray-400 mr-2" />}
                  >
                    <MenuItem value="all">All Statuses</MenuItem>
                    <MenuItem value="pending">Pending</MenuItem>
                    <MenuItem value="processing">Processing</MenuItem>
                    <MenuItem value="shipped">Shipped</MenuItem>
                    <MenuItem value="delivered">Delivered</MenuItem>
                    <MenuItem value="cancelled">Cancelled</MenuItem>
                  </Select>
                </div>
                
                <div className="flex items-end">
                  <Button
                    fullWidth
                    variant="contained"
                    className="bg-linear-to-r from-purple-600 to-pink-500"
                    onClick={fetchOrders}
                  >
                    Refresh Orders
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
            {[
              { label: 'Total Orders', value: orders.length.toString() },
              { label: 'Pending', value: orders.filter(o => o.status === 'pending').length.toString() },
              { label: 'Processing', value: orders.filter(o => o.status === 'processing').length.toString() },
              { label: 'Shipped', value: orders.filter(o => o.status === 'shipped').length.toString() },
              { label: 'Revenue', value: `$${orders.reduce((sum, o) => sum + o.total, 0).toLocaleString()}` },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="rounded-xl shadow-sm">
                  <CardContent className="p-4 text-center">
                    <Typography variant="h4" className="font-bold mb-1">
                      {stat.value}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      {stat.label}
                    </Typography>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Orders Table */}
          <Card className="rounded-2xl shadow-sm">
            <CardContent className="p-6">
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Order #</TableCell>
                      <TableCell>Customer</TableCell>
                      <TableCell>Date</TableCell>
                      <TableCell>Items</TableCell>
                      <TableCell>Total</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Payment</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredOrders
                      .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                      .map((order) => (
                        <TableRow key={order._id} hover>
                          <TableCell>
                            <Typography variant="body2" className="font-mono font-bold">
                              {order.orderNumber}
                            </Typography>
                          </TableCell>
                          
                          <TableCell>
                            <div>
                              <Typography variant="body2" className="font-medium">
                                {order.customerName}
                              </Typography>
                              <Typography variant="caption" color="textSecondary">
                                {order.customerEmail}
                              </Typography>
                            </div>
                          </TableCell>
                          
                          <TableCell>
                            <Typography variant="body2">
                              {new Date(order.createdAt).toLocaleDateString()}
                            </Typography>
                          </TableCell>
                          
                          <TableCell>
                            <Typography variant="body2">
                              {order.items.reduce((sum, item) => sum + item.quantity, 0)} items
                            </Typography>
                          </TableCell>
                          
                          <TableCell>
                            <Typography variant="body2" className="font-bold">
                              ${order.total.toFixed(2)}
                            </Typography>
                          </TableCell>
                          
                          <TableCell>
                            <div className="flex items-center gap-2">
                              {getStatusIcon(order.status)}
                              <Chip
                                label={order.status}
                                size="small"
                                color={getStatusColor(order.status) as any}
                              />
                            </div>
                          </TableCell>
                          
                          <TableCell>
                            <Typography variant="body2" className="capitalize">
                              {order.paymentMethod}
                            </Typography>
                          </TableCell>
                          
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <IconButton
                                size="small"
                                onClick={() => handleViewOrder(order)}
                                title="View Details"
                              >
                                <Eye className="w-4 h-4" />
                              </IconButton>
                              
                              <Select
                                value={order.status}
                                onChange={(e) => handleStatusUpdate(order._id, e.target.value as Order['status'])}
                                size="small"
                                className="min-w-32"
                              >
                                <MenuItem value="pending">Pending</MenuItem>
                                <MenuItem value="processing">Processing</MenuItem>
                                <MenuItem value="shipped">Shipped</MenuItem>
                                <MenuItem value="delivered">Delivered</MenuItem>
                                <MenuItem value="cancelled">Cancelled</MenuItem>
                              </Select>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </TableContainer>
              
              <TablePagination
                component="div"
                count={filteredOrders.length}
                page={page}
                onPageChange={(_, newPage) => setPage(newPage)}
                rowsPerPage={rowsPerPage}
                onRowsPerPageChange={(e) => {
                  setRowsPerPage(parseInt(e.target.value, 10));
                  setPage(0);
                }}
                rowsPerPageOptions={[5, 10, 25, 50]}
              />
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Order Details Dialog */}
      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        {selectedOrder && (
          <>
            <DialogTitle className="flex items-center justify-between">
              <div>
                <Typography variant="h6" className="font-bold">
                  Order #{selectedOrder.orderNumber}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Placed on {new Date(selectedOrder.createdAt).toLocaleDateString()}
                </Typography>
              </div>
              <Chip
                label={selectedOrder.status}
                color={getStatusColor(selectedOrder.status) as any}
                icon={getStatusIcon(selectedOrder.status)}
              />
            </DialogTitle>
            
            <DialogContent dividers>
              {/* Customer Info */}
              <div className="mb-6">
                <Typography variant="subtitle1" className="font-bold mb-2">
                  Customer Information
                </Typography>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Typography variant="body2" className="font-medium">Name</Typography>
                    <Typography variant="body1">{selectedOrder.customerName}</Typography>
                  </div>
                  <div>
                    <Typography variant="body2" className="font-medium">Email</Typography>
                    <Typography variant="body1">{selectedOrder.customerEmail}</Typography>
                  </div>
                </div>
              </div>

              {/* Shipping Address */}
              <div className="mb-6">
                <Typography variant="subtitle1" className="font-bold mb-2">
                  Shipping Address
                </Typography>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Typography variant="body2" className="font-medium">Address</Typography>
                    <Typography variant="body1">{selectedOrder.shippingAddress.address}</Typography>
                  </div>
                  <div>
                    <Typography variant="body2" className="font-medium">City</Typography>
                    <Typography variant="body1">{selectedOrder.shippingAddress.city}</Typography>
                  </div>
                  <div>
                    <Typography variant="body2" className="font-medium">State</Typography>
                    <Typography variant="body1">{selectedOrder.shippingAddress.state}</Typography>
                  </div>
                  <div>
                    <Typography variant="body2" className="font-medium">ZIP Code</Typography>
                    <Typography variant="body1">{selectedOrder.shippingAddress.zipCode}</Typography>
                  </div>
                </div>
              </div>

              {/* Order Items */}
              <div className="mb-6">
                <Typography variant="subtitle1" className="font-bold mb-2">
                  Order Items
                </Typography>
                <div className="space-y-3">
                  {selectedOrder.items.map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded">
                      <div>
                        <Typography variant="body2" className="font-medium">
                          {item.title}
                        </Typography>
                        <Typography variant="caption" color="textSecondary">
                          Quantity: {item.quantity}
                        </Typography>
                      </div>
                      <Typography variant="body2" className="font-bold">
                        ${(item.price * item.quantity).toFixed(2)}
                      </Typography>
                    </div>
                  ))}
                </div>
              </div>

              {/* Order Summary */}
              <div>
                <Typography variant="subtitle1" className="font-bold mb-2">
                  Order Summary
                </Typography>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Typography variant="body2">Subtotal</Typography>
                    <Typography variant="body2">${selectedOrder.subtotal.toFixed(2)}</Typography>
                  </div>
                  <div className="flex justify-between">
                    <Typography variant="body2">Tax</Typography>
                    <Typography variant="body2">${selectedOrder.tax.toFixed(2)}</Typography>
                  </div>
                  <div className="flex justify-between">
                    <Typography variant="body2">Shipping</Typography>
                    <Typography variant="body2">${selectedOrder.shipping.toFixed(2)}</Typography>
                  </div>
                  <div className="flex justify-between border-t pt-2">
                    <Typography variant="body1" className="font-bold">Total</Typography>
                    <Typography variant="body1" className="font-bold">
                      ${selectedOrder.total.toFixed(2)}
                    </Typography>
                  </div>
                </div>
              </div>
            </DialogContent>
            
            <DialogActions>
              <Button onClick={() => setDialogOpen(false)}>Close</Button>
              <Button
                variant="contained"
                className="bg-linear-to-r from-purple-600 to-pink-500"
              >
                Print Invoice
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </div>
  );
}