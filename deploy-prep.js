/**
 * This script helps prepare your Google Cloud credentials for deployment to Render.com
 * It reads your credentials.json file and outputs the content in a format that can be
 * copied directly into the GOOGLE_APPLICATION_CREDENTIALS_JSON environment variable.
 */

const fs = require('fs');
const path = require('path');

// Path to your credentials file
const credentialsPath = path.join(__dirname, 'credentials.json');

try {
  // Read the credentials file
  const credentials = fs.readFileSync(credentialsPath, 'utf8');
  
  // Parse and stringify to ensure it's valid JSON
  const parsedCredentials = JSON.parse(credentials);
  const formattedCredentials = JSON.stringify(parsedCredentials);
  
  console.log('\n=== GOOGLE_APPLICATION_CREDENTIALS_JSON ===\n');
  console.log(formattedCredentials);
  console.log('\n=== Copy the above string to your Render.com environment variables ===\n');
  
  console.log('Deployment preparation complete!');
  console.log('Follow the instructions in DEPLOYMENT.md to deploy your application to Render.com');
} catch (error) {
  console.error('Error preparing credentials for deployment:');
  console.error(error.message);
  console.error('\nMake sure your credentials.json file exists and contains valid JSON.');
}