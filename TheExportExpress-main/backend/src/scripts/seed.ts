import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
// import dotenv from 'dotenv'; // Removed
// import path from 'path'; // Removed, not needed if .env is not used for MONGODB_URI
import { User } from '../models/User';
import { Product } from '../models/Product';
import { Category } from '../models/Category';
import { MONGODB_URI } from '../server'; // Import hardcoded MONGODB_URI
import { UserRole } from '../types/user';

// Load environment variables with explicit path
// dotenv.config({ path: path.join(__dirname, '../../.env') }); // Removed

// Verify environment variables
// if (!process.env.MONGODB_URI) { // Removed
//   console.error('MONGODB_URI is not defined in environment variables');
//   process.exit(1);
// }

// --- Hardcoded Admin Credentials (Consider implications) ---
const ADMIN_EMAIL_SEED = "admin@example.com"; // Replace or manage securely for actual use
const ADMIN_PASSWORD_SEED = "AdminSeed123!";   // Replace or manage securely for actual use
// --- End Hardcoded Admin Credentials ---

const seedDatabase = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    // await User.deleteMany({});
    // await Product.deleteMany({});

    // Create admin user
    const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD_SEED, 10);
    
    await User.findOneAndUpdate(
      { email: ADMIN_EMAIL_SEED },
      {
        email: ADMIN_EMAIL_SEED,
        password: hashedPassword,
        role: UserRole.ADMIN,
        name: 'Admin User',
        verified: true
      },
      { upsert: true }
    );

    // Get categories from database
    const spicesCategory = await Category.findOne({ slug: 'spices' });
    const textilesCategory = await Category.findOne({ slug: 'textiles' });
    const handicraftsCategory = await Category.findOne({ slug: 'handicrafts' });

    if (!spicesCategory || !textilesCategory || !handicraftsCategory) {
      console.error('Categories not found. Please run "npm run seed:categories" first.');
      process.exit(1);
    }

    // Create sample products
    const products = await Product.create([
      {
        name: 'Premium Kashmiri Saffron',
        shortDescription: 'Highest grade saffron from Kashmir valley',
        description: 'Our premium Kashmiri Saffron is hand-picked from the valleys of Kashmir. Known for its distinct aroma and color, this saffron is perfect for both culinary and medicinal purposes.',
        category: spicesCategory._id,
        specifications: {
          'Grade': 'Premium',
          'Color': 'Deep Red',
          'Length': '2.5-3cm',
          'Moisture': '<10%',
        },
        origin: 'Kashmir, India',
        certifications: ['ISO 22000:2018', 'FSSAI Certified'],
        packagingOptions: ['1g Box', '5g Box', '10g Box', 'Bulk Packaging'],
        images: ['products/saffron1.jpg', 'products/saffron2.jpg', 'products/saffron3.jpg'],
      },
      {
        name: 'Handwoven Pashmina Shawl',
        shortDescription: 'Traditional Kashmiri Pashmina shawl',
        description: 'Exquisitely handwoven Pashmina shawls made from the finest Cashmere wool. Each piece is unique and features traditional Kashmiri embroidery.',
        category: textilesCategory._id,
        specifications: {
          'Material': '100% Pashmina',
          'Weave': 'Hand Woven',
          'Size': '2m x 1m',
          'Weight': '200g',
        },
        origin: 'Kashmir, India',
        certifications: ['Handloom Mark', 'Woolmark'],
        packagingOptions: ['Gift Box', 'Standard Package'],
        images: ['products/pashmina1.jpg', 'products/pashmina2.jpg'],
      },
      {
        name: 'Brass Decorative Vase',
        shortDescription: 'Hand-crafted brass vase with traditional designs',
        description: 'Intricately designed brass vase featuring traditional Indian motifs. Each piece is handcrafted by skilled artisans using age-old techniques.',
        category: handicraftsCategory._id,
        specifications: {
          'Material': 'Pure Brass',
          'Height': '30cm',
          'Weight': '1.5kg',
          'Finish': 'Antique',
        },
        origin: 'Moradabad, India',
        certifications: ['Craft Mark', 'Fair Trade Certified'],
        packagingOptions: ['Premium Box', 'Export Packaging'],
        images: ['products/vase1.jpg', 'products/vase2.jpg', 'products/vase3.jpg'],
      },
    ]);

    console.log('Sample products created:', products.length);

    await mongoose.disconnect();
    console.log('Database seeded successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase(); 