import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Edit, Trash2, Search, Copy, Eye, EyeOff, CheckCircle, AlertCircle, BookOpen } from 'lucide-react';
import { procedureLibraryService } from '../../services/procedureLibraryService';
import DentistNavigation from '../../components/DentistNavigation';
import Card from '../../components/ui/Card';
import ButtonPrimary from '../../components/ui/ButtonPrimary';
import ButtonSecondary from '../../components/ui/ButtonSecondary';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import Badge from '../../components/ui/Badge';

const ALL_CATEGORIES = [
  { value: 'all', label: 'All Categories' },
  { value: 'preventive', label: 'Preventive' },
  { value: 'restorative', label: 'Restorative' },
  { value: 'endodontics', label: 'Endodontics' },
  { value: 'endodontic', label: 'Endodontic' },
  { value: 'periodontics', label: 'Periodontics' },
  { value: 'periodontic', label: 'Periodontic' },
  { value: 'prosthodontics', label: 'Prosthodontics' },
  { value: 'surgery', label: 'Surgery' },
  { value: 'oral-surgery', label: 'Oral Surgery' },
  { value: 'orthodontics', label: 'Orthodontics' },
  { value: 'cosmetic', label: 'Cosmetic' },
  { value: 'adjunctive', label: 'Adjunctive' },
  { value: 'diagnostic', label: 'Diagnostic' },
  { value: 'implants', label: 'Implants' },
  { value: 'pediatric', label: 'Pediatric' },
  { value: 'emergency', label: 'Emergency' },
];

function getContentCompleteness(proc) {
  const fields = [
    proc?.titleEn, proc?.titleEs,
    proc?.summaryEn, proc?.summaryEs,
    proc?.whyEn, proc?.whyEs,
    proc?.aftercareEn, proc?.aftercareEs,
  ];
  const jsonFields = [
    proc?.stepsEn, proc?.stepsEs,
    proc?.faqsEn, proc?.faqsEs,
  ];
  let filled = 0;
  let total = fields.length + jsonFields.length;
  fields.forEach(f => { if (f && f.trim?.() !== '') filled++; });
  jsonFields.forEach(f => { if (f && Array.isArray(f) && f.length > 0) filled++; });
  return Math.round((filled / total) * 100);
}

export default function ProcedureLibraryManagement() {
  const navigate = useNavigate();
  const [procedures, setProcedures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  useEffect(() => {
    loadProcedures();
  }, []);

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => setSuccess(''), 3000);
      return () => clearTimeout(timer);
    }
  }, [success]);

  const loadProcedures = async () => {
    try {
      setLoading(true);
      const data = await procedureLibraryService?.getAll();
      setProcedures(data || []);
      setError('');
    } catch (err) {
      setError(err?.message || 'Failed to load procedures');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateNew = () => {
    navigate('/markdown-content-editor', { state: { mode: 'create' } });
  };

  const handleEdit = (procedure) => {
    navigate('/markdown-content-editor', { state: { mode: 'edit', procedureId: procedure?.id } });
  };

  const handleDuplicate = async (procedure) => {
    try {
      const newSlug = `${procedure?.slug}-copy-${Date.now()}`;
      await procedureLibraryService?.duplicate(procedure?.id, newSlug);
      setSuccess(`Duplicated "${procedure?.titleEn}" successfully`);
      await loadProcedures();
    } catch (err) {
      setError(err?.message || 'Failed to duplicate procedure');
    }
  };

  const handleTogglePublish = async (procedure) => {
    try {
      await procedureLibraryService?.update(procedure?.id, {
        isPublished: !procedure?.isPublished
      });
      setSuccess(`${procedure?.titleEn} ${procedure?.isPublished ? 'unpublished' : 'published'}`);
      await loadProcedures();
    } catch (err) {
      setError(err?.message || 'Failed to toggle publish status');
    }
  };

  const handleDelete = async (procedureId) => {
    try {
      await procedureLibraryService?.delete(procedureId);
      setDeleteConfirm(null);
      setSuccess('Procedure deleted successfully');
      await loadProcedures();
    } catch (err) {
      setError(err?.message || 'Failed to delete procedure');
    }
  };

  const handleReset = () => {
    setSearchTerm('');
    setFilterCategory('all');
    setFilterStatus('all');
  };

  const filteredProcedures = procedures?.filter(proc => {
    const matchesSearch = !searchTerm ||
      proc?.titleEn?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
      proc?.titleEs?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
      proc?.slug?.toLowerCase()?.includes(searchTerm?.toLowerCase());
    const matchesCategory = filterCategory === 'all' || proc?.category === filterCategory;
    const matchesStatus = filterStatus === 'all' ||
      (filterStatus === 'published' && proc?.isPublished) ||
      (filterStatus === 'draft' && !proc?.isPublished);
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const stats = {
    total: procedures?.length || 0,
    published: procedures?.filter(p => p?.isPublished)?.length || 0,
    draft: procedures?.filter(p => !p?.isPublished)?.length || 0,
    complete: procedures?.filter(p => getContentCompleteness(p) === 100)?.length || 0,
  };

  if (loading) {
    return (
      <>
        <DentistNavigation />
        <div className="min-h-screen bg-bg0 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin w-12 h-12 border-4 border-accent border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-t2">Loading procedure library...</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <DentistNavigation />

      <div className="min-h-screen bg-bg0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-t1 mb-1">Procedure Library</h1>
              <p className="text-t2">Manage bilingual educational content for patient treatment plans</p>
            </div>
            <ButtonPrimary onClick={handleCreateNew}>
              <Plus className="mr-2" size={20} />
              Add Procedure
            </ButtonPrimary>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <Card className="p-4 text-center">
              <p className="text-3xl font-bold text-t1">{stats.total}</p>
              <p className="text-sm text-t2">Total Procedures</p>
            </Card>
            <Card className="p-4 text-center">
              <p className="text-3xl font-bold text-success">{stats.published}</p>
              <p className="text-sm text-t2">Published</p>
            </Card>
            <Card className="p-4 text-center">
              <p className="text-3xl font-bold text-warning">{stats.draft}</p>
              <p className="text-sm text-t2">Drafts</p>
            </Card>
            <Card className="p-4 text-center">
              <p className="text-3xl font-bold text-accent">{stats.complete}</p>
              <p className="text-sm text-t2">Fully Complete</p>
            </Card>
          </div>

          {error && (
            <div className="bg-danger/10 border border-danger/20 rounded-lg p-4 mb-6 flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-danger flex-shrink-0" />
              <p className="text-danger">{error}</p>
              <button onClick={() => setError('')} className="ml-auto text-danger hover:text-danger/80 text-sm">Dismiss</button>
            </div>
          )}
          {success && (
            <div className="bg-success/10 border border-success/20 rounded-lg p-4 mb-6 flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-success flex-shrink-0" />
              <p className="text-success">{success}</p>
            </div>
          )}

          <Card className="mb-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-t3" />
                <Input
                  type="search"
                  placeholder="Search by title or slug..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e?.target?.value)}
                  className="pl-10"
                />
              </div>
              <Select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e?.target?.value)}
              >
                {ALL_CATEGORIES.map(cat => (
                  <option key={cat.value} value={cat.value}>{cat.label}</option>
                ))}
              </Select>
              <Select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e?.target?.value)}
              >
                <option value="all">All Status</option>
                <option value="published">Published</option>
                <option value="draft">Draft</option>
              </Select>
              <ButtonSecondary onClick={handleReset} className="w-full">
                Reset Filters
              </ButtonSecondary>
            </div>
          </Card>

          {filteredProcedures?.length === 0 ? (
            <Card className="p-12 text-center">
              <BookOpen className="w-12 h-12 text-t3 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-t1 mb-2">
                {procedures?.length === 0 ? 'No procedures yet' : 'No matching procedures'}
              </h3>
              <p className="text-t2 mb-6">
                {procedures?.length === 0
                  ? 'Create your first procedure to get started.'
                  : 'Try adjusting your search or filters.'}
              </p>
              {procedures?.length === 0 && (
                <ButtonPrimary onClick={handleCreateNew}>
                  <Plus className="mr-2" size={16} />
                  Create First Procedure
                </ButtonPrimary>
              )}
            </Card>
          ) : (
            <Card>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="border-b border-bd">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-t2 uppercase tracking-wider">
                        Procedure
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-t2 uppercase tracking-wider">
                        Category
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-t2 uppercase tracking-wider">
                        Content
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-t2 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-t2 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-bd">
                    {filteredProcedures?.map((procedure) => {
                      const completeness = getContentCompleteness(procedure);
                      const hasSpanish = !!(procedure?.titleEs && procedure?.summaryEs);
                      return (
                        <tr key={procedure?.id} className="hover:bg-bg1 transition-colors">
                          <td className="px-6 py-4">
                            <div className="text-t1 font-medium">{procedure?.titleEn || 'Untitled'}</div>
                            <div className="text-t3 text-sm font-mono">{procedure?.slug}</div>
                            {hasSpanish && (
                              <div className="text-t3 text-xs mt-0.5">{procedure?.titleEs}</div>
                            )}
                          </td>
                          <td className="px-6 py-4">
                            <Badge variant="neutral">
                              {procedure?.category || 'uncategorized'}
                            </Badge>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <div className="w-20 h-2 bg-bg3 rounded-full overflow-hidden">
                                <div
                                  className="h-full rounded-full transition-all"
                                  style={{
                                    width: `${completeness}%`,
                                    backgroundColor: completeness === 100 ? 'var(--success)' : completeness >= 50 ? 'var(--warning)' : 'var(--danger)',
                                  }}
                                />
                              </div>
                              <span className="text-xs text-t3">{completeness}%</span>
                            </div>
                            <div className="flex gap-1 mt-1">
                              {hasSpanish && (
                                <span className="text-xs px-1.5 py-0.5 rounded bg-accent/10 text-accent">EN+ES</span>
                              )}
                              {!hasSpanish && (
                                <span className="text-xs px-1.5 py-0.5 rounded bg-warning/10 text-warning">EN only</span>
                              )}
                              {procedure?.stepsEn?.length > 0 && (
                                <span className="text-xs px-1.5 py-0.5 rounded bg-bg3 text-t3">{procedure?.stepsEn?.length} steps</span>
                              )}
                              {procedure?.faqsEn?.length > 0 && (
                                <span className="text-xs px-1.5 py-0.5 rounded bg-bg3 text-t3">{procedure?.faqsEn?.length} FAQs</span>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <button
                              onClick={() => handleTogglePublish(procedure)}
                              className="flex items-center gap-1.5 cursor-pointer"
                              title={procedure?.isPublished ? 'Click to unpublish' : 'Click to publish'}
                            >
                              {procedure?.isPublished ? (
                                <Badge variant="success">
                                  <Eye className="w-3 h-3 mr-1" />
                                  Published
                                </Badge>
                              ) : (
                                <Badge variant="warning">
                                  <EyeOff className="w-3 h-3 mr-1" />
                                  Draft
                                </Badge>
                              )}
                            </button>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => handleEdit(procedure)}
                                className="p-2 text-t2 hover:text-accent hover:bg-accent/10 rounded-lg transition-colors"
                                title="Edit"
                              >
                                <Edit size={16} />
                              </button>
                              <button
                                onClick={() => handleDuplicate(procedure)}
                                className="p-2 text-t2 hover:text-accent hover:bg-accent/10 rounded-lg transition-colors"
                                title="Duplicate"
                              >
                                <Copy size={16} />
                              </button>
                              {deleteConfirm === procedure?.id ? (
                                <div className="flex items-center gap-1">
                                  <button
                                    onClick={() => handleDelete(procedure?.id)}
                                    className="px-2 py-1 text-xs bg-danger text-white rounded hover:brightness-110"
                                  >
                                    Confirm
                                  </button>
                                  <button
                                    onClick={() => setDeleteConfirm(null)}
                                    className="px-2 py-1 text-xs bg-bg3 text-t2 rounded hover:bg-bg2"
                                  >
                                    Cancel
                                  </button>
                                </div>
                              ) : (
                                <button
                                  onClick={() => setDeleteConfirm(procedure?.id)}
                                  className="p-2 text-t2 hover:text-danger hover:bg-danger/10 rounded-lg transition-colors"
                                  title="Delete"
                                >
                                  <Trash2 size={16} />
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              <div className="px-6 py-3 border-t border-bd text-sm text-t3">
                Showing {filteredProcedures?.length} of {procedures?.length} procedures
              </div>
            </Card>
          )}
        </div>
      </div>
    </>
  );
}
