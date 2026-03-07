import React, { useState, useEffect } from 'react';
import { X, Search, Star, Clock, ImagePlus, Camera, Check, ChevronDown, ChevronUp, ClipboardList, Trash2, Plus } from 'lucide-react';
import { procedureCodesService } from '../../../services/procedureCodesService';
import { supabase } from '../../../lib/supabase';

export default function AddProcedureDrawer({ 
  isOpen, 
  onClose, 
  onSave, 
  isMobile = false,
  addedProcedures = []
}) {
  const [currentUser, setCurrentUser] = useState(null);
  const [procedureCodes, setProcedureCodes] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [recents, setRecents] = useState([]);
  const [activeTab, setActiveTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectionMethod, setSelectionMethod] = useState('code');

  const [selectedItems, setSelectedItems] = useState([]);
  const [expandedItemIndex, setExpandedItemIndex] = useState(null);

  const [showToothPicker, setShowToothPicker] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadInitialData();
      setSelectedItems([]);
      setExpandedItemIndex(null);
    } else {
      selectedItems.forEach(item => {
        item?.patientImages?.forEach(img => {
          if (img?.preview) URL.revokeObjectURL(img.preview);
        });
      });
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

  const handleProcedureToggle = async (procedure) => {
    if (!procedure?.code) return;

    const existingIndex = selectedItems.findIndex(item => item.adaCode === procedure.code);

    if (existingIndex > -1) {
      const updated = [...selectedItems];
      updated[existingIndex]?.patientImages?.forEach(img => {
        if (img?.preview) URL.revokeObjectURL(img.preview);
      });
      updated.splice(existingIndex, 1);
      setSelectedItems(updated);
      if (expandedItemIndex === existingIndex) setExpandedItemIndex(null);
      else if (expandedItemIndex !== null && expandedItemIndex > existingIndex) {
        setExpandedItemIndex(expandedItemIndex - 1);
      }
    } else {
      setSelectedItems(prev => [...prev, {
        _id: `sel-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        adaCode: procedure.code,
        displayTitle: `${procedure.title} (${procedure.code})`,
        procedureName: procedure.title,
        procedureSlug: '',
        toothNumbers: '',
        priority: 'Soon',
        estTime: '',
        notesForPatient: '',
        patientImages: []
      }]);
      if (currentUser) {
        await procedureCodesService?.addRecent(currentUser?.id, null, procedure?.code);
      }
    }
    setSearchTerm('');
  };

  const updateSelectedItem = (index, field, value) => {
    setSelectedItems(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const removeSelectedItem = (index) => {
    setSelectedItems(prev => {
      const updated = [...prev];
      updated[index]?.patientImages?.forEach(img => {
        if (img?.preview) URL.revokeObjectURL(img.preview);
      });
      updated.splice(index, 1);
      return updated;
    });
    if (expandedItemIndex === index) setExpandedItemIndex(null);
    else if (expandedItemIndex !== null && expandedItemIndex > index) {
      setExpandedItemIndex(expandedItemIndex - 1);
    }
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

  const handleImageSelect = (itemIndex, e) => {
    const files = Array.from(e?.target?.files || []);
    const currentCount = selectedItems[itemIndex]?.patientImages?.length || 0;
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
    setSelectedItems(prev => {
      const updated = [...prev];
      updated[itemIndex] = {
        ...updated[itemIndex],
        patientImages: [...(updated[itemIndex]?.patientImages || []), ...newImages]
      };
      return updated;
    });
    e.target.value = '';
  };

  const handleRemoveImage = (itemIndex, imgIndex) => {
    setSelectedItems(prev => {
      const updated = [...prev];
      const images = [...(updated[itemIndex]?.patientImages || [])];
      if (images[imgIndex]?.preview) {
        URL.revokeObjectURL(images[imgIndex].preview);
      }
      images.splice(imgIndex, 1);
      updated[itemIndex] = { ...updated[itemIndex], patientImages: images };
      return updated;
    });
  };

  const handleImageNoteChange = (itemIndex, imgIndex, note) => {
    setSelectedItems(prev => {
      const updated = [...prev];
      const images = [...(updated[itemIndex]?.patientImages || [])];
      images[imgIndex] = { ...images[imgIndex], note };
      updated[itemIndex] = { ...updated[itemIndex], patientImages: images };
      return updated;
    });
  };

  const handleAddAllToPlan = () => {
    if (selectedItems.length === 0) return;

    selectedItems.forEach(item => {
      onSave(item);
    });

    selectedItems.forEach(item => {
      item?.patientImages?.forEach(img => {
        if (img?.preview) URL.revokeObjectURL(img.preview);
      });
    });

    setSelectedItems([]);
    setExpandedItemIndex(null);
    onClose();
  };

  const toggleToothNumber = (itemIndex, toothNumber) => {
    const currentTeeth = selectedItems[itemIndex]?.toothNumbers || '';
    const teethArray = currentTeeth?.split(',')?.map(t => t?.trim())?.filter(Boolean);
    const toothStr = `#${toothNumber}`;
    const toothIndex = teethArray?.indexOf(toothStr);

    let newTeethArray;
    if (toothIndex > -1) {
      newTeethArray = teethArray?.filter((_, i) => i !== toothIndex);
    } else {
      newTeethArray = [...teethArray, toothStr];
    }

    updateSelectedItem(itemIndex, 'toothNumbers', newTeethArray?.join(', '));
  };

  if (!isOpen) return null;

  const filteredProcedures = getFilteredProcedures();
  const selectedAdaCodes = new Set(selectedItems.map(item => item.adaCode));
  const addedAdaCodes = new Set(addedProcedures?.map(p => p?.adaCode)?.filter(Boolean));

  return (
    <>
      <div 
        className="fixed inset-0 bg-[var(--overlay)] z-40 transition-opacity"
        onClick={onClose}
      />

      <div className="fixed inset-0 z-50 flex flex-col md:flex-row">
        {(selectedItems.length > 0 || addedProcedures?.length > 0) && (
          <div className={`bg-bg0 border-b md:border-b-0 md:border-r border-bd flex flex-col ${
            isMobile ? 'max-h-[35vh]' : 'w-[280px] h-full'
          }`}>
            <div className="p-4 border-b border-bd flex-shrink-0">
              <div className="flex items-center gap-2">
                <ClipboardList size={18} className="text-accent" />
                <h3 className="text-sm font-bold text-t1 uppercase tracking-wider">
                  Selected ({selectedItems.length})
                </h3>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-3 space-y-2">
              {addedProcedures?.length > 0 && (
                <div className="mb-3">
                  <p className="text-xs text-t3 font-semibold uppercase tracking-wider px-1 mb-1.5">Already in Plan</p>
                  {addedProcedures.map((proc, idx) => (
                    <div key={proc?.id || `added-${idx}`} className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-bg2/50 mb-1">
                      <Check size={14} className="text-accent/50 flex-shrink-0" />
                      <span className="text-t3 text-xs truncate">
                        {proc?.procedureName || proc?.displayTitle}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {selectedItems.length > 0 && (
                <div>
                  {addedProcedures?.length > 0 && (
                    <p className="text-xs text-accent font-semibold uppercase tracking-wider px-1 mb-1.5">Adding Now</p>
                  )}
                  {selectedItems.map((item, idx) => (
                    <div
                      key={item._id || `item-${idx}`}
                      className={`flex items-center gap-2 px-2.5 py-2 rounded-lg mb-1 cursor-pointer transition-colors ${
                        expandedItemIndex === idx
                          ? 'bg-accent/20 border border-accent'
                          : 'bg-bg1 hover:bg-bg2 border border-transparent'
                      }`}
                      onClick={() => setExpandedItemIndex(expandedItemIndex === idx ? null : idx)}
                    >
                      <div className="w-5 h-5 rounded-full bg-accent flex items-center justify-center flex-shrink-0">
                        <span className="text-xs font-bold text-white">{idx + 1}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-t1 text-sm font-medium truncate">{item.procedureName}</p>
                        <p className="text-accent text-xs font-mono">{item.adaCode}</p>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          removeSelectedItem(idx);
                        }}
                        className="p-1 text-t3 hover:text-danger hover:bg-danger/10 rounded transition-colors flex-shrink-0"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {selectedItems.length === 0 && addedProcedures?.length === 0 && (
                <p className="text-t3 text-xs text-center py-4">Tap codes on the right to select treatments</p>
              )}
            </div>

            {selectedItems.length > 0 && (
              <div className="p-3 border-t border-bd flex-shrink-0">
                <button
                  onClick={handleAddAllToPlan}
                  className="w-full px-4 py-2.5 bg-accent hover:brightness-110 text-white font-bold rounded-xl transition-colors flex items-center justify-center gap-2 text-sm"
                >
                  <Plus size={16} />
                  Add {selectedItems.length} to Plan
                </button>
              </div>
            )}
          </div>
        )}

        <div className={`flex-1 bg-bg1 flex flex-col ${isMobile ? '' : 'h-full'} overflow-hidden`}>
          <div className="flex-shrink-0 border-b border-bd p-4 md:p-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl md:text-2xl font-bold text-t1">Add Procedures</h2>
              <button
                onClick={onClose}
                className="p-2 text-t3 hover:text-t1 hover:bg-bg2 rounded-lg transition-colors"
              >
                <X size={24} />
              </button>
            </div>
            {selectedItems.length > 0 && (
              <p className="text-accent text-sm font-medium mt-1">
                {selectedItems.length} treatment{selectedItems.length !== 1 ? 's' : ''} selected
              </p>
            )}
          </div>

          <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4 md:space-y-6">
            <div>
              <div className="grid grid-cols-2 gap-2 md:gap-3">
                <button
                  onClick={() => setSelectionMethod('code')}
                  className={`px-3 md:px-4 py-2.5 md:py-3 rounded-lg font-semibold text-sm transition-colors ${
                    selectionMethod === 'code' ?'bg-accent text-white' :'bg-bg2 text-t2 hover:bg-bg3'
                  }`}
                >
                  ADA Code
                </button>
                <button
                  onClick={() => setSelectionMethod('manual')}
                  className={`px-3 md:px-4 py-2.5 md:py-3 rounded-lg font-semibold text-sm transition-colors ${
                    selectionMethod === 'manual' ?'bg-accent text-white' :'bg-bg2 text-t2 hover:bg-bg3'
                  }`}
                >
                  Manual Entry
                </button>
              </div>
            </div>

            {selectionMethod === 'code' && (
              <div className="flex gap-2 flex-wrap">
                <button
                  onClick={() => setActiveTab('all')}
                  className={`px-3 md:px-4 py-2 rounded-lg font-semibold text-sm transition-colors ${
                    activeTab === 'all' ? 'bg-accent text-white' : 'bg-bg2 text-t2 hover:bg-bg3'
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => setActiveTab('favorites')}
                  className={`flex items-center gap-1.5 px-3 md:px-4 py-2 rounded-lg font-semibold text-sm transition-colors ${
                    activeTab === 'favorites' ? 'bg-accent text-white' : 'bg-bg2 text-t2 hover:bg-bg3'
                  }`}
                >
                  <Star size={14} />
                  Favorites ({favorites?.length || 0})
                </button>
                <button
                  onClick={() => setActiveTab('recents')}
                  className={`flex items-center gap-1.5 px-3 md:px-4 py-2 rounded-lg font-semibold text-sm transition-colors ${
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

                <div className="max-h-64 md:max-h-80 overflow-y-auto bg-bg2 rounded-lg border border-bd">
                  {filteredProcedures?.length > 0 ? (
                    filteredProcedures?.map((item, index) => {
                      const isSelected = selectedAdaCodes.has(item?.code);
                      const isAlreadyAdded = addedAdaCodes.has(item?.code);
                      return (
                        <button
                          key={index}
                          onClick={() => handleProcedureToggle(item)}
                          className={`w-full text-left px-3 md:px-4 py-3 transition-all flex items-center justify-between border-b border-bd last:border-b-0 ${
                            isSelected
                              ? 'bg-accent/20 border-l-4 border-l-accent'
                              : isAlreadyAdded
                                ? 'bg-bg3/50'
                                : 'hover:bg-bg3'
                          }`}
                        >
                          <div className="flex items-center gap-2 md:gap-3 flex-1 min-w-0">
                            <div className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
                              isSelected
                                ? 'bg-accent border-accent'
                                : 'border-bd bg-bg1'
                            }`}>
                              {isSelected && <Check size={12} className="text-white" />}
                            </div>
                            <div className="min-w-0">
                              <span className="font-bold text-accent">{item?.code}</span>
                              <span className={`ml-2 text-sm ${isSelected ? 'text-t1 font-semibold' : 'text-t2'}`}>{item?.title}</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-1.5 flex-shrink-0">
                            {isAlreadyAdded && (
                              <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-bg3 text-t3 uppercase">
                                In Plan
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
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="flex-1 px-3 py-2 bg-bg2 border-2 border-bd rounded-lg text-t1 placeholder-t3 focus:outline-none focus:border-accent"
                    placeholder="Enter custom procedure title"
                  />
                  <button
                    onClick={() => {
                      const title = searchTerm?.trim();
                      if (!title) return;
                      setSelectedItems(prev => [...prev, {
                        _id: `manual-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
                        adaCode: '',
                        displayTitle: title,
                        procedureName: title,
                        procedureSlug: '',
                        toothNumbers: '',
                        priority: 'Soon',
                        estTime: '',
                        notesForPatient: '',
                        patientImages: []
                      }]);
                      setSearchTerm('');
                    }}
                    className="px-4 py-2 bg-accent text-white font-semibold rounded-lg hover:brightness-110 transition-colors"
                  >
                    <Plus size={20} />
                  </button>
                </div>
              </div>
            )}

            {expandedItemIndex !== null && selectedItems[expandedItemIndex] && (
              <div className="p-4 bg-bg2/50 rounded-xl border-2 border-accent/30">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-t1 font-bold">
                    Details: {selectedItems[expandedItemIndex].procedureName}
                  </h3>
                  <button
                    onClick={() => setExpandedItemIndex(null)}
                    className="text-t3 hover:text-t1"
                  >
                    <ChevronUp size={20} />
                  </button>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-t2 text-sm font-semibold">Tooth Numbers</label>
                      <button
                        type="button"
                        onClick={() => setShowToothPicker(!showToothPicker)}
                        className="text-xs text-accent font-medium underline"
                      >
                        {showToothPicker ? 'Hide' : 'Show'} Picker
                      </button>
                    </div>
                    <input
                      type="text"
                      value={selectedItems[expandedItemIndex]?.toothNumbers || ''}
                      onChange={(e) => updateSelectedItem(expandedItemIndex, 'toothNumbers', e.target.value)}
                      className="w-full px-3 py-2 bg-bg1 border border-bd rounded-lg text-t1 text-sm placeholder-t3 focus:outline-none focus:border-accent"
                      placeholder="#3, #4 or All"
                    />
                    {showToothPicker && (
                      <div className="mt-2 p-3 bg-bg1 rounded-lg border border-bd">
                        <div className="grid grid-cols-8 gap-1.5">
                          {[...Array(32)]?.map((_, i) => {
                            const toothNum = i + 1;
                            const isToothSel = selectedItems[expandedItemIndex]?.toothNumbers?.includes(`#${toothNum}`);
                            return (
                              <button
                                key={toothNum}
                                type="button"
                                onClick={() => toggleToothNumber(expandedItemIndex, toothNum)}
                                className={`px-2 py-1.5 rounded text-xs font-semibold transition-all ${
                                  isToothSel
                                    ? 'bg-accent text-white' : 'bg-bg2 text-t2 hover:bg-bg3'
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

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-t2 text-sm font-semibold block mb-1">Priority</label>
                      <select
                        value={selectedItems[expandedItemIndex]?.priority || 'Soon'}
                        onChange={(e) => updateSelectedItem(expandedItemIndex, 'priority', e.target.value)}
                        className="w-full px-3 py-2 bg-bg1 border border-bd rounded-lg text-t1 text-sm focus:outline-none focus:border-accent"
                      >
                        <option value="Urgent">Urgent</option>
                        <option value="Soon">Soon</option>
                        <option value="Later">Later</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-t2 text-sm font-semibold block mb-1">Est. Time</label>
                      <input
                        type="text"
                        value={selectedItems[expandedItemIndex]?.estTime || ''}
                        onChange={(e) => updateSelectedItem(expandedItemIndex, 'estTime', e.target.value)}
                        className="w-full px-3 py-2 bg-bg1 border border-bd rounded-lg text-t1 text-sm placeholder-t3 focus:outline-none focus:border-accent"
                        placeholder="60 min"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-t2 text-sm font-semibold block mb-1">Notes for Patient</label>
                    <textarea
                      value={selectedItems[expandedItemIndex]?.notesForPatient || ''}
                      onChange={(e) => updateSelectedItem(expandedItemIndex, 'notesForPatient', e.target.value)}
                      className="w-full px-3 py-2 bg-bg1 border border-bd rounded-lg text-t1 text-sm placeholder-t3 focus:outline-none focus:border-accent"
                      rows="2"
                      placeholder="Additional notes..."
                    />
                  </div>

                  <div>
                    <label className="text-t2 text-sm font-semibold flex items-center gap-1.5 mb-1">
                      <Camera size={14} />
                      Patient Images ({selectedItems[expandedItemIndex]?.patientImages?.length || 0}/5)
                    </label>
                    {(selectedItems[expandedItemIndex]?.patientImages?.length || 0) < 5 && (
                      <label className="flex items-center justify-center w-full h-20 border-2 border-dashed border-bd rounded-lg cursor-pointer bg-bg1 hover:bg-bg3 hover:border-accent transition-colors mb-2">
                        <div className="flex items-center gap-2">
                          <ImagePlus size={18} className="text-t3" />
                          <span className="text-sm text-accent font-semibold">Upload images</span>
                        </div>
                        <input
                          type="file"
                          accept="image/*"
                          multiple
                          onChange={(e) => handleImageSelect(expandedItemIndex, e)}
                          className="hidden"
                        />
                      </label>
                    )}
                    {selectedItems[expandedItemIndex]?.patientImages?.length > 0 && (
                      <div className="space-y-2">
                        {selectedItems[expandedItemIndex].patientImages.map((img, imgIdx) => (
                          <div key={imgIdx} className="flex gap-2 p-2 bg-bg1 rounded-lg border border-bd">
                            <div className="relative w-14 h-14 flex-shrink-0">
                              <img src={img.preview} alt="" className="w-full h-full object-cover rounded" />
                              <button
                                type="button"
                                onClick={() => handleRemoveImage(expandedItemIndex, imgIdx)}
                                className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-danger text-white rounded-full flex items-center justify-center"
                              >
                                <X size={10} />
                              </button>
                            </div>
                            <input
                              type="text"
                              value={img.note}
                              onChange={(e) => handleImageNoteChange(expandedItemIndex, imgIdx, e.target.value)}
                              placeholder="Add note..."
                              className="flex-1 px-2 py-1 bg-bg2 border border-bd rounded text-t1 text-xs placeholder-t3 focus:outline-none focus:border-accent"
                            />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="flex-shrink-0 border-t border-bd p-4 md:p-6 bg-bg1">
            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="flex-1 px-4 md:px-6 py-3 bg-bg2 hover:bg-bg3 text-t1 font-bold rounded-xl transition-colors"
              >
                {selectedItems.length > 0 ? 'Cancel' : (addedProcedures?.length > 0 ? 'Done' : 'Cancel')}
              </button>
              <button
                onClick={handleAddAllToPlan}
                disabled={selectedItems.length === 0}
                className={`flex-1 px-4 md:px-6 py-3 font-bold rounded-xl transition-colors flex items-center justify-center gap-2 ${
                  selectedItems.length > 0
                    ? 'bg-accent hover:brightness-110 text-white'
                    : 'bg-bg3 text-t3 cursor-not-allowed'
                }`}
              >
                <Check size={20} />
                Add {selectedItems.length > 0 ? `${selectedItems.length} ` : ''}to Plan
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
