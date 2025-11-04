/**
 * Script to check if environment variables are properly configured
 * Run: node scripts/check-env.js
 */

const requiredVars = [
  'KV_REST_API_URL',
  'KV_REST_API_TOKEN',
  'REDIS_URL',
];

console.log('🔍 Checking Environment Variables...\n');

const hasKV = !!process.env.KV_REST_API_URL;
const hasToken = !!process.env.KV_REST_API_TOKEN;
const hasRedisConnectionString = !!process.env.REDIS_URL;

if ((hasKV && hasToken) || hasRedisConnectionString) {
  console.log('✅ Redis is configured!');
  if (hasKV && hasToken) {
    console.log('   Type: Upstash Redis (REST API)');
    console.log(`   URL: ${process.env.KV_REST_API_URL || 'Not set'}`);
    console.log(`   Token: ${process.env.KV_REST_API_TOKEN ? '***' + process.env.KV_REST_API_TOKEN.slice(-4) : 'Not set'}`);
  }
  if (hasRedisConnectionString) {
    console.log('   Type: Redis Cloud (Connection String)');
    const connStr = process.env.REDIS_URL || '';
    // Mask password in connection string
    const masked = connStr.replace(/:(.*?)@/, ':****@');
    console.log(`   URL: ${masked}`);
  }
  console.log('\n✅ Cards will be stored persistently!');
} else {
  console.log('⚠️  Redis not configured');
  console.log('\nMissing variables:');
  if (!hasKV) console.log('   - KV_REST_API_URL');
  if (!hasToken && !hasRedisConnectionString) console.log('   - KV_REST_API_TOKEN');
  if (!hasRedisConnectionString && !hasToken) console.log('   - REDIS_URL (connection string)');
  console.log('\n📝 Cards will only work on the device where they were created.');
  console.log('   To enable cross-device access, set up Redis.');
}

console.log('\n📋 All environment variables:');
requiredVars.forEach(varName => {
  const value = process.env[varName];
  if (value) {
    const displayValue = varName.includes('TOKEN') 
      ? '***' + value.slice(-4)
      : value;
    console.log(`   ${varName}=${displayValue}`);
  }
});

