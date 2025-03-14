/**
 * This script tests if the Google Cloud credentials are properly configured
 * Run it with: node scripts/test-credentials.js
 */

const { BigQuery } = require('@google-cloud/bigquery');

// Helper function to create clean BigQuery options
function createBigQueryOptions(projectId, credentials, keyFilename) {
  const options = {
    projectId
  };
  
  if (credentials) {
    // Create a clean copy of credentials without any location/region fields
    const cleanCredentials = { ...credentials };
    
    // Remove any fields that might cause CloudRegion parsing issues
    delete cleanCredentials.location;
    delete cleanCredentials.region;
    delete cleanCredentials.locationPreference;
    
    options.credentials = cleanCredentials;
  }
  
  if (keyFilename) {
    options.keyFilename = keyFilename;
  }
  
  return options;
}

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
  let options;
  
  if (process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON) {
    const credentials = JSON.parse(process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON);
    options = createBigQueryOptions(process.env.PROJECT_ID, credentials);
    console.log('Using options:', JSON.stringify({
      ...options,
      credentials: '**REDACTED**'
    }));
    
    bigquery = new BigQuery(options);
  } else if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
    options = createBigQueryOptions(process.env.PROJECT_ID, null, process.env.GOOGLE_APPLICATION_CREDENTIALS);
    console.log('Using options:', JSON.stringify({
      ...options,
      keyFilename: '**REDACTED**'
    }));
    
    bigquery = new BigQuery(options);
  } else {
    throw new Error('No credentials provided');
  }
  
  console.log('✅ BigQuery client initialized successfully');
  
  // Try a simple query to test connection
  console.log('Testing connection to BigQuery...');
  bigquery.query({ query: 'SELECT 1' })
    .then(() => {
      console.log('✅ Successfully connected to BigQuery');
      
      // Try to access the dataset and table if all IDs are provided
      if (process.env.PROJECT_ID && process.env.DATASET_ID && process.env.TABLE_ID) {
        return bigquery.dataset(process.env.DATASET_ID).table(process.env.TABLE_ID).exists();
      }
      return [false];
    })
    .then(([exists]) => {
      if (exists) {
        console.log(`✅ Table ${process.env.PROJECT_ID}.${process.env.DATASET_ID}.${process.env.TABLE_ID} exists`);
      } else if (process.env.PROJECT_ID && process.env.DATASET_ID && process.env.TABLE_ID) {
        console.log(`❌ Table ${process.env.PROJECT_ID}.${process.env.DATASET_ID}.${process.env.TABLE_ID} does not exist`);
      }
    })
    .catch((error) => {
      console.error('❌ Failed to connect to BigQuery:', error.message);
      console.error('Error details:', error);
      
      if (error.message.includes('CloudRegion')) {
        console.error('\n=== CloudRegion Error Detected ===');
        console.error('This error occurs when the BigQuery client tries to use an invalid region value.');
        console.error('Possible solutions:');
        console.error('1. Remove any location/region fields from your credentials JSON');
        console.error('2. Set BIGQUERY_LOCATION environment variable to a valid region (e.g., "us")');
        console.error('3. Generate a new service account key without location information');
      }
    });
} catch (error) {
  console.error('❌ Failed to initialize BigQuery client:', error.message);
}