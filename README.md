# Executive Leads Export Tool

A web application for filtering and exporting executive leads from BigQuery based on industry and company name.

## Features

- Filter leads by industry and company name
- View the count of matching leads
- Export filtered leads to CSV
- Support for large exports with multi-part downloads
- Clean, modern UI with responsive design

## Deployment

### Local Development

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Create a `.env.local` file with the following variables:
   ```
   PROJECT_ID=your-google-cloud-project-id
   DATASET_ID=your-bigquery-dataset-id
   TABLE_ID=your-bigquery-table-id
   GOOGLE_APPLICATION_CREDENTIALS=path/to/credentials.json
   ```
4. Place your Google Cloud credentials file in the project root
5. Start the development server:
   ```
   npm run dev
   ```

### Deploying to Render.com

You have two options for deploying to Render.com:

#### Option 1: Deploy with Blueprint (render.yaml)

This is the recommended approach as it automates much of the deployment process:

1. Format your Google Cloud credentials:
   ```
   npm run format-credentials path/to/credentials.json
   ```

2. Deploy using Render Blueprint:
   - Log in to Render.com
   - Click "New" and select "Blueprint"
   - Connect your GitHub repository
   - Follow the prompts to complete the deployment

For detailed instructions, see [RENDER-BLUEPRINT-GUIDE.md](RENDER-BLUEPRINT-GUIDE.md).

#### Option 2: Manual Deployment

If you prefer more control over the deployment process:

1. Log in to Render.com
2. Click "New" and select "Web Service"
3. Connect your GitHub repository
4. Configure the service manually

For detailed instructions, see [RENDER-DEPLOY-GUIDE.md](RENDER-DEPLOY-GUIDE.md).

## Google Cloud Credentials

To use this application, you need a Google Cloud service account with access to BigQuery. 

1. Create a service account in the Google Cloud Console
2. Grant it the "BigQuery Data Viewer" role
3. Create and download a key file (JSON format)
4. Use the provided script to format it for Render.com:
   ```
   npm run format-credentials path/to/credentials.json
   ```

See `credentials.json.example` for the expected format.

## Troubleshooting

If you encounter issues during deployment:

1. **Check the build logs** in the Render.com dashboard
2. **Verify environment variables** are set correctly
3. **Ensure your Google Cloud credentials** are properly formatted
4. **Test your credentials locally** using the provided script:
   ```
   npm run test-credentials
   ```

For more detailed troubleshooting steps, see the deployment guides.

## License

MIT