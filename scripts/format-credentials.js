/**
 * This script helps format Google Cloud credentials for use in Render.com environment variables
 * Run it with: node scripts/format-credentials.js path/to/credentials.json
 */

const fs = require('fs');

// Check if a file path was provided
if (process.argv.length < 3) {
  console.error('Please provide the path to your credentials.json file');
  console.error('Usage: node scripts/format-credentials.js path/to/credentials.json');
  process.exit(1);
}

const credentialsPath = process.argv[2];

try {
  // Read the credentials file
  const credentialsContent = fs.readFileSync(credentialsPath, 'utf8');
  
  // Parse the JSON to validate it
  const credentials = JSON.parse(credentialsContent);
  
  // Check for required fields
  if (!credentials.client_email) {
    console.warn('Warning: credentials.json is missing client_email field');
  }
  
  if (!credentials.private_key) {
    console.warn('Warning: credentials.json is missing private_key field');
  }
  
  // Format the credentials as a single line JSON string
  const formattedCredentials = JSON.stringify(credentials);
  
  console.log('\n=== Formatted Credentials for Render.com ===\n');
  console.log(formattedCredentials);
  console.log('\n=== End of Formatted Credentials ===\n');
  
  console.log('Instructions:');
  console.log('1. Copy the entire string above (between the === markers)');
  console.log('2. In Render.com, add an environment variable named GOOGLE_APPLICATION_CREDENTIALS_JSON');
  console.log('3. Paste the copied string as the value');
  console.log('4. Make sure to also set PROJECT_ID, DATASET_ID, and TABLE_ID environment variables');
  
} catch (error) {
  if (error.code === 'ENOENT') {
    console.error(`Error: File not found at ${credentialsPath}`);
  } else if (error instanceof SyntaxError) {
    console.error('Error: Invalid JSON in credentials file');
  } else {
    console.error('Error:', error.message);
  }
  process.exit(1);
}