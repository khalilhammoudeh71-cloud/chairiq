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
      <h2 className="text-2xl font-bold text-t1 mb-6">Patient Search</h2>
      <div className="space-y-4">
        <Input
          type="search"
          placeholder="Search by name or ID..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e?.target?.value)}
          className="w-full"
        />
        
        {searchResults?.length > 0 && (
          <div className="space-y-2">
            {searchResults?.map((patient) => (
              <Card
                key={patient?.id}
                padding="p-3"
                hover={true}
                className="bg-bg1 cursor-pointer"
                onClick={() => onPatientSelect(patient)}
              >
                <div className="text-t1 font-medium">{patient?.name}</div>
                <div className="text-t2 text-sm">ID: {patient?.id}</div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </Card>
  );
}