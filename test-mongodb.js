// MongoDB Connection Test
// استخدم هذا الملف لاختبار الاتصال

const mongoose = require('mongoose');

// ضع Connection String هنا
const MONGODB_URI = 'mongodb+srv://regs_admin:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/regs-global?retryWrites=true&w=majority';

console.log('🔄 Testing MongoDB connection...');
console.log('');

mongoose.connect(MONGODB_URI, {
  serverSelectionTimeoutMS: 5000
})
.then(() => {
  console.log('✅ SUCCESS! MongoDB Connected!');
  console.log('📍 Host:', mongoose.connection.host);
  console.log('📊 Database:', mongoose.connection.name);
  console.log('');
  console.log('🎉 Your MongoDB Atlas is working perfectly!');
  process.exit(0);
})
.catch((err) => {
  console.log('❌ ERROR: Could not connect to MongoDB');
  console.log('');
  console.log('Error details:', err.message);
  console.log('');
  console.log('💡 Common issues:');
  console.log('1. Wrong password in connection string');
  console.log('2. IP not whitelisted (use 0.0.0.0/0)');
  console.log('3. Cluster URL incorrect');
  console.log('4. Database user not created');
  console.log('');
  process.exit(1);
});

