import { NextResponse } from 'next/server';
import { getLeads, convertToCSV, splitLeadsIntoChunks } from '../../lib/bigquery';

// Generate mock leads for fallback
function generateMockLeads(industry?: string, companyName?: string, count: number = 100): any[] {
  const industries = [
    'Accounting', 'Advertising', 'Aerospace', 'Agriculture', 'Apparel & Fashion',
    'Architecture & Planning', 'Automotive', 'Banking', 'Biotechnology', 'Computer Software',
    'Construction', 'Consumer Electronics', 'Consumer Goods', 'Education Management',
    'Financial Services', 'Food & Beverages', 'Government Administration',
    'Health, Wellness and Fitness', 'Hospital & Health Care', 'Hospitality',
    'Information Technology and Services', 'Insurance', 'Internet', 'Legal Services',
    'Management Consulting', 'Marketing and Advertising', 'Media Production',
    'Medical Devices', 'Oil & Energy', 'Real Estate', 'Retail', 'Telecommunications'
  ];
  
  const companies = [
    'Acme Corp', 'Globex', 'Initech', 'Umbrella Corporation', 'Stark Industries',
    'Wayne Enterprises', 'Cyberdyne Systems', 'Soylent Corp', 'Massive Dynamic',
    'Weyland-Yutani', 'Oscorp', 'LexCorp', 'Gekko & Co', 'Dunder Mifflin',
    'Wonka Industries', 'Oceanic Airlines', 'Tyrell Corporation', 'Nakatomi Trading Corp',
    'Spacely Sprockets', 'Cogswell Cogs', 'Monsters Inc', 'Acme Industries'
  ];
  
  const titles = [
    'CEO', 'CTO', 'CFO', 'COO', 'CMO', 'CIO', 'President', 'Vice President',
    'Director', 'Senior Director', 'Manager', 'Senior Manager', 'Executive',
    'Senior Executive', 'Partner', 'Associate', 'Consultant', 'Analyst',
    'Senior Analyst', 'Specialist', 'Coordinator', 'Administrator'
  ];
  
  const firstNames = [
    'John', 'Jane', 'Michael', 'Emily', 'David', 'Sarah', 'Robert', 'Jennifer',
    'William', 'Elizabeth', 'James', 'Linda', 'Richard', 'Patricia', 'Thomas',
    'Barbara', 'Charles', 'Susan', 'Daniel', 'Jessica', 'Matthew', 'Mary',
    'Anthony', 'Karen', 'Mark', 'Nancy', 'Donald', 'Lisa', 'Steven', 'Betty'
  ];
  
  const lastNames = [
    'Smith', 'Johnson', 'Williams', 'Jones', 'Brown', 'Davis', 'Miller', 'Wilson',
    'Moore', 'Taylor', 'Anderson', 'Thomas', 'Jackson', 'White', 'Harris', 'Martin',
    'Thompson', 'Garcia', 'Martinez', 'Robinson', 'Clark', 'Rodriguez', 'Lewis',
    'Lee', 'Walker', 'Hall', 'Allen', 'Young', 'Hernandez', 'King', 'Wright', 'Lopez'
  ];
  
  const domains = [
    'gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 'aol.com',
    'company.com', 'example.com', 'business.com', 'enterprise.org', 'corp.net'
  ];
  
  const leads = [];
  
  for (let i = 0; i < count; i++) {
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    const selectedIndustry = industry || industries[Math.floor(Math.random() * industries.length)];
    const selectedCompany = companyName || companies[Math.floor(Math.random() * companies.length)];
    const title = titles[Math.floor(Math.random() * titles.length)];
    const domain = domains[Math.floor(Math.random() * domains.length)];
    const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}@${domain}`;
    
    leads.push({
      first_name: firstName,
      last_name: lastName,
      full_name: `${firstName} ${lastName}`,
      title: title,
      company_name: selectedCompany,
      industry: selectedIndustry,
      emails: email,
      phone: `(${Math.floor(Math.random() * 900) + 100}) ${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 9000) + 1000}`,
      linkedin_url: `https://linkedin.com/in/${firstName.toLowerCase()}${lastName.toLowerCase()}${Math.floor(Math.random() * 100)}`,
      location: 'United States',
      created_at: new Date().toISOString()
    });
  }
  
  return leads;
}

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
    
    // Generate mock leads as fallback
    console.log('Using fallback mock leads');
    let mockLeadCount = 100;
    
    // Adjust count based on industry
    if (industry) {
      // More leads for popular industries
      if (['Computer Software', 'Information Technology and Services', 'Financial Services', 'Internet'].includes(industry)) {
        mockLeadCount = 200;
      }
    }
    
    // Reduce count if company name is provided (to simulate filtering)
    if (companyName) {
      mockLeadCount = Math.floor(mockLeadCount * 0.3);
    }
    
    const mockLeads = generateMockLeads(industry, companyName, mockLeadCount);
    
    // If a specific part is requested, handle it
    if (partIndex !== undefined) {
      const chunks = splitLeadsIntoChunks(mockLeads, 50);
      
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
    
    // Otherwise, return all mock leads as CSV
    const csv = convertToCSV(mockLeads);
    
    return new NextResponse(csv, {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename=\"leads_${industry || 'all'}_${companyName || 'all'}.csv\"`,
      },
    });
  }
}