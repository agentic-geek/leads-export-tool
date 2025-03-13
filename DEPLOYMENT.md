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

#### Option 1: Deploy via Dashboard (Recommended)

1. Log in to your [Render.com dashboard](https://dashboard.render.com/)
2. Click "New" and select "Web Service"
3. Connect your GitHub repository
4. Configure the service:
   - **Name**: leads-export-tool (or your preferred name)
   - **Environment**: Node
   - **Build Command**: `chmod +x render-build.sh && ./render-build.sh`
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

### 3. Troubleshooting Common Deployment Issues

#### Module Resolution Issues

If you encounter errors like "Module not found: Can't resolve '@/app/lib/bigquery'", this is due to path alias resolution issues in the production environment. We've fixed this by:

1. Using relative imports instead of path aliases in API routes
2. Setting the appropriate Next.js configuration

#### Tailwind CSS Issues

If you encounter errors like "Cannot find module 'tailwindcss'", this is because Tailwind CSS needs to be in the dependencies section of package.json, not devDependencies. We've fixed this by moving Tailwind CSS and related packages to the dependencies section.

#### Build Failures

If your build is failing with a generic error message:

1. Check the Render.com logs for specific error messages
2. Make sure all environment variables are set correctly
3. Verify that the Node.js version is compatible (we require Node.js 18+)
4. Try using the custom build script (`render-build.sh`) provided in the repository

### 4. Verify Deployment

1. Once deployed, Render will provide you with a URL (e.g., `https://leads-export-tool.onrender.com`)
2. Visit the URL to ensure your application is working correctly
3. Test the industry dropdown, company name filtering, and export functionality

## Scaling and Paid Options

The free tier of Render.com has some limitations:
- Services spin down after 15 minutes of inactivity
- Limited bandwidth and compute resources

If you need more resources, consider upgrading to a paid plan:
- Individual: $7/month for the basic plan
- Team: $19/month for the standard plan

These plans provide more resources and eliminate the spin-down behavior.