import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { User } from '../models/User';
import { Product } from '../models/Product';
import { Category } from '../models/Category';
import { MONGODB_URI } from '../server';
import { UserRole } from '../types/user';
import slugify from 'slugify';

const seedDatabase = async () => {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('MongoDB connected successfully.');

    // 1. Skip clearing existing data to preserve user data
    console.log('Skipping data deletion to preserve existing data...');
    // await Product.deleteMany({});
    // await Category.deleteMany({});
    // await User.deleteMany({});
    console.log('Data cleared.');

    // 2. Create Super Admin User
    console.log('Creating super admin user...');
    const hashedPassword = await bcrypt.hash('Admin@123', 10);
    const adminUser = await User.create({
      email: 'admin@example.com',
      password: hashedPassword,
      name: 'Super Admin',
      role: UserRole.SUPER_ADMIN,
      isActive: true,
      verified: true,
    });
    console.log(`Super admin created: ${adminUser.email}`);

    // 3. Create Categories
    console.log('Seeding categories...');
    const categoriesData = [
      { name: 'Spices', description: 'Aromatic spices from around the world.' },
      { name: 'Textiles', description: 'High-quality fabrics and textiles.' },
      { name: 'Handicrafts', description: 'Hand-made decorative items.' },
    ];

    const categoryDocs = await Category.insertMany(
        categoriesData.map(cat => ({
            ...cat,
            slug: slugify(cat.name, { lower: true, strict: true }),
            createdBy: adminUser._id,
        }))
    );
    console.log(`${categoryDocs.length} categories seeded.`);
    const categoryMap = new Map(categoryDocs.map(cat => [cat.name, cat._id]));


    // 4. Create Sample Products
    console.log('Seeding sample products...');
    const productsData = [
        {
            name: 'Premium Kashmiri Saffron',
            shortDescription: 'Highest grade saffron from Kashmir valley',
            description: 'Our premium Kashmiri Saffron is hand-picked from the valleys of Kashmir. Known for its distinct aroma and color, this saffron is perfect for both culinary and medicinal purposes.',
            category: categoryMap.get('Spices'),
            specifications: { 'Grade': 'Premium', 'Color': 'Deep Red' },
            origin: 'Kashmir, India',
            images: ['products/saffron1.jpg', 'products/saffron2.jpg'],
        },
        {
            name: 'Handwoven Pashmina Shawl',
            shortDescription: 'Traditional Kashmiri Pashmina shawl',
            description: 'Exquisitely handwoven Pashmina shawls made from the finest Cashmere wool.',
            category: categoryMap.get('Textiles'),
            specifications: { 'Material': '100% Pashmina', 'Weave': 'Hand Woven' },
            origin: 'Kashmir, India',
            images: ['products/pashmina1.jpg'],
        },
        {
            name: 'Brass Decorative Vase',
            shortDescription: 'Hand-crafted brass vase with traditional designs',
            description: 'Intricately designed brass vase featuring traditional Indian motifs.',
            category: categoryMap.get('Handicrafts'),
            specifications: { 'Material': 'Pure Brass', 'Height': '30cm' },
            origin: 'Moradabad, India',
            images: ['products/vase1.jpg'],
        },
    ];

    await Product.insertMany(productsData);
    console.log(`${productsData.length} products seeded.`);

    console.log('Database seeding completed successfully!');
    return true;
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
    return false;
  } finally {
    if (require.main === module) {
      await mongoose.disconnect();
      console.log('MongoDB connection closed.');
      process.exit(0);
    }
  }
};

if (require.main === module) {
  seedDatabase();
}

export { seedDatabase };