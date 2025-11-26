import mongoose from 'mongoose';
import User from '../models/User.js';
import dotenv from 'dotenv';

dotenv.config();

async function createAdmin() {
  try {
    // Connect to MongoDB (requires MONGODB_URI env var to be set)
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) {
      throw new Error('MONGODB_URI environment variable is not set.');
    }
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB');

    // Check if admin already exists
    const adminExists = await User.findOne({ email: 'admin@example.com' });
    if (adminExists) {
      console.log('✓ Admin user already exists');
      await mongoose.disconnect();
      return;
    }

    // Create admin user
    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@example.com',
      password: 'admin123',
      role: 'admin',
      isActive: true,
      address: {
        line1: 'Admin Building',
        line2: 'Suite 100',
        city: 'Tech City',
        state: 'TC',
        postal: '12345',
        country: 'USA',
        phone: '555-0000'
      }
    });

    console.log('✓ Admin user created successfully!');
    console.log('Email: admin@example.com');
    console.log('Password: admin123');
    console.log('ID:', admin._id);

    await mongoose.disconnect();
  } catch (error) {
    console.error('✗ Error creating admin user:', error.message);
    process.exit(1);
  }
}

createAdmin();
