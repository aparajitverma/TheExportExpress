const mongoose = require('mongoose');

// Sample vendor data with initialProducts
const sampleVendorData = {
  name: "Sarah Johnson",
  companyName: "TechWorld Electronics Ltd",
  email: "sarah.johnson@techworld-electronics.com",
  phone: "+1-555-0199",
  website: "https://techworld-electronics.com",
  
  address: {
    street: "456 Innovation Drive",
    city: "San Francisco",
    state: "CA",
    country: "USA",
    postalCode: "94105"
  },
  
  businessType: "manufacturer",
  industry: "Consumer Electronics",
  specialization: ["Smartphones", "Tablets", "Accessories"],
  yearEstablished: 2018,
  employeeCount: 75,
  
  primaryContact: {
    name: "Sarah Johnson",
    position: "Sales Director",
    email: "sarah.johnson@techworld-electronics.com",
    phone: "+1-555-0199"
  },
  
  creditTerms: "Net 30",
  paymentMethod: "net30",
  currency: "USD",
  taxId: "98-7654321",
  
  certifications: {
    iso9001: true,
    iso14001: true,
    fssai: false,
    organic: false,
    fairTrade: false,
    other: ["FCC Certified", "CE Marking", "RoHS Compliant"]
  },
  
  productCategories: [],
  minimumOrderQuantity: 500,
  leadTime: 12,
  samplePolicy: "Free samples for qualified buyers, minimum order $2000",
  
  // Initial Products with all the fields you requested
  initialProducts: [
    {
      name: "Premium Wireless Earbuds Pro",
      currentPrice: 89.99,
      currency: "USD",
      unit: "pair",
      minimumOrderQuantity: 100,
      leadTime: 15,
      hscCode: "8518.30.20",
      additionalComment: "Latest Bluetooth 5.3 technology with active noise cancellation and 30-hour battery life",
      packagingOptions: [
        {
          option: "Premium Gift Box",
          pricePerOption: 4.50
        },
        {
          option: "Standard Retail Box",
          pricePerOption: 2.00
        },
        {
          option: "Bulk Packaging",
          pricePerOption: 0.50
        }
      ],
      certificationFiles: []
    },
    {
      name: "Fast Wireless Charging Pad",
      currentPrice: 24.99,
      currency: "USD", 
      unit: "piece",
      minimumOrderQuantity: 200,
      leadTime: 10,
      hscCode: "8504.40.95",
      additionalComment: "15W fast charging compatible with all Qi-enabled devices, includes LED indicator",
      packagingOptions: [
        {
          option: "Eco-Friendly Box",
          pricePerOption: 1.25
        },
        {
          option: "Blister Pack",
          pricePerOption: 0.75
        }
      ],
      certificationFiles: []
    },
    {
      name: "USB-C to Lightning Cable 6ft",
      currentPrice: 12.99,
      currency: "USD",
      unit: "piece", 
      minimumOrderQuantity: 500,
      leadTime: 7,
      hscCode: "8544.42.90",
      additionalComment: "MFi certified, supports fast charging up to 20W and data sync",
      packagingOptions: [
        {
          option: "Individual Sleeve",
          pricePerOption: 0.40
        },
        {
          option: "Bulk Pack (10 units)",
          pricePerOption: 2.50
        }
      ],
      certificationFiles: []
    },
    {
      name: "Bluetooth Smart Watch Series X",
      currentPrice: 149.99,
      currency: "USD",
      unit: "piece",
      minimumOrderQuantity: 50,
      leadTime: 20,
      hscCode: "9102.12.80",
      additionalComment: "1.4 inch AMOLED display, heart rate monitor, GPS, 7-day battery life, IP68 waterproof",
      packagingOptions: [
        {
          option: "Luxury Watch Box",
          pricePerOption: 8.99
        },
        {
          option: "Standard Box with Accessories",
          pricePerOption: 4.99
        }
      ],
      certificationFiles: []
    }
  ],
  
  rating: 4.7,
  reliabilityScore: 94,
  qualityScore: 91,
  deliveryScore: 89,
  
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
  
  notes: "High-quality electronics manufacturer with excellent customer service and competitive pricing",
  tags: ["Electronics", "Manufacturer", "Fast Delivery", "Quality Products"]
};

// MongoDB connection and insertion
async function createSampleVendor() {
  try {
    // Connect to MongoDB
    const mongoUri = process.env.MONGODB_URI || 'mongodb://admin:password@localhost:27017/TheExportExpress?authSource=admin';
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB');

    // Define Vendor schema (simplified version for script)
    const vendorSchema = new mongoose.Schema({}, { strict: false });
    const Vendor = mongoose.model('Vendor', vendorSchema);

    // Check if vendor already exists
    const existingVendor = await Vendor.findOne({ email: sampleVendorData.email });
    if (existingVendor) {
      console.log('Sample vendor already exists, updating initialProducts...');
      existingVendor.initialProducts = sampleVendorData.initialProducts;
      await existingVendor.save();
      console.log('✅ Sample vendor updated successfully!');
      console.log('📦 Initial Products Count:', existingVendor.initialProducts.length);
      return existingVendor;
    }

    // Generate vendor code
    const count = await Vendor.countDocuments();
    sampleVendorData.vendorCode = `VEN${String(count + 1).padStart(4, '0')}`;

    // Create new vendor
    const vendor = new Vendor(sampleVendorData);
    await vendor.save();
    
    console.log('✅ Sample vendor created successfully!');
    console.log('🆔 Vendor ID:', vendor._id);
    console.log('🏢 Company:', vendor.companyName);
    console.log('📧 Email:', vendor.email);
    console.log('📦 Initial Products Count:', vendor.initialProducts.length);
    
    // List the products
    console.log('\n📋 Initial Products:');
    vendor.initialProducts.forEach((product, index) => {
      console.log(`  ${index + 1}. ${product.name} - $${product.currentPrice} ${product.currency}`);
      console.log(`     Unit: ${product.unit}, MOQ: ${product.minimumOrderQuantity}, Lead Time: ${product.leadTime} days`);
      console.log(`     HSC: ${product.hscCode}`);
      if (product.additionalComment) {
        console.log(`     Comment: ${product.additionalComment}`);
      }
      console.log('');
    });
    
    return vendor;
  } catch (error) {
    console.error('❌ Error creating sample vendor:', error);
    throw error;
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

// Run the script
if (require.main === module) {
  createSampleVendor()
    .then(() => {
      console.log('\n🎉 Sample vendor creation completed!');
      console.log('👀 You can now view this vendor in the frontend admin panel');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Script failed:', error);
      process.exit(1);
    });
}

module.exports = { createSampleVendor, sampleVendorData };
