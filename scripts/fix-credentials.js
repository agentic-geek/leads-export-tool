/**
 * This script fixes CloudRegion issues in Google Cloud credentials
 * Run it with: node scripts/fix-credentials.js
 */

// Check if credentials are provided
if (!process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON) {
  console.error('❌ GOOGLE_APPLICATION_CREDENTIALS_JSON environment variable is not set');
  console.error('This script requires the credentials JSON to be set as an environment variable.');
  process.exit(1);
}

try {
  // Parse the credentials JSON
  const credentials = JSON.parse(process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON);
  console.log('✅ Credentials JSON parsed successfully');
  
  // Check for required fields
  if (!credentials.client_email || !credentials.private_key) {
    console.error('❌ Credentials missing required fields');
    if (!credentials.client_email) console.error('   - Missing client_email');
    if (!credentials.private_key) console.error('   - Missing private_key');
    process.exit(1);
  }
  
  // Create a clean copy of credentials
  const cleanCredentials = { ...credentials };
  let modified = false;
  
  // Remove problematic fields
  const problematicFields = ['location', 'region', 'locationPreference', 'zone'];
  
  problematicFields.forEach(field => {
    if (cleanCredentials[field] !== undefined) {
      console.log(`🔧 Removing '${field}' field: ${cleanCredentials[field]}`);
      delete cleanCredentials[field];
      modified = true;
    }
  });
  
  // Check for nested location fields
  if (cleanCredentials.resource && cleanCredentials.resource.location) {
    console.log(`🔧 Removing nested 'resource.location' field: ${cleanCredentials.resource.location}`);
    delete cleanCredentials.resource.location;
    modified = true;
  }
  
  if (!modified) {
    console.log('✅ No problematic fields found in credentials');
  } else {
    console.log('✅ Problematic fields removed from credentials');
  }
  
  // Output the fixed credentials
  console.log('\n=== Fixed Credentials JSON ===');
  console.log(JSON.stringify(cleanCredentials));
  console.log('\n=== Instructions ===');
  console.log('1. Copy the JSON above (everything between the === lines)');
  console.log('2. Update your GOOGLE_APPLICATION_CREDENTIALS_JSON environment variable in Render.com with this value');
  console.log('3. Redeploy your application');
  
} catch (error) {
  console.error('❌ Failed to parse credentials JSON:', error.message);
  process.exit(1);
}