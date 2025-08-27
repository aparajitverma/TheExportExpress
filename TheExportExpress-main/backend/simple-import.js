const fs = require('fs');
const csv = require('csv-parser');
const { MongoClient, ObjectId } = require('mongodb');

// MongoDB connection string
const uri = 'mongodb://admin:password@localhost:27017/TheExportExpress?authSource=admin';
const client = new MongoClient(uri);

// Admin user ID (you may need to replace this with an actual admin user ID from your database)
const ADMIN_USER_ID = new ObjectId('000000000000000000000001');

async function processCategories(db, categories) {
  const categoriesCollection = db.collection('categories');
  const categoryMap = new Map();
  
  // Process each category
  for (const [name, category] of categories.entries()) {
    try {
      // First try to find existing category
      const existingCategory = await categoriesCollection.findOne({ name });
      
      if (existingCategory) {
        // Update existing category
        await categoriesCollection.updateOne(
          { _id: existingCategory._id },
          { 
            $set: { 
              description: category.description,
              slug: category.slug,
              isActive: true,
              updatedAt: new Date()
            }
          }
        );
        categoryMap.set(name, existingCategory._id);
        console.log(`Updated existing category: ${name}`);
      } else {
        // Insert new category
        const newCategory = {
          ...category,
          createdBy: ADMIN_USER_ID,
          createdAt: new Date(),
          updatedAt: new Date()
        };
        const result = await categoriesCollection.insertOne(newCategory);
        categoryMap.set(name, result.insertedId);
        console.log(`Added new category: ${name} (ID: ${result.insertedId})`);
      }
    } catch (error) {
      console.error(`Error processing category ${name}:`, error);
      throw error;
    }
  }
  
  return categoryMap;
}

async function importProducts() {
  try {
    // Connect to MongoDB
    await client.connect();
    console.log('Connected to MongoDB');

    const db = client.db('TheExportExpress');
    const products = [];
    const categories = new Map(); // Store categories with their unique names

    // First pass: Extract all unique categories
    console.log('Extracting categories from CSV...');
    const categorySet = new Set();
    
    // Read the file once to extract categories
    await new Promise((resolve, reject) => {
      fs.createReadStream('products.csv')
        .pipe(csv({
          mapHeaders: ({ header }) => header.trim()
        }))
        .on('data', (data) => {
          const categoryName = data['Category']?.trim() || 'Uncategorized';
          if (categoryName) {
            categorySet.add(categoryName);
          }
        })
        .on('end', resolve)
        .on('error', reject);
    });

    // Create category objects with proper structure
    for (const categoryName of categorySet) {
      const slug = categoryName.toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^\w-]+/g, '')
        .replace(/--+/g, '-')
        .replace(/^-+|-+$/g, '');
      
      categories.set(categoryName, {
        name: categoryName,
        slug: slug,
        description: `${categoryName} products`,
        isActive: true
      });
    }

    console.log(`Found ${categories.size} unique categories`);
    
    // Process and insert all categories first
    const categoryMap = await processCategories(db, categories);
    console.log('Successfully processed all categories');
    
    // Second pass: Process products
    console.log('Processing products...');
    await new Promise((resolve, reject) => {
      fs.createReadStream('products.csv')
        .pipe(csv({
          mapHeaders: ({ header }) => header.trim()
        }))
        .on('data', (data) => {
          const categoryName = data['Category']?.trim() || 'Uncategorized';
          
          // Create product with required fields only
          const product = {
            name: data['Product name']?.trim() || 'Unnamed Product',
            shortDescription: data['short description']?.trim() || '',
            description: data['Full description']?.trim() || '',
            category: categoryMap.get(categoryName), // Use the category ID
            specifications: {},
            images: [],
            certifications: data['Certifications'] 
              ? data['Certifications'].split(',').map(c => c.trim()).filter(Boolean)
              : [],
            origin: data['Origin']?.trim() || '',
            isActive: true,
            packagingOptions: [],
            createdAt: new Date(),
            updatedAt: new Date()
          };
          
          products.push(product);
        })
        .on('end', resolve)
        .on('error', reject);
    });
    
    console.log(`Found ${products.length} products to process`);

    // Now process products
    const productsCollection = db.collection('products');
    let importedCount = 0;
    let skippedCount = 0;
    
    for (const product of products) {
      try {
        if (!product.category) {
          console.warn(`Skipping product '${product.name}' - no category specified`);
          skippedCount++;
          continue;
        }
          
        // Prepare product data with category ID
        const productData = {
          name: product.name,
          shortDescription: product.shortDescription,
          description: product.description,
          category: product.category, // Already contains the category ID
          specifications: product.specifications,
          images: product.images,
          certifications: product.certifications,
          origin: product.origin,
          isActive: true,
          packagingOptions: product.packagingOptions,
          updatedAt: new Date()
        };
        
        // Check if product exists
        const existingProduct = await productsCollection.findOne({ name: product.name });
        
        if (existingProduct) {
          // Update existing product
          await productsCollection.updateOne(
            { _id: existingProduct._id },
            { $set: productData }
          );
          console.log(`Updated product: ${product.name}`);
        } else {
          // Insert new product
          await productsCollection.insertOne({
            ...productData,
            createdAt: new Date()
          });
          console.log(`Added product: ${product.name}`);
        }
        
        importedCount++;
        if (importedCount % 10 === 0) {
          console.log(`Processed ${importedCount} products...`);
        }
      } catch (error) {
        console.error(`Error processing product '${product.name}':`, error.message);
        skippedCount++;
      }
    }
    
    console.log(`\nImport Summary:`);
    console.log(`- Total products processed: ${products.length}`);
    console.log(`- Successfully imported/updated: ${importedCount}`);
    console.log(`- Skipped: ${skippedCount}`);
    
    // Close the MongoDB connection
    await client.close();
    console.log('Import completed successfully!');
  } catch (error) {
    console.error('Error:', error);
    await client.close().catch(console.error);
    process.exit(1);
  }
}

// Run the import
importProducts();
