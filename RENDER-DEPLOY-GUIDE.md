# Step-by-Step Render.com Deployment Guide

Follow these exact steps to deploy your Leads Export Tool to Render.com:

## 1. Prepare Your Google Cloud Credentials

The most common issue with deployment is improperly formatted Google Cloud credentials. Follow these steps carefully:

1. Clone the repository to your local machine if you haven't already:
   ```
   git clone https://github.com/agentic-geek/leads-export-tool.git
   cd leads-export-tool
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Use the provided script to format your credentials properly:
   ```
   npm run format-credentials path/to/your/credentials.json
   ```

4. The script will output a properly formatted JSON string. Copy this entire string (it should be a single line with no line breaks).

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
5. `GOOGLE_APPLICATION_CREDENTIALS_JSON` = Paste the entire formatted JSON string from step 1

**IMPORTANT**: Make sure the JSON in `GOOGLE_APPLICATION_CREDENTIALS_JSON` is properly formatted. It should be a single line with no line breaks, and all quotes should be properly escaped. Use the `format-credentials.js` script to ensure proper formatting.

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

## Troubleshooting Credentials Issues

If you see the error "Could not load the default credentials", follow these steps:

1. **Check your credentials format**:
   - Make sure you used the `format-credentials.js` script to format your credentials
   - Verify that the `GOOGLE_APPLICATION_CREDENTIALS_JSON` environment variable contains the entire JSON string
   - Check that there are no line breaks or extra spaces in the JSON string

2. **Verify required fields**:
   - Your credentials JSON must contain `client_email` and `private_key` fields
   - The `private_key` should start with `-----BEGIN PRIVATE KEY-----` and end with `-----END PRIVATE KEY-----`

3. **Check environment variables**:
   - Verify that `PROJECT_ID`, `DATASET_ID`, and `TABLE_ID` are set correctly
   - These values should match your Google Cloud project configuration

4. **Test locally before deploying**:
   ```
   # Set environment variables locally
   export PROJECT_ID=your-project-id
   export DATASET_ID=your-dataset-id
   export TABLE_ID=your-table-id
   export GOOGLE_APPLICATION_CREDENTIALS=path/to/your/credentials.json
   
   # Run the application
   npm run dev
   ```

5. **Check permissions**:
   - Make sure the service account in your credentials has the necessary permissions to access BigQuery
   - The service account should have at least the "BigQuery Data Viewer" role

If you continue to experience issues, refer to the troubleshooting section in the DEPLOYMENT.md file for more detailed guidance.