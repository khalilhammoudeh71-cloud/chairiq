import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { patientPlanService } from '../../services/patientPlanService';
import { shareLinkService } from '../../services/shareLinkService';
import { emailService } from '../../services/emailService';
import { sendSms, getSmsDeliveryStatus, retrySmsDelivery } from '../../services/twilioService';

import { useToast } from '../../hooks/useToast';
import { Plus, Copy, Check, MessageSquare, Send, RefreshCw, Mail } from 'lucide-react';
import DentistNavigation from '../../components/DentistNavigation';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { supabase } from '../../lib/supabase';
import { procedureCodesService } from '../../services/procedureCodesService';
import { procedureLibraryService } from '../../services/procedureLibraryService';

// Fixed import path - cn utility is in utils folder, not lib folder
import { cn } from '../../utils/cn';

import { DndContext, closestCenter, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import AddProcedureDrawer from './components/AddProcedureDrawer';
import ProcedureTableRow from './components/ProcedureTableRow';
import CanonicalMappingGuide from './components/CanonicalMappingGuide';

export default function CreatePatientPlan() {
  const navigate = useNavigate();
  const { showToast } = useToast();

  // Patient information state
  const [patientInfo, setPatientInfo] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    preferredLanguage: 'EN'
  });

  // Plan information state
  const [planInfo, setPlanInfo] = useState({
    dentistName: '',
    practiceName: ''
  });

  // Procedures state - START WITH EMPTY ARRAY
  const [procedures, setProcedures] = useState([]);

  // UI state
  const [loading, setLoading] = useState(false);
  const [savedPlan, setSavedPlan] = useState(null);
  const [shareToken, setShareToken] = useState(null);
  const [showSMSMessage, setShowSMSMessage] = useState(false);
  const [sendingSMS, setSendingSMS] = useState(false);
  const [sendMethod, setSendMethod] = useState('email');
  const [patientEmail, setPatientEmail] = useState('');
  const [sendingEmail, setSendingEmail] = useState(false);
  const [smsDeliveryLogs, setSmsDeliveryLogs] = useState([]);
  const [showSmsStatus, setShowSmsStatus] = useState(false);
  const [retryingMessageId, setRetryingMessageId] = useState(null);
  const [linkCopied, setLinkCopied] = useState(false);

  // New state for procedure codes feature
  const [procedureCodes, setProcedureCodes] = useState([]);
  const [procedureLibrary, setProcedureLibrary] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showCodeSearch, setShowCodeSearch] = useState(false);
  const [showProcedureSearch, setShowProcedureSearch] = useState(false);
  const [favorites, setFavorites] = useState([]);
  const [recents, setRecents] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [activeTab, setActiveTab] = useState('all'); // all, favorites, recents

  // Add new state for drawer and mobile detection
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [priorityFilter, setPriorityFilter] = useState('all'); // 'all', 'Urgent', 'Soon', 'Later'

  // Add new state for tooth picker
  const [showToothPicker, setShowToothPicker] = useState({});
  const [selectedTeeth, setSelectedTeeth] = useState({});

  // Add new state for resending saved plan
  const [resendingSavedPlan, setResendingSavedPlan] = useState(false);

  // Add helper to extract ADA codes from current procedures
  const getSelectedAdaCodes = () => {
    return procedures
      ?.filter(p => p?.adaCode)
      ?.map(p => p?.adaCode);
  };

  // Real-time subscription effect
  useEffect(() => {
    if (!savedPlan?.treatmentPlan?.id) return;

    // Subscribe to SMS messages changes for this treatment plan
    const channel = supabase?.channel(`sms_messages_${savedPlan?.treatmentPlan?.id}`)?.on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'sms_messages',
          filter: `treatment_plan_id=eq.${savedPlan?.treatmentPlan?.id}`
        },
        (payload) => {
          const newRecord = payload?.new;
          const oldRecord = payload?.old;

          // Check if delivery status changed
          if (newRecord?.delivery_status !== oldRecord?.delivery_status) {
            const statusChange = newRecord?.delivery_status;

            // Show notification based on status
            if (statusChange === 'failed') {
              showToast(
                `⚠️ SMS delivery failed to ${newRecord?.phone_number}. ${newRecord?.error_message || 'Please try resending.'}`,
                'error'
              );
            } else if (statusChange === 'delivered') {
              showToast(
                `✅ SMS successfully delivered to ${newRecord?.phone_number}`,
                'success'
              );
            } else if (statusChange === 'sent') {
              showToast(
                `📤 SMS sent to ${newRecord?.phone_number}. Waiting for delivery confirmation...`,
                'info'
              );
            }

            // Auto-refresh SMS delivery logs if they're visible
            if (showSmsStatus) {
              fetchSmsDeliveryStatus(savedPlan?.treatmentPlan?.id);
            }
          }
        }
      )?.subscribe();

    // Cleanup subscription on unmount
    return () => {
      supabase?.removeChannel(channel);
    };
  }, [savedPlan?.treatmentPlan?.id, showSmsStatus]);

  // Load current user
  useEffect(() => {
    const loadUser = async () => {
      const { data: { user } } = await supabase?.auth?.getUser();
      setCurrentUser(user);
      
      if (user) {
        // Load favorites and recents
        loadFavorites(user?.id);
        loadRecents(user?.id);
      }
    };
    loadUser();
  }, []);

  // Load procedure codes
  useEffect(() => {
    loadProcedureCodes();
  }, []);

  // Load procedure library
  useEffect(() => {
    loadProcedureLibrary();
  }, []);

  // Add mobile detection
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const loadProcedureCodes = async () => {
    try {
      const codes = await procedureCodesService?.getAllCodes();
      setProcedureCodes(codes);
    } catch (error) {
      console.error('Error loading procedure codes:', error);
    }
  };

  const loadProcedureLibrary = async () => {
    try {
      const library = await procedureLibraryService?.getAll();
      setProcedureLibrary(library);
    } catch (error) {
      console.error('Error loading procedure library:', error);
    }
  };

  const loadFavorites = async (userId) => {
    try {
      const favs = await procedureCodesService?.getFavorites(userId);
      setFavorites(favs);
    } catch (error) {
      console.error('Error loading favorites:', error);
    }
  };

  const loadRecents = async (userId) => {
    try {
      const recs = await procedureCodesService?.getRecents(userId);
      setRecents(recs);
    } catch (error) {
      console.error('Error loading recents:', error);
    }
  };

  // Handle procedure selection by treatment title
  const handleProcedureLibrarySelect = async (index, slug) => {
    const procedure = procedureLibrary?.find(p => p?.slug === slug);
    if (!procedure) return;

    // Auto-fill procedure data
    const updated = [...procedures];
    updated[index] = {
      ...updated?.[index],
      procedureSlug: slug,
      displayTitle: procedure?.titleEn,
      procedureName: procedure?.titleEn
    };
    setProcedures(updated);

    // Add to recents
    if (currentUser) {
      await procedureCodesService?.addRecent(currentUser?.id, slug, null);
      loadRecents(currentUser?.id);
    }

    showToast('Procedure selected from library', 'success');
  };

  // Handle procedure selection by ADA code
  const handleAdaCodeSelect = async (index, code) => {
    const procedureCode = procedureCodes?.find(c => c?.code === code);
    if (!procedureCode) return;

    // Auto-fill procedure data
    const updated = [...procedures];
    updated[index] = {
      ...updated?.[index],
      adaCode: code,
      displayTitle: procedureCode?.title,
      procedureName: procedureCode?.title
    };
    setProcedures(updated);

    // Add to recents
    if (currentUser) {
      await procedureCodesService?.addRecent(currentUser?.id, null, code);
      loadRecents(currentUser?.id);
    }

    showToast('Procedure selected by ADA code', 'success');
  };

  // Toggle favorite
  const handleToggleFavorite = async (procedureSlug, adaCode) => {
    if (!currentUser) {
      showToast('Please login to use favorites', 'error');
      return;
    }

    const existingFav = favorites?.find(f => 
      (f?.procedureSlug === procedureSlug && procedureSlug) ||
      (f?.adaCode === adaCode && adaCode)
    );

    try {
      if (existingFav) {
        await procedureCodesService?.removeFavorite(existingFav?.id);
        showToast('Removed from favorites', 'success');
      } else {
        await procedureCodesService?.addFavorite(currentUser?.id, procedureSlug, adaCode);
        showToast('Added to favorites', 'success');
      }
      loadFavorites(currentUser?.id);
    } catch (error) {
      showToast(`Error updating favorites: ${error?.message}`, 'error');
    }
  };

  // Check if procedure is favorited
  const isFavorite = (procedureSlug, adaCode) => {
    return favorites?.some(f => 
      (f?.procedureSlug === procedureSlug && procedureSlug) ||
      (f?.adaCode === adaCode && adaCode)
    );
  };

  // Get filtered procedures based on active tab
  const getFilteredProcedures = () => {
    if (activeTab === 'favorites') {
      return favorites?.map(fav => {
        if (fav?.procedureSlug) {
          return procedureLibrary?.find(p => p?.slug === fav?.procedureSlug);
        } else if (fav?.adaCode) {
          return procedureCodes?.find(c => c?.code === fav?.adaCode);
        }
        return null;
      })?.filter(Boolean);
    } else if (activeTab === 'recents') {
      return recents?.map(rec => {
        if (rec?.procedureSlug) {
          return procedureLibrary?.find(p => p?.slug === rec?.procedureSlug);
        } else if (rec?.adaCode) {
          return procedureCodes?.find(c => c?.code === rec?.adaCode);
        }
        return null;
      })?.filter(Boolean);
    } else {
      // All procedures
      return [...procedureLibrary, ...procedureCodes];
    }
  };

  // Handle procedure changes with validation
  const handleProcedureChangeWithValidation = (index, field, value) => {
    const updated = [...procedures];
    updated[index] = { ...updated?.[index], [field]: value };

    // Ensure at least one of procedure_slug, ada_code, or display_title is filled
    const hasRequiredField = updated?.[index]?.procedureSlug || 
                            updated?.[index]?.adaCode || 
                            updated?.[index]?.displayTitle;

    if (field === 'displayTitle' && value?.trim() && !hasRequiredField) {
      updated[index].displayTitle = value;
    }

    setProcedures(updated);
  };

  // Handle patient info changes
  const handlePatientChange = (field, value) => {
    setPatientInfo(prev => ({ ...prev, [field]: value }));
  };

  // Handle plan info changes
  const handlePlanChange = (field, value) => {
    setPlanInfo(prev => ({ ...prev, [field]: value }));
  };

  // Handle procedure changes
  const handleProcedureChange = (index, field, value) => {
    const updated = [...procedures];
    updated[index] = { ...updated?.[index], [field]: value };
    setProcedures(updated);
  };

  // Remove procedure row
  const removeProcedure = (index) => {
    setProcedures(prev => prev?.filter((_, i) => i !== index));
  };

  // Validate form
  const validateFormUpdated = () => {
    console.log('🔍 VALIDATION START - Form State:', {
      patientInfo,
      planInfo,
      proceduresCount: procedures?.length,
      procedures
    });

    if (!patientInfo?.firstName?.trim()) {
      console.error('❌ Validation failed: Missing firstName');
      showToast('Please enter patient first name', 'error');
      return false;
    }
    if (!patientInfo?.lastName?.trim()) {
      console.error('❌ Validation failed: Missing lastName');
      showToast('Please enter patient last name', 'error');
      return false;
    }
    if (!patientInfo?.phone?.trim()) {
      console.error('❌ Validation failed: Missing phone');
      showToast('Please enter patient phone number', 'error');
      return false;
    }
    if (!planInfo?.dentistName?.trim()) {
      console.error('❌ Validation failed: Missing dentistName');
      showToast('Please enter dentist name', 'error');
      return false;
    }
    if (!planInfo?.practiceName?.trim()) {
      console.error('❌ Validation failed: Missing practiceName');
      showToast('Please enter practice name', 'error');
      return false;
    }
    
    // Updated validation: check if there are any procedures added
    if (procedures?.length === 0) {
      console.error('❌ Validation failed: No procedures added');
      showToast('Please add at least one procedure', 'error');
      return false;
    }

    console.log('✅ Basic validations passed, checking procedures...');

    // Validate each procedure has at least one of: procedureSlug, adaCode, displayTitle, or procedureName
    for (let i = 0; i < procedures?.length; i++) {
      const proc = procedures?.[i];
      console.log(`🔍 Validating procedure ${i + 1}:`, proc);
      
      const hasIdentifier = proc?.procedureSlug || 
                           proc?.adaCode || 
                           proc?.displayTitle?.trim() || 
                           proc?.procedureName?.trim();
      
      console.log(`Procedure ${i + 1} has identifier:`, hasIdentifier, {
        procedureSlug: proc?.procedureSlug || 'EMPTY',
        adaCode: proc?.adaCode || 'EMPTY',
        displayTitle: proc?.displayTitle?.trim() || 'EMPTY',
        procedureName: proc?.procedureName?.trim() || 'EMPTY'
      });

      if (!hasIdentifier) {
        console.error(`❌ Validation failed: Procedure ${i + 1} has no valid identifier`);
        showToast(`Procedure ${i + 1} must have at least a treatment title, ADA code, display title, or procedure name`, 'error');
        return false;
      }
    }

    console.log('✅ ALL VALIDATIONS PASSED - Form is valid');
    return true;
  };

  // Save plan
  const handleSavePlan = async () => {
    console.log('🚀 SAVE PLAN CLICKED');
    console.log('Current State:', {
      patientInfo,
      planInfo,
      procedures,
      loading
    });

    const isValid = validateFormUpdated();
    console.log('Validation result:', isValid);

    if (!isValid) {
      console.error('❌ Save plan aborted - validation failed');
      return;
    }

    console.log('✅ Validation passed, proceeding with save...');
    setLoading(true);
    try {
      console.log('📡 Calling patientPlanService.createPatientPlan...');
      const result = await patientPlanService?.createPatientPlan(
        patientInfo,
        planInfo,
        procedures
      );
      console.log('✅ Plan saved successfully:', result);
      setSavedPlan(result);

      const linkResult = await shareLinkService.getOrCreateShareLink(
        result?.treatmentPlan?.id,
        result?.patient?.id
      );
      if (linkResult?.success) {
        setShareToken(linkResult.token);
      }

      showToast('Patient plan saved successfully!', 'success');
    } catch (error) {
      console.error('❌ Error saving plan:', error);
      showToast(`Error saving plan: ${error?.message}`, 'error');
    } finally {
      setLoading(false);
      console.log('🏁 Save plan process completed');
    }
  };

  const fallbackCopy = (text) => {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-9999px';
    textArea.style.top = '-9999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    document.execCommand('copy');
    document.body.removeChild(textArea);
  };

  const safeCopy = async (text) => {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
      } else {
        fallbackCopy(text);
      }
      return true;
    } catch (err) {
      try {
        fallbackCopy(text);
        return true;
      } catch (e) {
        console.error('Copy failed:', e);
        return false;
      }
    }
  };

  const copyPatientLink = async () => {
    if (!savedPlan) return;
    const token = shareToken || savedPlan?.treatmentPlan?.publicToken;
    const link = `${window.location?.origin}/p/${token}`;
    const success = await safeCopy(link);
    if (success) {
      setLinkCopied(true);
      setTimeout(() => setLinkCopied(false), 2500);
    }
  };

  // Generate and show SMS message
  const handleGenerateSMS = () => {
    if (!savedPlan) return;
    setShowSMSMessage(true);
  };

  const copySMSMessage = () => {
    if (!savedPlan) return;
    const token = shareToken || savedPlan?.treatmentPlan?.publicToken;
    const message = patientPlanService?.generateSMSMessage(
      savedPlan?.patient?.firstName,
      savedPlan?.treatmentPlan?.practiceName,
      token
    );
    safeCopy(message);
    showToast('SMS message copied to clipboard!', 'success');
  };

  const handleSendSMS = async () => {
    if (!savedPlan) return;

    setSendingSMS(true);
    try {
      const token = shareToken || savedPlan?.treatmentPlan?.publicToken;
      const result = await sendSms(
        savedPlan?.patient?.phone,
        savedPlan?.patient?.firstName,
        `${window.location?.origin}/p/${token}`,
        savedPlan?.treatmentPlan?.id
      );

      if (result?.success) {
        showToast('SMS sent successfully to patient!', 'success');
        setShowSMSMessage(false);
      } else {
        showToast(`Failed to send SMS: ${result?.error}`, 'error');
      }
    } catch (error) {
      showToast(`Error sending SMS: ${error?.message}`, 'error');
    } finally {
      setSendingSMS(false);
    }
  };

  const handleSendEmail = async () => {
    if (!savedPlan || !patientEmail) return;

    setSendingEmail(true);
    try {
      const token = shareToken || savedPlan?.treatmentPlan?.publicToken;
      const planLink = `${window.location?.origin}/p/${token}`;
      const result = await emailService.sendTreatmentPlanEmail(
        patientEmail,
        planLink,
        savedPlan?.patient?.firstName
      );

      if (result?.success) {
        showToast('Email sent successfully!', 'success');
      } else {
        showToast(`Failed to send email: ${result?.error}`, 'error');
      }
    } catch (error) {
      showToast(`Error sending email: ${error?.message}`, 'error');
    } finally {
      setSendingEmail(false);
    }
  };

  const fetchSmsDeliveryStatus = async (planId) => {
    const { data, error } = await getSmsDeliveryStatus(planId);
    if (!error && data) {
      setSmsDeliveryLogs(data);
      setShowSmsStatus(true);
    }
  };

  // Handle SMS retry
  const handleRetryFailedSms = async (smsLog) => {
    if (!savedPlan) return;
    
    setRetryingMessageId(smsLog?.id);
    
    const result = await retrySmsDelivery(
      smsLog?.id,
      savedPlan?.patient?.phone,
      savedPlan?.patient?.firstName,
      `${window.location?.origin}/p/${shareToken || savedPlan?.treatmentPlan?.publicToken}`
    );

    if (result?.success) {
      showToast('SMS retry sent successfully!', 'success');
      await fetchSmsDeliveryStatus(savedPlan?.treatmentPlan?.id);
    } else {
      showToast(result?.error || 'Failed to retry SMS', 'error');
    }
    
    setRetryingMessageId(null);
  };

  const handleResendSavedPlanLink = async () => {
    if (!savedPlan?.treatmentPlan?.id) {
      showToast('No treatment plan link available to resend', 'error');
      return;
    }

    setResendingSavedPlan(true);
    try {
      const linkResult = await shareLinkService.getOrCreateShareLink(
        savedPlan?.treatmentPlan?.id,
        savedPlan?.patient?.id
      );
      if (linkResult?.success) {
        setShareToken(linkResult.token);
      }
      const tokenToUse = linkResult?.token || shareToken || savedPlan?.treatmentPlan?.publicToken;
      const result = await patientPlanService?.resendTreatmentPlanLink(
        tokenToUse, true
      );

      if (result?.success) {
        showToast('Treatment plan link resent successfully!', 'success');
      } else {
        showToast(result?.userMessage || 'Failed to resend link', 'error');
      }
    } catch (error) {
      showToast(`Error resending link: ${error?.message}`, 'error');
    } finally {
      setResendingSavedPlan(false);
    }
  };

  // Get status badge styling
  const getStatusBadge = (status) => {
    const styles = {
      sent: 'bg-accent/10 text-accent',
      delivered: 'bg-success/10 text-success',
      failed: 'bg-danger/10 text-danger',
      undelivered: 'bg-warning/10 text-warning'
    };
    return styles?.[status] || 'bg-bg2 text-t1';
  };

  // Format timestamp
  const formatTimestamp = (timestamp) => {
    if (!timestamp) return 'N/A';
    return new Date(timestamp)?.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Toggle tooth number selection
  const toggleToothNumber = (procedureIndex, toothNumber) => {
    const currentTeeth = procedures?.[procedureIndex]?.toothNumbers || '';
    const teethArray = currentTeeth?.split(',')?.map(t => t?.trim())?.filter(Boolean);

    const toothStr = `#${toothNumber}`;
    const toothIndex = teethArray?.indexOf(toothStr);

    let newTeethArray;
    if (toothIndex > -1) {
      // Remove tooth
      newTeethArray = teethArray?.filter((_, i) => i !== toothIndex);
    } else {
      // Add tooth
      newTeethArray = [...teethArray, toothStr];
    }

    handleProcedureChange(procedureIndex, 'toothNumbers', newTeethArray?.join(', '));
  };

  // Check if tooth is selected
  const isToothSelected = (procedureIndex, toothNumber) => {
    const currentTeeth = procedures?.[procedureIndex]?.toothNumbers || '';
    return currentTeeth?.includes(`#${toothNumber}`);
  };

  // Toggle tooth picker visibility
  const toggleToothPicker = (procedureIndex) => {
    setShowToothPicker(prev => ({
      ...prev,
      [procedureIndex]: !prev?.[procedureIndex]
    }));
  };

  // Drag and drop sensors
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  // Handle drag end
  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (active?.id !== over?.id) {
      setProcedures((items) => {
        const oldIndex = items?.findIndex((item) => 
          (item?.id || `procedure-${items?.indexOf(item)}`) === active?.id
        );
        const newIndex = items?.findIndex((item) => 
          (item?.id || `procedure-${items?.indexOf(item)}`) === over?.id
        );

        const reordered = arrayMove(items, oldIndex, newIndex);
        // Update sortOrder
        return reordered?.map((item, index) => ({
          ...item,
          sortOrder: index
        }));
      });
    }
  };

  // Get filtered and grouped procedures
  const getGroupedProcedures = () => {
    let filtered = procedures;
    
    if (priorityFilter !== 'all') {
      filtered = procedures?.filter(p => p?.priority === priorityFilter);
    }

    // Group by priority
    const grouped = {
      'Urgent': filtered?.filter(p => p?.priority === 'Urgent') || [],
      'Soon': filtered?.filter(p => p?.priority === 'Soon') || [],
      'Later': filtered?.filter(p => p?.priority === 'Later') || []
    };

    return grouped;
  };

  // Remove old addProcedure function and replace with drawer open
  const openAddProcedureDrawer = () => {
    setIsDrawerOpen(true);
  };

  // Handle procedure save from drawer
  const handleSaveProcedureFromDrawer = (procedureData) => {
    const newProcedure = {
      ...procedureData,
      sortOrder: procedures?.length,
      id: `temp-${Date.now()}` // Temporary ID for drag-and-drop
    };
    setProcedures(prev => [...prev, newProcedure]);
    setIsDrawerOpen(false);
    showToast('Procedure added successfully', 'success');
  };

  return (
    <div className="page-container">
      {/* Add Navigation */}
      <DentistNavigation />
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="card mb-8">
          <h1 className="text-4xl font-bold text-t1 mb-2">Create Patient Plan</h1>
          <p className="text-t2 text-lg">Generate treatment plans and share with patients via SMS</p>
        </div>

        {/* Patient Information Section */}
        <div className="card mb-6">
          <h2 className="text-2xl font-bold text-t1 mb-6">Patient Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-t2 mb-2 font-semibold text-base">First Name *</label>
              <input
                type="text"
                value={patientInfo?.firstName}
                onChange={(e) => handlePatientChange('firstName', e?.target?.value)}
                className="input-field w-full"
                placeholder="Enter first name"
              />
            </div>
            <div>
              <label className="block text-t2 mb-2 font-semibold text-base">Last Name *</label>
              <input
                type="text"
                value={patientInfo?.lastName}
                onChange={(e) => handlePatientChange('lastName', e?.target?.value)}
                className="input-field w-full"
                placeholder="Enter last name"
              />
            </div>
            <div>
              <label className="block text-t2 mb-2 font-semibold text-base">Phone Number *</label>
              <input
                type="tel"
                value={patientInfo?.phone}
                onChange={(e) => handlePatientChange('phone', e?.target?.value)}
                className="input-field w-full"
                placeholder="+1-555-0123"
              />
            </div>
            <div>
              <label className="block text-t2 mb-2 font-semibold text-base">Preferred Language</label>
              <select
                value={patientInfo?.preferredLanguage}
                onChange={(e) => handlePatientChange('preferredLanguage', e?.target?.value)}
                className="input-field w-full"
              >
                <option value="EN" className="bg-bg2">English</option>
                <option value="ES" className="bg-bg2">Spanish</option>
              </select>
            </div>
          </div>
        </div>

        {/* Plan Information Section */}
        <div className="card mb-6">
          <h2 className="text-2xl font-bold text-t1 mb-6">Plan Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-t2 mb-2 font-semibold text-base">Dentist Name *</label>
              <input
                type="text"
                value={planInfo?.dentistName}
                onChange={(e) => handlePlanChange('dentistName', e?.target?.value)}
                className="input-field w-full"
                placeholder="Dr. Smith"
              />
            </div>
            <div>
              <label className="block text-t2 mb-2 font-semibold text-base">Practice Name *</label>
              <input
                type="text"
                value={planInfo?.practiceName}
                onChange={(e) => handlePlanChange('practiceName', e?.target?.value)}
                className="input-field w-full"
                placeholder="Bright Smile Dental"
              />
            </div>
          </div>
        </div>

        {/* NEW: Canonical Mapping Guide - Add BEFORE Procedures Section */}
        <CanonicalMappingGuide selectedAdaCodes={getSelectedAdaCodes()} />

        {/* Redesigned Procedures Section */}
        <div className="card mb-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
            <h2 className="text-2xl font-bold text-t1">Added Procedures</h2>
            
            <div className="flex flex-wrap items-center gap-3">
              {/* Priority Filter Tabs */}
              <div className="flex gap-2">
                <button
                  onClick={() => setPriorityFilter('all')}
                  className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition-colors ${
                    priorityFilter === 'all' ? 'bg-accent text-bg0' : 'bg-bg3 text-t2 hover:bg-bg2'
                  }`}
                >
                  All ({procedures?.length})
                </button>
                <button
                  onClick={() => setPriorityFilter('Urgent')}
                  className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition-colors ${
                    priorityFilter === 'Urgent' ? 'bg-danger text-bg0' : 'bg-bg3 text-t2 hover:bg-bg2'
                  }`}
                >
                  Urgent ({procedures?.filter(p => p?.priority === 'Urgent')?.length})
                </button>
                <button
                  onClick={() => setPriorityFilter('Soon')}
                  className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition-colors ${
                    priorityFilter === 'Soon' ? 'bg-warning text-bg0' : 'bg-bg3 text-t2 hover:bg-bg2'
                  }`}
                >
                  Soon ({procedures?.filter(p => p?.priority === 'Soon')?.length})
                </button>
                <button
                  onClick={() => setPriorityFilter('Later')}
                  className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition-colors ${
                    priorityFilter === 'Later' ? 'bg-success text-bg0' : 'bg-bg3 text-t2 hover:bg-bg2'
                  }`}
                >
                  Later ({procedures?.filter(p => p?.priority === 'Later')?.length})
                </button>
              </div>

              {/* Add Procedure Button */}
              <button
                onClick={openAddProcedureDrawer}
                className="btn-primary flex items-center gap-2"
              >
                <Plus size={20} />
                Add Procedure
              </button>
            </div>
          </div>

          {/* Procedures Table/List */}
          {procedures?.length === 0 ? (
            <div className="text-center py-12 bg-bg3 rounded border-2 border-dashed border-bd">
              <p className="text-t3 text-lg mb-4">No procedures added yet</p>
              <button
                onClick={openAddProcedureDrawer}
                className="btn-primary inline-flex items-center gap-2"
              >
                <Plus size={20} />
                Add Your First Procedure
              </button>
            </div>
          ) : (
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              {/* Desktop Table View */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="table-header border-b-2 border-bd">
                      <th className="px-4 py-3 text-left text-xs font-semibold text-t2 uppercase tracking-wider">
                        {/* Drag handle column */}
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-t2 uppercase tracking-wider">
                        Priority
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-t2 uppercase tracking-wider">
                        Tooth #
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-t2 uppercase tracking-wider">
                        Treatment Title
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-t2 uppercase tracking-wider">
                        ADA Code
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-t2 uppercase tracking-wider">
                        Est. Time
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-t2 uppercase tracking-wider">
                        Notes
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-t2 uppercase tracking-wider">
                        {/* Delete column */}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <SortableContext
                      items={procedures?.map((p, i) => p?.id || `procedure-${i}`)}
                      strategy={verticalListSortingStrategy}
                    >
                      {procedures
                        ?.filter(p => priorityFilter === 'all' || p?.priority === priorityFilter)
                        ?.map((procedure, index) => (
                          <ProcedureTableRow
                            key={procedure?.id || `procedure-${index}`}
                            procedure={procedure}
                            index={procedures?.indexOf(procedure)}
                            onDelete={removeProcedure}
                          />
                        ))}
                    </SortableContext>
                  </tbody>
                </table>
              </div>

              {/* Mobile Card View */}
              <div className="md:hidden space-y-4">
                <SortableContext
                  items={procedures?.map((p, i) => p?.id || `procedure-${i}`)}
                  strategy={verticalListSortingStrategy}
                >
                  {procedures
                    ?.filter(p => priorityFilter === 'all' || p?.priority === priorityFilter)
                    ?.map((procedure, index) => (
                      <ProcedureTableRow
                        key={procedure?.id || `procedure-${index}`}
                        procedure={procedure}
                        index={procedures?.indexOf(procedure)}
                        onDelete={removeProcedure}
                      />
                    ))}
                </SortableContext>
              </div>
            </DndContext>
          )}
        </div>

        {/* Action Buttons */}
        <div className="card">
          <button
            onClick={handleSavePlan}
            disabled={loading}
            className={cn(
              "btn-primary w-full py-4 text-lg flex items-center justify-center gap-2 transition-all",
              loading && "opacity-60 cursor-not-allowed"
            )}
          >
            {loading && <LoadingSpinner size="sm" variant="accent" className="text-white" />}
            {loading ? 'Saving Plan...' : 'Save Plan'}
          </button>

          {savedPlan && (
            <div className="space-y-4 mt-4">
              <div className="card bg-success/10 border-success">
                <h3 className="text-xl font-bold text-success mb-4">Plan Saved Successfully!</h3>
                
                <div className="mb-4">
                  <label className="block text-t2 mb-2 font-semibold text-base">Patient Link</label>
                  <div className="flex gap-2 items-center">
                    <input
                      type="text"
                      readOnly
                      value={`${window.location?.origin}/p/${shareToken || savedPlan?.treatmentPlan?.publicToken}`}
                      className="input-field flex-1"
                    />
                    <div className="relative">
                      <button
                        onClick={copyPatientLink}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${linkCopied ? 'bg-success text-white' : 'btn-primary'}`}
                      >
                        {linkCopied ? <Check size={20} /> : <Copy size={20} />}
                        {linkCopied ? 'Copied!' : 'Copy'}
                      </button>
                      {linkCopied && (
                        <span className="absolute -bottom-7 left-1/2 -translate-x-1/2 whitespace-nowrap text-sm text-success font-medium">
                          Link copied!
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="mb-4">
                  <label className="block text-t2 mb-2 font-semibold text-base">Send via</label>
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="sendMethod"
                        value="email"
                        checked={sendMethod === 'email'}
                        onChange={() => setSendMethod('email')}
                        className="accent-accent"
                      />
                      <Mail size={16} className="text-t2" />
                      <span className="text-t1">Email</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="sendMethod"
                        value="sms"
                        checked={sendMethod === 'sms'}
                        onChange={() => setSendMethod('sms')}
                        className="accent-accent"
                      />
                      <MessageSquare size={16} className="text-t2" />
                      <span className="text-t1">SMS</span>
                    </label>
                  </div>
                </div>

                {sendMethod === 'email' && (
                  <div className="mb-4">
                    <label className="block text-t2 mb-2 text-sm">Patient Email</label>
                    <div className="flex gap-2 items-center">
                      <input
                        type="email"
                        value={patientEmail}
                        onChange={(e) => setPatientEmail(e.target.value)}
                        placeholder="patient@email.com"
                        className="input-field flex-1"
                      />
                      <button
                        onClick={handleSendEmail}
                        disabled={sendingEmail || !patientEmail}
                        className="btn-primary bg-success hover:bg-success/90 py-2.5 px-5 flex items-center gap-2"
                      >
                        <Mail size={18} />
                        {sendingEmail ? 'Sending...' : 'Send Email'}
                      </button>
                    </div>
                  </div>
                )}

                {sendMethod === 'sms' && (
                  <div className="mb-4 p-4 rounded-lg bg-warning/10 border border-warning/30">
                    <p className="text-warning text-sm font-medium">
                      SMS coming soon (pending carrier approval)
                    </p>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <button
                    onClick={handleResendSavedPlanLink}
                    disabled={resendingSavedPlan}
                    className="btn-primary bg-accent hover:bg-accent-hover py-3 flex items-center justify-center gap-2"
                  >
                    <Send size={20} />
                    {resendingSavedPlan ? 'Resending...' : 'Resend Link'}
                  </button>

                  <button
                    onClick={handleGenerateSMS}
                    className="btn-secondary py-3 flex items-center justify-center gap-2"
                  >
                    <Copy size={20} />
                    View/Copy Message
                  </button>
                </div>
              </div>

              {showSMSMessage && (
                <div className="card bg-accent/10 border-accent">
                  <h3 className="text-xl font-bold text-accent mb-4">Message Preview</h3>
                  <p className="text-t2 mb-2 text-base">
                    Message that will be included with the plan link:
                  </p>
                  <div className="mb-4">
                    <textarea
                      readOnly
                      value={patientPlanService?.generateSMSMessage(
                        savedPlan?.patient?.firstName,
                        savedPlan?.treatmentPlan?.practiceName,
                        shareToken || savedPlan?.treatmentPlan?.publicToken
                      )}
                      className="input-field w-full"
                      rows="3"
                    />
                  </div>
                  <button
                    onClick={copySMSMessage}
                    className="btn-primary w-full py-3 flex items-center justify-center gap-2"
                  >
                    <Copy size={20} />
                    Copy Message
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* SMS Delivery Status Section */}
        {showSmsStatus && smsDeliveryLogs?.length > 0 && (
          <div className="mt-6 card">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <MessageSquare className="w-6 h-6 text-accent" />
                <h2 className="text-2xl font-bold text-t1">SMS Delivery Status</h2>
              </div>
              <button
                onClick={() => fetchSmsDeliveryStatus(savedPlan?.treatmentPlan?.id)}
                className="btn-ghost text-accent hover:text-accent-hover flex items-center gap-2 text-sm"
              >
                <RefreshCw className="w-4 h-4" />
                Refresh
              </button>
            </div>

            <div className="space-y-4">
              {smsDeliveryLogs?.map((log) => (
                <div
                  key={log?.id}
                  className="card bg-bg3"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold uppercase ${getStatusBadge(
                            log?.delivery_status
                          )}`}
                        >
                          {log?.delivery_status}
                        </span>
                        {log?.twilio_message_sid && (
                          <span className="text-xs text-t3 font-mono">
                            {log?.twilio_message_sid}
                          </span>
                        )}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                        <div>
                          <span className="text-t3">Sent At:</span>
                          <span className="ml-2 text-t1 font-medium">
                            {formatTimestamp(log?.sent_at)}
                          </span>
                        </div>
                        {log?.delivered_at && (
                          <div>
                            <span className="text-t3">Delivered At:</span>
                            <span className="ml-2 text-t1 font-medium">
                              {formatTimestamp(log?.delivered_at)}
                            </span>
                          </div>
                        )}
                        {log?.failed_at && (
                          <div>
                            <span className="text-t3">Failed At:</span>
                            <span className="ml-2 text-t1 font-medium">
                              {formatTimestamp(log?.failed_at)}
                            </span>
                          </div>
                        )}
                        <div>
                          <span className="text-t3">Phone:</span>
                          <span className="ml-2 text-t1 font-medium">
                            {log?.phone_number}
                          </span>
                        </div>
                      </div>

                      {log?.error_message && (
                        <div className="mt-3 p-3 bg-danger/10 border border-danger rounded-md">
                          <p className="text-sm text-danger">
                            <span className="font-semibold">Error:</span> {log?.error_message}
                          </p>
                        </div>
                      )}
                    </div>

                    {(log?.delivery_status === 'failed' || log?.delivery_status === 'undelivered') && (
                      <button
                        onClick={() => handleRetryFailedSms(log)}
                        disabled={retryingMessageId === log?.id}
                        className="btn-primary ml-4 flex items-center gap-2 text-sm"
                      >
                        {retryingMessageId === log?.id ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                            Retrying...
                          </>
                        ) : (
                          <>
                            <RefreshCw className="w-4 h-4" />
                            Retry
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Add Procedure Drawer */}
      <AddProcedureDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        onSave={handleSaveProcedureFromDrawer}
        isMobile={isMobile}
      />
    </div>
  );
}