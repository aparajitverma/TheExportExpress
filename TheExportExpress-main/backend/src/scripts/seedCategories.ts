import mongoose from 'mongoose';
import slugify from 'slugify';
import { Category } from '../models/Category';
import { User } from '../models/User';
import { MONGODB_URI } from '../server';

const categories = [
  { name: 'Spices', description: 'Aromatic or pungent vegetable substances used to flavor food.' },
  { name: 'Gems', description: 'Precious or semiprecious stones, especially when cut and polished or engraved.' },
  { name: 'Agriculture', description: 'The science or practice of farming, including cultivation of the soil for the growing of crops and the rearing of animals to provide food, wool, and other products.' },
  { name: 'Ayurvedic Products', description: 'Products based on Ayurveda, a natural system of medicine that originated in India more than 3,000 years ago.' },
  { name: 'Textiles', description: 'A type of cloth or woven fabric.' },
  { name: 'Handicrafts', description: 'A particular skill of making decorative objects by hand.' },
  { name: 'Jewelry', description: 'Personal ornaments, such as necklaces, rings, or bracelets, that are typically made from or contain jewels and precious metal.' },
  { name: 'Leather', description: 'A material made from the tanned skin of an animal.' }
];

const seedCategories = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    const adminUser = await User.findOne({ email: 'admin@example.com' });
    if (!adminUser) {
      console.error('Admin user not found. Please seed the admin user first using "npm run seed:admin".');
      process.exit(1);
    }

    await Category.deleteMany({});
    console.log('Categories deleted');

    const categoriesWithSlugAndCreator = categories.map(category => ({
      ...category,
      slug: slugify(category.name, { lower: true, strict: true }),
      createdBy: adminUser._id
    }));

    await Category.insertMany(categoriesWithSlugAndCreator);
    console.log('Categories seeded');

  } catch (error) {
    console.error('Error seeding categories:', error);
  } finally {
    await mongoose.disconnect();
    console.log('MongoDB connection closed');
  }
};

seedCategories(); 