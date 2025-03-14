# Leads Export Tool

A web application for exporting leads data from BigQuery, with filtering capabilities by industry.

## Features

- Display a list of standardized industry options in a dropdown
- Show the count of leads available for each selected industry
- Export leads data to CSV format
- Clean and modern UI with responsive design
- Integration with Google BigQuery for data retrieval

## Technology Stack

- **Frontend**: Next.js, React, Tailwind CSS
- **Backend**: Next.js API routes
- **Data**: Google BigQuery
- **Deployment**: Render.com

## Getting Started

### Prerequisites

- Node.js (v18 or later)
- npm or yarn
- Google Cloud Platform account with BigQuery access
- Service account credentials with appropriate permissions

### Environment Setup

1. Clone the repository
2. Copy `.env.template` to `.env.local` and fill in the required values:
   ```
   PROJECT_ID=your-gcp-project-id
   DATASET_ID=your-dataset-id
   TABLE_ID=your-table-id
   GOOGLE_APPLICATION_CREDENTIALS_JSON=your-credentials-json-string
   ```

### Installation

```bash
# Install dependencies
npm install

# Run the development server
npm run dev
```

Visit `http://localhost:3000` to see the application.

## Deployment

See the [RENDER-DEPLOY-GUIDE.md](./RENDER-DEPLOY-GUIDE.md) for detailed instructions on deploying this application to Render.com.

## License

MIT

## Contact

For questions or support, please open an issue in the GitHub repository.