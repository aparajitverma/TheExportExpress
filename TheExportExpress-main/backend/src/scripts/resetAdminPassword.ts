import mongoose from 'mongoose';
import { User } from '../models/User';
import { MONGODB_URI } from '../server';

const resetAdminPassword = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    const admin = await User.findOne({ email: 'admin@example.com' });
    if (!admin) {
      console.log('Admin user not found');
      return;
    }

    // Set new password
    admin.password = 'Admin@123';
    admin.verified = true;
    await admin.save();

    console.log('Admin password reset successfully');
    console.log('Email:', admin.email);
    console.log('Role:', admin.role);
    console.log('Verified:', admin.verified);

    await mongoose.disconnect();
    console.log('MongoDB connection closed');
  } catch (error) {
    console.error('Error resetting admin password:', error);
  }
};

resetAdminPassword(); 