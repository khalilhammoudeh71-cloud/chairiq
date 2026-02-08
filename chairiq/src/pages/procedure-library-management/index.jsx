import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Edit, Trash2, Search } from 'lucide-react';
import { procedureLibraryService } from '../../services/procedureLibraryService';
import DentistNavigation from '../../components/DentistNavigation';
import Card from '../../components/ui/Card';
import ButtonPrimary from '../../components/ui/ButtonPrimary';
import ButtonSecondary from '../../components/ui/ButtonSecondary';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import Badge from '../../components/ui/Badge';

export default function ProcedureLibraryManagement() {
  const navigate = useNavigate();
  const [procedures, setProcedures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    loadProcedures();
  }, []);

  const loadProcedures = async () => {
    try {
      setLoading(true);
      const data = await procedureLibraryService?.getAll();
      setProcedures(data);
      setError('');
    } catch (err) {
      setError(err?.message || 'Failed to load procedures');
      console.error('Load procedures error:', err);
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
      await loadProcedures();
    } catch (err) {
      setError(err?.message || 'Failed to toggle publish status');
    }
  };

  const handleDelete = async (procedureId) => {
    try {
      await procedureLibraryService?.delete(procedureId);
      setDeleteConfirm(null);
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
    const matchesSearch = proc?.titleEn?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
                         proc?.slug?.toLowerCase()?.includes(searchTerm?.toLowerCase());
    const matchesFilter = filterStatus === 'all' || 
                         (filterStatus === 'published' && proc?.isPublished) ||
                         (filterStatus === 'draft' && !proc?.isPublished);
    return matchesSearch && matchesFilter;
  });

  const stats = {
    total: procedures?.length,
    published: procedures?.filter(p => p?.isPublished)?.length,
    draft: procedures?.filter(p => !p?.isPublished)?.length
  };

  return (
    <>
      <DentistNavigation />
      
      <div className="min-h-screen bg-bg0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-4xl font-bold text-t1 mb-2">Procedure Library</h1>
              <p className="text-t2">Manage your clinical procedure database</p>
            </div>
            <ButtonPrimary onClick={() => setShowModal(true)}>
              <Plus className="mr-2" size={20} />
              Add Procedure
            </ButtonPrimary>
          </div>

          {/* Filters */}
          <Card className="mb-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Input
                type="search"
                placeholder="Search procedures..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e?.target?.value)}
              />
              <Select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e?.target?.value)}
              >
                <option value="all">All Categories</option>
                <option value="preventive">Preventive</option>
                <option value="restorative">Restorative</option>
                <option value="endodontic">Endodontic</option>
                <option value="periodontal">Periodontal</option>
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

          {/* Table */}
          <Card>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b border-bd">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-t2 uppercase">
                      Procedure
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-t2 uppercase">
                      Category
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-t2 uppercase">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-t2 uppercase">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-bd">
                  {filteredProcedures?.map((procedure) => (
                    <tr key={procedure?.id} className="hover:bg-bg1 transition-colors">
                      <td className="px-6 py-4">
                        <div className="text-t1 font-medium">{procedure?.name}</div>
                        <div className="text-t2 text-sm">{procedure?.code}</div>
                      </td>
                      <td className="px-6 py-4 text-t1">{procedure?.category}</td>
                      <td className="px-6 py-4">
                        <Badge variant={procedure?.status === 'published' ? 'success' : 'neutral'}>
                          {procedure?.status}
                        </Badge>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <ButtonSecondary size="sm" onClick={() => handleEdit(procedure)}>
                            <Edit size={16} />
                          </ButtonSecondary>
                          <ButtonSecondary size="sm" onClick={() => handleDelete(procedure?.id)}>
                            <Trash2 size={16} />
                          </ButtonSecondary>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      </div>
    </>
  );
}