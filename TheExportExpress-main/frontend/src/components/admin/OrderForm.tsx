import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import {
  XMarkIcon,
  UserIcon,
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon,
  ShoppingCartIcon,
  CurrencyDollarIcon,
  TagIcon,
  PlusIcon,
  TrashIcon,
  BuildingOfficeIcon,
  StarIcon,
  FireIcon,
  ArrowUpIcon,
  ArrowDownIcon
} from '@heroicons/react/24/outline';
import { getApiUrl } from '../../config';
import { IOrder, IOrderFormData } from '../../types/order';
import { IProduct } from '../../types/product';
import { IVendor } from '../../types/vendor';

interface OrderFormProps {
  order?: IOrder;
  onClose: () => void;
  onSuccess: () => void;
  mode: 'create' | 'edit';
}

const OrderForm: React.FC<OrderFormProps> = ({ order, onClose, onSuccess, mode }) => {
  const [loading, setLoading] = useState(false);
  const [currentApiUrl, setCurrentApiUrl] = useState('');
  const [products, setProducts] = useState<IProduct[]>([]);
  const [vendors, setVendors] = useState<IVendor[]>([]);
  const [formData, setFormData] = useState<IOrderFormData>({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    customerAddress: {
      street: '',
      city: '',
      state: '',
      country: '',
      postalCode: ''
    },
    items: [],
    totalAmount: 0,
    taxAmount: 0,
    shippingAmount: 0,
    discountAmount: 0,
    currency: 'USD',
    paymentMethod: 'credit_card',
    priority: 'medium',
    source: 'website',
    notes: '',
    tags: []
  });

  const [tagInput, setTagInput] = useState('');

  useEffect(() => {
    const initializeApiUrl = async () => {
      try {
        const apiUrl = await getApiUrl();
        setCurrentApiUrl(apiUrl);
      } catch (error) {
        console.error('Failed to initialize API URL:', error);
        toast.error('Failed to connect to server');
      }
    };
    initializeApiUrl();
  }, []);

  useEffect(() => {
    if (currentApiUrl) {
      fetchProducts();
      fetchVendors();
    }
  }, [currentApiUrl]);

  useEffect(() => {
    if (order && mode === 'edit') {
      setFormData({
        customerName: order.customerName,
        customerEmail: order.customerEmail,
        customerPhone: order.customerPhone || '',
        customerAddress: order.customerAddress,
        items: order.items.map(item => ({
          product: item.product._id,
          vendor: item.vendor._id,
          quantity: item.quantity,
          unitPrice: item.unitPrice
        })),
        totalAmount: order.totalAmount,
        taxAmount: order.taxAmount,
        shippingAmount: order.shippingAmount,
        discountAmount: order.discountAmount,
        currency: order.currency,
        paymentMethod: order.paymentMethod,
        priority: order.priority,
        source: order.source,
        notes: order.notes || '',
        tags: order.tags,
        assignedTo: order.assignedTo?._id
      });
    }
  }, [order, mode]);

  const fetchProducts = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${currentApiUrl}/api/products`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProducts(response.data.data || []);
    } catch (error: any) {
      console.error('Error fetching products:', error);
    }
  };

  const fetchVendors = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${currentApiUrl}/api/vendors`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setVendors(response.data.data || []);
    } catch (error: any) {
      console.error('Error fetching vendors:', error);
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAddressChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      customerAddress: {
        ...prev.customerAddress,
        [field]: value
      }
    }));
  };

  const addItem = () => {
    setFormData(prev => ({
      ...prev,
      items: [...prev.items, {
        product: '',
        vendor: '',
        quantity: 1,
        unitPrice: 0
      }]
    }));
  };

  const removeItem = (index: number) => {
    setFormData(prev => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index)
    }));
  };

  const updateItem = (index: number, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      items: prev.items.map((item, i) =>
        i === index ? { ...item, [field]: value } : item
      )
    }));
  };

  const addTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()]
      }));
      setTagInput('');
    }
  };

  const removeTag = (index: number) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter((_, i) => i !== index)
    }));
  };

  const calculateTotals = () => {
    const subtotal = formData.items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
    const total = subtotal + formData.taxAmount + formData.shippingAmount - formData.discountAmount;
    
    setFormData(prev => ({
      ...prev,
      totalAmount: subtotal,
      finalAmount: total
    }));
  };

  useEffect(() => {
    calculateTotals();
  }, [formData.items, formData.taxAmount, formData.shippingAmount, formData.discountAmount]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentApiUrl) {
      toast.error('API URL not initialized');
      return;
    }

    if (formData.items.length === 0) {
      toast.error('Please add at least one item to the order');
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };

      if (mode === 'create') {
        await axios.post(`${currentApiUrl}/api/orders`, formData, { headers });
        toast.success('Order created successfully');
      } else {
        await axios.put(`${currentApiUrl}/api/orders/${order?._id}`, formData, { headers });
        toast.success('Order updated successfully');
      }

      onSuccess();
      onClose();
    } catch (error: any) {
      console.error('Error saving order:', error);
      toast.error(error.response?.data?.message || 'Failed to save order');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-gray-800/90 backdrop-blur-sm rounded-lg shadow-xl w-full max-w-6xl max-h-[90vh] overflow-y-auto border border-gray-700/50"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700/50">
          <div>
            <h2 className="text-xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-emerald-400">
              {mode === 'create' ? 'Create New Order' : 'Edit Order'}
            </h2>
            <p className="text-sm text-gray-300">
              {mode === 'create' ? 'Create a new order with multiple products and vendors' : 'Update order information'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-300 transition-colors"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Customer Information */}
          <div className="border-b border-gray-700/50 pb-6">
            <h3 className="text-lg font-medium text-gray-200 mb-4 flex items-center">
              <UserIcon className="w-5 h-5 mr-2" />
              Customer Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Customer Name *
                </label>
                <input
                  type="text"
                  value={formData.customerName}
                  onChange={(e) => handleInputChange('customerName', e.target.value)}
                  className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600/50 text-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-400"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  value={formData.customerEmail}
                  onChange={(e) => handleInputChange('customerEmail', e.target.value)}
                  className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600/50 text-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-400"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Phone
                </label>
                <input
                  type="tel"
                  value={formData.customerPhone}
                  onChange={(e) => handleInputChange('customerPhone', e.target.value)}
                  className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600/50 text-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-400"
                />
              </div>
            </div>

            {/* Address */}
            <div className="mt-6">
              <h4 className="text-md font-medium text-gray-200 mb-4 flex items-center">
                <MapPinIcon className="w-4 h-4 mr-2" />
                Shipping Address
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Street Address *
                  </label>
                  <input
                    type="text"
                    value={formData.customerAddress.street}
                    onChange={(e) => handleAddressChange('street', e.target.value)}
                    className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600/50 text-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-400"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    City *
                  </label>
                  <input
                    type="text"
                    value={formData.customerAddress.city}
                    onChange={(e) => handleAddressChange('city', e.target.value)}
                    className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600/50 text-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-400"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    State/Province *
                  </label>
                  <input
                    type="text"
                    value={formData.customerAddress.state}
                    onChange={(e) => handleAddressChange('state', e.target.value)}
                    className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600/50 text-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-400"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Country *
                  </label>
                  <input
                    type="text"
                    value={formData.customerAddress.country}
                    onChange={(e) => handleAddressChange('country', e.target.value)}
                    className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600/50 text-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-400"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Postal Code *
                  </label>
                  <input
                    type="text"
                    value={formData.customerAddress.postalCode}
                    onChange={(e) => handleAddressChange('postalCode', e.target.value)}
                    className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600/50 text-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-400"
                    required
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Order Items */}
          <div className="border-b border-gray-700/50 pb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-200 flex items-center">
                <ShoppingCartIcon className="w-5 h-5 mr-2" />
                Order Items
              </h3>
              <button
                type="button"
                onClick={addItem}
                className="px-4 py-2 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-md hover:from-green-700 hover:to-green-800 transition-all duration-200 flex items-center gap-2"
              >
                <PlusIcon className="w-4 h-4" />
                Add Item
              </button>
            </div>

            {formData.items.map((item, index) => (
              <div key={index} className="bg-gray-700/30 p-4 rounded-lg mb-4">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-md font-medium text-gray-200">Item {index + 1}</h4>
                  <button
                    type="button"
                    onClick={() => removeItem(index)}
                    className="text-red-400 hover:text-red-300 hover:bg-red-600/20 p-1 rounded"
                  >
                    <TrashIcon className="w-4 h-4" />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Product *
                    </label>
                    <select
                      value={item.product}
                      onChange={(e) => {
                        updateItem(index, 'product', e.target.value);
                        // Auto-set price from product
                        const selectedProduct = products.find(p => p._id === e.target.value);
                        if (selectedProduct) {
                          updateItem(index, 'unitPrice', selectedProduct.price);
                        }
                      }}
                      className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600/50 text-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    >
                      <option value="">Select Product</option>
                      {products && products.length > 0 ? products.map(product => (
                        <option key={product._id} value={product._id}>
                          {product.name} - {formatCurrency(product.price)}
                        </option>
                      )) : (
                        <option disabled>Loading products...</option>
                      )}
                    </select>
                    {item.product && products && products.length > 0 && (
                      <p className="text-xs text-gray-400 mt-1">
                        {products.find(p => p._id === item.product)?.name}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      <BuildingOfficeIcon className="w-4 h-4 inline mr-1" />
                      Vendor Source *
                    </label>
                    <select
                      value={item.vendor}
                      onChange={(e) => updateItem(index, 'vendor', e.target.value)}
                      className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600/50 text-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    >
                      <option value="">Select Vendor Source</option>
                      {vendors && vendors.length > 0 ? vendors.map(vendor => (
                        <option key={vendor._id} value={vendor._id}>
                          {vendor.companyName} - {vendor.name}
                        </option>
                      )) : (
                        <option disabled>Loading vendors...</option>
                      )}
                    </select>
                    {item.vendor && vendors && vendors.length > 0 && (
                      <p className="text-xs text-blue-400 mt-1">
                        Source: {vendors.find(v => v._id === item.vendor)?.companyName}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Quantity *
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) => updateItem(index, 'quantity', parseInt(e.target.value))}
                      className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600/50 text-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-400"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Unit Price *
                    </label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={item.unitPrice}
                      onChange={(e) => updateItem(index, 'unitPrice', parseFloat(e.target.value))}
                      className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600/50 text-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-400"
                      required
                    />
                    <p className="text-xs text-gray-400 mt-1">
                      From vendor source
                    </p>
                  </div>
                </div>

                <div className="mt-2 text-sm text-gray-400">
                  Total: {formatCurrency(item.quantity * item.unitPrice)}
                </div>
              </div>
            ))}
          </div>

          {/* Order Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-medium text-gray-200 mb-4 flex items-center">
                <CurrencyDollarIcon className="w-5 h-5 mr-2" />
                Payment & Pricing
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Payment Method *
                  </label>
                  <select
                    value={formData.paymentMethod}
                    onChange={(e) => handleInputChange('paymentMethod', e.target.value)}
                    className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600/50 text-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  >
                    <option value="credit_card">Credit Card</option>
                    <option value="bank_transfer">Bank Transfer</option>
                    <option value="paypal">PayPal</option>
                    <option value="cash">Cash</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Currency
                  </label>
                  <select
                    value={formData.currency}
                    onChange={(e) => handleInputChange('currency', e.target.value)}
                    className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600/50 text-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="USD">USD</option>
                    <option value="EUR">EUR</option>
                    <option value="GBP">GBP</option>
                    <option value="INR">INR</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Tax Amount
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.taxAmount}
                    onChange={(e) => handleInputChange('taxAmount', parseFloat(e.target.value))}
                    className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600/50 text-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-400"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Shipping Amount
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.shippingAmount}
                    onChange={(e) => handleInputChange('shippingAmount', parseFloat(e.target.value))}
                    className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600/50 text-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-400"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Discount Amount
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.discountAmount}
                    onChange={(e) => handleInputChange('discountAmount', parseFloat(e.target.value))}
                    className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600/50 text-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-400"
                  />
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-200 mb-4 flex items-center">
                <TagIcon className="w-5 h-5 mr-2" />
                Order Settings
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Priority *
                  </label>
                  <select
                    value={formData.priority}
                    onChange={(e) => handleInputChange('priority', e.target.value)}
                    className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600/50 text-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Source *
                  </label>
                  <select
                    value={formData.source}
                    onChange={(e) => handleInputChange('source', e.target.value)}
                    className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600/50 text-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  >
                    <option value="website">Website</option>
                    <option value="phone">Phone</option>
                    <option value="email">Email</option>
                    <option value="walk_in">Walk-in</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Notes
                  </label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) => handleInputChange('notes', e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600/50 text-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-400"
                    placeholder="Additional notes about the order..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Tags
                  </label>
                  <div className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      placeholder="Add tag"
                      className="flex-1 px-3 py-2 bg-gray-700/50 border border-gray-600/50 text-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-400"
                    />
                    <button
                      type="button"
                      onClick={addTag}
                      className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-md hover:from-blue-700 hover:to-blue-800 transition-all duration-200"
                    >
                      Add
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {formData.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-600/20 text-blue-300 border border-blue-500/30"
                      >
                        {tag}
                        <button
                          type="button"
                          onClick={() => removeTag(index)}
                          className="ml-2 text-blue-400 hover:text-blue-300"
                        >
                          <XMarkIcon className="w-4 h-4" />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="bg-gray-700/30 p-4 rounded-lg">
            <h3 className="text-lg font-medium text-gray-200 mb-4">Order Summary</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <h4 className="text-sm font-medium text-gray-300 mb-2">Financial Summary</h4>
                <p className="text-sm text-gray-400">Subtotal: {formatCurrency(formData.totalAmount)}</p>
                <p className="text-sm text-gray-400">Tax: {formatCurrency(formData.taxAmount)}</p>
                <p className="text-sm text-gray-400">Shipping: {formatCurrency(formData.shippingAmount)}</p>
                <p className="text-sm text-gray-400">Discount: -{formatCurrency(formData.discountAmount)}</p>
                <p className="text-lg font-bold text-gray-200 mt-2">
                  Total: {formatCurrency(formData.totalAmount + formData.taxAmount + formData.shippingAmount - formData.discountAmount)}
                </p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-300 mb-2">Items Summary</h4>
                <p className="text-sm text-gray-400">Total Items: {formData.items.length}</p>
                <p className="text-sm text-gray-400">Total Quantity: {formData.items.reduce((sum, item) => sum + item.quantity, 0)}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-300 mb-2 flex items-center">
                  <BuildingOfficeIcon className="w-4 h-4 mr-1" />
                  Vendor Sources
                </h4>
                {formData.items.length > 0 ? (
                  <div className="space-y-1">
                    {vendors && vendors.length > 0 && [...new Set(formData.items.map(item => item.vendor).filter(Boolean))].map(vendorId => {
                      const vendor = vendors.find(v => v._id === vendorId);
                      const itemCount = formData.items.filter(item => item.vendor === vendorId).length;
                      return vendor ? (
                        <div key={vendorId} className="text-xs text-blue-400">
                          {vendor.companyName} ({itemCount} item{itemCount > 1 ? 's' : ''})
                        </div>
                      ) : null;
                    })}
                    {formData.items.some(item => !item.vendor) && (
                      <div className="text-xs text-yellow-400">
                        Some items need vendor assignment
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="text-xs text-gray-500">No items added yet</p>
                )}
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end gap-4 pt-6 border-t border-gray-700/50">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 bg-gray-700/50 border border-gray-600/50 text-gray-300 rounded-md hover:bg-gray-600/50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-md hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              {loading ? 'Saving...' : mode === 'create' ? 'Create Order' : 'Update Order'}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default OrderForm; 