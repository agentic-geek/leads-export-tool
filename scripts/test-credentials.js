/**
 * This script tests if the Google Cloud credentials are properly configured
 * Run it with: node scripts/test-credentials.js
 */

const { BigQuery } = require('@google-cloud/bigquery');

// Check if credentials are provided as environment variable
if (process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON) {
  console.log('✅ GOOGLE_APPLICATION_CREDENTIALS_JSON environment variable is set');
  
  try {
    // Try to parse the JSON
    const credentials = JSON.parse(process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON);
    console.log('✅ Credentials JSON is valid');
    
    // Check for required fields
    if (credentials.client_email && credentials.private_key) {
      console.log('✅ Credentials contain required fields (client_email, private_key)');
    } else {
      console.error('❌ Credentials missing required fields');
      if (!credentials.client_email) console.error('   - Missing client_email');
      if (!credentials.private_key) console.error('   - Missing private_key');
    }
  } catch (error) {
    console.error('❌ Failed to parse credentials JSON:', error.message);
  }
} else if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
  console.log('✅ GOOGLE_APPLICATION_CREDENTIALS environment variable is set');
  console.log(`   Path: ${process.env.GOOGLE_APPLICATION_CREDENTIALS}`);
} else {
  console.error('❌ No Google Cloud credentials found in environment variables');
}

// Check if project ID is set
if (process.env.PROJECT_ID) {
  console.log(`✅ PROJECT_ID is set: ${process.env.PROJECT_ID}`);
} else {
  console.error('❌ PROJECT_ID environment variable is not set');
}

// Check if dataset ID is set
if (process.env.DATASET_ID) {
  console.log(`✅ DATASET_ID is set: ${process.env.DATASET_ID}`);
} else {
  console.error('❌ DATASET_ID environment variable is not set');
}

// Check if table ID is set
if (process.env.TABLE_ID) {
  console.log(`✅ TABLE_ID is set: ${process.env.TABLE_ID}`);
} else {
  console.error('❌ TABLE_ID environment variable is not set');
}

// Try to initialize BigQuery client
try {
  let bigquery;
  
  if (process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON) {
    const credentials = JSON.parse(process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON);
    bigquery = new BigQuery({
      projectId: process.env.PROJECT_ID,
      credentials,
    });
  } else {
    bigquery = new BigQuery({
      projectId: process.env.PROJECT_ID,
      keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS,
    });
  }
  
  console.log('✅ BigQuery client initialized successfully');
  
  // Try a simple query to test connection
  console.log('Testing connection to BigQuery...');
  bigquery.query({ query: 'SELECT 1' })
    .then(() => {
      console.log('✅ Successfully connected to BigQuery');
    })
    .catch((error) => {
      console.error('❌ Failed to connect to BigQuery:', error.message);
    });
} catch (error) {
  console.error('❌ Failed to initialize BigQuery client:', error.message);
}