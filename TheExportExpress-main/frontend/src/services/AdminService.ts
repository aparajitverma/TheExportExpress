import axios, { AxiosResponse } from 'axios';
import { toast } from 'react-hot-toast';
import { getApiUrl } from '../config';

// Unified API Response Types
interface ApiResponse<T = any> {
  success: boolean;
  data: T;
  message?: string;
  pagination?: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
  };
}

// Unified Filter Interface
export interface BaseFilters {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  status?: string;
}

// Unified Stats Interface
export interface BaseStats {
  total: number;
  active: number;
  pending: number;
  inactive?: number;
}

class AdminService {
  private static instance: AdminService;
  private apiUrl: string = '';
  private authHeaders: { Authorization: string } = { Authorization: '' };

  private constructor() {
    this.initializeAuth();
  }

  public static getInstance(): AdminService {
    if (!AdminService.instance) {
      AdminService.instance = new AdminService();
    }
    return AdminService.instance;
  }

  // Initialize authentication and API URL
  private initializeAuth(): void {
    const token = localStorage.getItem('token');
    if (token) {
      this.authHeaders = { Authorization: `Bearer ${token}` };
    }
  }

  // Get API URL (cached)
  public async getApiUrl(): Promise<string> {
    if (!this.apiUrl) {
      this.apiUrl = await getApiUrl();
    }
    return this.apiUrl;
  }

  // Generic API call method
  private async apiCall<T>(
    method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH',
    endpoint: string,
    data?: any,
    showToast: boolean = true
  ): Promise<T> {
    try {
      const apiUrl = await this.getApiUrl();
      const config = {
        method,
        url: `${apiUrl}/api/${endpoint}`,
        headers: this.authHeaders,
        ...(data && { data })
      };

      const response: AxiosResponse<ApiResponse<T>> = await axios(config);
      
      if (showToast && response.data.message) {
        toast.success(response.data.message);
      }
      
      return response.data.data;
    } catch (error: any) {
      const message = error.response?.data?.message || `Failed to ${method.toLowerCase()} ${endpoint}`;
      if (showToast) {
        toast.error(message);
      }
      throw new Error(message);
    }
  }

  // Generic CRUD operations
  public async getList<T>(
    entity: string, 
    filters: BaseFilters = {}
  ): Promise<{ items: T[]; pagination: any; stats?: any }> {
    const queryParams = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== '') {
        queryParams.append(key, value.toString());
      }
    });
    
    const queryString = queryParams.toString();
    const endpoint = `${entity}${queryString ? `?${queryString}` : ''}`;
    
    return this.apiCall('GET', endpoint, undefined, false);
  }

  public async getById<T>(entity: string, id: string): Promise<T> {
    return this.apiCall('GET', `${entity}/${id}`, undefined, false);
  }

  public async create<T>(entity: string, data: any): Promise<T> {
    return this.apiCall('POST', entity, data);
  }

  public async update<T>(entity: string, id: string, data: any): Promise<T> {
    return this.apiCall('PUT', `${entity}/${id}`, data);
  }

  public async delete<T>(entity: string, id: string): Promise<T> {
    return this.apiCall('DELETE', `${entity}/${id}`);
  }

  public async bulkUpdate<T>(entity: string, ids: string[], updates: any): Promise<T> {
    return this.apiCall('PATCH', `${entity}/bulk`, { ids, updates });
  }

  // Entity-specific methods with interconnections
  
  // Vendors
  public async getVendors(filters: BaseFilters = {}) {
    return this.getList('vendors', filters);
  }

  public async getVendorStats() {
    return this.apiCall('GET', 'vendors/stats', undefined, false);
  }

  public async getVendorPerformance(vendorId: string) {
    return this.apiCall('GET', `vendors/${vendorId}/performance`, undefined, false);
  }

  // Orders with interconnected data
  public async getOrders(filters: BaseFilters = {}) {
    return this.getList('orders', filters);
  }

  public async createOrderWithPayment(orderData: any) {
    // Create order and automatically initialize payment
    const order = await this.create('orders', orderData);
    
    // Auto-create payment record
    const paymentData = {
      orderId: order._id,
      totalAmount: order.finalAmount,
      currency: order.currency,
      paymentMethod: order.paymentMethod,
      parties: {
        payer: { type: 'customer', email: order.customerEmail },
        payee: { type: 'host', name: 'Export Express' }
      }
    };
    
    const payment = await this.create('payments', paymentData);
    
    // Update vendor performance metrics
    for (const item of order.items) {
      this.updateVendorMetrics(item.vendor, 'order_received');
    }
    
    return { order, payment };
  }

  public async updateOrderStatus(orderId: string, status: string, notes?: string) {
    const order = await this.update('orders', orderId, { orderStatus: status, internalNotes: notes });
    
    // Trigger related updates based on status
    switch (status) {
      case 'processing':
        // Update vendor metrics
        for (const item of order.items) {
          this.updateVendorMetrics(item.vendor, 'order_processing');
        }
        break;
        
      case 'shipped':
        // Auto-create shipment if not exists
        this.createShipmentFromOrder(order);
        break;
        
      case 'delivered':
        // Update payment status and vendor performance
        this.updatePaymentStatus(order._id, 'completed');
        for (const item of order.items) {
          this.updateVendorMetrics(item.vendor, 'order_delivered');
        }
        break;
        
      case 'cancelled':
        this.updatePaymentStatus(order._id, 'cancelled');
        break;
    }
    
    return order;
  }

  // Payments with interconnected flows
  public async getPayments(filters: BaseFilters = {}) {
    return this.getList('payments', filters);
  }

  public async createPaymentFlow(paymentData: any) {
    const payment = await this.create('payments', paymentData);
    
    // If this is for an order, update order payment status
    if (payment.orderId) {
      this.update('orders', payment.orderId, { paymentStatus: 'processing' });
    }
    
    return payment;
  }

  public async updatePaymentStatus(orderId: string, status: string) {
    // Find payment by order ID and update status
    const payments = await this.getList('payments', { orderId });
    if (payments.items.length > 0) {
      return this.update('payments', payments.items[0]._id, { status });
    }
  }

  // Shipments with 5-phase tracking
  public async getShipments(filters: BaseFilters = {}) {
    return this.getList('shipments', filters);
  }

  public async createShipmentFromOrder(order: any) {
    const shipmentData = {
      orderId: order._id,
      orderNumber: order.orderNumber,
      customerInfo: {
        name: order.customerName,
        email: order.customerEmail,
        phone: order.customerPhone,
        address: order.customerAddress
      },
      items: order.items.map((item: any) => ({
        productId: item.product,
        vendorId: item.vendor,
        quantity: item.quantity,
        weight: item.weight || 1,
        dimensions: item.dimensions || { length: 10, width: 10, height: 10 }
      })),
      phases: {
        vendorToHost: { status: 'pending' },
        hostToPort: { status: 'pending' },
        portToPort: { status: 'pending' },
        importProcessing: { status: 'pending' },
        portToClient: { status: 'pending' }
      }
    };
    
    return this.create('shipments', shipmentData);
  }

  public async updateShipmentPhase(shipmentId: string, phase: string, update: any) {
    const shipment = await this.update('shipments', shipmentId, {
      [`phases.${phase}`]: update
    });
    
    // Auto-update order status based on shipment progress
    if (shipment.orderId) {
      let orderStatus = 'processing';
      
      if (phase === 'portToClient' && update.status === 'completed') {
        orderStatus = 'delivered';
      } else if (phase === 'hostToPort' && update.status === 'completed') {
        orderStatus = 'shipped';
      }
      
      this.updateOrderStatus(shipment.orderId, orderStatus);
    }
    
    return shipment;
  }

  // Vendor performance tracking
  private async updateVendorMetrics(vendorId: string, action: string) {
    try {
      await this.apiCall('POST', `vendors/${vendorId}/metrics`, { action }, false);
    } catch (error) {
      // Silent fail for metrics updates
      console.warn('Failed to update vendor metrics:', error);
    }
  }

  // Unified dashboard data
  public async getDashboardData() {
    const [vendors, orders, payments, shipments] = await Promise.all([
      this.getVendorStats(),
      this.apiCall('GET', 'orders/stats', undefined, false),
      this.apiCall('GET', 'payments/stats', undefined, false),
      this.apiCall('GET', 'shipments/stats', undefined, false)
    ]);

    return {
      vendors,
      orders,
      payments,
      shipments,
      interconnections: {
        activeOrders: orders.totalOrders - orders.deliveredOrders,
        pendingPayments: payments.pendingAmount,
        shipmentsInTransit: shipments.inTransit,
        topVendors: vendors.topPerformers || []
      }
    };
  }

  // Export functionality
  public async exportData(entity: string, filters: BaseFilters = {}) {
    const queryParams = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== '') {
        queryParams.append(key, value.toString());
      }
    });
    queryParams.append('export', 'csv');
    
    const apiUrl = await this.getApiUrl();
    const url = `${apiUrl}/api/${entity}?${queryParams.toString()}`;
    
    // Create download link
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${entity}-export.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success(`${entity} data exported successfully`);
  }
}

export default AdminService.getInstance();