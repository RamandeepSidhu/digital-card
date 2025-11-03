/**
 * Script to check if environment variables are properly configured
 * Run: node scripts/check-env.js
 */

const requiredVars = [
  'KV_REST_API_URL',
  'KV_REST_API_TOKEN',
  // Alternative names
  'UPSTASH_REDIS_REST_URL',
  'UPSTASH_REDIS_REST_TOKEN',
];

console.log('🔍 Checking Environment Variables...\n');

const hasKV = !!(process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL);
const hasToken = !!(process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN);

if (hasKV && hasToken) {
  console.log('✅ Redis/KV is configured!');
  console.log(`   URL: ${process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL || 'Not set'}`);
  console.log(`   Token: ${process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN ? '***' + (process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN).slice(-4) : 'Not set'}`);
  console.log('\n✅ Cards will be stored persistently!');
} else {
  console.log('⚠️  Redis/KV not configured');
  console.log('\nMissing variables:');
  if (!hasKV) console.log('   - KV_REST_API_URL or UPSTASH_REDIS_REST_URL');
  if (!hasToken) console.log('   - KV_REST_API_TOKEN or UPSTASH_REDIS_REST_TOKEN');
  console.log('\n📝 Cards will only work on the device where they were created.');
  console.log('   To enable cross-device access, set up Upstash Redis in Vercel.');
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

