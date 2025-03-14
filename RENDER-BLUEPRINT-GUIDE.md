# Deploying with Render Blueprint (render.yaml)

This guide will walk you through deploying the Executive Leads Export Tool to Render.com using the Blueprint feature (render.yaml).

## Prerequisites

1. A GitHub account with your code pushed to a repository
2. A Render.com account (free tier is available)
3. Your Google Cloud Platform service account credentials

## Step 1: Prepare Your Google Cloud Credentials

Before deploying, you need to format your Google Cloud credentials properly:

1. Make sure you have a valid `credentials.json` file with the following structure:
   ```json
   {
     "type": "service_account",
     "project_id": "bigquery-project-452507",
     "private_key_id": "YOUR_PRIVATE_KEY_ID",
     "private_key": "YOUR_PRIVATE_KEY",
     "client_email": "YOUR_CLIENT_EMAIL",
     "client_id": "YOUR_CLIENT_ID",
     "auth_uri": "https://accounts.google.com/o/oauth2/auth",
     "token_uri": "https://oauth2.googleapis.com/token",
     "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
     "client_x509_cert_url": "YOUR_CLIENT_CERT_URL",
     "universe_domain": "googleapis.com"
   }
   ```

2. Format your credentials for Render.com:
   ```
   npm run format-credentials path/to/your/credentials.json
   ```

3. Copy the formatted JSON string (it will be a single line with no line breaks)

## Step 2: Deploy Using Render Blueprint

1. Log in to your [Render.com dashboard](https://dashboard.render.com/)

2. Click the "New +" button in the top right corner

3. Select "Blueprint" from the dropdown menu

4. Connect your GitHub repository (you may need to authorize Render to access your GitHub account)

5. Find and select the "leads-export-tool" repository

6. Render will detect the `render.yaml` file and show you the services it will create

7. Click "Apply" to proceed

## Step 3: Configure Environment Variables

After creating the service, you need to set up the environment variables:

1. Once the service is created, click on it to go to its dashboard

2. Click on "Environment" in the left sidebar

3. You'll need to set the following environment variables:
   - `PROJECT_ID`: Your Google Cloud project ID (should be pre-filled with "bigquery-project-452507")
   - `DATASET_ID`: Your BigQuery dataset ID
   - `TABLE_ID`: Your BigQuery table ID
   - `GOOGLE_APPLICATION_CREDENTIALS_JSON`: Paste the formatted JSON string from Step 1

4. Click "Save Changes"

## Step 4: Trigger a Manual Deploy

1. Go to the "Deploys" tab in the left sidebar

2. Click "Manual Deploy" and select "Clear build cache & deploy"

3. Monitor the build logs for any issues

## Step 5: Test Your Deployed Application

1. Once deployment is complete, Render will provide you with a URL (e.g., `https://leads-export-tool.onrender.com`)

2. Visit the URL to ensure your application is working correctly

3. Test the industry dropdown, company name filtering, and export functionality

## Troubleshooting

If you encounter any issues during deployment:

1. **Check the build logs** in the "Events" tab for specific error messages

2. **Verify environment variables** are set correctly:
   - Make sure `GOOGLE_APPLICATION_CREDENTIALS_JSON` contains the entire JSON string
   - Verify that `PROJECT_ID`, `DATASET_ID`, and `TABLE_ID` are set correctly

3. **Check credentials format**:
   - The JSON string should be a single line with no line breaks
   - All quotes should be properly escaped
   - The `private_key` should include the entire key including `-----BEGIN PRIVATE KEY-----` and `-----END PRIVATE KEY-----`

4. **Test your credentials locally** before deploying:
   ```
   # Set environment variables locally
   export PROJECT_ID=your-project-id
   export DATASET_ID=your-dataset-id
   export TABLE_ID=your-table-id
   export GOOGLE_APPLICATION_CREDENTIALS=path/to/your/credentials.json
   
   # Run the test script
   npm run test-credentials
   ```

5. If you continue to experience issues, try deploying manually using the steps in [RENDER-DEPLOY-GUIDE.md](RENDER-DEPLOY-GUIDE.md)