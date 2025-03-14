import { BigQuery } from '@google-cloud/bigquery';
import { stringify } from 'csv-stringify/sync';

// Helper function to create clean BigQuery options
function createBigQueryOptions(projectId: string | undefined, credentials?: any, keyFilename?: string) {
  const options: any = {
    projectId
  };
  
  if (credentials) {
    // Create a clean copy of credentials without any location/region fields
    const cleanCredentials = { ...credentials };
    
    // Remove any fields that might cause CloudRegion parsing issues
    delete cleanCredentials.location;
    delete cleanCredentials.region;
    delete cleanCredentials.locationPreference;
    
    options.credentials = cleanCredentials;
  }
  
  if (keyFilename) {
    options.keyFilename = keyFilename;
  }
  
  return options;
}

// Initialize BigQuery client with better error handling
let bigquery: BigQuery;

try {
  if (process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON) {
    // For production: use credentials from environment variable
    console.log('Using Google Cloud credentials from environment variable');
    try {
      const credentials = JSON.parse(process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON);
      
      // Check if credentials contain required fields
      if (!credentials.client_email || !credentials.private_key) {
        console.error('Credentials JSON is missing required fields (client_email or private_key)');
      }
      
      const options = createBigQueryOptions(process.env.PROJECT_ID, credentials);
      console.log('BigQuery initialization options:', JSON.stringify({
        ...options,
        credentials: '**REDACTED**'
      }));
      
      bigquery = new BigQuery(options);
    } catch (error) {
      console.error('Error parsing Google Cloud credentials JSON:', error);
      throw new Error('Invalid Google Cloud credentials JSON. Please check the format.');
    }
  } else if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
    // For development: use credentials file
    console.log(`Using Google Cloud credentials from file: ${process.env.GOOGLE_APPLICATION_CREDENTIALS}`);
    const options = createBigQueryOptions(process.env.PROJECT_ID, undefined, process.env.GOOGLE_APPLICATION_CREDENTIALS);
    console.log('BigQuery initialization options:', JSON.stringify({
      ...options,
      keyFilename: '**REDACTED**'
    }));
    
    bigquery = new BigQuery(options);
  } else {
    console.error('No Google Cloud credentials provided. Please set GOOGLE_APPLICATION_CREDENTIALS_JSON or GOOGLE_APPLICATION_CREDENTIALS.');
    throw new Error('No Google Cloud credentials provided');
  }
  
  // Verify that PROJECT_ID is set
  if (!process.env.PROJECT_ID) {
    console.error('PROJECT_ID environment variable is not set');
    throw new Error('PROJECT_ID environment variable is not set');
  }
  
  // Verify that DATASET_ID is set
  if (!process.env.DATASET_ID) {
    console.error('DATASET_ID environment variable is not set');
    throw new Error('DATASET_ID environment variable is not set');
  }
  
  // Verify that TABLE_ID is set
  if (!process.env.TABLE_ID) {
    console.error('TABLE_ID environment variable is not set');
    throw new Error('TABLE_ID environment variable is not set');
  }
} catch (error) {
  console.error('Error initializing BigQuery client:', error);
  // Create a dummy BigQuery instance to prevent runtime errors
  // This will throw more specific errors when methods are called
  bigquery = new BigQuery(createBigQueryOptions(process.env.PROJECT_ID));
}

// Standard industry names to filter by
const standardIndustries = [
  'accounting', 'advertising', 'aerospace', 'agriculture', 'apparel & fashion',
  'architecture & planning', 'arts and crafts', 'automotive', 'aviation & aerospace',
  'banking', 'biotechnology', 'broadcast media', 'building materials',
  'business supplies and equipment', 'capital markets', 'chemicals',
  'civic & social organization', 'civil engineering', 'commercial real estate',
  'computer & network security', 'computer games', 'computer hardware',
  'computer networking', 'computer software', 'construction', 'consumer electronics',
  'consumer goods', 'consumer services', 'cosmetics', 'dairy', 'defense & space',
  'design', 'e-learning', 'education management', 'electrical/electronic manufacturing',
  'entertainment', 'environmental services', 'events services', 'executive office',
  'facilities services', 'farming', 'financial services', 'fine art', 'fishery',
  'food & beverages', 'food production', 'fund-raising', 'furniture',
  'gambling & casinos', 'glass, ceramics, & concrete', 'government administration',
  'government relations', 'graphic design', 'health, wellness and fitness',
  'higher education', 'hospital & health care', 'hospitality', 'human resources',
  'import and export', 'individual & family services', 'industrial automation',
  'information services', 'information technology and services', 'insurance',
  'international affairs', 'international trade and development', 'internet',
  'investment banking', 'investment management', 'judiciary', 'law enforcement',
  'law practice', 'legal services', 'legislative office', 'leisure, travel, & tourism',
  'libraries', 'logistics and supply chain', 'luxury goods & jewelry', 'machinery',
  'magazines', 'management consulting', 'maritime', 'market research', 'marketing',
  'marketing and advertising', 'mechanical or industrial engineering', 'media production',
  'medical devices', 'medical practice', 'mental health care', 'military',
  'mining & metals', 'motion pictures and film', 'museums and institutions', 'music',
  'nanotechnology', 'newspapers', 'non-profit organization management', 'oil & energy',
  'online media', 'outsourcing/offshoring', 'package/freight delivery',
  'packaging and containers', 'paper & forest products', 'performing arts',
  'pharmaceuticals', 'philanthropy', 'photography', 'plastics', 'political organization',
  'primary/secondary education', 'printing', 'professional training & coaching',
  'program development', 'public policy', 'public relations and communications',
  'public safety', 'publishing', 'railroad manufacture', 'ranching', 'real estate',
  'recreational facilities and services', 'religious institutions',
  'renewables & environment', 'research', 'restaurants', 'retail',
  'security and investigations', 'semiconductors', 'shipbuilding', 'sporting goods',
  'sports', 'staffing and recruiting', 'supermarkets', 'telecommunications',
  'textiles', 'think tanks', 'tobacco', 'translation and localization',
  'transportation/trucking/railroad', 'utilities', 'venture capital & private equity',
  'veterinary', 'warehousing', 'wholesale', 'wine and spirits', 'wireless',
  'writing and editing'
];

// Get all unique industries from the table
export async function getIndustries(): Promise<string[]> {
  try {
    // Verify that all required environment variables are set
    if (!process.env.PROJECT_ID || !process.env.DATASET_ID || !process.env.TABLE_ID) {
      console.error('Missing required environment variables for BigQuery');
      throw new Error('Missing required environment variables for BigQuery');
    }

    const query = `
      SELECT DISTINCT industry 
      FROM \`${process.env.PROJECT_ID}.${process.env.DATASET_ID}.${process.env.TABLE_ID}\`
      WHERE industry IS NOT NULL
      ORDER BY industry ASC
    `;

    console.log('Executing BigQuery query for industries...');
    const [rows] = await bigquery.query({ query });
    console.log(`Retrieved ${rows.length} industries from BigQuery`);
    
    // Filter out long descriptions and non-standard industries
    const industries = rows
      .map((row: any) => row.industry.trim().toLowerCase())
      .filter((industry: string) => {
        // Filter out long descriptions (more than 50 characters)
        if (industry.length > 50) return false;
        
        // Filter out industries that are likely descriptions
        if (industry.includes('.') || industry.includes(',')) return false;
        
        // Check if it's a standard industry or close to one
        return standardIndustries.some(std => 
          industry.includes(std) || std.includes(industry)
        );
      })
      .map((industry: string) => {
        // Find the closest standard industry
        const matchedStandard = standardIndustries.find(std => 
          industry.includes(std) || std.includes(industry)
        );
        
        // Return the standard industry name with proper capitalization
        return matchedStandard ? 
          matchedStandard.split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ') : 
          industry.split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
      });
    
    // Remove duplicates
    return Array.from(new Set(industries));
  } catch (error) {
    console.error('Error fetching industries:', error);
    // Return a subset of standard industries as fallback
    console.log('Returning fallback industry list');
    return standardIndustries
      .slice(0, 30)
      .map(industry => 
        industry.split(' ')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ')
      );
  }
}

// Get count of leads matching the filters
export async function getLeadsCount(industry?: string, companyName?: string): Promise<number> {
  try {
    // Verify that all required environment variables are set
    if (!process.env.PROJECT_ID || !process.env.DATASET_ID || !process.env.TABLE_ID) {
      console.error('Missing required environment variables for BigQuery');
      throw new Error('Missing required environment variables for BigQuery');
    }

    let query = `
      SELECT COUNT(*) as count
      FROM \`${process.env.PROJECT_ID}.${process.env.DATASET_ID}.${process.env.TABLE_ID}\`
      WHERE emails IS NOT NULL AND TRIM(emails) != ''
    `;

    if (industry) {
      // Use LIKE instead of exact match to handle case sensitivity and partial matches
      query += ` AND LOWER(industry) LIKE LOWER('%${industry}%')`;
    }

    if (companyName) {
      // Use the correct column name 'company_name'
      query += ` AND LOWER(company_name) LIKE LOWER('%${companyName}%')`;
    }

    const [rows] = await bigquery.query({ query });
    return rows[0].count;
  } catch (error) {
    console.error('Error getting leads count:', error);
    throw error;
  }
}

// Get leads matching the filters
export async function getLeads(industry?: string, companyName?: string): Promise<any[]> {
  try {
    // Verify that all required environment variables are set
    if (!process.env.PROJECT_ID || !process.env.DATASET_ID || !process.env.TABLE_ID) {
      console.error('Missing required environment variables for BigQuery');
      throw new Error('Missing required environment variables for BigQuery');
    }

    let query = `
      SELECT *
      FROM \`${process.env.PROJECT_ID}.${process.env.DATASET_ID}.${process.env.TABLE_ID}\`
      WHERE emails IS NOT NULL AND TRIM(emails) != ''
    `;

    if (industry) {
      // Use LIKE instead of exact match to handle case sensitivity and partial matches
      query += ` AND LOWER(industry) LIKE LOWER('%${industry}%')`;
    }

    if (companyName) {
      // Use the correct column name 'company_name'
      query += ` AND LOWER(company_name) LIKE LOWER('%${companyName}%')`;
    }

    const [rows] = await bigquery.query({ query });
    return rows;
  } catch (error) {
    console.error('Error getting leads:', error);
    throw error;
  }
}

// Convert leads to CSV format
export function convertToCSV(leads: any[]): string {
  if (leads.length === 0) {
    return '';
  }

  // Get all column headers from the first lead
  const columns = Object.keys(leads[0]);
  
  // Convert leads to CSV
  return stringify(leads, {
    header: true,
    columns: columns,
  });
}

// Split leads into chunks of specified size
export function splitLeadsIntoChunks(leads: any[], chunkSize: number = 20000): any[][] {
  const chunks = [];
  for (let i = 0; i < leads.length; i += chunkSize) {
    chunks.push(leads.slice(i, i + chunkSize));
  }
  return chunks;
}

// Get table schema to debug column names
export async function getTableSchema(): Promise<any[]> {
  try {
    // Verify that all required environment variables are set
    if (!process.env.PROJECT_ID || !process.env.DATASET_ID || !process.env.TABLE_ID) {
      console.error('Missing required environment variables for BigQuery');
      throw new Error('Missing required environment variables for BigQuery');
    }

    const dataset = bigquery.dataset(process.env.DATASET_ID as string);
    const table = dataset.table(process.env.TABLE_ID as string);
    const [metadata] = await table.getMetadata();
    return metadata.schema.fields;
  } catch (error) {
    console.error('Error fetching table schema:', error);
    return [];
  }
}