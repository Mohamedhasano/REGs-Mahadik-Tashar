/**
 * Test Zakat Calculator API
 * 
 * Run this script to test if the Zakat API is working:
 * node test-zakat-api.js
 */

const API_URL = 'http://localhost:5000/api';

async function testNisabAPI() {
  console.log('\n🧪 Testing Nisab API...');
  console.log('GET /api/zakat/nisab');
  
  try {
    const response = await fetch(`${API_URL}/zakat/nisab`);
    const data = await response.json();
    
    if (response.ok) {
      console.log('✅ SUCCESS!');
      console.log('   Gold Price:', data.metalPrices.gold.pricePerGram, 'USD/gram');
      console.log('   Silver Price:', data.metalPrices.silver.pricePerGram, 'USD/gram');
      console.log('   Gold Nisab:', data.nisab.gold.valueUSD, 'USD');
      console.log('   Silver Nisab:', data.nisab.silver.valueUSD, 'USD');
      console.log('   Zakat Rate:', data.zakatRate);
      return true;
    } else {
      console.log('❌ FAILED!');
      console.log('   Status:', response.status);
      console.log('   Error:', data.message);
      return false;
    }
  } catch (error) {
    console.log('❌ ERROR!');
    console.log('   ', error.message);
    console.log('   ⚠️  Make sure backend is running on port 5000');
    return false;
  }
}

async function testCalculateAPI() {
  console.log('\n🧪 Testing Calculate Zakat API...');
  console.log('POST /api/zakat/calculate');
  console.log('⚠️  This requires authentication (JWT token)');
  console.log('💡 Test this manually from the frontend after logging in');
  
  // Example curl command
  console.log('\n📝 Example curl command:');
  console.log('curl -X POST http://localhost:5000/api/zakat/calculate \\');
  console.log('  -H "Content-Type: application/json" \\');
  console.log('  -H "Authorization: Bearer YOUR_JWT_TOKEN" \\');
  console.log('  -d \'{"assets":[{"type":"crypto","name":"Bitcoin","amount":0.5,"valueUSD":25000}],"nisabType":"silver","hawlCompleted":true}\'');
}

async function runTests() {
  console.log('================================================');
  console.log('   🕌 ZAKAT CALCULATOR API TEST');
  console.log('================================================');
  console.log('   حاسبة الزكاة - اختبار الـ API');
  console.log('================================================\n');
  
  // Test 1: Nisab API (public endpoint)
  const nisabResult = await testNisabAPI();
  
  // Test 2: Calculate API (protected endpoint)
  await testCalculateAPI();
  
  console.log('\n================================================');
  console.log('   📊 TEST SUMMARY');
  console.log('================================================');
  console.log('   Nisab API:', nisabResult ? '✅ WORKING' : '❌ FAILED');
  console.log('   Calculate API: 🔒 Requires Login (test from frontend)');
  console.log('================================================\n');
  
  if (nisabResult) {
    console.log('✅ Backend API is working!');
    console.log('💡 Next steps:');
    console.log('   1. Open: http://localhost:5173/zakat-calculator');
    console.log('   2. Login if not already');
    console.log('   3. Add assets and calculate Zakat');
  } else {
    console.log('❌ Backend not responding!');
    console.log('💡 Solutions:');
    console.log('   1. Make sure backend is running: cd backend && npm run dev');
    console.log('   2. Check MongoDB is connected');
    console.log('   3. Check port 5000 is not in use');
  }
  
  console.log('\n🕌 الحمد لله - May your Zakat be accepted! 💰\n');
}

// Run tests
runTests();

