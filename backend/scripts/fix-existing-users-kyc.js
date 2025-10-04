/**
 * Script to fix existing users' KYC status
 * Run this to reset all users to unverified status
 * 
 * Usage:
 *   cd backend
 *   node scripts/fix-existing-users-kyc.js
 */

const mongoose = require('mongoose');
require('dotenv').config();

const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/regs-global';

// User Schema (minimal)
const userSchema = new mongoose.Schema({
  email: String,
  name: String,
  isVerified: Boolean,
  kycStatus: String,
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

async function fixExistingUsers() {
  try {
    console.log('🔄 Connecting to MongoDB...');
    await mongoose.connect(mongoURI);
    console.log('✅ Connected to MongoDB\n');

    // Count users before update
    const totalUsers = await User.countDocuments();
    const incorrectUsers = await User.countDocuments({
      isVerified: true,
      kycStatus: { $ne: 'approved' }
    });

    console.log(`📊 Database Statistics:`);
    console.log(`   Total users: ${totalUsers}`);
    console.log(`   Users with incorrect status: ${incorrectUsers}\n`);

    if (incorrectUsers === 0) {
      console.log('✅ No users need fixing. All statuses are correct!');
      process.exit(0);
    }

    console.log('🔧 Fixing user statuses...\n');

    // Fix OAuth users who are verified but KYC is pending
    const result = await User.updateMany(
      {
        isVerified: true,
        kycStatus: { $ne: 'approved' }
      },
      {
        $set: {
          isVerified: false
        }
      }
    );

    console.log('✅ Fix completed!');
    console.log(`   Modified ${result.modifiedCount} users\n`);

    // Show updated statistics
    const updatedStats = {
      pending: await User.countDocuments({ kycStatus: 'pending', isVerified: false }),
      approved: await User.countDocuments({ kycStatus: 'approved', isVerified: true }),
      rejected: await User.countDocuments({ kycStatus: 'rejected', isVerified: false })
    };

    console.log('📊 Updated Statistics:');
    console.log(`   Pending KYC (unverified): ${updatedStats.pending}`);
    console.log(`   Approved KYC (verified): ${updatedStats.approved}`);
    console.log(`   Rejected KYC (unverified): ${updatedStats.rejected}\n`);

    console.log('🎉 All done! Users now have correct KYC status.');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log('\n👋 Disconnected from MongoDB');
    process.exit(0);
  }
}

// Run the fix
fixExistingUsers();

