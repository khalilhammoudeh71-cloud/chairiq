import React, { useState, useEffect, useRef } from 'react';
import { Search, Upload, Download, Edit2, Trash2, Plus, Save, X, CheckCircle, AlertCircle, FileText, RefreshCw, MapPin, TrendingUp, Shield } from 'lucide-react';
import DentistNavigation from '../../components/DentistNavigation';
import { 
  getAllAdaCodes, 
  getCanonicalProcedures,
  updateAdaCodeMapping,
  createAdaCode,
  updateAdaCode,
  deleteAdaCode,
  bulkImportAdaCodes,
  exportAdaCodesToCSV,
  parseCSVFile,
  getMappingStatistics,
  runBulkAuditChecks,
  exportAuditResultsToCSV
} from '../../services/adaCodeManagementService';

const AdaCodeManagementDashboard = () => {
  // State management
  const [adaCodes, setAdaCodes] = useState([]);
  const [canonicalProcedures, setCanonicalProcedures] = useState([]);
  const [filteredCodes, setFilteredCodes] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterMappingStatus, setFilterMappingStatus] = useState('all');
  const [filterActiveStatus, setFilterActiveStatus] = useState('all');
  const [editingCode, setEditingCode] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showBulkImport, setShowBulkImport] = useState(false);
  const [showAuditModal, setShowAuditModal] = useState(false);
  const [auditResults, setAuditResults] = useState(null);
  const [auditLoading, setAuditLoading] = useState(false);
  const [notification, setNotification] = useState(null);
  const fileInputRef = useRef(null);

  // Form state for add/edit
  const [formData, setFormData] = useState({
    code: '',
    description: '',
    canonicalSlug: '',
    isActive: true
  });

  // Load initial data
  useEffect(() => {
    loadData();
  }, []);

  // Apply filters
  useEffect(() => {
    applyFilters();
  }, [searchTerm, filterCategory, filterMappingStatus, filterActiveStatus, adaCodes]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [codesResult, proceduresResult, statsResult] = await Promise.all([
        getAllAdaCodes(),
        getCanonicalProcedures(),
        getMappingStatistics()
      ]);

      if (codesResult?.success) {
        setAdaCodes(codesResult?.data);
      }

      if (proceduresResult?.success) {
        setCanonicalProcedures(proceduresResult?.data);
      }

      if (statsResult?.success) {
        setStats(statsResult?.stats);
      }
    } catch (error) {
      showNotification('Error loading data: ' + error?.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...adaCodes];

    // Search filter
    if (searchTerm) {
      filtered = filtered?.filter(code => 
        code?.code?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
        code?.description?.toLowerCase()?.includes(searchTerm?.toLowerCase())
      );
    }

    // Category filter
    if (filterCategory !== 'all') {
      filtered = filtered?.filter(code => 
        code?.canonical_procedures?.category === filterCategory
      );
    }

    // Mapping status filter
    if (filterMappingStatus === 'mapped') {
      filtered = filtered?.filter(code => code?.canonical_slug);
    } else if (filterMappingStatus === 'unmapped') {
      filtered = filtered?.filter(code => !code?.canonical_slug);
    }

    // Active status filter
    if (filterActiveStatus !== 'all') {
      const isActive = filterActiveStatus === 'active';
      filtered = filtered?.filter(code => code?.is_active === isActive);
    }

    setFilteredCodes(filtered);
  };

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 5000);
  };

  const handleEditCode = (code) => {
    setEditingCode(code?.code);
    setFormData({
      code: code?.code,
      description: code?.description,
      canonicalSlug: code?.canonical_slug || '',
      isActive: code?.is_active
    });
  };

  const handleCancelEdit = () => {
    setEditingCode(null);
    setFormData({
      code: '',
      description: '',
      canonicalSlug: '',
      isActive: true
    });
  };

  const handleSaveEdit = async () => {
    try {
      const result = await updateAdaCode(editingCode, {
        description: formData?.description,
        canonicalSlug: formData?.canonicalSlug || null,
        isActive: formData?.isActive
      });

      if (result?.success) {
        showNotification('ADA code updated successfully');
        loadData();
        handleCancelEdit();
      } else {
        showNotification('Error updating ADA code: ' + result?.error, 'error');
      }
    } catch (error) {
      showNotification('Error updating ADA code: ' + error?.message, 'error');
    }
  };

  const handleDeleteCode = async (code) => {
    if (!window.confirm(`Are you sure you want to delete ADA code ${code}?`)) {
      return;
    }

    try {
      const result = await deleteAdaCode(code);

      if (result?.success) {
        showNotification('ADA code deleted successfully');
        loadData();
      } else {
        showNotification('Error deleting ADA code: ' + result?.error, 'error');
      }
    } catch (error) {
      showNotification('Error deleting ADA code: ' + error?.message, 'error');
    }
  };

  const handleAddCode = async () => {
    try {
      const result = await createAdaCode(formData);

      if (result?.success) {
        showNotification('ADA code added successfully');
        loadData();
        setShowAddModal(false);
        setFormData({
          code: '',
          description: '',
          canonicalSlug: '',
          isActive: true
        });
      } else {
        showNotification('Error adding ADA code: ' + result?.error, 'error');
      }
    } catch (error) {
      showNotification('Error adding ADA code: ' + error?.message, 'error');
    }
  };

  const handleMappingChange = async (code, newCanonicalSlug) => {
    try {
      const result = await updateAdaCodeMapping(code, newCanonicalSlug || null);

      if (result?.success) {
        showNotification('Mapping updated successfully');
        loadData();
      } else {
        showNotification('Error updating mapping: ' + result?.error, 'error');
      }
    } catch (error) {
      showNotification('Error updating mapping: ' + error?.message, 'error');
    }
  };

  const handleExportCSV = async () => {
    try {
      const result = await exportAdaCodesToCSV({
        searchTerm,
        category: filterCategory !== 'all' ? filterCategory : undefined,
        mappingStatus: filterMappingStatus !== 'all' ? filterMappingStatus : undefined,
        activeStatus: filterActiveStatus !== 'all' ? (filterActiveStatus === 'active') : undefined
      });

      if (result?.success) {
        // Create download link
        const blob = new Blob([result.csvContent], { type: 'text/csv' });
        const url = window.URL?.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `ada_codes_export_${new Date()?.toISOString()?.split('T')?.[0]}.csv`;
        document.body?.appendChild(a);
        a?.click();
        document.body?.removeChild(a);
        window.URL?.revokeObjectURL(url);

        showNotification(`Exported ${result?.rowCount} ADA codes successfully`);
      } else {
        showNotification('Error exporting: ' + result?.error, 'error');
      }
    } catch (error) {
      showNotification('Error exporting: ' + error?.message, 'error');
    }
  };

  const handleImportCSV = async (event) => {
    const file = event?.target?.files?.[0];
    if (!file) return;

    try {
      const text = await file?.text();
      const parseResult = parseCSVFile(text);

      if (!parseResult?.success) {
        showNotification('Error parsing CSV: ' + parseResult?.error, 'error');
        return;
      }

      if (parseResult?.errors?.length > 0) {
        showNotification(
          `CSV contains ${parseResult?.errors?.length} invalid rows. Check console for details.`,
          'error'
        );
        console.error('CSV parse errors:', parseResult?.errors);
      }

      // Confirm import
      const confirmed = window.confirm(
        `Import ${parseResult?.data?.length} ADA codes?\n` +
        `Valid: ${parseResult?.summary?.valid}, Invalid: ${parseResult?.summary?.invalid}`
      );

      if (!confirmed) return;

      const importResult = await bulkImportAdaCodes(parseResult?.data);

      if (importResult?.success) {
        showNotification(
          `Bulk import complete: ${importResult?.summary?.success} succeeded, ${importResult?.summary?.failed} failed`
        );
        loadData();
        setShowBulkImport(false);
      } else {
        showNotification('Error importing: ' + importResult?.error, 'error');
      }
    } catch (error) {
      showNotification('Error importing: ' + error?.message, 'error');
    }

    // Reset file input
    if (fileInputRef?.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleRunAudit = async () => {
    setAuditLoading(true);
    setShowAuditModal(true);
    try {
      const result = await runBulkAuditChecks();

      if (result?.success) {
        setAuditResults(result);
        showNotification('Audit completed successfully');
      } else {
        showNotification('Error running audit: ' + result?.error, 'error');
      }
    } catch (error) {
      showNotification('Error running audit: ' + error?.message, 'error');
    } finally {
      setAuditLoading(false);
    }
  };

  const handleExportAuditResults = () => {
    if (!auditResults) return;

    try {
      const result = exportAuditResultsToCSV(auditResults);

      if (result?.success) {
        // Create download link
        const blob = new Blob([result?.csvContent], { type: 'text/csv' });
        const url = window.URL?.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `audit_results_${new Date()?.toISOString()?.split('T')?.[0]}.csv`;
        document.body?.appendChild(a);
        a?.click();
        document.body?.removeChild(a);
        window.URL?.revokeObjectURL(url);

        showNotification(`Exported ${result?.rowCount} audit findings successfully`);
      } else {
        showNotification('Error exporting audit results: ' + result?.error, 'error');
      }
    } catch (error) {
      showNotification('Error exporting audit results: ' + error?.message, 'error');
    }
  };

  const categories = [...new Set(canonicalProcedures.map(p => p.category).filter(Boolean))];

  return (
    <div className="min-h-screen bg-bg-0">
      <DentistNavigation />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            ADA Code Management Dashboard
          </h1>
          <p className="text-gray-600">
            Manage ADA procedure codes and their mappings to canonical procedures
          </p>
        </div>

        {/* Notification */}
        {notification && (
          <div className={`mb-6 p-4 rounded-lg flex items-center justify-between ${
            notification?.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
          }`}>
            <div className="flex items-center">
              {notification?.type === 'success' ? (
                <CheckCircle className="h-5 w-5 mr-2" />
              ) : (
                <AlertCircle className="h-5 w-5 mr-2" />
              )}
              <span>{notification?.message}</span>
            </div>
            <button
              onClick={() => setNotification(null)}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        )}

        {/* Statistics Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
            <div className="bg-white rounded-lg shadow p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Codes</p>
                  <p className="text-2xl font-bold text-gray-900">{stats?.total}</p>
                </div>
                <FileText className="h-8 w-8 text-blue-500" />
              </div>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Mapped</p>
                  <p className="text-2xl font-bold text-green-600">{stats?.mapped}</p>
                </div>
                <MapPin className="h-8 w-8 text-green-500" />
              </div>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Unmapped</p>
                  <p className="text-2xl font-bold text-orange-600">{stats?.unmapped}</p>
                </div>
                <AlertCircle className="h-8 w-8 text-orange-500" />
              </div>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Active</p>
                  <p className="text-2xl font-bold text-green-600">{stats?.active}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-500" />
              </div>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Coverage</p>
                  <p className="text-2xl font-bold text-blue-600">{stats?.mappingPercentage}%</p>
                </div>
                <TrendingUp className="h-8 w-8 text-blue-500" />
              </div>
            </div>
          </div>
        )}

        {/* Toolbar */}
        <div className="bg-white rounded-lg shadow mb-6 p-4">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by code or description..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e?.target?.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-2">
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e?.target?.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Categories</option>
                {categories?.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>

              <select
                value={filterMappingStatus}
                onChange={(e) => setFilterMappingStatus(e?.target?.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Mappings</option>
                <option value="mapped">Mapped</option>
                <option value="unmapped">Unmapped</option>
              </select>

              <select
                value={filterActiveStatus}
                onChange={(e) => setFilterActiveStatus(e?.target?.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2">
              <button
                onClick={handleRunAudit}
                className="flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
              >
                <Shield className="h-5 w-5" />
                Run Audit
              </button>

              <button
                onClick={() => setShowAddModal(true)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="h-5 w-5" />
                Add Code
              </button>

              <button
                onClick={handleExportCSV}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <Download className="h-5 w-5" />
                Export
              </button>

              <button
                onClick={() => setShowBulkImport(true)}
                className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                <Upload className="h-5 w-5" />
                Import
              </button>

              <button
                onClick={loadData}
                className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                <RefreshCw className="h-5 w-5" />
                Refresh
              </button>
            </div>
          </div>
        </div>

        {/* ADA Codes Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      ADA Code
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Description
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Canonical Procedure
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredCodes?.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                        No ADA codes found matching your filters
                      </td>
                    </tr>
                  ) : (
                    filteredCodes?.map((code) => (
                      <tr key={code?.code} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {code?.code}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          {editingCode === code?.code ? (
                            <input
                              type="text"
                              value={formData?.description}
                              onChange={(e) => setFormData({ ...formData, description: e?.target?.value })}
                              className="w-full px-2 py-1 border border-gray-300 rounded"
                            />
                          ) : (
                            <div className="text-sm text-gray-900">{code?.description}</div>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          {editingCode === code?.code ? (
                            <select
                              value={formData?.canonicalSlug}
                              onChange={(e) => setFormData({ ...formData, canonicalSlug: e?.target?.value })}
                              className="w-full px-2 py-1 border border-gray-300 rounded"
                            >
                              <option value="">-- No Mapping --</option>
                              {canonicalProcedures?.map(proc => (
                                <option key={proc?.slug} value={proc?.slug}>
                                  {proc?.display_name_en} ({proc?.slug})
                                </option>
                              ))}
                            </select>
                          ) : (
                            <select
                              value={code?.canonical_slug || ''}
                              onChange={(e) => handleMappingChange(code?.code, e?.target?.value)}
                              className="text-sm border border-gray-300 rounded px-2 py-1 focus:ring-2 focus:ring-blue-500"
                            >
                              <option value="">-- No Mapping --</option>
                              {canonicalProcedures?.map(proc => (
                                <option key={proc?.slug} value={proc?.slug}>
                                  {proc?.display_name_en}
                                </option>
                              ))}
                            </select>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800">
                            {code?.canonical_procedures?.category || 'N/A'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {editingCode === code?.code ? (
                            <select
                              value={formData?.isActive ? 'active' : 'inactive'}
                              onChange={(e) => setFormData({ ...formData, isActive: e?.target?.value === 'active' })}
                              className="text-sm border border-gray-300 rounded px-2 py-1"
                            >
                              <option value="active">Active</option>
                              <option value="inactive">Inactive</option>
                            </select>
                          ) : (
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                              code?.is_active 
                                ? 'bg-green-100 text-green-800' :'bg-gray-100 text-gray-800'
                            }`}>
                              {code?.is_active ? 'Active' : 'Inactive'}
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          {editingCode === code?.code ? (
                            <div className="flex gap-2">
                              <button
                                onClick={handleSaveEdit}
                                className="text-green-600 hover:text-green-900"
                              >
                                <Save className="h-5 w-5" />
                              </button>
                              <button
                                onClick={handleCancelEdit}
                                className="text-gray-600 hover:text-gray-900"
                              >
                                <X className="h-5 w-5" />
                              </button>
                            </div>
                          ) : (
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleEditCode(code)}
                                className="text-blue-600 hover:text-blue-900"
                              >
                                <Edit2 className="h-5 w-5" />
                              </button>
                              <button
                                onClick={() => handleDeleteCode(code?.code)}
                                className="text-red-600 hover:text-red-900"
                              >
                                <Trash2 className="h-5 w-5" />
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Results count */}
        <div className="mt-4 text-sm text-gray-600 text-center">
          Showing {filteredCodes?.length} of {adaCodes?.length} ADA codes
        </div>
      </div>
      {/* Add Code Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-900">Add New ADA Code</h2>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  ADA Code *
                </label>
                <input
                  type="text"
                  value={formData?.code}
                  onChange={(e) => setFormData({ ...formData, code: e?.target?.value })}
                  placeholder="e.g., D2740"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description *
                </label>
                <textarea
                  value={formData?.description}
                  onChange={(e) => setFormData({ ...formData, description: e?.target?.value })}
                  placeholder="Enter procedure description"
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Canonical Procedure
                </label>
                <select
                  value={formData?.canonicalSlug}
                  onChange={(e) => setFormData({ ...formData, canonicalSlug: e?.target?.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">-- No Mapping --</option>
                  {canonicalProcedures?.map(proc => (
                    <option key={proc?.slug} value={proc?.slug}>
                      {proc?.display_name_en} ({proc?.slug})
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={formData?.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e?.target?.checked })}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="isActive" className="ml-2 text-sm text-gray-700">
                  Active
                </label>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={handleAddCode}
                disabled={!formData?.code || !formData?.description}
                className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Add Code
              </button>
              <button
                onClick={() => setShowAddModal(false)}
                className="flex-1 bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Bulk Import Modal */}
      {showBulkImport && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-lg w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-900">Bulk Import ADA Codes</h2>
              <button
                onClick={() => setShowBulkImport(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="font-semibold text-blue-900 mb-2">CSV Format Requirements:</h3>
                <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
                  <li>Required columns: Code, Description, Canonical Slug</li>
                  <li>Optional column: Is Active (Yes/No)</li>
                  <li>First row must contain column headers</li>
                  <li>Existing codes will be updated, new codes will be created</li>
                </ul>
              </div>

              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                <Upload className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                <p className="text-sm text-gray-600 mb-4">
                  Click to select CSV file or drag and drop
                </p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".csv"
                  onChange={handleImportCSV}
                  className="hidden"
                />
                <button
                  onClick={() => fileInputRef?.current?.click()}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Select CSV File
                </button>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowBulkImport(false)}
                className="flex-1 bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Audit Results Modal */}
      {showAuditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full p-6 my-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Bulk Audit Results</h2>
              <button
                onClick={() => setShowAuditModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {auditLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
              </div>
            ) : auditResults ? (
              <div className="space-y-6">
                {/* Summary Cards */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                  <div className="bg-blue-50 rounded-lg p-4">
                    <p className="text-sm text-blue-800 font-medium">Total ADA Codes</p>
                    <p className="text-2xl font-bold text-blue-900">{auditResults?.summary?.total_ada_codes}</p>
                  </div>
                  <div className="bg-orange-50 rounded-lg p-4">
                    <p className="text-sm text-orange-800 font-medium">Unmapped Codes</p>
                    <p className="text-2xl font-bold text-orange-900">{auditResults?.summary?.unmapped_ada_codes}</p>
                  </div>
                  <div className="bg-red-50 rounded-lg p-4">
                    <p className="text-sm text-red-800 font-medium">Missing Visuals</p>
                    <p className="text-2xl font-bold text-red-900">{auditResults?.summary?.procedures_missing_visuals}</p>
                  </div>
                  <div className="bg-yellow-50 rounded-lg p-4">
                    <p className="text-sm text-yellow-800 font-medium">Incomplete Bilingual</p>
                    <p className="text-2xl font-bold text-yellow-900">{auditResults?.summary?.incomplete_bilingual_content}</p>
                  </div>
                  <div className="bg-purple-50 rounded-lg p-4">
                    <p className="text-sm text-purple-800 font-medium">Canonical Conflicts</p>
                    <p className="text-2xl font-bold text-purple-900">{auditResults?.summary?.canonical_conflicts}</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-sm text-gray-800 font-medium">Total Issues</p>
                    <p className="text-2xl font-bold text-gray-900">{auditResults?.summary?.total_issues}</p>
                  </div>
                </div>

                {/* Detailed Results Sections */}
                <div className="space-y-4">
                  {/* Unmapped ADA Codes */}
                  {auditResults?.details?.unmapped_ada_codes?.length > 0 && (
                    <div className="bg-white border border-orange-200 rounded-lg p-4">
                      <h3 className="text-lg font-semibold text-orange-900 mb-3 flex items-center gap-2">
                        <AlertCircle className="h-5 w-5" />
                        Unmapped ADA Codes ({auditResults?.details?.unmapped_ada_codes?.length})
                      </h3>
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead className="bg-orange-50">
                            <tr>
                              <th className="px-4 py-2 text-left font-medium text-orange-900">Code</th>
                              <th className="px-4 py-2 text-left font-medium text-orange-900">Description</th>
                              <th className="px-4 py-2 text-left font-medium text-orange-900">Severity</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-orange-100">
                            {auditResults?.details?.unmapped_ada_codes?.map((item, index) => (
                              <tr key={index} className="hover:bg-orange-50">
                                <td className="px-4 py-2 font-medium">{item?.code}</td>
                                <td className="px-4 py-2">{item?.description}</td>
                                <td className="px-4 py-2">
                                  <span className="px-2 py-1 text-xs font-medium rounded-full bg-orange-100 text-orange-800">
                                    {item?.severity}
                                  </span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  {/* Procedures Missing Visuals */}
                  {auditResults?.details?.procedures_missing_visuals?.length > 0 && (
                    <div className="bg-white border border-red-200 rounded-lg p-4">
                      <h3 className="text-lg font-semibold text-red-900 mb-3 flex items-center gap-2">
                        <AlertCircle className="h-5 w-5" />
                        Procedures Missing Visuals ({auditResults?.details?.procedures_missing_visuals?.length})
                      </h3>
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead className="bg-red-50">
                            <tr>
                              <th className="px-4 py-2 text-left font-medium text-red-900">Slug</th>
                              <th className="px-4 py-2 text-left font-medium text-red-900">Display Name</th>
                              <th className="px-4 py-2 text-left font-medium text-red-900">Category</th>
                              <th className="px-4 py-2 text-left font-medium text-red-900">Severity</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-red-100">
                            {auditResults?.details?.procedures_missing_visuals?.map((item, index) => (
                              <tr key={index} className="hover:bg-red-50">
                                <td className="px-4 py-2 font-medium">{item?.slug}</td>
                                <td className="px-4 py-2">{item?.display_name}</td>
                                <td className="px-4 py-2">{item?.category}</td>
                                <td className="px-4 py-2">
                                  <span className="px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800">
                                    {item?.severity}
                                  </span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  {/* Incomplete Bilingual Content */}
                  {auditResults?.details?.incomplete_bilingual_content?.length > 0 && (
                    <div className="bg-white border border-yellow-200 rounded-lg p-4">
                      <h3 className="text-lg font-semibold text-yellow-900 mb-3 flex items-center gap-2">
                        <AlertCircle className="h-5 w-5" />
                        Incomplete Bilingual Content ({auditResults?.details?.incomplete_bilingual_content?.length})
                      </h3>
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead className="bg-yellow-50">
                            <tr>
                              <th className="px-4 py-2 text-left font-medium text-yellow-900">Canonical Slug</th>
                              <th className="px-4 py-2 text-left font-medium text-yellow-900">Missing Fields</th>
                              <th className="px-4 py-2 text-left font-medium text-yellow-900">Severity</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-yellow-100">
                            {auditResults?.details?.incomplete_bilingual_content?.map((item, index) => (
                              <tr key={index} className="hover:bg-yellow-50">
                                <td className="px-4 py-2 font-medium">{item?.canonical_slug}</td>
                                <td className="px-4 py-2">{item?.missing_fields?.join(', ')}</td>
                                <td className="px-4 py-2">
                                  <span className="px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800">
                                    {item?.severity}
                                  </span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  {/* Canonical Conflicts */}
                  {auditResults?.details?.canonical_conflicts?.length > 0 && (
                    <div className="bg-white border border-purple-200 rounded-lg p-4">
                      <h3 className="text-lg font-semibold text-purple-900 mb-3 flex items-center gap-2">
                        <AlertCircle className="h-5 w-5" />
                        Canonical-to-Procedure Conflicts ({auditResults?.details?.canonical_conflicts?.length})
                      </h3>
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead className="bg-purple-50">
                            <tr>
                              <th className="px-4 py-2 text-left font-medium text-purple-900">Slug</th>
                              <th className="px-4 py-2 text-left font-medium text-purple-900">Display Name</th>
                              <th className="px-4 py-2 text-left font-medium text-purple-900">Affected ADA Codes</th>
                              <th className="px-4 py-2 text-left font-medium text-purple-900">Severity</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-purple-100">
                            {auditResults?.details?.canonical_conflicts?.map((item, index) => (
                              <tr key={index} className="hover:bg-purple-50">
                                <td className="px-4 py-2 font-medium">{item?.slug}</td>
                                <td className="px-4 py-2">{item?.display_name}</td>
                                <td className="px-4 py-2">{item?.affected_ada_codes?.join(', ')}</td>
                                <td className="px-4 py-2">
                                  <span className="px-2 py-1 text-xs font-medium rounded-full bg-purple-100 text-purple-800">
                                    {item?.severity}
                                  </span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  {/* Unpublished with Mappings */}
                  {auditResults?.details?.unpublished_with_mappings?.length > 0 && (
                    <div className="bg-white border border-gray-200 rounded-lg p-4">
                      <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                        <AlertCircle className="h-5 w-5" />
                        Unpublished Procedures with Mappings ({auditResults?.details?.unpublished_with_mappings?.length})
                      </h3>
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead className="bg-gray-50">
                            <tr>
                              <th className="px-4 py-2 text-left font-medium text-gray-900">Canonical Slug</th>
                              <th className="px-4 py-2 text-left font-medium text-gray-900">Affected ADA Codes</th>
                              <th className="px-4 py-2 text-left font-medium text-gray-900">Severity</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-100">
                            {auditResults?.details?.unpublished_with_mappings?.map((item, index) => (
                              <tr key={index} className="hover:bg-gray-50">
                                <td className="px-4 py-2 font-medium">{item?.canonical_slug}</td>
                                <td className="px-4 py-2">{item?.affected_ada_codes?.join(', ')}</td>
                                <td className="px-4 py-2">
                                  <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800">
                                    {item?.severity}
                                  </span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  {/* No Issues Found */}
                  {auditResults?.summary?.total_issues === 0 && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-8 text-center">
                      <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-3" />
                      <h3 className="text-lg font-semibold text-green-900 mb-2">All Clear!</h3>
                      <p className="text-green-800">No issues found during the audit check.</p>
                    </div>
                  )}
                </div>

                {/* Export Button */}
                {auditResults?.summary?.total_issues > 0 && (
                  <div className="flex justify-end gap-3 pt-4 border-t">
                    <button
                      onClick={handleExportAuditResults}
                      className="flex items-center gap-2 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                      <Download className="h-5 w-5" />
                      Export Audit Report
                    </button>
                    <button
                      onClick={() => setShowAuditModal(false)}
                      className="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
                    >
                      Close
                    </button>
                  </div>
                )}
              </div>
            ) : null}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdaCodeManagementDashboard;