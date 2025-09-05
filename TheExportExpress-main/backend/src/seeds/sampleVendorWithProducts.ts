import mongoose from 'mongoose';
import { Vendor } from '../models/Vendor';

const sampleVendorWithProducts = {
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
  
  businessType: "exporter" as const,
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
  paymentMethod: "net30" as const,
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
  
  status: "active" as const,
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

async function seedSampleVendor() {
  try {
    // Connect to MongoDB if not already connected
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/exportexpress');
    }

    // Check if vendor already exists
    const existingVendor = await Vendor.findOne({ email: sampleVendorWithProducts.email });
    if (existingVendor) {
      console.log('Sample vendor already exists, updating with new initialProducts...');
      existingVendor.initialProducts = sampleVendorWithProducts.initialProducts as any;
      await existingVendor.save();
      console.log('Sample vendor updated successfully!');
      console.log('Initial Products Count:', existingVendor.initialProducts?.length || 0);
      return existingVendor;
    }

    // Create new vendor
    const vendor = new Vendor(sampleVendorWithProducts);
    await vendor.save();
    
    console.log('Sample vendor with initialProducts created successfully!');
    console.log('Vendor ID:', vendor._id);
    console.log('Initial Products Count:', vendor.initialProducts?.length || 0);
    
    // Log the actual saved data to verify
    const savedVendor = await Vendor.findById(vendor._id);
    console.log('Saved initialProducts:', JSON.stringify(savedVendor?.initialProducts, null, 2));
    
    return vendor;
  } catch (error) {
    console.error('Error creating sample vendor:', error);
    throw error;
  }
}

// Export for use in other files
export { seedSampleVendor, sampleVendorWithProducts };

// Run directly if this file is executed
if (require.main === module) {
  seedSampleVendor()
    .then(() => {
      console.log('Seeding completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Seeding failed:', error);
      process.exit(1);
    });
}
