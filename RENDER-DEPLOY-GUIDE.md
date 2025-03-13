# Step-by-Step Render.com Deployment Guide

Follow these exact steps to deploy your Leads Export Tool to Render.com:

## 1. Prepare Your Google Cloud Credentials

1. Open your `credentials.json` file
2. Copy the entire contents (you'll need this for step 3)
3. Make sure the credentials JSON is properly formatted and contains all required fields:
   - `client_email`
   - `private_key`
   - `project_id`
   - Other required fields

## 2. Log in to Render.com

1. Go to [https://dashboard.render.com/](https://dashboard.render.com/)
2. Log in to your account or create a new one

## 3. Create a New Web Service

1. Click the "New +" button in the top right corner
2. Select "Web Service" from the dropdown menu
3. Connect your GitHub repository (you may need to authorize Render to access your GitHub account)
4. Find and select the "leads-export-tool" repository

## 4. Configure the Web Service

Fill in the following configuration details:

- **Name**: leads-export-tool (or your preferred name)
- **Environment**: Node
- **Region**: Choose the region closest to your users
- **Branch**: main
- **Build Command**: `chmod +x render-build.sh && ./render-build.sh`
- **Start Command**: `npm start`
- **Plan**: Free (or select a paid plan if needed)

## 5. Add Environment Variables

Click "Advanced" and then "Add Environment Variable" for each of these:

1. `NODE_ENV` = `production`
2. `PROJECT_ID` = Your Google Cloud project ID
3. `DATASET_ID` = Your BigQuery dataset ID
4. `TABLE_ID` = Your BigQuery table ID
5. `GOOGLE_APPLICATION_CREDENTIALS_JSON` = Paste the entire contents of your credentials.json file

**Important**: Make sure the JSON in `GOOGLE_APPLICATION_CREDENTIALS_JSON` is properly formatted. It should be a single line with no line breaks, and all quotes should be properly escaped.

## 6. Create Web Service

Click the "Create Web Service" button at the bottom of the page.

## 7. Monitor the Deployment

1. Render will now start building and deploying your application
2. You can monitor the progress in the "Events" tab
3. The build script will automatically test your Google Cloud credentials
4. If you encounter any errors, check the logs for details

## 8. Test Your Deployed Application

1. Once deployment is complete, Render will provide you with a URL (e.g., `https://leads-export-tool.onrender.com`)
2. Visit the URL to ensure your application is working correctly
3. Test the industry dropdown, company name filtering, and export functionality

## Troubleshooting

If you encounter any issues during deployment:

1. **Check the build logs** in the "Events" tab for specific error messages
2. **Verify environment variables** are set correctly
3. **Test your credentials locally** before deploying:
   ```
   # Set environment variables locally
   export PROJECT_ID=your-project-id
   export DATASET_ID=your-dataset-id
   export TABLE_ID=your-table-id
   export GOOGLE_APPLICATION_CREDENTIALS_JSON='{"type":"service_account",...}'
   
   # Run the test script
   npm run test-credentials
   ```
4. **Try redeploying** by clicking the "Manual Deploy" button and selecting "Clear build cache & deploy"

If you continue to experience issues, refer to the troubleshooting section in the DEPLOYMENT.md file for more detailed guidance.