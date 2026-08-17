import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { patientSearchService } from '../../../services/patientSearchService';
import Card from '../../../components/ui/Card';
import Input from '../../../components/ui/Input';


export default function PatientSearchCard({ onPatientSelect }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showResults, setShowResults] = useState(false);

  const handleSearch = async (query) => {
    setSearchQuery(query);
    
    if (!query || query?.trim()?.length < 2) {
      setSearchResults([]);
      setShowResults(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const results = await patientSearchService?.searchPatients(query);
      setSearchResults(results);
      setShowResults(true);
    } catch (err) {
      console.error('Search error:', err);
      setError(err?.message || 'Failed to search patients');
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handlePatientClick = async (patient) => {
    setShowResults(false);
    setSearchQuery(`${patient?.firstName} ${patient?.lastName}`);
    onPatientSelect(patient);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString)?.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <Card>
      <h2 className="text-base font-semibold text-t1 mb-4">Patient Search</h2>
      <div className="space-y-4">
        <Input
          type="search"
          placeholder="Search by name or ID..."
          value={searchQuery}
          onChange={(e) => handleSearch(e?.target?.value)}
          className="w-full"
        />
        
        {loading && (
          <div className="text-center py-4">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-accent mx-auto"></div>
            <p className="text-t3 text-sm mt-2">Searching...</p>
          </div>
        )}

        {error && (
          <div className="p-3 bg-danger/10 border border-danger rounded-lg">
            <p className="text-danger text-sm">{error}</p>
          </div>
        )}

        {!loading && searchResults?.length > 0 && (
          <div className="space-y-2">
            {searchResults?.map((patient) => (
              <Card
                key={patient?.id}
                padding="p-3"
                hover={true}
                className="bg-bg1 cursor-pointer"
                onClick={() => handlePatientClick(patient)}
              >
                <div className="text-t1 font-medium">{patient?.name || `${patient?.firstName} ${patient?.lastName}`}</div>
                {patient?.phone && <div className="text-t2 text-sm">{patient?.phone}</div>}
              </Card>
            ))}
          </div>
        )}

        {!loading && !error && searchResults?.length === 0 && (
          <div className="relative overflow-hidden flex flex-col items-center justify-center py-10 border border-bd rounded-xl bg-bg2/40 panel-glow">
            <div className="w-12 h-12 rounded-full bg-accent/10 border border-accent/25 flex items-center justify-center mb-3">
              <Search className="w-5 h-5 text-accent" />
            </div>
            <p className="text-t2 text-sm font-medium">
              {searchQuery?.length > 0 ? 'No patients found' : 'Search for a patient to view their treatment details'}
            </p>
            <p className="text-t3 text-xs mt-1">
              {searchQuery?.length > 0 ? 'Try a different name or ID' : 'Enter a name or patient ID above'}
            </p>
          </div>
        )}
      </div>
    </Card>
  );
}