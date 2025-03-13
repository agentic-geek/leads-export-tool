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

**Important Note**: If you encounter the error "Module not found: Can't resolve '@/app/lib/bigquery'", it's because the path aliases aren't resolving correctly in the production environment. This has been fixed in the latest version by using relative imports instead of path aliases.

Follow these steps to deploy to Render.com:

1. Push your code to a GitHub repository
2. Log in to your [Render.com dashboard](https://dashboard.render.com/)
3. Click "New" and select "Web Service"
4. Connect your GitHub repository
5. Configure the service:
   - **Name**: leads-export-tool (or your preferred name)
   - **Environment**: Node
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
6. Add the following environment variables:
   - `NODE_ENV`: `production`
   - `PROJECT_ID`: Your Google Cloud project ID
   - `DATASET_ID`: Your BigQuery dataset ID
   - `TABLE_ID`: Your BigQuery table ID
   - `GOOGLE_APPLICATION_CREDENTIALS_JSON`: Paste the entire contents of your credentials.json file

7. Click "Create Web Service"

For more detailed deployment instructions, see [DEPLOYMENT.md](DEPLOYMENT.md).

## Troubleshooting

If you encounter issues with the deployment:

1. Check the Render logs in your dashboard
2. Verify that all environment variables are set correctly
3. Ensure your Google Cloud service account has the necessary permissions

## License

MIT