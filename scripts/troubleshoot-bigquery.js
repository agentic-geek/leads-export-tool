/**
 * This script helps troubleshoot BigQuery connection issues
 * Run it with: node scripts/troubleshoot-bigquery.js
 */

const { BigQuery } = require('@google-cloud/bigquery');

console.log('=== BigQuery Connection Troubleshooter ===');
console.log('This script will help diagnose issues with your BigQuery connection.');

// Check environment variables
console.log('\n=== Environment Variables ===');
const requiredVars = ['PROJECT_ID', 'DATASET_ID', 'TABLE_ID'];
let missingVars = false;

requiredVars.forEach(varName => {
  if (process.env[varName]) {
    console.log(`✅ ${varName}: ${process.env[varName]}`);
  } else {
    console.log(`❌ ${varName} is missing`);
    missingVars = true;
  }
});

// Check credentials
console.log('\n=== Credentials ===');
let credentialsSource = null;
let credentials = null;

if (process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON) {
  console.log('✅ Using credentials from GOOGLE_APPLICATION_CREDENTIALS_JSON');
  credentialsSource = 'json';
  
  try {
    credentials = JSON.parse(process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON);
    console.log('✅ Credentials JSON parsed successfully');
    
    // Check required fields
    if (credentials.client_email && credentials.private_key) {
      console.log('✅ Credentials contain required fields (client_email, private_key)');
      console.log(`   Client email: ${credentials.client_email}`);
      console.log(`   Private key: ${credentials.private_key.substring(0, 15)}...`);
    } else {
      console.log('❌ Credentials missing required fields');
      if (!credentials.client_email) console.log('   - Missing client_email');
      if (!credentials.private_key) console.log('   - Missing private_key');
    }
    
    // Check for problematic fields
    if (credentials.location !== undefined) {
      console.log(`⚠️ Credentials contain 'location' field: ${credentials.location}`);
      console.log('   This might cause CloudRegion parsing issues');
    }
    
    if (credentials.region !== undefined) {
      console.log(`⚠️ Credentials contain 'region' field: ${credentials.region}`);
      console.log('   This might cause CloudRegion parsing issues');
    }
  } catch (error) {
    console.log('❌ Failed to parse credentials JSON:', error.message);
  }
} else if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
  console.log('✅ Using credentials from file:', process.env.GOOGLE_APPLICATION_CREDENTIALS);
  credentialsSource = 'file';
} else {
  console.log('❌ No credentials found. Set GOOGLE_APPLICATION_CREDENTIALS_JSON or GOOGLE_APPLICATION_CREDENTIALS');
}

// Try to connect to BigQuery
console.log('\n=== Connection Test ===');

if (missingVars) {
  console.log('❌ Cannot test connection: Missing required environment variables');
} else if (!credentialsSource) {
  console.log('❌ Cannot test connection: No credentials provided');
} else {
  console.log('Attempting to connect to BigQuery...');
  
  try {
    // Create options without location/region
    const options = { projectId: process.env.PROJECT_ID };
    
    if (credentialsSource === 'json') {
      // Create a clean copy of credentials
      const cleanCredentials = { ...credentials };
      delete cleanCredentials.location;
      delete cleanCredentials.region;
      options.credentials = cleanCredentials;
    } else {
      options.keyFilename = process.env.GOOGLE_APPLICATION_CREDENTIALS;
    }
    
    console.log('BigQuery options:', JSON.stringify({
      ...options,
      credentials: options.credentials ? '**REDACTED**' : undefined,
      keyFilename: options.keyFilename ? '**REDACTED**' : undefined
    }));
    
    const bigquery = new BigQuery(options);
    
    // Test with a simple query
    bigquery.query({ query: 'SELECT 1' })
      .then(() => {
        console.log('✅ Successfully connected to BigQuery');
        
        // Try to access the dataset and table
        return bigquery.dataset(process.env.DATASET_ID).table(process.env.TABLE_ID).exists();
      })
      .then(([exists]) => {
        if (exists) {
          console.log(`✅ Table ${process.env.PROJECT_ID}.${process.env.DATASET_ID}.${process.env.TABLE_ID} exists`);
        } else {
          console.log(`❌ Table ${process.env.PROJECT_ID}.${process.env.DATASET_ID}.${process.env.TABLE_ID} does not exist`);
        }
      })
      .catch(error => {
        console.log('❌ Failed to access table:', error.message);
      });
  } catch (error) {
    console.log('❌ Failed to initialize BigQuery client:', error.message);
  }
}

console.log('\n=== Troubleshooting Tips ===');
console.log('1. If you see "Cannot parse as CloudRegion" errors:');
console.log('   - Make sure your credentials JSON does not contain location/region fields');
console.log('   - Try setting BIGQUERY_LOCATION=null explicitly');
console.log('2. If you have authentication issues:');
console.log('   - Verify that your service account has the necessary permissions');
console.log('   - Check that your private key is correctly formatted (including newlines)');
console.log('3. If you cannot access the table:');
console.log('   - Double-check PROJECT_ID, DATASET_ID, and TABLE_ID values');
console.log('   - Ensure your service account has access to the dataset and table');