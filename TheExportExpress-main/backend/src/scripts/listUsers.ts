import mongoose from 'mongoose';
import { User } from '../models/User';
import { MONGODB_URI } from '../server';

const listUsers = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    const users = await User.find({}).select('email name role isActive verified createdAt');
    console.log('Users in database:');
    console.log(JSON.stringify(users, null, 2));

    await mongoose.disconnect();
    console.log('MongoDB connection closed');
  } catch (error) {
    console.error('Error listing users:', error);
  }
};

listUsers(); 