# Deploying to Render.com

This guide will walk you through deploying the Executive Leads Export Tool to Render.com.

## Prerequisites

1. A GitHub account with your code pushed to a repository
2. A Render.com account (free tier is available)
3. Your Google Cloud Platform service account credentials

## Deployment Steps

### 1. Prepare Your Google Cloud Credentials

Since Render.com doesn't support storing files directly, you'll need to convert your Google Cloud credentials to environment variables:

1. Open your `credentials.json` file
2. Copy the entire contents
3. You'll add this as an environment variable in Render.com

### 2. Deploy to Render.com

#### Option 1: Deploy via Dashboard (Easiest)

1. Log in to your [Render.com dashboard](https://dashboard.render.com/)
2. Click "New" and select "Web Service"
3. Connect your GitHub repository
4. Configure the service:
   - **Name**: leads-export-tool (or your preferred name)
   - **Environment**: Node
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
5. Add the following environment variables:
   - `NODE_ENV`: `production`
   - `PROJECT_ID`: Your Google Cloud project ID
   - `DATASET_ID`: Your BigQuery dataset ID
   - `TABLE_ID`: Your BigQuery table ID
   - `GOOGLE_APPLICATION_CREDENTIALS_JSON`: Paste the entire contents of your credentials.json file

6. Click "Create Web Service"

#### Option 2: Deploy via Blueprint (render.yaml)

1. Make sure your repository contains the `render.yaml` file
2. Log in to your [Render.com dashboard](https://dashboard.render.com/)
3. Click "New" and select "Blueprint"
4. Connect your GitHub repository
5. Render will detect the `render.yaml` file and configure the services
6. You'll need to manually add the environment variables mentioned above

### 3. Update Your Code for Credentials

Since we're using an environment variable for credentials instead of a file, add this code to your `app/lib/bigquery.ts` file:

```typescript
// Initialize BigQuery client
let bigquery;

if (process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON) {
  // For production: use credentials from environment variable
  const credentials = JSON.parse(process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON);
  bigquery = new BigQuery({
    projectId: process.env.PROJECT_ID,
    credentials,
  });
} else {
  // For development: use credentials file
  bigquery = new BigQuery({
    projectId: process.env.PROJECT_ID,
    keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS,
  });
}
```

### 4. Verify Deployment

1. Once deployed, Render will provide you with a URL (e.g., `https://leads-export-tool.onrender.com`)
2. Visit the URL to ensure your application is working correctly
3. Test the industry dropdown, company name filtering, and export functionality

## Troubleshooting

If you encounter issues:

1. Check the Render logs in your dashboard
2. Verify that all environment variables are set correctly
3. Ensure your Google Cloud service account has the necessary permissions

## Scaling and Paid Options

The free tier of Render.com has some limitations:
- Services spin down after 15 minutes of inactivity
- Limited bandwidth and compute resources

If you need more resources, consider upgrading to a paid plan:
- Individual: $7/month for the basic plan
- Team: $19/month for the standard plan

These plans provide more resources and eliminate the spin-down behavior.