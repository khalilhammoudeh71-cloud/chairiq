import React, { useState, useEffect } from 'react';
import { X, Search, Star, Clock, ImagePlus, Camera, Check, ChevronDown, ChevronUp } from 'lucide-react';
import { procedureCodesService } from '../../../services/procedureCodesService';
import { supabase } from '../../../lib/supabase';

export default function AddProcedureDrawer({ 
  isOpen, 
  onClose, 
  onSave, 
  isMobile = false 
}) {
  const [currentUser, setCurrentUser] = useState(null);
  const [procedureCodes, setProcedureCodes] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [recents, setRecents] = useState([]);
  const [activeTab, setActiveTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectionMethod, setSelectionMethod] = useState('code');
  const [showDetails, setShowDetails] = useState(false);
  
  const [formData, setFormData] = useState({
    procedureSlug: '',
    adaCode: '',
    displayTitle: '',
    procedureName: '',
    toothNumbers: '',
    priority: 'Soon',
    estTime: '',
    notesForPatient: '',
    patientImages: []
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

      const codes = await procedureCodesService?.getAllCodes();
      setProcedureCodes(codes || []);

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
    if (procedure?.code) {
      setFormData(prev => ({
        ...prev,
        adaCode: procedure?.code,
        displayTitle: `${procedure?.title} (${procedure?.code})`,
        procedureName: procedure?.title
      }));
      setShowDetails(true);
      if (currentUser) {
        await procedureCodesService?.addRecent(currentUser?.id, null, procedure?.code);
      }
    }
    setSearchTerm('');
  };

  const handleClearSelection = () => {
    setFormData(prev => ({
      ...prev,
      adaCode: '',
      displayTitle: '',
      procedureName: ''
    }));
    setShowDetails(false);
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
        if (fav?.adaCode) {
          return procedureCodes?.find(c => c?.code === fav?.adaCode);
        }
        return null;
      })?.filter(Boolean);
    } else if (activeTab === 'recents') {
      items = recents?.map(rec => {
        if (rec?.adaCode) {
          return procedureCodes?.find(c => c?.code === rec?.adaCode);
        }
        return null;
      })?.filter(Boolean);
    } else {
      items = [...procedureCodes];
    }

    if (!searchTerm) return items;

    return items?.filter(item => {
      const searchLower = searchTerm?.toLowerCase();
      if (item?.code && item?.title) {
        return item?.code?.toLowerCase()?.includes(searchLower) ||
               item?.title?.toLowerCase()?.includes(searchLower);
      }
      return false;
    });
  };

  const handleImageSelect = (e) => {
    const files = Array.from(e?.target?.files || []);
    const currentCount = formData?.patientImages?.length || 0;
    const remaining = 5 - currentCount;
    if (remaining <= 0) {
      alert('Maximum 5 images per procedure');
      return;
    }
    const filesToAdd = files.slice(0, remaining);
    const validFiles = filesToAdd.filter(file => {
      if (file.size > 5 * 1024 * 1024) {
        alert(`File "${file.name}" exceeds 5MB limit and was skipped.`);
        return false;
      }
      return true;
    });
    const newImages = validFiles.map(file => ({
      file,
      note: '',
      preview: URL.createObjectURL(file)
    }));
    setFormData(prev => ({
      ...prev,
      patientImages: [...(prev?.patientImages || []), ...newImages]
    }));
    e.target.value = '';
  };

  const handleRemoveImage = (index) => {
    setFormData(prev => {
      const updated = [...(prev?.patientImages || [])];
      if (updated[index]?.preview) {
        URL.revokeObjectURL(updated[index].preview);
      }
      updated.splice(index, 1);
      return { ...prev, patientImages: updated };
    });
  };

  const handleImageNoteChange = (index, note) => {
    setFormData(prev => {
      const updated = [...(prev?.patientImages || [])];
      updated[index] = { ...updated[index], note };
      return { ...prev, patientImages: updated };
    });
  };

  const handleSave = () => {
    if (!formData?.procedureSlug && !formData?.adaCode && !formData?.displayTitle?.trim()) {
      alert('Please select or enter a procedure');
      return;
    }

    onSave(formData);
    
    formData?.patientImages?.forEach(img => {
      if (img?.preview) URL.revokeObjectURL(img.preview);
    });
    setFormData({
      procedureSlug: '',
      adaCode: '',
      displayTitle: '',
      procedureName: '',
      toothNumbers: '',
      priority: 'Soon',
      estTime: '',
      notesForPatient: '',
      patientImages: []
    });
    setSearchTerm('');
    setShowDetails(false);
  };

  if (!isOpen) return null;

  const drawerClasses = isMobile
    ? 'fixed inset-0 z-50 bg-bg0' :'fixed right-0 top-0 h-full w-full md:w-[600px] z-50 bg-bg1 border-l border-bd';

  const filteredProcedures = getFilteredProcedures();
  const hasSelection = !!(formData?.adaCode || formData?.displayTitle?.trim());

  return (
    <>
      <div 
        className="fixed inset-0 bg-[var(--overlay)] z-40 transition-opacity"
        onClick={onClose}
      />
      <div className={`${drawerClasses} overflow-y-auto animate-slide-in-right`}>
        <div className="sticky top-0 bg-bg1 border-b border-bd p-6 z-10">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-t1">Add Procedure</h2>
            <button
              onClick={onClose}
              className="p-2 text-t3 hover:text-t1 hover:bg-bg2 rounded-lg transition-colors"
            >
              <X size={24} />
            </button>
          </div>

          {hasSelection && (
            <div className="mt-4 p-4 rounded-xl bg-accent/15 border-2 border-accent">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center flex-shrink-0">
                    <Check size={18} className="text-white" />
                  </div>
                  <div>
                    <p className="text-xs text-accent font-semibold uppercase tracking-wider">Selected Treatment</p>
                    <p className="text-t1 font-bold text-lg leading-tight">
                      {formData?.procedureName || formData?.displayTitle}
                    </p>
                    {formData?.adaCode && (
                      <p className="text-accent text-sm font-mono font-semibold">{formData.adaCode}</p>
                    )}
                  </div>
                </div>
                <button
                  onClick={handleClearSelection}
                  className="p-1.5 text-t3 hover:text-danger hover:bg-danger/10 rounded-lg transition-colors"
                  title="Clear selection"
                >
                  <X size={18} />
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="p-6 space-y-6">
          <div>
            <label className="block text-t2 mb-3 text-base font-semibold">
              Selection Method
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setSelectionMethod('code')}
                className={`px-4 py-3 rounded-lg font-semibold text-sm transition-colors ${
                  selectionMethod === 'code' ?'bg-accent text-white' :'bg-bg2 text-t2 hover:bg-bg3'
                }`}
              >
                ADA Code
              </button>
              <button
                onClick={() => setSelectionMethod('manual')}
                className={`px-4 py-3 rounded-lg font-semibold text-sm transition-colors ${
                  selectionMethod === 'manual' ?'bg-accent text-white' :'bg-bg2 text-t2 hover:bg-bg3'
                }`}
              >
                Manual Entry
              </button>
            </div>
          </div>

          {selectionMethod === 'code' && (
            <div className="flex gap-2">
              <button
                onClick={() => setActiveTab('all')}
                className={`px-4 py-2 rounded-lg font-semibold text-sm transition-colors ${
                  activeTab === 'all' ? 'bg-accent text-white' : 'bg-bg2 text-t2 hover:bg-bg3'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setActiveTab('favorites')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-sm transition-colors ${
                  activeTab === 'favorites' ? 'bg-accent text-white' : 'bg-bg2 text-t2 hover:bg-bg3'
                }`}
              >
                <Star size={14} />
                Favorites ({favorites?.length || 0})
              </button>
              <button
                onClick={() => setActiveTab('recents')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-sm transition-colors ${
                  activeTab === 'recents' ? 'bg-accent text-white' : 'bg-bg2 text-t2 hover:bg-bg3'
                }`}
              >
                <Clock size={14} />
                Recent ({recents?.length || 0})
              </button>
            </div>
          )}

          {selectionMethod === 'code' && (
            <div>
              <label className="block text-t2 mb-2 text-base font-semibold">
                Search ADA Codes
              </label>
              <div className="relative mb-3">
                <Search className="absolute left-3 top-3 text-t3" size={20} />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e?.target?.value)}
                  placeholder="Search by code or procedure name..."
                  className="w-full pl-10 pr-3 py-2 bg-bg2 border-2 border-bd rounded-lg text-t1 placeholder-t3 focus:outline-none focus:border-accent"
                />
              </div>

              <div className="max-h-72 overflow-y-auto bg-bg2 rounded-lg border border-bd">
                {filteredProcedures?.length > 0 ? (
                  filteredProcedures?.map((item, index) => {
                    const isSelected = formData?.adaCode === item?.code;
                    return (
                      <button
                        key={index}
                        onClick={() => handleProcedureSelect(item)}
                        className={`w-full text-left px-4 py-3 transition-all flex items-center justify-between border-b border-bd last:border-b-0 ${
                          isSelected
                            ? 'bg-accent/20 border-l-4 border-l-accent'
                            : 'hover:bg-bg3'
                        }`}
                      >
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          {isSelected && (
                            <div className="w-6 h-6 rounded-full bg-accent flex items-center justify-center flex-shrink-0">
                              <Check size={14} className="text-white" />
                            </div>
                          )}
                          <div className="min-w-0">
                            <span className={`font-bold ${isSelected ? 'text-accent' : 'text-accent'}`}>{item?.code}</span>
                            <span className={`ml-2 ${isSelected ? 'text-t1 font-semibold' : 'text-t2'}`}>{item?.title}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          {isSelected && (
                            <span className="px-2 py-0.5 rounded text-xs font-bold bg-accent text-white uppercase">
                              Selected
                            </span>
                          )}
                          <div
                            role="button"
                            tabIndex={0}
                            onClick={(e) => {
                              e?.stopPropagation();
                              handleToggleFavorite(null, item?.code);
                            }}
                            onKeyDown={(e) => { if (e?.key === 'Enter') { e?.stopPropagation(); handleToggleFavorite(null, item?.code); } }}
                            className="ml-1 text-warning hover:text-warning cursor-pointer"
                          >
                            <Star 
                              size={16} 
                              fill={isFavorite(null, item?.code) ? 'currentColor' : 'none'} 
                            />
                          </div>
                        </div>
                      </button>
                    );
                  })
                ) : (
                  <div className="px-4 py-6 text-center text-t3">
                    No procedures found
                  </div>
                )}
              </div>
            </div>
          )}

          {selectionMethod === 'manual' && (
            <div>
              <label className="block text-t2 mb-2 text-base font-semibold">
                Procedure Title *
              </label>
              <input
                type="text"
                value={formData?.displayTitle}
                onChange={(e) => handleFieldChange('displayTitle', e?.target?.value)}
                className="w-full px-3 py-2 bg-bg2 border-2 border-bd rounded-lg text-t1 placeholder-t3 focus:outline-none focus:border-accent"
                placeholder="Enter custom procedure title"
              />
            </div>
          )}

          {hasSelection && (
            <>
              <button
                onClick={() => setShowDetails(!showDetails)}
                className="w-full flex items-center justify-between px-4 py-3 bg-bg2 rounded-lg text-t1 font-semibold hover:bg-bg3 transition-colors"
              >
                <span>Procedure Details</span>
                {showDetails ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
              </button>

              {showDetails && (
                <div className="space-y-6 p-4 bg-bg2/50 rounded-xl border border-bd">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="block text-t2 text-base font-semibold">
                        Tooth Numbers
                      </label>
                      <button
                        type="button"
                        onClick={() => setShowToothPicker(!showToothPicker)}
                        className="text-sm text-accent hover:text-accent font-medium underline"
                      >
                        {showToothPicker ? 'Hide' : 'Show'} Quick Picker
                      </button>
                    </div>
                    <input
                      type="text"
                      value={formData?.toothNumbers}
                      onChange={(e) => handleFieldChange('toothNumbers', e?.target?.value)}
                      className="w-full px-3 py-2 bg-bg1 border-2 border-bd rounded-lg text-t1 placeholder-t3 focus:outline-none focus:border-accent"
                      placeholder="e.g., #3 or #3, #4 or Upper Left or All"
                    />
                    <p className="text-t3 text-sm mt-1">
                      Examples: "#3" for single tooth, "#3, #4" for multiple, "Upper Left", or "All"
                    </p>

                    {showToothPicker && (
                      <div className="mt-3 p-4 bg-bg1 rounded-lg border border-bd">
                        <p className="text-t2 text-sm font-semibold mb-3">
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
                                    ? 'bg-accent text-white border-2 border-accent' :'bg-bg2 text-t2 border-2 border-bd hover:bg-bg3'
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

                  <div>
                    <label className="block text-t2 mb-2 text-base font-semibold">
                      Priority
                    </label>
                    <select
                      value={formData?.priority}
                      onChange={(e) => handleFieldChange('priority', e?.target?.value)}
                      className="w-full px-3 py-2 bg-bg1 border-2 border-bd rounded-lg text-t1 focus:outline-none focus:border-accent"
                    >
                      <option value="Urgent" className="bg-bg1">Urgent</option>
                      <option value="Soon" className="bg-bg1">Soon</option>
                      <option value="Later" className="bg-bg1">Later</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-t2 mb-2 text-base font-semibold">
                      Estimated Time
                    </label>
                    <input
                      type="text"
                      value={formData?.estTime}
                      onChange={(e) => handleFieldChange('estTime', e?.target?.value)}
                      className="w-full px-3 py-2 bg-bg1 border-2 border-bd rounded-lg text-t1 placeholder-t3 focus:outline-none focus:border-accent"
                      placeholder="60 minutes"
                    />
                  </div>

                  <div>
                    <label className="block text-t2 mb-2 text-base font-semibold">
                      Notes for Patient
                    </label>
                    <textarea
                      value={formData?.notesForPatient}
                      onChange={(e) => handleFieldChange('notesForPatient', e?.target?.value)}
                      className="w-full px-3 py-2 bg-bg1 border-2 border-bd rounded-lg text-t1 placeholder-t3 focus:outline-none focus:border-accent"
                      rows="3"
                      placeholder="Additional information for the patient..."
                    />
                  </div>

                  <div>
                    <label className="block text-t2 mb-2 text-base font-semibold flex items-center gap-2">
                      <Camera size={18} />
                      Patient Images
                      <span className="text-t3 text-sm font-normal">({formData?.patientImages?.length || 0}/5)</span>
                    </label>
                    <p className="text-t3 text-sm mb-3">
                      Upload X-rays or intraoral photos specific to this patient (max 5MB each)
                    </p>

                    {(formData?.patientImages?.length || 0) < 5 && (
                      <label className="flex flex-col items-center justify-center w-full h-28 border-2 border-dashed border-bd rounded-lg cursor-pointer bg-bg1 hover:bg-bg3 hover:border-accent transition-colors mb-3">
                        <div className="flex flex-col items-center justify-center py-4">
                          <ImagePlus size={24} className="text-t3 mb-1" />
                          <p className="text-sm text-t3">
                            <span className="font-semibold text-accent">Click to upload</span>
                          </p>
                          <p className="text-xs text-t3 mt-0.5">PNG, JPG, JPEG up to 5MB</p>
                        </div>
                        <input
                          type="file"
                          accept="image/*"
                          multiple
                          onChange={handleImageSelect}
                          className="hidden"
                        />
                      </label>
                    )}

                    {formData?.patientImages?.length > 0 && (
                      <div className="space-y-3">
                        {formData.patientImages.map((img, index) => (
                          <div key={index} className="flex gap-3 p-3 bg-bg1 rounded-lg border border-bd">
                            <div className="relative w-20 h-20 flex-shrink-0">
                              <img
                                src={img.preview}
                                alt={`Patient image ${index + 1}`}
                                className="w-full h-full object-cover rounded-lg"
                              />
                              <button
                                type="button"
                                onClick={() => handleRemoveImage(index)}
                                className="absolute -top-2 -right-2 w-6 h-6 bg-danger text-white rounded-full flex items-center justify-center hover:brightness-110 transition-colors"
                              >
                                <X size={14} />
                              </button>
                            </div>
                            <div className="flex-1">
                              <input
                                type="text"
                                value={img.note}
                                onChange={(e) => handleImageNoteChange(index, e?.target?.value)}
                                placeholder="Add a note (e.g., X-ray shows decay on tooth #14)"
                                className="w-full px-3 py-2 bg-bg2 border border-bd rounded-lg text-t1 text-sm placeholder-t3 focus:outline-none focus:border-accent"
                              />
                              <p className="text-xs text-t3 mt-1">{img.file?.name}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </>
          )}

          {!hasSelection && selectionMethod === 'code' && (
            <div className="text-center py-4 px-6 bg-bg2/50 rounded-xl border border-dashed border-bd">
              <p className="text-t3 text-sm">Select a treatment from the list above to configure details</p>
            </div>
          )}
        </div>

        <div className="sticky bottom-0 bg-bg1 border-t border-bd p-6">
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-6 py-3 bg-bg2 hover:bg-bg3 text-t1 font-bold rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={!hasSelection}
              className={`flex-1 px-6 py-3 font-bold rounded-xl transition-colors flex items-center justify-center gap-2 ${
                hasSelection
                  ? 'bg-accent hover:brightness-110 text-white'
                  : 'bg-bg3 text-t3 cursor-not-allowed'
              }`}
            >
              {hasSelection && <Check size={20} />}
              Add Procedure
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
