'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Search,
  Filter,
  Plus,
  Edit,
  Trash2,
  AlertTriangle,
  CheckCircle,
  XCircle,
  TrendingUp,
  TrendingDown,
} from 'lucide-react';
import {
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  LinearProgress,
} from '@mui/material';

interface Product {
  _id: string;
  sku: string;
  handle: string;
  title: string;
  vendor: string;
  category: string;
  price: number;
  compareAtPrice?: number;
  images: string[];
  inventory: number;
  lowStockThreshold: number;
  featured: boolean;
  active: boolean;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export default function AdminInventoryPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [stockFilter, setStockFilter] = useState('all');
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [inventoryUpdate, setInventoryUpdate] = useState({ quantity: 0 });
  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/products');
      const data = await response.json();
      setProducts(data.products || []);
      
      // Extract unique categories
      const uniqueCategories = [...new Set(data.products.map((p: Product) => p.category))];
      setCategories(uniqueCategories as string[]);
    } catch (error) {
      console.error('Failed to fetch products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInventoryUpdate = async (productId: string, quantity: number) => {
    try {
      const response = await fetch(`/api/admin/products/${productId}/inventory`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ inventory: quantity }),
      });

      if (response.ok) {
        fetchProducts(); // Refresh products
        setEditDialogOpen(false);
      }
    } catch (error) {
      console.error('Failed to update inventory:', error);
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    try {
      const response = await fetch(`/api/admin/products/${productId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        fetchProducts(); // Refresh products
        setDeleteDialogOpen(false);
      }
    } catch (error) {
      console.error('Failed to delete product:', error);
    }
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = 
      product.title.toLowerCase().includes(search.toLowerCase()) ||
      product.sku.toLowerCase().includes(search.toLowerCase()) ||
      product.vendor.toLowerCase().includes(search.toLowerCase());
    
    const matchesCategory = categoryFilter === 'all' || product.category === categoryFilter;
    
    const matchesStock = stockFilter === 'all' || 
      (stockFilter === 'low' && product.inventory <= product.lowStockThreshold) ||
      (stockFilter === 'out' && product.inventory === 0) ||
      (stockFilter === 'in' && product.inventory > 0);
    
    return matchesSearch && matchesCategory && matchesStock;
  });

  const getStockStatus = (inventory: number, threshold: number) => {
    if (inventory === 0) return { label: 'Out of Stock', color: 'error' };
    if (inventory <= threshold) return { label: 'Low Stock', color: 'warning' };
    return { label: 'In Stock', color: 'success' };
  };

  const getStockColor = (inventory: number, threshold: number) => {
    if (inventory === 0) return 'red';
    if (inventory <= threshold) return 'orange';
    return 'green';
  };

  const handleEditClick = (product: Product) => {
    setSelectedProduct(product);
    setInventoryUpdate({ quantity: product.inventory });
    setEditDialogOpen(true);
  };

  const handleDeleteClick = (product: Product) => {
    setSelectedProduct(product);
    setDeleteDialogOpen(true);
  };

  const getStockPercentage = (inventory: number, threshold: number) => {
    const max = Math.max(threshold * 3, 100); // Scale based on threshold
    return Math.min((inventory / max) * 100, 100);
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
              <h1 className="text-3xl font-bold text-gray-900">Inventory Management</h1>
              <p className="text-gray-600">Manage product inventory and stock levels</p>
            </div>
            
            <div className="flex items-center gap-4 mt-4 md:mt-0">
              <Button
                startIcon={<Plus className="w-4 h-4" />}
                variant="contained"
                className="bg-linear-to-r from-purple-600 to-pink-500"
                href="/admin/products/new"
              >
                Add Product
              </Button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {[
              { 
                label: 'Total Products', 
                value: products.length.toString(),
                icon: TrendingUp,
                color: 'blue',
              },
              { 
                label: 'Low Stock', 
                value: products.filter(p => p.inventory <= p.lowStockThreshold && p.inventory > 0).length.toString(),
                icon: AlertTriangle,
                color: 'orange',
              },
              { 
                label: 'Out of Stock', 
                value: products.filter(p => p.inventory === 0).length.toString(),
                icon: XCircle,
                color: 'red',
              },
              { 
                label: 'Featured', 
                value: products.filter(p => p.featured).length.toString(),
                icon: CheckCircle,
                color: 'green',
              },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="rounded-xl shadow-sm">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Typography variant="h4" className="font-bold mb-1">
                          {stat.value}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          {stat.label}
                        </Typography>
                      </div>
                      <div className={`p-2 bg-${stat.color}-100 rounded-lg`}>
                        <stat.icon className={`w-6 h-6 text-${stat.color}-600`} />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Filters */}
          <Card className="rounded-2xl shadow-sm mb-8">
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Search Products
                  </label>
                  <TextField
                    fullWidth
                    placeholder="Search by name, SKU, vendor..."
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
                    Category
                  </label>
                  <select
                    className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                  >
                    <option value="all">All Categories</option>
                    {categories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Stock Status
                  </label>
                  <select
                    className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                    value={stockFilter}
                    onChange={(e) => setStockFilter(e.target.value)}
                  >
                    <option value="all">All Stock</option>
                    <option value="in">In Stock</option>
                    <option value="low">Low Stock</option>
                    <option value="out">Out of Stock</option>
                  </select>
                </div>
                
                <div className="flex items-end">
                  <Button
                    fullWidth
                    variant="outlined"
                    startIcon={<Filter className="w-4 h-4" />}
                    onClick={() => {
                      setSearch('');
                      setCategoryFilter('all');
                      setStockFilter('all');
                    }}
                  >
                    Clear Filters
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Products Table */}
          <Card className="rounded-2xl shadow-sm">
            <CardContent className="p-6">
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Product</TableCell>
                      <TableCell>SKU</TableCell>
                      <TableCell>Category</TableCell>
                      <TableCell>Price</TableCell>
                      <TableCell>Inventory</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredProducts
                      .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                      .map((product) => {
                        const stockStatus = getStockStatus(product.inventory, product.lowStockThreshold);
                        const stockColor = getStockColor(product.inventory, product.lowStockThreshold);
                        
                        return (
                          <TableRow key={product._id} hover>
                            <TableCell>
                              <div className="flex items-center gap-3">
                                {product.images[0] && (
                                  <img
                                    src={product.images[0]}
                                    alt={product.title}
                                    className="w-10 h-10 rounded object-cover"
                                  />
                                )}
                                <div>
                                  <Typography variant="body2" className="font-medium">
                                    {product.title}
                                  </Typography>
                                  <Typography variant="caption" color="textSecondary">
                                    {product.vendor}
                                  </Typography>
                                </div>
                              </div>
                            </TableCell>
                            
                            <TableCell>
                              <Typography variant="body2" className="font-mono">
                                {product.sku}
                              </Typography>
                            </TableCell>
                            
                            <TableCell>
                              <Chip
                                label={product.category}
                                size="small"
                                variant="outlined"
                              />
                            </TableCell>
                            
                            <TableCell>
                              <Typography variant="body2" className="font-bold">
                                ${product.price.toFixed(2)}
                              </Typography>
                              {product.compareAtPrice && (
                                <Typography variant="caption" color="textSecondary" className="line-through ml-1">
                                  ${product.compareAtPrice.toFixed(2)}
                                </Typography>
                              )}
                            </TableCell>
                            
                            <TableCell>
                              <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                  <Typography variant="body2">
                                    {product.inventory} units
                                  </Typography>
                                  <Chip
                                    label={stockStatus.label}
                                    size="small"
                                    color={stockStatus.color as any}
                                  />
                                </div>
                                <LinearProgress
                                  variant="determinate"
                                  value={getStockPercentage(product.inventory, product.lowStockThreshold)}
                                  className={`h-2 rounded-full bg-${stockColor}-100`}
                                  classes={{
                                    bar: `bg-${stockColor}-600`
                                  }}
                                />
                              </div>
                            </TableCell>
                            
                            <TableCell>
                              <div className="flex gap-2">
                                {product.featured && (
                                  <Chip
                                    label="Featured"
                                    size="small"
                                    color="primary"
                                    variant="outlined"
                                  />
                                )}
                                {!product.active && (
                                  <Chip
                                    label="Inactive"
                                    size="small"
                                    color="default"
                                    variant="outlined"
                                  />
                                )}
                              </div>
                            </TableCell>
                            
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <IconButton
                                  size="small"
                                  onClick={() => handleEditClick(product)}
                                  title="Edit Inventory"
                                >
                                  <Edit className="w-4 h-4" />
                                </IconButton>
                                
                                <IconButton
                                  size="small"
                                  onClick={() => handleDeleteClick(product)}
                                  title="Delete Product"
                                  className="text-red-600 hover:text-red-800"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </IconButton>
                                
                                <Button
                                  size="small"
                                  variant="outlined"
                                  href={`/admin/products/${product._id}/edit`}
                                >
                                  Edit
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                  </TableBody>
                </Table>
              </TableContainer>
              
              <TablePagination
                component="div"
                count={filteredProducts.length}
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

      {/* Edit Inventory Dialog */}
      <Dialog
        open={editDialogOpen}
        onClose={() => setEditDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        {selectedProduct && (
          <>
            <DialogTitle>
              <Typography variant="h6" className="font-bold">
                Update Inventory
              </Typography>
              <Typography variant="body2" color="textSecondary">
                {selectedProduct.title}
              </Typography>
            </DialogTitle>
            
            <DialogContent>
              <div className="space-y-4">
                <div>
                  <Typography variant="body2" className="font-medium mb-2">
                    Current Inventory
                  </Typography>
                  <Typography variant="h4" className="font-bold">
                    {selectedProduct.inventory} units
                  </Typography>
                </div>
                
                <div>
                  <Typography variant="body2" className="font-medium mb-2">
                    Low Stock Threshold
                  </Typography>
                  <Typography variant="body1">
                    {selectedProduct.lowStockThreshold} units
                  </Typography>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    New Inventory Quantity
                  </label>
                  <TextField
                    fullWidth
                    type="number"
                    value={inventoryUpdate.quantity}
                    onChange={(e) => setInventoryUpdate({ 
                      quantity: parseInt(e.target.value) || 0 
                    })}
                    InputProps={{
                      inputProps: { min: 0 }
                    }}
                  />
                </div>
                
                {inventoryUpdate.quantity <= selectedProduct.lowStockThreshold && (
                  <Alert severity="warning" className="rounded-xl">
                    {inventoryUpdate.quantity === 0 ? (
                      'Product will be marked as Out of Stock'
                    ) : (
                      `Product will be marked as Low Stock (below ${selectedProduct.lowStockThreshold} units)`
                    )}
                  </Alert>
                )}
              </div>
            </DialogContent>
            
            <DialogActions>
              <Button onClick={() => setEditDialogOpen(false)}>Cancel</Button>
              <Button
                variant="contained"
                className="bg-linear-to-r from-purple-600 to-pink-500"
                onClick={() => handleInventoryUpdate(selectedProduct._id, inventoryUpdate.quantity)}
              >
                Update Inventory
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        {selectedProduct && (
          <>
            <DialogTitle>
              <Typography variant="h6" className="font-bold text-red-600">
                Delete Product
              </Typography>
            </DialogTitle>
            
            <DialogContent>
              <Alert severity="error" className="rounded-xl mb-4">
                This action cannot be undone. Are you sure you want to delete this product?
              </Alert>
              
              <div className="space-y-2">
                <Typography variant="body2" className="font-medium">Product:</Typography>
                <Typography variant="body1">{selectedProduct.title}</Typography>
                
                <Typography variant="body2" className="font-medium mt-3">SKU:</Typography>
                <Typography variant="body1">{selectedProduct.sku}</Typography>
                
                <Typography variant="body2" className="font-medium mt-3">Inventory:</Typography>
                <Typography variant="body1">{selectedProduct.inventory} units</Typography>
              </div>
            </DialogContent>
            
            <DialogActions>
              <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
              <Button
                variant="contained"
                color="error"
                onClick={() => handleDeleteProduct(selectedProduct._id)}
              >
                Delete Product
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </div>
  );
}