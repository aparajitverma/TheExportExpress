import { Router, Request, Response } from 'express';
import { Vendor } from '../models/Vendor';
import { sendSuccess, sendError } from '../utils/response';

const router = Router();

// POST /api/sample-data/vendor - Create sample vendor with initialProducts
router.post('/vendor', async (req: Request, res: Response) => {
  try {
    const sampleVendorData = {
      name: "John Smith",
      companyName: "Global Trade Solutions Ltd",
      email: "john.smith@globaltradesolutions.com",
      phone: "+1-555-0123",
      website: "https://globaltradesolutions.com",
      
      address: {
        street: "123 Business District",
        city: "New York",
        state: "NY",
        country: "USA",
        postalCode: "10001"
      },
      
      businessType: "exporter",
      industry: "Electronics & Components",
      specialization: ["Consumer Electronics", "Industrial Components"],
      yearEstablished: 2015,
      employeeCount: 50,
      
      primaryContact: {
        name: "John Smith",
        position: "CEO",
        email: "john.smith@globaltradesolutions.com",
        phone: "+1-555-0123"
      },
      
      creditTerms: "Net 30",
      paymentMethod: "net30",
      currency: "USD",
      taxId: "12-3456789",
      
      certifications: {
        iso9001: true,
        iso14001: false,
        fssai: false,
        organic: false,
        fairTrade: true,
        other: ["CE Certification", "FCC Approved"]
      },
      
      productCategories: [],
      minimumOrderQuantity: 100,
      leadTime: 15,
      samplePolicy: "Free samples available for orders above $1000",
      
      // Sample Initial Products
      initialProducts: [
        {
          name: "Wireless Bluetooth Headphones",
          currentPrice: 45.99,
          currency: "USD",
          unit: "piece",
          minimumOrderQuantity: 500,
          leadTime: 20,
          hscCode: "8518.30.00",
          additionalComment: "Premium quality with noise cancellation feature",
          packagingOptions: [
            {
              option: "Retail Box",
              pricePerOption: 2.50
            },
            {
              option: "Bulk Packaging",
              pricePerOption: 0.75
            }
          ],
          certificationFiles: []
        },
        {
          name: "USB-C Fast Charging Cable",
          currentPrice: 8.99,
          currency: "USD",
          unit: "piece",
          minimumOrderQuantity: 1000,
          leadTime: 10,
          hscCode: "8544.42.90",
          additionalComment: "3ft length, supports fast charging up to 60W",
          packagingOptions: [
            {
              option: "Individual Packaging",
              pricePerOption: 0.30
            },
            {
              option: "Bulk Pack (50 units)",
              pricePerOption: 5.00
            }
          ],
          certificationFiles: []
        },
        {
          name: "Smart Home Security Camera",
          currentPrice: 89.99,
          currency: "USD",
          unit: "piece",
          minimumOrderQuantity: 200,
          leadTime: 25,
          hscCode: "8525.80.30",
          additionalComment: "1080p HD, night vision, WiFi enabled with mobile app",
          packagingOptions: [
            {
              option: "Premium Box with Accessories",
              pricePerOption: 5.99
            },
            {
              option: "Standard Packaging",
              pricePerOption: 2.99
            }
          ],
          certificationFiles: []
        }
      ],
      
      rating: 4.5,
      reliabilityScore: 92,
      qualityScore: 88,
      deliveryScore: 95,
      
      status: "active",
      verified: true,
      verificationDate: new Date(),
      
      documents: {
        businessLicense: "",
        taxCertificate: "",
        qualityCertificates: [],
        bankDetails: "",
        other: []
      },
      
      notes: "Reliable supplier with excellent track record in electronics export",
      tags: ["Electronics", "Consumer Goods", "Reliable", "Fast Shipping"]
    };

    // Check if vendor already exists
    const existingVendor = await Vendor.findOne({ email: sampleVendorData.email });
    if (existingVendor) {
      // Update existing vendor with new initialProducts
      existingVendor.initialProducts = sampleVendorData.initialProducts as any;
      await existingVendor.save();
      
      console.log('Sample vendor updated with initialProducts:', existingVendor.initialProducts?.length);
      return sendSuccess(res, { 
        vendor: existingVendor, 
        message: 'Sample vendor updated with initialProducts successfully',
        initialProductsCount: existingVendor.initialProducts?.length || 0
      });
    }

    // Create new vendor
    const vendor = new Vendor(sampleVendorData);
    await vendor.save();
    
    console.log('Sample vendor created with initialProducts:', vendor.initialProducts?.length);
    
    sendSuccess(res, { 
      vendor, 
      message: 'Sample vendor with initialProducts created successfully',
      initialProductsCount: vendor.initialProducts?.length || 0
    });
  } catch (error) {
    console.error('Error creating sample vendor:', error);
    sendError(res, 'Failed to create sample vendor', 500);
  }
});

export default router;
