const mongoose = require('mongoose');

// Script to check the actual vendor data structure in MongoDB
async function checkVendorData() {
  try {
    // Connect to MongoDB
    const mongoUri = process.env.MONGODB_URI || 'mongodb://admin:password@localhost:27017/TheExportExpress?authSource=admin';
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB');

    // Find the TechWorld Electronics vendor
    const Vendor = mongoose.model('Vendor', new mongoose.Schema({}, { strict: false }));
    const vendor = await Vendor.findOne({ email: 'sarah.johnson@techworld-electronics.com' });
    
    if (!vendor) {
      console.log('❌ TechWorld Electronics vendor not found');
      return;
    }

    console.log('✅ Found vendor:', vendor.companyName);
    console.log('🆔 Vendor ID:', vendor._id);

    // Check documents structure
    console.log('\n📋 Documents Structure:');
    console.log('vendor.documents:', JSON.stringify(vendor.documents, null, 2));

    // Check specific document arrays
    console.log('\n📊 Document Counts:');
    console.log('certificates:', vendor.documents?.certificates?.length || 0);
    console.log('brochures:', vendor.documents?.brochures?.length || 0);
    console.log('catalogs:', vendor.documents?.catalogs?.length || 0);
    console.log('qualityCertificates:', vendor.documents?.qualityCertificates?.length || 0);

    // Check initialProducts
    console.log('\n📦 Initial Products:');
    if (vendor.initialProducts && vendor.initialProducts.length > 0) {
      vendor.initialProducts.forEach((product, index) => {
        console.log(`Product ${index + 1}: ${product.name}`);
        console.log(`  - certificationFiles: ${product.certificationFiles?.length || 0} files`);
        if (product.certificationFiles && product.certificationFiles.length > 0) {
          product.certificationFiles.forEach((file, fileIndex) => {
            console.log(`    ${fileIndex + 1}. ${file}`);
          });
        }
      });
    } else {
      console.log('No initial products found');
    }

    // Check if the vendor object has the expected structure
    console.log('\n🔍 Raw vendor.documents object keys:');
    if (vendor.documents) {
      console.log(Object.keys(vendor.documents));
    } else {
      console.log('No documents object found');
    }

  } catch (error) {
    console.error('❌ Error checking vendor data:', error);
    throw error;
  } finally {
    await mongoose.disconnect();
    console.log('\nDisconnected from MongoDB');
  }
}

// Run the script
if (require.main === module) {
  checkVendorData()
    .then(() => {
      console.log('\n✨ Vendor data check completed!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Script failed:', error);
      process.exit(1);
    });
}

module.exports = { checkVendorData };
