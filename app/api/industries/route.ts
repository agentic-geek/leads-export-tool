import { NextResponse } from 'next/server';
import { getIndustries } from '../../lib/bigquery';

// Fallback industries list in case of BigQuery connection issues
const fallbackIndustries = [
  'Accounting',
  'Advertising',
  'Aerospace',
  'Agriculture',
  'Apparel & Fashion',
  'Architecture & Planning',
  'Automotive',
  'Banking',
  'Biotechnology',
  'Computer Software',
  'Construction',
  'Consumer Electronics',
  'Consumer Goods',
  'Education Management',
  'Financial Services',
  'Food & Beverages',
  'Government Administration',
  'Health, Wellness and Fitness',
  'Hospital & Health Care',
  'Hospitality',
  'Information Technology and Services',
  'Insurance',
  'Internet',
  'Legal Services',
  'Management Consulting',
  'Marketing and Advertising',
  'Media Production',
  'Medical Devices',
  'Oil & Energy',
  'Real Estate',
  'Retail',
  'Telecommunications',
  'Transportation/Trucking/Railroad'
];

export async function GET() {
  console.log('Industries API called');
  
  try {
    console.log('Fetching industries from BigQuery...');
    const industries = await getIndustries();
    console.log(`Retrieved ${industries.length} industries from BigQuery`);
    
    return NextResponse.json(industries);
  } catch (error) {
    console.error('Error in industries API:', error);
    console.log('Returning fallback industries list');
    
    // Return fallback industries list
    return NextResponse.json(fallbackIndustries);
  }
}