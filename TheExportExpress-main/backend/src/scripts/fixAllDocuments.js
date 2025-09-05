const mongoose = require('mongoose');

async function fixAllDocuments() {
  try {
    await mongoose.connect('mongodb://admin:password@localhost:27017/TheExportExpress?authSource=admin');
    console.log('✅ Connected to MongoDB');

    const Vendor = mongoose.model('Vendor', new mongoose.Schema({}, { strict: false }));
    const vendor = await Vendor.findOne({ email: 'sarah.johnson@techworld-electronics.com' });
    
    if (!vendor) {
      console.log('❌ Vendor not found');
      return;
    }

    console.log('📋 Found vendor:', vendor.companyName);
    
    const sampleFile = 'vendors/1757102290362-841217825-Shilajit Catalogue-1.pdf';
    
    // Update vendor documents
    const updateData = {
      'documents.certificates': [sampleFile],
      'documents.brochures': [sampleFile],
      'documents.catalogs': [sampleFile],
      'documents.qualityCertificates': [sampleFile]
    };

    // Update all products to have certification files
    if (vendor.initialProducts && vendor.initialProducts.length > 0) {
      vendor.initialProducts.forEach((product, index) => {
        updateData[`initialProducts.${index}.certificationFiles`] = [sampleFile];
      });
    }

    console.log('🔄 Updating vendor with documents...');
    const updatedVendor = await Vendor.findByIdAndUpdate(
      vendor._id,
      { $set: updateData },
      { new: true }
    );

    console.log('✅ Updated successfully!');
    console.log('📊 Final document counts:');
    console.log('- certificates:', updatedVendor.documents.certificates?.length || 0);
    console.log('- brochures:', updatedVendor.documents.brochures?.length || 0);
    console.log('- catalogs:', updatedVendor.documents.catalogs?.length || 0);
    console.log('- qualityCertificates:', updatedVendor.documents.qualityCertificates?.length || 0);
    
    console.log('📦 Product certification files:');
    updatedVendor.initialProducts?.forEach((product, index) => {
      console.log(`- ${product.name}: ${product.certificationFiles?.length || 0} files`);
    });

    await mongoose.disconnect();
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

fixAllDocuments();
