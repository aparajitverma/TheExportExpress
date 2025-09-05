const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

// Script to add the same Shilajit Catalogue PDF to all document fields for testing
async function addDocumentsToAllFields() {
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

    // The existing Shilajit Catalogue file path
    const existingFilePath = 'vendors/1757102290362-841217825-Shilajit Catalogue-1.pdf';
    
    // Verify the file exists
    const fullFilePath = path.join(__dirname, '../../uploads', existingFilePath);
    if (!fs.existsSync(fullFilePath)) {
      console.log('❌ Shilajit Catalogue file not found at:', fullFilePath);
      return;
    }

    console.log('📄 Using existing file:', existingFilePath);

    // Initialize documents object if it doesn't exist
    vendor.documents = vendor.documents || {};

    // Add to vendor-level certificates (if not already there)
    vendor.documents.certificates = vendor.documents.certificates || [];
    if (!vendor.documents.certificates.includes(existingFilePath)) {
      vendor.documents.certificates.push(existingFilePath);
      console.log('✅ Added to vendor certificates');
    } else {
      console.log('ℹ️ Already in vendor certificates');
    }

    // Add to vendor-level brochures
    vendor.documents.brochures = vendor.documents.brochures || [];
    if (!vendor.documents.brochures.includes(existingFilePath)) {
      vendor.documents.brochures.push(existingFilePath);
      console.log('✅ Added to vendor brochures');
    } else {
      console.log('ℹ️ Already in vendor brochures');
    }

    // Add to vendor-level catalogs
    vendor.documents.catalogs = vendor.documents.catalogs || [];
    if (!vendor.documents.catalogs.includes(existingFilePath)) {
      vendor.documents.catalogs.push(existingFilePath);
      console.log('✅ Added to vendor catalogs');
    } else {
      console.log('ℹ️ Already in vendor catalogs');
    }

    // Add to qualityCertificates (existing field)
    vendor.documents.qualityCertificates = vendor.documents.qualityCertificates || [];
    if (!vendor.documents.qualityCertificates.includes(existingFilePath)) {
      vendor.documents.qualityCertificates.push(existingFilePath);
      console.log('✅ Added to quality certificates');
    } else {
      console.log('ℹ️ Already in quality certificates');
    }

    // Add to product certification files for all initial products
    if (vendor.initialProducts && vendor.initialProducts.length > 0) {
      vendor.initialProducts.forEach((product, index) => {
        product.certificationFiles = product.certificationFiles || [];
        if (!product.certificationFiles.includes(existingFilePath)) {
          product.certificationFiles.push(existingFilePath);
          console.log(`✅ Added to product ${index + 1} (${product.name}) certification files`);
        } else {
          console.log(`ℹ️ Already in product ${index + 1} certification files`);
        }
      });
    }

    // Save the updated vendor
    await vendor.save();
    
    console.log('\n🎉 Successfully added Shilajit Catalogue to all document fields!');
    console.log('\n📋 Summary of document locations:');
    console.log(`   📜 Vendor Certificates: ${vendor.documents.certificates?.length || 0} files`);
    console.log(`   📰 Vendor Brochures: ${vendor.documents.brochures?.length || 0} files`);
    console.log(`   📁 Vendor Catalogs: ${vendor.documents.catalogs?.length || 0} files`);
    console.log(`   🏆 Quality Certificates: ${vendor.documents.qualityCertificates?.length || 0} files`);
    console.log(`   📦 Product Certifications: ${vendor.initialProducts?.reduce((total, p) => total + (p.certificationFiles?.length || 0), 0) || 0} files across ${vendor.initialProducts?.length || 0} products`);

    console.log('\n👀 You can now test all document fields in the vendor details UI:');
    console.log('   1. Go to Vendors page');
    console.log('   2. Click eye icon on TechWorld Electronics');
    console.log('   3. Check "Uploaded Documents" section');
    console.log('   4. Check each Initial Product for certification files');
    console.log('   5. All should show the Shilajit Catalogue with View/Download buttons');

  } catch (error) {
    console.error('❌ Error adding documents:', error);
    throw error;
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

// Run the script
if (require.main === module) {
  addDocumentsToAllFields()
    .then(() => {
      console.log('\n✨ Document addition completed successfully!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Script failed:', error);
      process.exit(1);
    });
}

module.exports = { addDocumentsToAllFields };
