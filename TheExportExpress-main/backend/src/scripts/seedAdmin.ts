import mongoose from 'mongoose';
import { User } from '../models/User';
import { UserRole } from '../types/user';
import { MONGODB_URI } from '../server';

const seedSuperAdmin = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('MongoDB connected successfully');

    // Check if super admin already exists
    const existingSuperAdmin = await User.findOne({ email: 'admin@example.com' });
    if (existingSuperAdmin) {
      console.log('Super admin already exists');
      return;
    }

    // Create super admin
    const superAdmin = await User.create({
      email: 'admin@example.com',
      password: 'Admin@123',
      name: 'Super Admin',
      role: UserRole.SUPER_ADMIN,
      isActive: true,
      verified: true
    });

    console.log('Super admin created successfully:', superAdmin.email);
  } catch (error) {
    console.error('Error seeding super admin:', error);
  } finally {
    await mongoose.disconnect();
    console.log('MongoDB connection closed');
  }
};

seedSuperAdmin(); 