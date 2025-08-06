import { useState, useEffect, useCallback } from 'react';
import AdminService, { BaseFilters } from '../services/AdminService';
import { IVendor } from '../types/vendor';

// Unified hook for all admin data management
export function useAdminData<T>(
  entity: string,
  initialFilters: BaseFilters = { page: 1, limit: 10 }
) {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<any>(null);
  const [filters, setFilters] = useState<BaseFilters>(initialFilters);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 10
  });
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  // Fetch data
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await AdminService.getList<T>(entity, filters);
      
      setData(result.items || []);
      setPagination(result.pagination || {
        currentPage: 1,
        totalPages: 1,
        totalItems: 0,
        itemsPerPage: 10
      });
      
      if (result.stats) {
        setStats(result.stats);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [entity, filters]);

  // Fetch stats separately if not included in main call
  const fetchStats = useCallback(async () => {
    try {
      const statsData = await AdminService.apiCall('GET', `${entity}/stats`, undefined, false);
      setStats(statsData);
    } catch (err) {
      console.warn(`Failed to fetch ${entity} stats:`, err);
    }
  }, [entity]);

  // Initial load
  useEffect(() => {
    fetchData();
    if (!stats) {
      fetchStats();
    }
  }, [fetchData, fetchStats, stats]);

  // CRUD operations
  const create = useCallback(async (itemData: any) => {
    try {
      setLoading(true);
      
      // Special handling for interconnected creates
      let result;
      if (entity === 'orders') {
        result = await AdminService.createOrderWithPayment(itemData);
      } else {
        result = await AdminService.create(entity, itemData);
      }
      
      await fetchData(); // Refresh data
      return result;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [entity, fetchData]);

  const update = useCallback(async (id: string, itemData: any) => {
    try {
      setLoading(true);
      
      // Special handling for status updates with interconnections
      let result;
      if (entity === 'orders' && itemData.orderStatus) {
        result = await AdminService.updateOrderStatus(id, itemData.orderStatus, itemData.internalNotes);
      } else if (entity === 'shipments' && itemData.phase) {
        result = await AdminService.updateShipmentPhase(id, itemData.phase, itemData.update);
      } else {
        result = await AdminService.update(entity, id, itemData);
      }
      
      await fetchData(); // Refresh data
      return result;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [entity, fetchData]);

  const remove = useCallback(async (id: string) => {
    try {
      setLoading(true);
      const result = await AdminService.delete(entity, id);
      await fetchData(); // Refresh data
      return result;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [entity, fetchData]);

  const bulkUpdate = useCallback(async (ids: string[], updates: any) => {
    try {
      setLoading(true);
      const result = await AdminService.bulkUpdate(entity, ids, updates);
      await fetchData(); // Refresh data
      setSelectedItems([]); // Clear selection
      return result;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [entity, fetchData]);

  // Filter and pagination helpers
  const updateFilters = useCallback((newFilters: Partial<BaseFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters, page: 1 })); // Reset to page 1 when filters change
  }, []);

  const changePage = useCallback((page: number) => {
    setFilters(prev => ({ ...prev, page }));
  }, []);

  const changePageSize = useCallback((limit: number) => {
    setFilters(prev => ({ ...prev, limit, page: 1 }));
  }, []);

  // Selection helpers
  const toggleSelection = useCallback((id: string) => {
    setSelectedItems(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  }, []);

  const selectAll = useCallback(() => {
    setSelectedItems(data.map((item: any) => item._id));
  }, [data]);

  const clearSelection = useCallback(() => {
    setSelectedItems([]);
  }, []);

  const isSelected = useCallback((id: string) => {
    return selectedItems.includes(id);
  }, [selectedItems]);

  // Export functionality
  const exportData = useCallback(async () => {
    try {
      await AdminService.exportData(entity, filters);
    } catch (err: any) {
      setError(err.message);
    }
  }, [entity, filters]);

  // Refresh data
  const refresh = useCallback(() => {
    fetchData();
    fetchStats();
  }, [fetchData, fetchStats]);

  return {
    // Data
    data,
    loading,
    error,
    stats,
    filters,
    pagination,
    selectedItems,
    
    // CRUD operations
    create,
    update,
    remove,
    bulkUpdate,
    
    // Filter and pagination
    updateFilters,
    changePage,
    changePageSize,
    
    // Selection
    toggleSelection,
    selectAll,
    clearSelection,
    isSelected,
    
    // Utilities
    exportData,
    refresh,
    
    // Computed values
    hasSelection: selectedItems.length > 0,
    allSelected: selectedItems.length === data.length && data.length > 0,
    partialSelection: selectedItems.length > 0 && selectedItems.length < data.length
  };
}

// Specialized hooks for different entities with proper typing
export const useVendors = (filters?: BaseFilters) => useAdminData<IVendor>('vendors', filters);
export const useOrders = (filters?: BaseFilters) => useAdminData('orders', filters);
export const usePayments = (filters?: BaseFilters) => useAdminData('payments', filters);
export const useShipments = (filters?: BaseFilters) => useAdminData('shipments', filters);

// Dashboard hook for interconnected data
export function useDashboard() {
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await AdminService.getDashboardData();
      setDashboardData(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
    
    // Auto-refresh every 30 seconds
    const interval = setInterval(fetchDashboardData, 30000);
    return () => clearInterval(interval);
  }, [fetchDashboardData]);

  return {
    dashboardData,
    loading,
    error,
    refresh: fetchDashboardData
  };
}