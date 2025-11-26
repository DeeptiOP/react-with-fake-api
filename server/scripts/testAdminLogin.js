import mongoose from 'mongoose';
import bcryptjs from 'bcryptjs';
import User from '../models/User.js';
import dotenv from 'dotenv';

dotenv.config();

async function testAdminLogin() {
  try {
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) {
      throw new Error('MONGODB_URI environment variable is not set.');
    }
    await mongoose.connect(mongoUri);
    console.log('✓ Connected to MongoDB');

    // Find admin user
    const admin = await User.findOne({ email: 'admin@example.com' }).select('+password');
    
    if (!admin) {
      console.log('✗ Admin user not found in database');
      await mongoose.disconnect();
      return;
    }

    console.log('\n📋 Admin User Info:');
    console.log('Email:', admin.email);
    console.log('Name:', admin.name);
    console.log('Role:', admin.role);
    console.log('Active:', admin.isActive);
    console.log('Password hash exists:', !!admin.password);
    console.log('Password hash length:', admin.password?.length);
    
    // Test password comparison
    const testPassword = 'admin123';
    console.log('\n🔐 Testing password comparison:');
    console.log('Input password:', testPassword);
    
    try {
      const isMatch = await bcryptjs.compare(testPassword, admin.password);
      console.log('Password match:', isMatch);
      
      if (!isMatch) {
        // Try to hash the test password and compare the hashes
        console.log('\n⚠️ Password does not match. Let me check what might be wrong...');
        
        // Test if password was somehow stored as plain text
        if (admin.password === testPassword) {
          console.log('ERROR: Password appears to be stored as plain text!');
          console.log('Fixing: Updating password hash...');
          
          const newHash = await bcryptjs.hash(testPassword, 10);
          admin.password = newHash;
          await admin.save();
          console.log('✓ Password hash updated');
        }
      } else {
        console.log('✓ Password matches correctly!');
      }
    } catch (compareError) {
      console.error('Error comparing password:', compareError.message);
    }

    await mongoose.disconnect();
  } catch (error) {
    console.error('✗ Error:', error.message);
  }
}

testAdminLogin();
