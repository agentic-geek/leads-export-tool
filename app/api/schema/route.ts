import { NextResponse } from 'next/server';
import { getTableSchema } from '../../lib/bigquery';

export async function GET() {
  console.log('Schema API called');
  
  try {
    const schema = await getTableSchema();
    console.log('Schema retrieved:', schema);
    
    return NextResponse.json({ schema });
  } catch (error) {
    console.error('Error in schema API:', error);
    return NextResponse.json({ error: 'Failed to fetch schema' }, { status: 500 });
  }
}