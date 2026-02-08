import React, { useState, useEffect } from 'react';
import { X, Search, Star, Clock } from 'lucide-react';
import { procedureCodesService } from '../../../services/procedureCodesService';
import { procedureLibraryService } from '../../../services/procedureLibraryService';
import { supabase } from '../../../lib/supabase';

export default function AddProcedureDrawer({ 
  isOpen, 
  onClose, 
  onSave, 
  isMobile = false 
}) {
  const [currentUser, setCurrentUser] = useState(null);
  const [procedureCodes, setProcedureCodes] = useState([]);
  const [procedureLibrary, setProcedureLibrary] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [recents, setRecents] = useState([]);
  const [activeTab, setActiveTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectionMethod, setSelectionMethod] = useState('library'); // 'library', 'code', 'manual'
  
  // Form state
  const [formData, setFormData] = useState({
    procedureSlug: '',
    adaCode: '',
    displayTitle: '',
    procedureName: '',
    toothNumbers: '',
    priority: 'Soon',
    estTime: '',
    notesForPatient: ''
  });

  const [showToothPicker, setShowToothPicker] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadInitialData();
    }
  }, [isOpen]);

  const loadInitialData = async () => {
    try {
      const { data: { user } } = await supabase?.auth?.getUser();
      setCurrentUser(user);

      const [codes, library] = await Promise.all([
        procedureCodesService?.getAllCodes(),
        procedureLibraryService?.getAll()
      ]);

      setProcedureCodes(codes || []);
      setProcedureLibrary(library || []);

      if (user) {
        const [favs, recs] = await Promise.all([
          procedureCodesService?.getFavorites(user?.id),
          procedureCodesService?.getRecents(user?.id)
        ]);
        setFavorites(favs || []);
        setRecents(recs || []);
      }
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  const handleFieldChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleProcedureSelect = async (procedure) => {
    if (procedure?.slug) {
      // From procedure library
      setFormData(prev => ({
        ...prev,
        procedureSlug: procedure?.slug,
        displayTitle: procedure?.titleEn,
        procedureName: procedure?.titleEn
      }));
      if (currentUser) {
        await procedureCodesService?.addRecent(currentUser?.id, procedure?.slug, null);
      }
    } else if (procedure?.code) {
      // From procedure codes
      setFormData(prev => ({
        ...prev,
        adaCode: procedure?.code,
        displayTitle: procedure?.title,
        procedureName: procedure?.title
      }));
      if (currentUser) {
        await procedureCodesService?.addRecent(currentUser?.id, null, procedure?.code);
      }
    }
    setSearchTerm('');
  };

  const toggleToothNumber = (toothNumber) => {
    const currentTeeth = formData?.toothNumbers || '';
    const teethArray = currentTeeth?.split(',')?.map(t => t?.trim())?.filter(Boolean);
    const toothStr = `#${toothNumber}`;
    const toothIndex = teethArray?.indexOf(toothStr);

    let newTeethArray;
    if (toothIndex > -1) {
      newTeethArray = teethArray?.filter((_, i) => i !== toothIndex);
    } else {
      newTeethArray = [...teethArray, toothStr];
    }

    handleFieldChange('toothNumbers', newTeethArray?.join(', '));
  };

  const isToothSelected = (toothNumber) => {
    return formData?.toothNumbers?.includes(`#${toothNumber}`);
  };

  const handleToggleFavorite = async (procedureSlug, adaCode) => {
    if (!currentUser) return;

    const existingFav = favorites?.find(f => 
      (f?.procedureSlug === procedureSlug && procedureSlug) ||
      (f?.adaCode === adaCode && adaCode)
    );

    try {
      if (existingFav) {
        await procedureCodesService?.removeFavorite(existingFav?.id);
      } else {
        await procedureCodesService?.addFavorite(currentUser?.id, procedureSlug, adaCode);
      }
      const favs = await procedureCodesService?.getFavorites(currentUser?.id);
      setFavorites(favs || []);
    } catch (error) {
      console.error('Error updating favorites:', error);
    }
  };

  const isFavorite = (procedureSlug, adaCode) => {
    return favorites?.some(f => 
      (f?.procedureSlug === procedureSlug && procedureSlug) ||
      (f?.adaCode === adaCode && adaCode)
    );
  };

  const getFilteredProcedures = () => {
    let items = [];
    
    if (activeTab === 'favorites') {
      items = favorites?.map(fav => {
        if (fav?.procedureSlug) {
          return procedureLibrary?.find(p => p?.slug === fav?.procedureSlug);
        } else if (fav?.adaCode) {
          return procedureCodes?.find(c => c?.code === fav?.adaCode);
        }
        return null;
      })?.filter(Boolean);
    } else if (activeTab === 'recents') {
      items = recents?.map(rec => {
        if (rec?.procedureSlug) {
          return procedureLibrary?.find(p => p?.slug === rec?.procedureSlug);
        } else if (rec?.adaCode) {
          return procedureCodes?.find(c => c?.code === rec?.adaCode);
        }
        return null;
      })?.filter(Boolean);
    } else {
      items = [...procedureLibrary, ...procedureCodes];
    }

    if (!searchTerm) return items;

    return items?.filter(item => {
      const searchLower = searchTerm?.toLowerCase();
      if (item?.titleEn) {
        return item?.titleEn?.toLowerCase()?.includes(searchLower);
      }
      if (item?.code && item?.title) {
        return item?.code?.toLowerCase()?.includes(searchLower) ||
               item?.title?.toLowerCase()?.includes(searchLower);
      }
      return false;
    });
  };

  const handleSave = () => {
    console.log('🎯 DRAWER SAVE CLICKED');
    console.log('Form data before validation:', formData);
    
    // Validate
    if (!formData?.procedureSlug && !formData?.adaCode && !formData?.displayTitle?.trim()) {
      console.error('❌ Drawer validation failed - no valid identifier');
      alert('Please select or enter a procedure');
      return;
    }

    console.log('✅ Drawer validation passed, calling onSave with:', formData);
    onSave(formData);
    
    console.log('🧹 Resetting drawer form...');
    // Reset form
    setFormData({
      procedureSlug: '',
      adaCode: '',
      displayTitle: '',
      procedureName: '',
      toothNumbers: '',
      priority: 'Soon',
      estTime: '',
      notesForPatient: ''
    });
    setSearchTerm('');
    console.log('✅ Drawer reset complete');
  };

  if (!isOpen) return null;

  const drawerClasses = isMobile
    ? 'fixed inset-0 z-50 bg-slate-900' :'fixed right-0 top-0 h-full w-full md:w-[600px] z-50 bg-slate-800 border-l border-blue-400';

  const filteredProcedures = getFilteredProcedures();

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 z-40 transition-opacity"
        onClick={onClose}
      />
      {/* Drawer */}
      <div className={`${drawerClasses} overflow-y-auto animate-slide-in-right`}>
        {/* Header */}
        <div className="sticky top-0 bg-slate-800 border-b border-blue-400/30 p-6 z-10">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-white">Add Procedure</h2>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Selection Method */}
          <div>
            <label className="block text-blue-100 mb-3 text-base font-semibold">
              Selection Method
            </label>
            <div className="grid grid-cols-3 gap-3">
              <button
                onClick={() => setSelectionMethod('library')}
                className={`px-4 py-3 rounded-lg font-semibold text-sm transition-colors ${
                  selectionMethod === 'library' ?'bg-blue-600 text-white' :'bg-slate-700 text-blue-200 hover:bg-slate-600'
                }`}
              >
                Treatment Title
              </button>
              <button
                onClick={() => setSelectionMethod('code')}
                className={`px-4 py-3 rounded-lg font-semibold text-sm transition-colors ${
                  selectionMethod === 'code' ?'bg-blue-600 text-white' :'bg-slate-700 text-blue-200 hover:bg-slate-600'
                }`}
              >
                ADA Code
              </button>
              <button
                onClick={() => setSelectionMethod('manual')}
                className={`px-4 py-3 rounded-lg font-semibold text-sm transition-colors ${
                  selectionMethod === 'manual' ?'bg-blue-600 text-white' :'bg-slate-700 text-blue-200 hover:bg-slate-600'
                }`}
              >
                Manual Entry
              </button>
            </div>
          </div>

          {/* Quick Access Tabs (for library/code selection) */}
          {(selectionMethod === 'library' || selectionMethod === 'code') && (
            <div className="flex gap-2">
              <button
                onClick={() => setActiveTab('all')}
                className={`px-4 py-2 rounded-lg font-semibold text-sm transition-colors ${
                  activeTab === 'all' ? 'bg-blue-600 text-white' : 'bg-slate-700 text-blue-200 hover:bg-slate-600'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setActiveTab('favorites')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-sm transition-colors ${
                  activeTab === 'favorites' ? 'bg-blue-600 text-white' : 'bg-slate-700 text-blue-200 hover:bg-slate-600'
                }`}
              >
                <Star size={14} />
                Favorites ({favorites?.length || 0})
              </button>
              <button
                onClick={() => setActiveTab('recents')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-sm transition-colors ${
                  activeTab === 'recents' ? 'bg-blue-600 text-white' : 'bg-slate-700 text-blue-200 hover:bg-slate-600'
                }`}
              >
                <Clock size={14} />
                Recent ({recents?.length || 0})
              </button>
            </div>
          )}

          {/* Search & Selection */}
          {(selectionMethod === 'library' || selectionMethod === 'code') && (
            <div>
              <label className="block text-blue-100 mb-2 text-base font-semibold">
                {selectionMethod === 'library' ? 'Search Treatment Titles' : 'Search ADA Codes'}
              </label>
              <div className="relative mb-3">
                <Search className="absolute left-3 top-3 text-gray-400" size={20} />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e?.target?.value)}
                  placeholder={selectionMethod === 'library' ? 'Search procedures...' : 'Search codes...'}
                  className="w-full pl-10 pr-3 py-2 bg-slate-700 border-2 border-blue-400/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>

              {/* Procedure List */}
              <div className="max-h-64 overflow-y-auto bg-slate-700 rounded-lg border border-blue-400/30">
                {filteredProcedures?.length > 0 ? (
                  filteredProcedures?.map((item, index) => (
                    <button
                      key={index}
                      onClick={() => handleProcedureSelect(item)}
                      className="w-full text-left px-4 py-3 text-white hover:bg-slate-600 transition-colors flex items-center justify-between border-b border-slate-600 last:border-b-0"
                    >
                      <div className="flex-1">
                        {item?.titleEn && <span className="font-medium">{item?.titleEn}</span>}
                        {item?.code && (
                          <div>
                            <span className="font-semibold text-blue-300">{item?.code}</span>
                            <span className="ml-2 text-gray-300">{item?.title}</span>
                          </div>
                        )}
                      </div>
                      <button
                        onClick={(e) => {
                          e?.stopPropagation();
                          handleToggleFavorite(item?.slug, item?.code);
                        }}
                        className="ml-2 text-yellow-400 hover:text-yellow-300"
                      >
                        <Star 
                          size={16} 
                          fill={isFavorite(item?.slug, item?.code) ? 'currentColor' : 'none'} 
                        />
                      </button>
                    </button>
                  ))
                ) : (
                  <div className="px-4 py-6 text-center text-gray-400">
                    No procedures found
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Manual Entry or Display Title */}
          {selectionMethod === 'manual' && (
            <div>
              <label className="block text-blue-100 mb-2 text-base font-semibold">
                Procedure Title *
              </label>
              <input
                type="text"
                value={formData?.displayTitle}
                onChange={(e) => handleFieldChange('displayTitle', e?.target?.value)}
                className="w-full px-3 py-2 bg-slate-700 border-2 border-blue-400/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="Enter custom procedure title"
              />
            </div>
          )}

          {/* Tooth Numbers */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-blue-100 text-base font-semibold">
                Tooth Numbers
              </label>
              <button
                type="button"
                onClick={() => setShowToothPicker(!showToothPicker)}
                className="text-sm text-blue-300 hover:text-blue-200 font-medium underline"
              >
                {showToothPicker ? 'Hide' : 'Show'} Quick Picker
              </button>
            </div>
            <input
              type="text"
              value={formData?.toothNumbers}
              onChange={(e) => handleFieldChange('toothNumbers', e?.target?.value)}
              className="w-full px-3 py-2 bg-slate-700 border-2 border-blue-400/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="e.g., #3 or #3, #4 or Upper Left or All"
            />
            <p className="text-blue-200 text-sm mt-1">
              Examples: "#3" for single tooth, "#3, #4" for multiple, "Upper Left", or "All"
            </p>

            {showToothPicker && (
              <div className="mt-3 p-4 bg-slate-700/50 rounded-lg border border-blue-400/30">
                <p className="text-blue-100 text-sm font-semibold mb-3">
                  Tap to select/deselect teeth (1-32):
                </p>
                <div className="grid grid-cols-8 gap-2">
                  {[...Array(32)]?.map((_, i) => {
                    const toothNum = i + 1;
                    const isSelected = isToothSelected(toothNum);
                    return (
                      <button
                        key={toothNum}
                        type="button"
                        onClick={() => toggleToothNumber(toothNum)}
                        className={`px-3 py-2 rounded-lg font-semibold text-sm transition-all ${
                          isSelected
                            ? 'bg-blue-600 text-white border-2 border-blue-400' :'bg-slate-600 text-blue-200 border-2 border-slate-500 hover:bg-slate-500'
                        }`}
                      >
                        {toothNum}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Priority */}
          <div>
            <label className="block text-blue-100 mb-2 text-base font-semibold">
              Priority
            </label>
            <select
              value={formData?.priority}
              onChange={(e) => handleFieldChange('priority', e?.target?.value)}
              className="w-full px-3 py-2 bg-slate-700 border-2 border-blue-400/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              <option value="Urgent" className="bg-slate-800">Urgent</option>
              <option value="Soon" className="bg-slate-800">Soon</option>
              <option value="Later" className="bg-slate-800">Later</option>
            </select>
          </div>

          {/* Estimated Time */}
          <div>
            <label className="block text-blue-100 mb-2 text-base font-semibold">
              Estimated Time
            </label>
            <input
              type="text"
              value={formData?.estTime}
              onChange={(e) => handleFieldChange('estTime', e?.target?.value)}
              className="w-full px-3 py-2 bg-slate-700 border-2 border-blue-400/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="60 minutes"
            />
          </div>

          {/* Notes for Patient */}
          <div>
            <label className="block text-blue-100 mb-2 text-base font-semibold">
              Notes for Patient
            </label>
            <textarea
              value={formData?.notesForPatient}
              onChange={(e) => handleFieldChange('notesForPatient', e?.target?.value)}
              className="w-full px-3 py-2 bg-slate-700 border-2 border-blue-400/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
              rows="3"
              placeholder="Additional information for the patient..."
            />
          </div>
        </div>

        {/* Footer Actions */}
        <div className="sticky bottom-0 bg-slate-800 border-t border-blue-400/30 p-6">
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white font-bold rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-colors"
            >
              Add Procedure
            </button>
          </div>
        </div>
      </div>
    </>
  );
}