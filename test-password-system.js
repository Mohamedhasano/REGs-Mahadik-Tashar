/**
 * Password System Test Script
 * Tests all password management endpoints
 */

const axios = require('axios');

const API_URL = 'http://localhost:5000/api';

// Colors for terminal output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

// Test credentials
const TEST_USER = {
  email: 'test@example.com',
  password: 'password123',
  name: 'Test User'
};

let authToken = '';

// Helper functions
function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function logSuccess(message) {
  log(`✅ ${message}`, 'green');
}

function logError(message) {
  log(`❌ ${message}`, 'red');
}

function logInfo(message) {
  log(`ℹ️  ${message}`, 'cyan');
}

function logWarning(message) {
  log(`⚠️  ${message}`, 'yellow');
}

function logTest(testName) {
  log(`\n${'='.repeat(60)}`, 'blue');
  log(`🧪 TEST: ${testName}`, 'blue');
  log('='.repeat(60), 'blue');
}

// Test 1: Login to get token
async function testLogin() {
  logTest('Login to get authentication token');
  
  try {
    const response = await axios.post(`${API_URL}/auth/login`, {
      email: TEST_USER.email,
      password: TEST_USER.password
    });
    
    authToken = response.data.token;
    logSuccess('Login successful');
    logInfo(`Token: ${authToken.substring(0, 20)}...`);
    return true;
  } catch (error) {
    if (error.response?.status === 401) {
      logWarning('User not found - attempting to register...');
      return await testRegister();
    }
    logError(`Login failed: ${error.response?.data?.message || error.message}`);
    return false;
  }
}

// Test 1b: Register if user doesn't exist
async function testRegister() {
  logTest('Register new user');
  
  try {
    const response = await axios.post(`${API_URL}/auth/register`, {
      email: TEST_USER.email,
      password: TEST_USER.password,
      name: TEST_USER.name
    });
    
    authToken = response.data.token;
    logSuccess('Registration successful');
    logInfo(`Token: ${authToken.substring(0, 20)}...`);
    return true;
  } catch (error) {
    logError(`Registration failed: ${error.response?.data?.message || error.message}`);
    return false;
  }
}

// Test 2: Get password info
async function testGetPasswordInfo() {
  logTest('Get Password Info');
  
  try {
    const response = await axios.get(`${API_URL}/password/info`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    
    logSuccess('Password info retrieved');
    logInfo(`Last Changed: ${response.data.lastChanged}`);
    logInfo(`Days Since Change: ${response.data.daysSinceChange}`);
    logInfo(`Message: ${response.data.message}`);
    return true;
  } catch (error) {
    logError(`Failed: ${error.response?.data?.message || error.message}`);
    return false;
  }
}

// Test 3: Change password - SUCCESS
async function testChangePasswordSuccess() {
  logTest('Change Password - Valid Request');
  
  const newPassword = 'newpassword456';
  
  try {
    const response = await axios.post(`${API_URL}/password/change`, {
      currentPassword: TEST_USER.password,
      newPassword: newPassword,
      confirmPassword: newPassword
    }, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    
    logSuccess('Password changed successfully');
    logInfo(`Message: ${response.data.message}`);
    
    // Update TEST_USER password for next tests
    TEST_USER.password = newPassword;
    
    return true;
  } catch (error) {
    logError(`Failed: ${error.response?.data?.message || error.message}`);
    return false;
  }
}

// Test 4: Change password - WRONG CURRENT PASSWORD
async function testChangePasswordWrongCurrent() {
  logTest('Change Password - Wrong Current Password');
  
  try {
    await axios.post(`${API_URL}/password/change`, {
      currentPassword: 'wrongpassword',
      newPassword: 'anotherpassword',
      confirmPassword: 'anotherpassword'
    }, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    
    logError('Should have failed but succeeded!');
    return false;
  } catch (error) {
    if (error.response?.status === 401 && error.response?.data?.message.includes('incorrect')) {
      logSuccess('Correctly rejected wrong current password');
      logInfo(`Error Message: ${error.response.data.message}`);
      return true;
    }
    logError(`Unexpected error: ${error.response?.data?.message || error.message}`);
    return false;
  }
}

// Test 5: Change password - PASSWORDS DON'T MATCH
async function testChangePasswordMismatch() {
  logTest('Change Password - Passwords Don\'t Match');
  
  try {
    await axios.post(`${API_URL}/password/change`, {
      currentPassword: TEST_USER.password,
      newPassword: 'password789',
      confirmPassword: 'password999'
    }, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    
    logError('Should have failed but succeeded!');
    return false;
  } catch (error) {
    if (error.response?.status === 400 && error.response?.data?.message.includes('do not match')) {
      logSuccess('Correctly rejected mismatched passwords');
      logInfo(`Error Message: ${error.response.data.message}`);
      return true;
    }
    logError(`Unexpected error: ${error.response?.data?.message || error.message}`);
    return false;
  }
}

// Test 6: Change password - TOO SHORT
async function testChangePasswordTooShort() {
  logTest('Change Password - Password Too Short');
  
  try {
    await axios.post(`${API_URL}/password/change`, {
      currentPassword: TEST_USER.password,
      newPassword: 'short',
      confirmPassword: 'short'
    }, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    
    logError('Should have failed but succeeded!');
    return false;
  } catch (error) {
    if (error.response?.status === 400 && error.response?.data?.message.includes('at least 6')) {
      logSuccess('Correctly rejected short password');
      logInfo(`Error Message: ${error.response.data.message}`);
      return true;
    }
    logError(`Unexpected error: ${error.response?.data?.message || error.message}`);
    return false;
  }
}

// Test 7: Change password - SAME AS CURRENT
async function testChangePasswordSameAsCurrent() {
  logTest('Change Password - Same As Current Password');
  
  try {
    await axios.post(`${API_URL}/password/change`, {
      currentPassword: TEST_USER.password,
      newPassword: TEST_USER.password,
      confirmPassword: TEST_USER.password
    }, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    
    logError('Should have failed but succeeded!');
    return false;
  } catch (error) {
    if (error.response?.status === 400 && error.response?.data?.message.includes('different')) {
      logSuccess('Correctly rejected same password');
      logInfo(`Error Message: ${error.response.data.message}`);
      return true;
    }
    logError(`Unexpected error: ${error.response?.data?.message || error.message}`);
    return false;
  }
}

// Test 8: Change password - MISSING FIELDS
async function testChangePasswordMissingFields() {
  logTest('Change Password - Missing Fields');
  
  try {
    await axios.post(`${API_URL}/password/change`, {
      currentPassword: TEST_USER.password,
      newPassword: 'newpass123'
      // Missing confirmPassword
    }, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    
    logError('Should have failed but succeeded!');
    return false;
  } catch (error) {
    if (error.response?.status === 400 && error.response?.data?.message.includes('required')) {
      logSuccess('Correctly rejected missing fields');
      logInfo(`Error Message: ${error.response.data.message}`);
      return true;
    }
    logError(`Unexpected error: ${error.response?.data?.message || error.message}`);
    return false;
  }
}

// Test 9: Change password - NO AUTH TOKEN
async function testChangePasswordNoAuth() {
  logTest('Change Password - No Authentication Token');
  
  try {
    await axios.post(`${API_URL}/password/change`, {
      currentPassword: TEST_USER.password,
      newPassword: 'newpass789',
      confirmPassword: 'newpass789'
    });
    
    logError('Should have failed but succeeded!');
    return false;
  } catch (error) {
    if (error.response?.status === 401) {
      logSuccess('Correctly rejected unauthenticated request');
      logInfo(`Error Message: ${error.response?.data?.message || 'Unauthorized'}`);
      return true;
    }
    logError(`Unexpected error: ${error.response?.data?.message || error.message}`);
    return false;
  }
}

// Test 10: Verify password was changed (try login with new password)
async function testVerifyPasswordChanged() {
  logTest('Verify Password Was Changed (Login with new password)');
  
  try {
    const response = await axios.post(`${API_URL}/auth/login`, {
      email: TEST_USER.email,
      password: TEST_USER.password // Should be the new password
    });
    
    logSuccess('Login successful with new password');
    logInfo('Password change was persisted in database');
    return true;
  } catch (error) {
    logError(`Failed to login with new password: ${error.response?.data?.message || error.message}`);
    return false;
  }
}

// Run all tests
async function runAllTests() {
  log('\n' + '='.repeat(80), 'cyan');
  log('🔐 PASSWORD MANAGEMENT SYSTEM - COMPREHENSIVE TEST SUITE', 'cyan');
  log('='.repeat(80) + '\n', 'cyan');
  
  const results = {
    passed: 0,
    failed: 0,
    total: 0
  };
  
  const tests = [
    { name: 'Login/Register', fn: testLogin },
    { name: 'Get Password Info', fn: testGetPasswordInfo },
    { name: 'Change Password (Success)', fn: testChangePasswordSuccess },
    { name: 'Wrong Current Password', fn: testChangePasswordWrongCurrent },
    { name: 'Passwords Mismatch', fn: testChangePasswordMismatch },
    { name: 'Password Too Short', fn: testChangePasswordTooShort },
    { name: 'Same As Current', fn: testChangePasswordSameAsCurrent },
    { name: 'Missing Fields', fn: testChangePasswordMissingFields },
    { name: 'No Authentication', fn: testChangePasswordNoAuth },
    { name: 'Verify Change Persisted', fn: testVerifyPasswordChanged },
  ];
  
  for (const test of tests) {
    results.total++;
    const success = await test.fn();
    if (success) {
      results.passed++;
    } else {
      results.failed++;
    }
    
    // Wait a bit between tests
    await new Promise(resolve => setTimeout(resolve, 500));
  }
  
  // Print summary
  log('\n' + '='.repeat(80), 'cyan');
  log('📊 TEST SUMMARY', 'cyan');
  log('='.repeat(80), 'cyan');
  log(`\nTotal Tests: ${results.total}`, 'blue');
  log(`Passed: ${results.passed}`, 'green');
  log(`Failed: ${results.failed}`, results.failed === 0 ? 'green' : 'red');
  log(`Success Rate: ${((results.passed / results.total) * 100).toFixed(1)}%`, results.failed === 0 ? 'green' : 'yellow');
  
  if (results.failed === 0) {
    log('\n🎉 ALL TESTS PASSED! PASSWORD SYSTEM IS WORKING PERFECTLY! 🎉\n', 'green');
  } else {
    log(`\n⚠️  ${results.failed} TEST(S) FAILED. PLEASE CHECK THE LOGS ABOVE.\n`, 'red');
  }
  
  log('='.repeat(80) + '\n', 'cyan');
}

// Run tests
runAllTests().catch(error => {
  logError(`\n❌ Test suite crashed: ${error.message}`);
  console.error(error);
  process.exit(1);
});

