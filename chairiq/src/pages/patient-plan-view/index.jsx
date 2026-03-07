import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { patientPlanService } from '../../services/patientPlanService';
import { shareLinkService } from '../../services/shareLinkService';

import { useToast } from '../../hooks/useToast';
import { Clock, AlertCircle, Calendar, ChevronDown, ChevronUp, ShieldX, TimerOff } from 'lucide-react';
import PatientContent from './components/PatientContent';
import ProcedureTimeline from './components/ProcedureTimeline';
import CategoryVisualDeck from './components/CategoryVisualDeck';
import PatientImageGallery from './components/PatientImageGallery';

function VisualsDebugPanel({ planData }) {
  const params = new URLSearchParams(window.location.search);
  if (params.get('debug') !== '1') return null;

  const supabaseUrl = import.meta.env?.VITE_SUPABASE_URL || 'NOT SET';
  const projectRef = supabaseUrl.replace('https://', '').split('.')[0];

  return (
    <div style={{ background: 'rgba(59,130,246,0.08)', border: '1px solid rgba(59,130,246,0.25)', borderRadius: '12px', padding: '16px', marginBottom: '24px', fontFamily: 'monospace', fontSize: '12px', color: '#93c5fd' }}>
      <div style={{ fontWeight: 'bold', marginBottom: '12px', fontSize: '14px' }}>Visuals Debug Panel</div>
      <div style={{ marginBottom: '8px' }}>
        <span style={{ color: '#9ca3af' }}>Supabase Project Ref: </span>
        <span style={{ color: '#e8e9ed' }}>{projectRef}</span>
      </div>
      <div style={{ marginBottom: '8px' }}>
        <span style={{ color: '#9ca3af' }}>Env Vars: </span>
        <span style={{ color: supabaseUrl !== 'NOT SET' ? '#10b981' : '#ef4444' }}>VITE_SUPABASE_URL={supabaseUrl !== 'NOT SET' ? 'SET' : 'MISSING'}</span>
        {', '}
        <span style={{ color: import.meta.env?.VITE_SUPABASE_ANON_KEY ? '#10b981' : '#ef4444' }}>VITE_SUPABASE_ANON_KEY={import.meta.env?.VITE_SUPABASE_ANON_KEY ? 'SET' : 'MISSING'}</span>
      </div>
      <div style={{ marginBottom: '12px' }}>
        <span style={{ color: '#9ca3af' }}>Route: </span>
        <span style={{ color: '#e8e9ed' }}>/p/{planData?.treatmentPlan?.publicToken || window.location.pathname}</span>
      </div>
      {planData?.procedures?.map((proc, i) => {
        const lang = planData?.patient?.preferredLanguage || 'EN';
        const content = proc?.library?.content?.[lang] || proc?.library?.content?.EN || [];
        const visualSteps = content.filter(s => s?.visual?.image_url);
        const firstVisual = visualSteps[0];

        return (
          <div key={proc?.id || i} style={{ background: 'rgba(0,0,0,0.2)', borderRadius: '8px', padding: '12px', marginBottom: '8px' }}>
            <div style={{ color: '#fbbf24', fontWeight: 'bold', marginBottom: '4px' }}>{proc?.procedureName}</div>
            <div><span style={{ color: '#9ca3af' }}>procedure_id: </span><span style={{ color: '#e8e9ed' }}>{proc?.id || 'N/A'}</span></div>
            <div><span style={{ color: '#9ca3af' }}>canonical_slug: </span><span style={{ color: '#e8e9ed' }}>{proc?.canonicalSlug || 'N/A'}</span></div>
            <div><span style={{ color: '#9ca3af' }}>ada_code: </span><span style={{ color: '#e8e9ed' }}>{proc?.adaCode || 'N/A'}</span></div>
            <div><span style={{ color: '#9ca3af' }}>total_steps: </span><span style={{ color: '#e8e9ed' }}>{content.length}</span></div>
            <div><span style={{ color: '#9ca3af' }}>visuals_count: </span><span style={{ color: visualSteps.length > 0 ? '#10b981' : '#ef4444' }}>{visualSteps.length}</span></div>
            {visualSteps.length === 0 && (
              <div style={{ color: '#ef4444', marginTop: '4px' }}>No visuals found. Query used canonical_slug="{proc?.canonicalSlug || 'N/A'}"</div>
            )}
            {visualSteps.length === 0 && content.length > 0 && (
              <div style={{ color: '#fbbf24', marginTop: '4px', fontSize: '11px' }}>Possible causes: RLS blocking anon SELECT on procedure_visuals, or no visuals uploaded for this canonical_slug.</div>
            )}
            {firstVisual && (() => {
              const url = firstVisual?.visual?.image_url || '';
              const urlType = url.includes('supabase.co/storage') 
                ? (url.includes('/object/public/') ? 'supabase-public' : 'supabase-private') 
                : (url ? 'external' : 'none');
              return (
                <div style={{ marginTop: '4px', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '4px' }}>
                  <div style={{ color: '#9ca3af', marginBottom: '2px' }}>First visual:</div>
                  <div><span style={{ color: '#9ca3af' }}>step_id: </span><span style={{ color: '#e8e9ed' }}>{firstVisual?.step_id || 'N/A'}</span></div>
                  <div><span style={{ color: '#9ca3af' }}>title: </span><span style={{ color: '#e8e9ed' }}>{firstVisual?.title || 'N/A'}</span></div>
                  <div><span style={{ color: '#9ca3af' }}>url_type: </span><span style={{ color: urlType === 'supabase-public' ? '#10b981' : urlType === 'supabase-private' ? '#fbbf24' : '#93c5fd' }}>{urlType}</span></div>
                  <div style={{ wordBreak: 'break-all' }}><span style={{ color: '#9ca3af' }}>image_url: </span><span style={{ color: '#e8e9ed', fontSize: '10px' }}>{url || 'null'}</span></div>
                </div>
              );
            })()}
          </div>
        );
      })}
    </div>
  );
}

export default function PatientPlanView() {
  const { publicToken } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [planData, setPlanData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [linkStatus, setLinkStatus] = useState(null);
  const [currentLanguage, setCurrentLanguage] = useState('EN');
  const [expandedProcedures, setExpandedProcedures] = useState(new Set());

  useEffect(() => {
    loadPlanData();
  }, [publicToken]);

  const loadPlanData = async () => {
    setLoading(true);
    setError('');
    setLinkStatus(null);
    try {
      const validation = await shareLinkService.validateShareLink(publicToken);

      if (validation.valid) {
        await shareLinkService.incrementViewCount(publicToken);
        const data = await patientPlanService?.getEnrichedPatientPlanById(validation.link.plan_id);
        if (data?.success) {
          setPlanData(data);
          setCurrentLanguage(data?.patient?.preferredLanguage || 'EN');
          return;
        }
      }

      if (validation.reason === 'expired') {
        setLinkStatus('expired');
        return;
      }

      const fallbackData = await patientPlanService?.getEnrichedPatientPlan(publicToken);
      if (fallbackData?.success) {
        setPlanData(fallbackData);
        setCurrentLanguage(fallbackData?.patient?.preferredLanguage || 'EN');
      } else if (validation.reason === 'not_found') {
        setLinkStatus('invalid');
      } else {
        setError(fallbackData?.error || 'Failed to load treatment plan');
      }
    } catch (err) {
      setError(err?.message || 'Failed to load treatment plan');
    } finally {
      setLoading(false);
    }
  };

  const toggleProcedureExpand = (procedureId) => {
    setExpandedProcedures((prev) => {
      const newSet = new Set(prev);
      if (newSet?.has(procedureId)) {
        newSet?.delete(procedureId);
      } else {
        newSet?.add(procedureId);
      }
      return newSet;
    });
  };


  // Group procedures by priority
  const getProceduresByPriority = () => {
    if (!planData) return { Immediate: [], Soon: [], Future: [] };
    
    return planData?.procedures?.reduce((acc, proc) => {
      if (!acc?.[proc?.priority]) acc[proc.priority] = [];
      acc?.[proc?.priority]?.push(proc);
      return acc;
    }, { Immediate: [], Soon: [], Future: [] });
  };

  // Get priority badge color
  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'Immediate':
        return 'bg-danger/10 text-danger border-danger/30';
      case 'Soon':
        return 'bg-warning/10 text-warning border-warning/30';
      case 'Future':
        return 'bg-accent/10 text-accent border-accent/30';
      default:
        return 'bg-bg3 text-t3 border-bd';
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg0">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-xl" 
          style={{ color: '#e8e9ed' }}
        >
          Loading your treatment plan...
        </motion.div>
      </div>
    );
  }

  if (linkStatus === 'invalid') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4" style={{ background: 'linear-gradient(165deg, #0c0e14 0%, #151825 50%, #1a1f2e 100%)' }}>
        <div className="max-w-md w-full text-center">
          <div className="flex items-center justify-center gap-2.5 mb-10">
            <ShieldX size={28} style={{ color: '#6B8AEE' }} />
            <span className="text-lg font-semibold tracking-tight" style={{ color: '#e8e9ed' }}>ChairIQ</span>
          </div>
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="rounded-2xl p-8 mb-8"
            style={{ backgroundColor: 'rgba(239, 68, 68, 0.06)', border: '1px solid rgba(239, 68, 68, 0.15)', backdropFilter: 'blur(12px)' }}
          >
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6" style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)' }}>
              <ShieldX size={32} style={{ color: '#fca5a5' }} />
            </div>
            <h2 className="text-2xl sm:text-3xl font-semibold mb-3" style={{ color: '#e8e9ed' }}>Link Invalid</h2>
            <p className="text-base leading-relaxed mb-6" style={{ color: '#9ca3af' }}>This treatment plan link is not valid. Please contact your dental provider for a new link.</p>
            <div className="w-12 h-px mx-auto mb-6" style={{ backgroundColor: 'rgba(255,255,255,0.1)' }} />
            <p className="text-sm" style={{ color: '#6b7280' }}>Contact your dental office for assistance</p>
          </motion.div>
          <p className="text-xs" style={{ color: '#4b5563' }}>Powered by ChairIQ</p>
        </div>
      </div>
    );
  }

  if (linkStatus === 'expired') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4" style={{ background: 'linear-gradient(165deg, #0c0e14 0%, #151825 50%, #1a1f2e 100%)' }}>
        <div className="max-w-md w-full text-center">
          <div className="flex items-center justify-center gap-2.5 mb-10">
            <TimerOff size={28} style={{ color: '#6B8AEE' }} />
            <span className="text-lg font-semibold tracking-tight" style={{ color: '#e8e9ed' }}>ChairIQ</span>
          </div>
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="rounded-2xl p-8 mb-8"
            style={{ backgroundColor: 'rgba(251, 191, 36, 0.06)', border: '1px solid rgba(251, 191, 36, 0.15)', backdropFilter: 'blur(12px)' }}
          >
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6" style={{ backgroundColor: 'rgba(251, 191, 36, 0.1)' }}>
              <TimerOff size={32} style={{ color: '#fbbf24' }} />
            </div>
            <h2 className="text-2xl sm:text-3xl font-semibold mb-3" style={{ color: '#e8e9ed' }}>Link Expired</h2>
            <p className="text-base leading-relaxed mb-6" style={{ color: '#9ca3af' }}>This treatment plan link has expired. Please contact your dental provider to request a new link.</p>
            <div className="w-12 h-px mx-auto mb-6" style={{ backgroundColor: 'rgba(255,255,255,0.1)' }} />
            <p className="text-sm" style={{ color: '#6b7280' }}>Contact your dental office for assistance</p>
          </motion.div>
          <p className="text-xs" style={{ color: '#4b5563' }}>Powered by ChairIQ</p>
        </div>
      </div>
    );
  }

  if (error || !planData) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4" style={{ background: 'linear-gradient(165deg, #0c0e14 0%, #151825 50%, #1a1f2e 100%)' }}>
        <div className="max-w-md w-full text-center">
          <div className="flex items-center justify-center gap-2.5 mb-10">
            <AlertCircle size={28} style={{ color: '#6B8AEE' }} />
            <span className="text-lg font-semibold tracking-tight" style={{ color: '#e8e9ed' }}>ChairIQ</span>
          </div>
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="rounded-2xl p-8 mb-8"
            style={{ backgroundColor: 'rgba(239, 68, 68, 0.06)', border: '1px solid rgba(239, 68, 68, 0.15)', backdropFilter: 'blur(12px)' }}
          >
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6" style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)' }}>
              <AlertCircle size={32} style={{ color: '#fca5a5' }} />
            </div>
            <h2 className="text-2xl sm:text-3xl font-semibold mb-3" style={{ color: '#e8e9ed' }}>Plan Not Found</h2>
            <p className="text-base leading-relaxed mb-6" style={{ color: '#9ca3af' }}>{error || 'The treatment plan you are looking for does not exist.'}</p>
            <div className="w-12 h-px mx-auto mb-6" style={{ backgroundColor: 'rgba(255,255,255,0.1)' }} />
            <p className="text-sm" style={{ color: '#6b7280' }}>Contact your dental office for assistance</p>
          </motion.div>
          <p className="text-xs" style={{ color: '#4b5563' }}>Powered by ChairIQ</p>
        </div>
      </div>
    );
  }

  const proceduresByPriority = getProceduresByPriority();
  const translations = {
    EN: {
      welcome: 'Welcome',
      yourTreatmentPlan: 'Your Treatment Plan',
      from: 'from',
      totalProcedures: 'Total Procedures',
      language: 'Language',
      immediate: 'Immediate Priority',
      soon: 'Soon',
      future: 'Future Planning',
      adaCode: 'ADA Code',
      estimatedTime: 'Estimated Time',
      notes: 'Notes',
      viewExplanation: 'View Explanation',
      toothNumbers: 'Tooth Numbers',
      generatingContent: 'Creating your education summary…',
      contentUnavailable: 'Education summary unavailable right now. Please contact our office.',
      expandDetails: 'Expand Details',
      collapseDetails: 'Collapse Details'
    },
    ES: {
      welcome: 'Bienvenido',
      yourTreatmentPlan: 'Su Plan de Tratamiento',
      from: 'de',
      totalProcedures: 'Total de Procedimientos',
      language: 'Idioma',
      immediate: 'Prioridad Inmediata',
      soon: 'Pronto',
      future: 'Planificación Futura',
      adaCode: 'Código ADA',
      estimatedTime: 'Tiempo Estimado',
      notes: 'Notas',
      viewExplanation: 'Ver Explicación',
      toothNumbers: 'Números de Dientes',
      generatingContent: 'Creando su resumen educativo…',
      contentUnavailable: 'Resumen educativo no disponible en este momento. Comuníquese con nuestra oficina.',
      expandDetails: 'Expandir Detalles',
      collapseDetails: 'Contraer Detalles'
    }
  };

  const t = translations?.[currentLanguage];

  // Updated renderProcedureCard with inline explanation section
  const renderProcedureCard = (procedure) => {
    // ✅ FIXED: Education content is ALWAYS available now (either curated or AI-generated)
    const hasContent = !!procedure?.library?.content;
    const isGenerating = false; // Remove loading state since content is always available
    const isExpanded = expandedProcedures?.has(procedure?.id);
    
    // Get content based on current language
    const content = procedure?.library?.content?.[currentLanguage] || procedure?.library?.content?.EN || [];

    return (
      <div
        key={procedure?.id}
        className="rounded-2xl overflow-hidden transition-all ease-out"
        style={{ 
          backgroundColor: 'rgba(255,255,255,0.03)', 
          border: '1px solid rgba(255,255,255,0.08)',
          transitionDuration: '300ms'
        }}
      >
        {/* Card Header - Always Visible */}
        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h3 className="text-2xl font-medium" style={{ color: '#e8e9ed', fontWeight: 500 }}>
                  {procedure?.procedureName}
                </h3>
                {procedure?.toothNumbers && (
                  <motion.span 
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    className="px-3 py-1 rounded-full text-sm font-semibold" 
                    style={{ backgroundColor: 'rgba(96, 165, 250, 0.2)', color: '#93c5fd', border: '1px solid rgba(96, 165, 250, 0.3)' }}
                  >
                    {procedure?.toothNumbers}
                  </motion.span>
                )}
              </div>
              {procedure?.adaCode && (
                <p style={{ color: '#9ca3af' }}>{t?.adaCode}: {procedure?.adaCode}</p>
              )}
            </div>
            <span className={`px-4 py-2 rounded-xl border font-semibold ${getPriorityColor(procedure?.priority)}`}>
              {procedure?.priority}
            </span>
          </div>

          {/* Timeline Pills */}
          <div className="mb-4">
            <ProcedureTimeline 
              steps={procedure?.timelineSteps || []} 
              currentStep={0}
              language={currentLanguage}
            />
          </div>

          {procedure?.estTime && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center gap-2 mb-3"
            >
              <Clock size={18} style={{ color: '#9ca3af' }} />
              <span style={{ color: '#b0b3ba' }}>{t?.estimatedTime}: {procedure?.estTime}</span>
            </motion.div>
          )}

          {procedure?.notesForPatient && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="rounded-xl p-4 mb-4" 
              style={{ backgroundColor: 'rgba(107, 124, 232, 0.1)', border: '1px solid rgba(107, 124, 232, 0.2)' }}
            >
              <p style={{ color: '#b0b3ba' }}>{procedure?.notesForPatient}</p>
            </motion.div>
          )}

          {/* Expand/Collapse Button */}
          <button
            onClick={() => toggleProcedureExpand(procedure?.id)}
            className="flex items-center gap-2 px-6 py-3 font-semibold rounded-xl w-full justify-center transition-all ease-out"
            style={{ 
              backgroundColor: 'rgba(107, 124, 232, 0.15)', 
              color: '#8b9aec', 
              border: '1px solid rgba(107, 124, 232, 0.25)',
              transitionDuration: '200ms'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.02)';
              e.currentTarget.style.backgroundColor = 'rgba(107, 124, 232, 0.2)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.backgroundColor = 'rgba(107, 124, 232, 0.15)';
            }}
          >
            {isExpanded ? (
              <>
                <ChevronUp size={20} />
                {t?.collapseDetails}
              </>
            ) : (
              <>
                <ChevronDown size={20} />
                {t?.expandDetails}
              </>
            )}
          </button>
        </div>
        {/* Expandable Content Section */}
        {isExpanded && (
          <div
            className="overflow-hidden transition-all ease-out"
            style={{
              transitionDuration: '300ms'
            }}
          >
            <div className="px-6 pb-6 space-y-6">
              {procedure?.patientImages?.length > 0 && (
                <PatientImageGallery
                  images={procedure.patientImages}
                  language={currentLanguage}
                />
              )}

              {hasContent && content?.length > 0 && (
                <CategoryVisualDeck 
                  steps={content}
                  language={currentLanguage}
                  canonicalSlug={procedure?.canonicalSlug}
                />
              )}
              
              {/* Educational Content - Always available now */}
              {hasContent && content?.length > 0 && (
                <PatientContent 
                  sections={content}
                  language={currentLanguage}
                />
              )}

              {procedure?.library?.disclaimer && (
                <div 
                  className="rounded-lg p-4"
                  style={{ backgroundColor: 'rgba(251, 191, 36, 0.1)', border: '1px solid rgba(251, 191, 36, 0.2)' }}
                >
                  <p className="text-sm" style={{ color: '#fbbf24' }}>
                    {procedure?.library?.disclaimer}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen py-12 px-4 bg-bg0">
      <div className="max-w-5xl mx-auto">
        <VisualsDebugPanel planData={planData} />
        {/* Header with iOS-style language toggle */}
        <div 
          className="rounded-2xl p-8 mb-8 transition-all ease-out" 
          style={{ 
            backgroundColor: 'rgba(255,255,255,0.03)', 
            border: '1px solid rgba(255,255,255,0.08)',
            transitionDuration: '300ms'
          }}
        >
          <div className="flex justify-between items-start mb-4">
            <div>
              <h1 className="text-4xl font-medium mb-2" style={{ color: '#e8e9ed', fontWeight: 500 }}>
                {t?.welcome}, {planData?.patient?.firstName} {planData?.patient?.lastName}
              </h1>
              <p className="text-lg" style={{ color: '#b0b3ba' }}>
                {t?.yourTreatmentPlan} {t?.from} {planData?.treatmentPlan?.practiceName}
              </p>
              <p className="text-sm mt-2" style={{ color: '#9ca3af' }}>
                {planData?.treatmentPlan?.dentistName}
              </p>
            </div>
            
            {/* iOS-style Language Toggle */}
            <div 
              className="flex rounded-lg p-1" 
              style={{ 
                backgroundColor: 'rgba(255,255,255,0.05)', 
                border: '1px solid rgba(255,255,255,0.08)' 
              }}
            >
              <button
                onClick={() => setCurrentLanguage('EN')}
                className="px-4 py-2 rounded-md font-medium text-sm transition-all ease-out"
                style={{
                  ...(currentLanguage === 'EN' 
                    ? { backgroundColor: 'rgba(107, 124, 232, 0.2)', color: '#8b9aec' }
                    : { backgroundColor: 'transparent', color: '#9ca3af' }),
                  transitionDuration: '200ms'
                }}
              >
                EN
              </button>
              <button
                onClick={() => setCurrentLanguage('ES')}
                className="px-4 py-2 rounded-md font-medium text-sm transition-all ease-out"
                style={{
                  ...(currentLanguage === 'ES' 
                    ? { backgroundColor: 'rgba(107, 124, 232, 0.2)', color: '#8b9aec' }
                    : { backgroundColor: 'transparent', color: '#9ca3af' }),
                  transitionDuration: '200ms'
                }}
              >
                ES
              </button>
            </div>
          </div>

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="flex items-center gap-4 mt-6"
          >
            <div className="flex items-center gap-2 px-4 py-2 rounded-xl" style={{ backgroundColor: 'rgba(107, 124, 232, 0.15)', border: '1px solid rgba(107, 124, 232, 0.25)' }}>
              <Calendar size={20} style={{ color: '#8b9aec' }} />
              <span className="font-medium" style={{ color: '#8b9aec' }}>
                {t?.totalProcedures}: {planData?.procedures?.length}
              </span>
            </div>
          </motion.div>
        </div>

        {/* Priority Sections */}
        {proceduresByPriority?.Immediate?.length > 0 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mb-8"
          >
            <div className="flex items-center gap-3 mb-4">
              <AlertCircle size={28} style={{ color: '#fca5a5' }} />
              <h2 className="text-3xl font-medium" style={{ color: '#e8e9ed', fontWeight: 500 }}>{t?.immediate}</h2>
            </div>
            <div className="space-y-4">
              {proceduresByPriority?.Immediate?.map((procedure) => renderProcedureCard(procedure))}
            </div>
          </motion.div>
        )}

        {proceduresByPriority?.Soon?.length > 0 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mb-8"
          >
            <h2 className="text-3xl font-medium mb-4" style={{ color: '#e8e9ed', fontWeight: 500 }}>{t?.soon}</h2>
            <div className="space-y-4">
              {proceduresByPriority?.Soon?.map((procedure) => renderProcedureCard(procedure))}
            </div>
          </motion.div>
        )}

        {proceduresByPriority?.Future?.length > 0 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mb-8"
          >
            <h2 className="text-3xl font-medium mb-4" style={{ color: '#e8e9ed', fontWeight: 500 }}>{t?.future}</h2>
            <div className="space-y-4">
              {proceduresByPriority?.Future?.map((procedure) => renderProcedureCard(procedure))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}