# Executive Leads Export Tool

A modern web application built with Next.js that allows users to filter and export executive leads from BigQuery based on industry and company name.

## Features

- **Industry Filtering**: Search and select from a comprehensive list of industries using a typable dropdown
- **Company Name Filtering**: Filter leads by company name
- **Real-time Lead Count**: See the number of leads matching your filter criteria
- **CSV Export**: Export filtered leads to CSV format
- **Large Dataset Handling**: Automatically splits large exports into manageable parts
- **Email Validation**: Only includes leads with valid email addresses

## Tech Stack

- **Frontend**: Next.js, React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes
- **Data Source**: Google BigQuery
- **Authentication**: Google Cloud Service Account

## Getting Started

### Prerequisites

- Node.js 16.x or higher
- npm or yarn
- Google Cloud Platform account with BigQuery access
- Service account credentials with BigQuery permissions

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/agentic-geek/leads-export-tool.git
   cd leads-export-tool
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Create a `.env.local` file in the root directory with the following variables:
   ```
   PROJECT_ID=your-gcp-project-id
   DATASET_ID=your-bigquery-dataset-id
   TABLE_ID=your-bigquery-table-id
   GOOGLE_APPLICATION_CREDENTIALS=./credentials.json
   ```

4. Place your Google Cloud service account credentials in a file named `credentials.json` in the root directory.

5. Start the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Usage

1. **Select an Industry**: Use the typable dropdown to search and select an industry.
2. **Enter a Company Name (Optional)**: Filter results further by entering a company name.
3. **View Lead Count**: The application will display the number of leads matching your criteria.
4. **Export to CSV**: Click the "Export to CSV" button to download the filtered leads.
5. **Download in Parts (if applicable)**: For large datasets, download each part separately.

## Data Structure

The application expects the BigQuery table to have the following columns:
- `industry`: The industry of the lead
- `company_name`: The company name
- `emails`: The email address of the lead (used for filtering valid leads)
- Additional columns will be included in the export

## Deployment

This application can be deployed to Render.com or any other platform that supports Next.js applications.

### Deploying to Render.com

For detailed deployment instructions, see [DEPLOYMENT.md](DEPLOYMENT.md).

Quick steps:
1. Prepare your Google Cloud credentials for deployment:
   ```bash
   node deploy-prep.js
   ```
2. Create a new Web Service on Render.com
3. Connect your GitHub repository
4. Configure the environment variables
5. Deploy the application

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements

- [Next.js](https://nextjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Google BigQuery](https://cloud.google.com/bigquery)