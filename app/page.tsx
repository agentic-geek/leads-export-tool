'use client';

import { useState, useEffect, useRef } from 'react';

export default function Home() {
  const [industries, setIndustries] = useState<string[]>([]);
  const [selectedIndustry, setSelectedIndustry] = useState<string>('');
  const [companyName, setCompanyName] = useState<string>('');
  const [leadsCount, setLeadsCount] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [exportParts, setExportParts] = useState<number>(0);
  const [totalLeads, setTotalLeads] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Fetch industries on component mount
  useEffect(() => {
    async function fetchIndustries() {
      try {
        const response = await fetch('/api/industries');
        const data = await response.json();
        
        // Check if the response is an array (direct industries) or has an industries property
        if (Array.isArray(data)) {
          setIndustries(data);
        } else if (data.industries) {
          setIndustries(data.industries);
        } else {
          console.error('Unexpected industries data format:', data);
          setError('Failed to load industries. Unexpected data format.');
        }
      } catch (error) {
        console.error('Error fetching industries:', error);
        setError('Failed to load industries. Please try again later.');
      }
    }

    fetchIndustries();
  }, []);

  // Filter industries based on search term
  const filteredIndustries = industries.filter(industry => 
    industry.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle click outside to close dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Handle industry selection
  const handleIndustrySelect = (industry: string) => {
    setSelectedIndustry(industry);
    setSearchTerm(industry);
    setIsDropdownOpen(false);
  };

  // Fetch leads count when filters change
  useEffect(() => {
    async function fetchLeadsCount() {
      if (!selectedIndustry && !companyName) {
        setLeadsCount(null);
        return;
      }

      setIsLoading(true);
      try {
        const params = new URLSearchParams();
        if (selectedIndustry) params.append('industry', selectedIndustry);
        if (companyName) params.append('companyName', companyName);

        const response = await fetch(`/api/count?${params.toString()}`);
        const data = await response.json();
        
        if (data.count !== undefined) {
          setLeadsCount(data.count);
          setError(null);
        } else {
          setError('Failed to fetch leads count');
        }
      } catch (error) {
        console.error('Error fetching leads count:', error);
        setError('Failed to fetch leads count. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    }

    // Use a debounce to avoid too many requests
    const timeoutId = setTimeout(fetchLeadsCount, 500);
    return () => clearTimeout(timeoutId);
  }, [selectedIndustry, companyName]);

  // Handle export button click
  const handleExport = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const params = new URLSearchParams();
      if (selectedIndustry) params.append('industry', selectedIndustry);
      if (companyName) params.append('companyName', companyName);

      const response = await fetch(`/api/export?${params.toString()}`);
      
      // Check if the response is JSON (for multi-part exports) or CSV (for direct download)
      const contentType = response.headers.get('content-type');
      
      if (contentType && contentType.includes('application/json')) {
        const data = await response.json();
        
        if (data.error) {
          setError(data.error);
        } else if (data.parts) {
          // Multi-part export
          setExportParts(data.parts);
          setTotalLeads(data.totalLeads);
        }
      } else {
        // Direct CSV download
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `leads_${selectedIndustry || 'all'}_${companyName || 'all'}.csv`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      }
    } catch (error) {
      console.error('Error exporting leads:', error);
      setError('Failed to export leads. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle download of a specific part
  const handleDownloadPart = async (partIndex: number) => {
    setIsLoading(true);
    
    try {
      const params = new URLSearchParams();
      if (selectedIndustry) params.append('industry', selectedIndustry);
      if (companyName) params.append('companyName', companyName);
      params.append('part', partIndex.toString());

      const response = await fetch(`/api/export?${params.toString()}`);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `leads_${selectedIndustry || 'all'}_${companyName || 'all'}_part${partIndex + 1}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Error downloading part:', error);
      setError(`Failed to download part ${partIndex + 1}. Please try again later.`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8 flex items-center justify-center">
      <div className="w-full max-w-4xl bg-white rounded-xl shadow-lg p-8 space-y-6">
        <h1 className="text-3xl font-bold text-center text-gray-800">
          Executive Leads Export Tool
        </h1>
        
        <p className="text-center text-gray-600">
          Filter and export leads from BigQuery based on industry and company name
        </p>
        
        <div className="space-y-4">
          <h2 className="font-medium text-gray-700">Filter Criteria</h2>
          
          <div className="space-y-4">
            <div>
              <label htmlFor="industry" className="block text-sm font-medium text-gray-700 mb-1">
                Industry
              </label>
              <div className="relative" ref={dropdownRef}>
                <input
                  id="industry"
                  type="text"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Type or select an industry"
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setIsDropdownOpen(true);
                    if (e.target.value === '') {
                      setSelectedIndustry('');
                    }
                  }}
                  onClick={() => setIsDropdownOpen(true)}
                />
                {isDropdownOpen && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
                    {filteredIndustries.length > 0 ? (
                      filteredIndustries.map((industry) => (
                        <div
                          key={industry}
                          className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                          onClick={() => handleIndustrySelect(industry)}
                        >
                          {industry}
                        </div>
                      ))
                    ) : (
                      <div className="px-4 py-2 text-gray-500">No industries found</div>
                    )}
                  </div>
                )}
              </div>
            </div>
            
            <div>
              <label htmlFor="companyName" className="block text-sm font-medium text-gray-700 mb-1">
                Company Name
              </label>
              <input
                id="companyName"
                type="text"
                className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter company name (optional)"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
              />
            </div>
          </div>
        </div>
        
        {isLoading && (
          <div className="flex justify-center py-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          </div>
        )}
        
        {error && (
          <div className="text-red-500 text-center">
            {error}
          </div>
        )}
        
        {leadsCount !== null && !isLoading && (
          <div className="flex flex-col items-center justify-center space-y-4">
            <p className="text-lg font-medium">
              {leadsCount.toLocaleString()} leads found
            </p>
            
            {leadsCount > 0 && (
              <button
                onClick={handleExport}
                disabled={isLoading}
                className="px-6 py-3 bg-blue-600 text-white font-medium rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              >
                Export to CSV
              </button>
            )}
          </div>
        )}
        
        {exportParts > 0 && (
          <div className="bg-gray-50 p-4 rounded-md space-y-4">
            <p className="font-medium">
              {totalLeads.toLocaleString()} leads found (too many for a single file)
            </p>
            
            <p>
              Please download the data in parts:
            </p>
            
            <div className="flex flex-wrap gap-2">
              {Array.from({ length: exportParts }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => handleDownloadPart(index)}
                  disabled={isLoading}
                  className="px-3 py-1 bg-gray-200 text-gray-800 font-medium rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-50"
                >
                  Part {index + 1}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}