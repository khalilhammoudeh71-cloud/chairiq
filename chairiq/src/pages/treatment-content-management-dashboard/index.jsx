import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Book, Clock, TrendingUp, Filter, Languages, BarChart3, X, Search, ChevronDown } from 'lucide-react';
import { getAllProcedures } from '../../data/procedures';
import TreatmentCard from './components/TreatmentCard';
import ContentViewerModal from './components/ContentViewerModal';
import DentistNavigation from '../../components/DentistNavigation';
import { procedureCodesService } from '../../services/procedureCodesService';

const TreatmentContentManagementDashboard = () => {
  const navigate = useNavigate();
  const [selectedTreatment, setSelectedTreatment] = useState(null);
  const [filterCategory, setFilterCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [languageFilter, setLanguageFilter] = useState('both');
  const [adaCodes, setAdaCodes] = useState([]);
  const [selectedAdaCode, setSelectedAdaCode] = useState('');
  const [adaDropdownOpen, setAdaDropdownOpen] = useState(false);
  const [adaSearchTerm, setAdaSearchTerm] = useState('');
  const adaDropdownRef = useRef(null);

  useEffect(() => {
    async function loadAdaCodes() {
      try {
        const codes = await procedureCodesService?.getAllCodes();
        setAdaCodes(codes || []);
      } catch (err) {
        console.error('Failed to load ADA codes:', err);
      }
    }
    loadAdaCodes();
  }, []);

  useEffect(() => {
    function handleClickOutside(e) {
      if (adaDropdownRef.current && !adaDropdownRef.current.contains(e.target)) {
        setAdaDropdownOpen(false);
        setAdaSearchTerm('');
      }
    }
    if (adaDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [adaDropdownOpen]);

  // Get all procedures from data
  const allProcedures = useMemo(() => getAllProcedures(), []);

  const filteredAdaCodes = useMemo(() => {
    if (!adaSearchTerm) return adaCodes;
    const term = adaSearchTerm.toLowerCase();
    return adaCodes.filter(c =>
      c?.code?.toLowerCase()?.includes(term) ||
      c?.title?.toLowerCase()?.includes(term)
    );
  }, [adaCodes, adaSearchTerm]);

  const filteredProcedures = useMemo(() => {
    return allProcedures?.filter((procedure) => {
      const matchesCategory = filterCategory === 'all' || procedure?.category === filterCategory;
      const matchesSearch = !searchQuery || 
        procedure?.name_en?.toLowerCase()?.includes(searchQuery?.toLowerCase()) ||
        procedure?.name_es?.toLowerCase()?.includes(searchQuery?.toLowerCase());
      
      return matchesCategory && matchesSearch;
    });
  }, [allProcedures, filterCategory, searchQuery]);

  // Calculate statistics
  const stats = useMemo(() => {
    return {
      totalTreatments: allProcedures?.length || 0,
      totalSteps: allProcedures?.reduce((sum, proc) => sum + (proc?.visualGuideSteps?.length || 0), 0),
      averageSteps: Math.round(allProcedures?.reduce((sum, proc) => sum + (proc?.visualGuideSteps?.length || 0), 0) / (allProcedures?.length || 1)),
      categories: [...new Set(allProcedures?.map(p => p?.category))]?.length
    };
  }, [allProcedures]);

  const categories = [
    { value: 'all', label: 'All Treatments' },
    { value: 'restorative', label: 'Restorative' },
    { value: 'periodontal', label: 'Periodontal' },
    { value: 'surgery', label: 'Surgery' },
    { value: 'pediatric', label: 'Pediatric' },
    { value: 'prosthetics', label: 'Prosthetics' },
    { value: 'orthodontics', label: 'Orthodontics' },
    { value: 'education', label: 'Educational' }
  ];

  const handleViewContent = (procedure) => {
    setSelectedTreatment(procedure);
  };

  const handleCloseModal = () => {
    setSelectedTreatment(null);
  };

  return (
    <div className="min-h-screen bg-bg0">
      <DentistNavigation />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-t1">
                Treatment Content Library
              </h1>
              <p className="text-t3 mt-2">
                Comprehensive overview of all educational materials patients receive
              </p>
            </div>
            <button
              onClick={() => navigate('/dentist-admin-analytics-dashboard')}
              className="flex items-center space-x-2 px-4 py-2 bg-accent text-accent-foreground rounded-lg hover:brightness-110 transition-colors"
            >
              <BarChart3 className="w-5 h-5" />
              <span>View Analytics</span>
            </button>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="card p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-t3">Total Treatments</p>
                  <p className="text-2xl font-bold text-t1">{stats?.totalTreatments}</p>
                </div>
                <Book className="w-8 h-8 text-accent" />
              </div>
            </div>

            <div className="card p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-t3">Total Steps</p>
                  <p className="text-2xl font-bold text-t1">{stats?.totalSteps}</p>
                </div>
                <TrendingUp className="w-8 h-8 text-success" />
              </div>
            </div>

            <div className="card p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-t3">Avg Steps/Treatment</p>
                  <p className="text-2xl font-bold text-t1">{stats?.averageSteps}</p>
                </div>
                <Clock className="w-8 h-8 text-accent2" />
              </div>
            </div>

            <div className="card p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-t3">Categories</p>
                  <p className="text-2xl font-bold text-t1">{stats?.categories}</p>
                </div>
                <Filter className="w-8 h-8 text-warning" />
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="card p-4">
            <div className="flex flex-col sm:flex-row gap-4">
              {/* ADA Code Dropdown */}
              <div className="flex-1 relative" ref={adaDropdownRef}>
                <div
                  onClick={() => setAdaDropdownOpen(!adaDropdownOpen)}
                  className="w-full px-4 py-2 border border-bd rounded-lg bg-bg2 text-t1 cursor-pointer flex items-center justify-between focus-within:border-accent"
                >
                  <span className={selectedAdaCode ? 'text-t1' : 'text-t3'}>
                    {selectedAdaCode
                      ? `${adaCodes.find(c => c.code === selectedAdaCode)?.code || ''} — ${adaCodes.find(c => c.code === selectedAdaCode)?.title || ''}`
                      : 'Search ADA codes...'}
                  </span>
                  <ChevronDown className={`w-4 h-4 text-t3 transition-transform ${adaDropdownOpen ? 'rotate-180' : ''}`} />
                </div>
                {adaDropdownOpen && (
                  <div className="absolute z-50 mt-1 w-full bg-bg1 border border-bd rounded-lg shadow-xl max-h-80 overflow-hidden flex flex-col">
                    <div className="p-2 border-b border-bd">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-t3" />
                        <input
                          type="text"
                          autoFocus
                          placeholder="Type to filter codes..."
                          value={adaSearchTerm}
                          onChange={(e) => setAdaSearchTerm(e.target.value)}
                          onClick={(e) => e.stopPropagation()}
                          className="w-full pl-9 pr-3 py-2 bg-bg2 border border-bd rounded-lg text-t1 text-sm focus:border-accent focus:outline-none"
                        />
                      </div>
                    </div>
                    <div className="overflow-y-auto flex-1">
                      <button
                        onClick={() => { setSelectedAdaCode(''); setSearchQuery(''); setAdaSearchTerm(''); setAdaDropdownOpen(false); }}
                        className={`w-full text-left px-4 py-2.5 text-sm hover:bg-bg2 transition-colors ${!selectedAdaCode ? 'bg-accent/10 text-accent font-medium' : 'text-t2'}`}
                      >
                        All Treatments
                      </button>
                      {filteredAdaCodes.map(c => (
                        <button
                          key={c.code}
                          onClick={() => {
                            setSelectedAdaCode(c.code);
                            setSearchQuery(c.title);
                            setAdaSearchTerm('');
                            setAdaDropdownOpen(false);
                          }}
                          className={`w-full text-left px-4 py-2.5 text-sm hover:bg-bg2 transition-colors flex items-center gap-2 ${selectedAdaCode === c.code ? 'bg-accent/10 text-accent font-medium' : 'text-t1'}`}
                        >
                          <span className="font-mono text-xs text-accent bg-accent/10 px-1.5 py-0.5 rounded">{c.code}</span>
                          <span className="truncate">{c.title}</span>
                        </button>
                      ))}
                      {filteredAdaCodes.length === 0 && (
                        <div className="px-4 py-6 text-center text-t3 text-sm">No ADA codes match your search</div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Category Filter */}
              <div className="sm:w-48">
                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e?.target?.value)}
                  className="w-full px-4 py-2 border border-bd rounded-lg bg-bg2 text-t1 focus:border-accent focus:outline-none"
                >
                  {categories?.map((cat) => (
                    <option key={cat?.value} value={cat?.value}>
                      {cat?.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Language Filter */}
              <div className="sm:w-48">
                <select
                  value={languageFilter}
                  onChange={(e) => setLanguageFilter(e?.target?.value)}
                  className="w-full px-4 py-2 border border-bd rounded-lg bg-bg2 text-t1 focus:border-accent focus:outline-none"
                >
                  <option value="both">Both Languages</option>
                  <option value="en">English Only</option>
                  <option value="es">Spanish Only</option>
                </select>
              </div>
            </div>

            {/* Active Filters Display */}
            {(filterCategory !== 'all' || selectedAdaCode) && (
              <div className="flex flex-wrap gap-2 mt-4">
                {filterCategory !== 'all' && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-accent/10 text-accent">
                    {categories?.find(c => c?.value === filterCategory)?.label}
                    <button
                      onClick={() => setFilterCategory('all')}
                      className="ml-2 hover:text-accent2"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </span>
                )}
                {selectedAdaCode && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-success/10 text-success">
                    {selectedAdaCode} — {adaCodes.find(c => c.code === selectedAdaCode)?.title}
                    <button
                      onClick={() => { setSelectedAdaCode(''); setSearchQuery(''); }}
                      className="ml-2 hover:brightness-110"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </span>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Treatment Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProcedures?.map((procedure) => (
            <TreatmentCard
              key={procedure?.id}
              procedure={procedure}
              onViewContent={handleViewContent}
              languageFilter={languageFilter}
            />
          ))}
        </div>

        {/* Empty State */}
        {filteredProcedures?.length === 0 && (
          <div className="text-center py-12">
            <Book className="w-16 h-16 text-t3 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-t1 mb-2">
              No treatments found
            </h3>
            <p className="text-t2">
              Try adjusting your filters or search query
            </p>
          </div>
        )}
      </div>
      {/* Content Viewer Modal */}
      {selectedTreatment && (
        <ContentViewerModal
          treatment={selectedTreatment}
          onClose={handleCloseModal}
          languageFilter={languageFilter}
        />
      )}
    </div>
  );
};

export default TreatmentContentManagementDashboard;