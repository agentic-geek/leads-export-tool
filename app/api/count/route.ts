import { NextResponse } from 'next/server';
import { getLeadsCount } from '../../lib/bigquery';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const industry = searchParams.get('industry') || undefined;
  const companyName = searchParams.get('companyName') || undefined;
  
  console.log('Count API called with params:', { industry, companyName });
  
  try {
    const count = await getLeadsCount(industry, companyName);
    console.log('Count result:', count);
    
    return NextResponse.json({ count });
  } catch (error) {
    console.error('Error fetching leads count:', error);
    return NextResponse.json({ error: 'Failed to fetch leads count' }, { status: 500 });
  }
}