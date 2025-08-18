import { Request, Response } from 'express';
import { Vendor, IVendor } from '../models/Vendor';
import { Category } from '../models/Category';
import Order from '../models/Order';
import { ApiError, asyncHandler } from '../utils/ApiError';
import { sendSuccess, sendError } from '../utils/response';

// Get all vendors with pagination, filtering, and sorting
export const getAllVendors = async (req: Request, res: Response) => {
  try {
    const {
      page = 1,
      limit = 10,
      search = '',
      status,
      businessType,
      industry,
      country,
      verified,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;

    // Build filter object
    const filter: any = {};

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { companyName: { $regex: search, $options: 'i' } },
        { vendorCode: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { 'primaryContact.name': { $regex: search, $options: 'i' } },
        { industry: { $regex: search, $options: 'i' } }
      ];
    }

    if (status) filter.status = status;
    if (businessType) filter.businessType = businessType;
    if (industry) filter.industry = { $regex: industry, $options: 'i' };
    if (country) filter['address.country'] = { $regex: country, $options: 'i' };
    if (verified !== undefined) filter.verified = verified === 'true';

    // Build sort object
    const sort: any = {};
    sort[sortBy as string] = sortOrder === 'desc' ? -1 : 1;

    const vendors = await Vendor.find(filter)
      .populate('productCategories', 'name')
      .sort(sort)
      .skip(skip)
      .limit(limitNum)
      .lean();

    const total = await Vendor.countDocuments(filter);
    const totalPages = Math.ceil(total / limitNum);

    // Calculate statistics
    const stats = await Vendor.aggregate([
      { $match: filter },
      {
        $group: {
          _id: null,
          totalVendors: { $sum: 1 },
          activeVendors: {
            $sum: { $cond: [{ $eq: ['$status', 'active'] }, 1, 0] }
          },
          verifiedVendors: {
            $sum: { $cond: ['$verified', 1, 0] }
          },
          avgRating: { $avg: '$rating' },
          avgReliabilityScore: { $avg: '$reliabilityScore' },
          avgQualityScore: { $avg: '$qualityScore' },
          avgDeliveryScore: { $avg: '$deliveryScore' }
        }
      }
    ]);

    sendSuccess(res, {
      vendors,
      pagination: {
        currentPage: pageNum,
        totalPages,
        totalVendors: total,
        hasNextPage: pageNum < totalPages,
        hasPrevPage: pageNum > 1
      },
      stats: stats[0] || {
        totalVendors: 0,
        activeVendors: 0,
        verifiedVendors: 0,
        avgRating: 0,
        avgReliabilityScore: 0,
        avgQualityScore: 0,
        avgDeliveryScore: 0
      }
    });
  } catch (error) {
    console.error('Error fetching vendors:', error);
    sendError(res, 'Failed to fetch vendors', 500);
  }
};

// Get vendor by ID
export const getVendorById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const vendor = await Vendor.findById(id)
      .populate('productCategories', 'name description')
      .lean();

    if (!vendor) {
      return sendError(res, 'Vendor not found', 404);
    }

    sendSuccess(res, { vendor });
  } catch (error) {
    console.error('Error fetching vendor:', error);
    sendError(res, 'Failed to fetch vendor', 500);
  }
};

// Create new vendor
export const createVendor = async (req: Request, res: Response) => {
  try {
    const vendorData = req.body;

    // Generate vendor code if not provided
    if (!vendorData.vendorCode) {
      const count = await Vendor.countDocuments();
      vendorData.vendorCode = `VEN${String(count + 1).padStart(4, '0')}`;
    }

    // Check if vendor code already exists
    const existingVendor = await Vendor.findOne({ vendorCode: vendorData.vendorCode });
    if (existingVendor) {
      return sendError(res, 'Vendor code already exists', 400);
    }

    // Check if email already exists
    const existingEmail = await Vendor.findOne({ email: vendorData.email });
    if (existingEmail) {
      return sendError(res, 'Email already exists', 400);
    }

    const vendor = new Vendor(vendorData);
    await vendor.save();

    const populatedVendor = await Vendor.findById(vendor._id).populate('categories', 'name');
    sendSuccess(res, { vendor: populatedVendor, message: 'Vendor created successfully' });
  } catch (error) {
    console.error('Error creating vendor:', error);
    if (error instanceof Error && 'name' in error && error.name === 'ValidationError') {
      return sendError(res, `Validation error: ${error instanceof Error ? error.message : 'Unknown error'}`, 400);
    }
    sendError(res, 'Failed to create vendor', 500);
  }
};

// Update vendor
export const updateVendor = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // Check if vendor exists
    const existingVendor = await Vendor.findById(id);
    if (!existingVendor) {
      return sendError(res, 'Vendor not found', 404);
    }

    // Check if vendor code is being changed and if it already exists
    if (updateData.vendorCode && updateData.vendorCode !== existingVendor.vendorCode) {
      const duplicateCode = await Vendor.findOne({ 
        vendorCode: updateData.vendorCode,
        _id: { $ne: id }
      });
      if (duplicateCode) {
        return sendError(res, 'Vendor code already exists', 400);
      }
    }

    // Check if email is being changed and if it already exists
    if (updateData.email && updateData.email !== existingVendor.email) {
      const duplicateEmail = await Vendor.findOne({ 
        email: updateData.email,
        _id: { $ne: id }
      });
      if (duplicateEmail) {
        return sendError(res, 'Email already exists', 400);
      }
    }

    const updatedVendor = await Vendor.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    ).populate('productCategories', 'name');

    sendSuccess(res, { vendor: updatedVendor, message: 'Vendor updated successfully' });
  } catch (error) {
    console.error('Error updating vendor:', error);
    if (error instanceof Error && 'name' in error && error.name === 'ValidationError') {
      return sendError(res, `Validation error: ${error instanceof Error ? error.message : 'Unknown error'}`, 400);
    }
    sendError(res, 'Failed to update vendor', 500);
  }
};

// Delete vendor
export const deleteVendor = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const vendor = await Vendor.findById(id);
    if (!vendor) {
      return sendError(res, 'Vendor not found', 404);
    }

    // Check if vendor has associated products
    const { Product } = require('../models/Product');
    const productsWithVendor = await Product.countDocuments({ vendor: id });
    
    if (productsWithVendor > 0) {
      return sendError(res, `Cannot delete vendor. ${productsWithVendor} product(s) are associated with this vendor.`, 400);
    }

    await Vendor.findByIdAndDelete(id);
    sendSuccess(res, { message: 'Vendor deleted successfully' });
  } catch (error) {
    console.error('Error deleting vendor:', error);
    sendError(res, 'Failed to delete vendor', 500);
  }
};

// Update vendor status
export const updateVendorStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ['active', 'inactive', 'pending', 'suspended'];
    if (!validStatuses.includes(status)) {
      return sendError(res, 'Invalid status', 400);
    }

    const vendor = await Vendor.findByIdAndUpdate(id, { status }, { new: true });
    if (!vendor) {
      return sendError(res, 'Vendor not found', 404);
    }
    sendSuccess(res, { vendor, message: 'Vendor status updated successfully' });
  } catch (error) {
    console.error('Error updating vendor status:', error);
    sendError(res, 'Failed to update vendor status', 500);
  }
};

// Verify vendor
export const verifyVendor = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { verified } = req.body;

    const vendor = await Vendor.findByIdAndUpdate(id, { verified }, { new: true });
    if (!vendor) {
      return sendError(res, 'Vendor not found', 404);
    }
    sendSuccess(res, { vendor, message: `Vendor ${verified ? 'verified' : 'unverified'} successfully` });
  } catch (error) {
    console.error('Error verifying vendor:', error);
    sendError(res, 'Failed to verify vendor', 500);
  }
};

// Update vendor performance metrics
export const updateVendorMetrics = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { rating, reliabilityScore, qualityScore, deliveryScore } = req.body;

    const updateData: any = {};
    if (rating !== undefined) updateData.rating = Math.max(0, Math.min(5, rating));
    if (reliabilityScore !== undefined) updateData.reliabilityScore = Math.max(0, Math.min(100, reliabilityScore));
    if (qualityScore !== undefined) updateData.qualityScore = Math.max(0, Math.min(100, qualityScore));
    if (deliveryScore !== undefined) updateData.deliveryScore = Math.max(0, Math.min(100, deliveryScore));

    const vendor = await Vendor.findByIdAndUpdate(id, updateData, { new: true });
    if (!vendor) {
      return sendError(res, 'Vendor not found', 404);
    }
    sendSuccess(res, { vendor, message: 'Vendor metrics updated successfully' });
  } catch (error) {
    console.error('Error updating vendor metrics:', error);
    sendError(res, 'Failed to update vendor metrics', 500);
  }
};

// Get vendor statistics
export const getVendorStats = async (req: Request, res: Response) => {
  try {
    const stats = await Vendor.aggregate([
      {
        $group: {
          _id: null,
          totalVendors: { $sum: 1 },
          activeVendors: {
            $sum: { $cond: [{ $eq: ['$status', 'active'] }, 1, 0] }
          },
          pendingVendors: {
            $sum: { $cond: [{ $eq: ['$status', 'pending'] }, 1, 0] }
          },
          verifiedVendors: {
            $sum: { $cond: ['$verified', 1, 0] }
          },
          avgRating: { $avg: '$rating' },
          avgReliabilityScore: { $avg: '$reliabilityScore' },
          avgQualityScore: { $avg: '$qualityScore' },
          avgDeliveryScore: { $avg: '$deliveryScore' }
        }
      }
    ]);

    // Get vendors by business type
    const businessTypeStats = await Vendor.aggregate([
      {
        $group: {
          _id: '$businessType',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } }
    ]);

    // Get vendors by country
    const countryStats = await Vendor.aggregate([
      {
        $group: {
          _id: '$address.country',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } }
    ]);

    // Get top rated vendors
    const topRatedVendors = await Vendor.find({ rating: { $gt: 0 } })
      .sort({ rating: -1, reliabilityScore: -1 })
      .limit(5)
      .select('name companyName rating reliabilityScore qualityScore deliveryScore')
      .lean();

    sendSuccess(res, {
      overview: stats[0] || {
        totalVendors: 0,
        activeVendors: 0,
        pendingVendors: 0,
        verifiedVendors: 0,
        avgRating: 0,
        avgReliabilityScore: 0,
        avgQualityScore: 0,
        avgDeliveryScore: 0
      },
      businessTypeStats,
      countryStats,
      topRatedVendors
    });
  } catch (error) {
    console.error('Error fetching vendor stats:', error);
    sendError(res, 'Failed to fetch vendor statistics', 500);
  }
};

// Bulk import vendors from CSV
export const bulkImportVendors = async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return sendError(res, 'No file uploaded', 400);
    }

    // Parse CSV and import vendors
    // This would need CSV parsing logic
    // For now, return a placeholder response
    sendSuccess(res, {
      message: 'Bulk import functionality will be implemented',
      summary: {
        total: 0,
        success: 0,
        errors: 0
      }
    });
  } catch (error) {
    console.error('Error in bulk import:', error);
    sendError(res, 'Failed to import vendors', 500);
  }
};

// Get vendor template for CSV download
export const getVendorTemplate = async (req: Request, res: Response) => {
  try {
    const csvHeaders = [
      'name',
      'companyName',
      'vendorCode',
      'email',
      'phone',
      'website',
      'address.street',
      'address.city',
      'address.state',
      'address.country',
      'address.postalCode',
      'businessType',
      'industry',
      'specialization',
      'yearEstablished',
      'employeeCount',
      'primaryContact.name',
      'primaryContact.position',
      'primaryContact.email',
      'primaryContact.phone',
      'creditTerms',
      'paymentMethod',
      'currency',
      'taxId',
      'minimumOrderQuantity',
      'leadTime',
      'samplePolicy',
      'notes',
      'tags'
    ];

    const csvContent = csvHeaders.join(',') + '\n';
    
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=vendor_template.csv');
    res.send(csvContent);
  } catch (error) {
    console.error('Error generating vendor template:', error);
    sendError(res, 'Failed to generate template', 500);
  }
};

// Update vendor performance metrics (for interconnected system)
export const updateVendorMetricsExternal = asyncHandler(async (req: Request, res: Response) => {
  const { vendorId } = req.params;
  const { action } = req.body;

  const vendor = await Vendor.findById(vendorId);
  if (!vendor) {
    throw new ApiError(404, 'Vendor not found');
  }

  // Update metrics based on action
  switch (action) {
    case 'order_received':
      vendor.reliabilityScore = Math.min(100, (vendor.reliabilityScore || 70) + 1);
      break;
    case 'order_processing':
      vendor.qualityScore = Math.min(100, (vendor.qualityScore || 70) + 0.5);
      break;
    case 'order_delivered':
      vendor.reliabilityScore = Math.min(100, (vendor.reliabilityScore || 70) + 2);
      vendor.deliveryScore = Math.min(100, (vendor.deliveryScore || 70) + 3);
      vendor.rating = Math.min(5, (vendor.rating || 3) + 0.1);
      break;
    case 'order_cancelled':
      vendor.reliabilityScore = Math.max(0, (vendor.reliabilityScore || 70) - 5);
      break;
  }

  await vendor.save();
  
  sendSuccess(res, { 
    metrics: { 
      rating: vendor.rating,
      reliabilityScore: vendor.reliabilityScore,
      qualityScore: vendor.qualityScore,
      deliveryScore: vendor.deliveryScore
    },
    message: 'Vendor metrics updated successfully'
  });
});

// Get vendor performance analytics
export const getVendorPerformance = asyncHandler(async (req: Request, res: Response) => {
  const { vendorId } = req.params;

  const vendor = await Vendor.findById(vendorId);
  if (!vendor) {
    throw new ApiError(404, 'Vendor not found');
  }

  // Get order statistics for this vendor
  const orderStats = await Order.aggregate([
    {
      $match: { 'items.vendor': vendor._id }
    },
    {
      $group: {
        _id: null,
        totalOrders: { $sum: 1 },
        completedOrders: {
          $sum: { $cond: [{ $eq: ['$orderStatus', 'delivered'] }, 1, 0] }
        },
        cancelledOrders: {
          $sum: { $cond: [{ $eq: ['$orderStatus', 'cancelled'] }, 1, 0] }
        },
        totalValue: { $sum: '$finalAmount' },
        avgOrderValue: { $avg: '$finalAmount' }
      }
    }
  ]);

  const performance = {
    vendor: {
      companyName: vendor.companyName,
      status: vendor.status,
      rating: vendor.rating,
      reliabilityScore: vendor.reliabilityScore,
      qualityScore: vendor.qualityScore,
      deliveryScore: vendor.deliveryScore
    },
    orders: orderStats[0] || {
      totalOrders: 0,
      completedOrders: 0,
      cancelledOrders: 0,
      totalValue: 0,
      avgOrderValue: 0
    },
    metrics: {
      completionRate: orderStats[0] ? 
        (orderStats[0].completedOrders / orderStats[0].totalOrders * 100).toFixed(2) : 0,
      cancellationRate: orderStats[0] ? 
        (orderStats[0].cancelledOrders / orderStats[0].totalOrders * 100).toFixed(2) : 0
    }
  };

  sendSuccess(res, { performance, message: 'Vendor performance data retrieved successfully' });
}); 