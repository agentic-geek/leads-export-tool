import { NextResponse } from 'next/server';
import { getIndustries } from '../../lib/bigquery';

export async function GET() {
  console.log('Industries API called');
  
  try {
    console.log('Fetching industries from BigQuery...');
    const industries = await getIndustries();
    console.log(`Retrieved ${industries.length} industries from BigQuery`);
    
    return NextResponse.json(industries);
  } catch (error) {
    console.error('Error in industries API:', error);
    return NextResponse.json({ error: 'Failed to fetch industries' }, { status: 500 });
  }
}