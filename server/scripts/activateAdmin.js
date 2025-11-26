import mongoose from 'mongoose';
import User from '../models/User.js';
import dotenv from 'dotenv';

dotenv.config();

async function checkAndActivateAdmin() {
  try {
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) {
      throw new Error('MONGODB_URI environment variable is not set.');
    }
    await mongoose.connect(mongoUri);
    console.log('✓ Connected to MongoDB\n');

    // Find admin user
    const admin = await User.findOne({ email: 'admin@example.com' });
    
    if (!admin) {
      console.log('✗ Admin user not found');
      await mongoose.disconnect();
      return;
    }

    console.log('📋 Current Admin Status:');
    console.log('Email:', admin.email);
    console.log('Name:', admin.name);
    console.log('Role:', admin.role);
    console.log('Is Active:', admin.isActive);
    console.log('Created:', admin.createdAt);
    
    // Activate if not active
    if (!admin.isActive) {
      console.log('\n🔄 Activating admin user...');
      admin.isActive = true;
      await admin.save();
      console.log('✓ Admin user activated successfully!');
    } else {
      console.log('\n✓ Admin user is already active');
    }

    console.log('\n✅ Admin Details:');
    console.log('Email:', admin.email);
    console.log('Password: admin123 (what you set during creation)');
    console.log('Status: Active');
    console.log('Role: Admin');

    await mongoose.disconnect();
  } catch (error) {
    console.error('✗ Error:', error.message);
  }
}

checkAndActivateAdmin();
