const mongoose = require('mongoose');

async function debugVendorData() {
  try {
    await mongoose.connect('mongodb://admin:password@localhost:27017/TheExportExpress?authSource=admin');
    console.log('✅ Connected to MongoDB');

    const Vendor = mongoose.model('Vendor', new mongoose.Schema({}, { strict: false }));
    const vendor = await Vendor.findOne({ email: 'sarah.johnson@techworld-electronics.com' });
    
    if (!vendor) {
      console.log('❌ Vendor not found');
      return;
    }

    console.log('📋 Vendor found:', vendor.companyName);
    console.log('🆔 ID:', vendor._id);
    
    // Check documents structure
    console.log('\n📊 Documents object:');
    console.log('Raw documents:', vendor.documents);
    
    if (vendor.documents) {
      console.log('\n📁 Document arrays:');
      console.log('certificates:', vendor.documents.certificates);
      console.log('brochures:', vendor.documents.brochures);
      console.log('catalogs:', vendor.documents.catalogs);
      console.log('qualityCertificates:', vendor.documents.qualityCertificates);
    }

    // Check initialProducts
    console.log('\n📦 Initial Products:');
    console.log('Count:', vendor.initialProducts?.length || 0);
    
    if (vendor.initialProducts && vendor.initialProducts.length > 0) {
      vendor.initialProducts.forEach((product, index) => {
        console.log(`\nProduct ${index + 1}: ${product.name}`);
        console.log('  certificationFiles:', product.certificationFiles);
      });
    }

    await mongoose.disconnect();
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

debugVendorData();
