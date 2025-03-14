# Fixing "Cannot parse as CloudRegion" Error

This guide provides solutions for the "Cannot parse as CloudRegion" error that can occur when deploying the Leads Export Tool to Render.com.

## Understanding the Error

The error occurs when the BigQuery client tries to use an invalid or empty region value. This typically happens when:

1. Your credentials JSON contains a `location` or `region` field with an invalid value
2. The BigQuery client is trying to use a default location that's not properly formatted
3. There's an empty string being passed as a location value

## Solution 1: Fix Your Credentials JSON

The most common cause of this error is problematic fields in your credentials JSON. Follow these steps to fix it:

### If you have access to your local development environment:

1. Set your credentials as an environment variable:
   ```bash
   export GOOGLE_APPLICATION_CREDENTIALS_JSON='your-credentials-json-here'
   ```

2. Run the fix-credentials script:
   ```bash
   npm run fix-credentials
   ```

3. Copy the fixed JSON output and update your environment variable in Render.com

### If you only have access to Render.com:

1. Go to your service dashboard in Render.com
2. Click on "Environment"
3. Find the `GOOGLE_APPLICATION_CREDENTIALS_JSON` variable
4. Copy its value
5. Create a new file locally with this value
6. Remove any fields named `location`, `region`, or `locationPreference`
7. Update the environment variable in Render.com with the fixed JSON

## Solution 2: Set an Explicit Location

You can also set an explicit location for the BigQuery client:

1. Go to your service dashboard in Render.com
2. Click on "Environment"
3. Add a new environment variable:
   - Key: `BIGQUERY_LOCATION`
   - Value: `us` (or another valid region like `us-central1`)
4. Redeploy your application

## Solution 3: Generate New Credentials

If the above solutions don't work, you can generate new service account credentials:

1. Go to the Google Cloud Console
2. Navigate to "IAM & Admin" > "Service Accounts"
3. Find your service account and create a new key
4. Download the JSON file
5. Update your `GOOGLE_APPLICATION_CREDENTIALS_JSON` environment variable in Render.com

## Verifying the Fix

After applying one of the solutions:

1. Redeploy your application on Render.com
2. Check the deployment logs for any errors
3. Test the application to ensure it can connect to BigQuery

## Need More Help?

If you continue to experience issues, you can:

1. Run the troubleshooting script in your local environment:
   ```bash
   npm run troubleshoot-bigquery
   ```

2. Check the Render.com logs for detailed error messages

3. Contact Google Cloud support if you believe there's an issue with your service account or permissions