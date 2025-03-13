import { NextResponse } from 'next/server';
import { getLeads, convertToCSV, splitLeadsIntoChunks } from '../../lib/bigquery';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const industry = searchParams.get('industry') || undefined;
  const companyName = searchParams.get('companyName') || undefined;
  const partIndex = searchParams.get('part') ? parseInt(searchParams.get('part') as string) : undefined;
  
  console.log('Export API called with params:', { industry, companyName, partIndex });
  
  try {
    console.log('Fetching leads from BigQuery...');
    const leads = await getLeads(industry, companyName);
    console.log(`Retrieved ${leads.length} leads from BigQuery`);
    
    // If there are too many leads, split them into chunks
    if (leads.length > 20000 && partIndex === undefined) {
      const chunks = splitLeadsIntoChunks(leads);
      return NextResponse.json({ 
        parts: chunks.length,
        totalLeads: leads.length,
        message: 'Too many leads to export at once. Please download in parts.'
      });
    }
    
    // If a specific part is requested, return that part
    if (partIndex !== undefined) {
      const chunks = splitLeadsIntoChunks(leads);
      
      if (partIndex < 0 || partIndex >= chunks.length) {
        return NextResponse.json({ error: 'Invalid part index' }, { status: 400 });
      }
      
      const csv = convertToCSV(chunks[partIndex]);
      
      return new NextResponse(csv, {
        headers: {
          'Content-Type': 'text/csv',
          'Content-Disposition': `attachment; filename=\"leads_${industry || 'all'}_${companyName || 'all'}_part${partIndex + 1}.csv\"`,
        },
      });
    }
    
    // Otherwise, return all leads as CSV
    const csv = convertToCSV(leads);
    
    return new NextResponse(csv, {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename=\"leads_${industry || 'all'}_${companyName || 'all'}.csv\"`,
      },
    });
  } catch (error) {
    console.error('Error exporting leads:', error);
    return NextResponse.json({ error: 'Failed to export leads' }, { status: 500 });
  }
}