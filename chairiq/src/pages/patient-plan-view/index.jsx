import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { patientPlanService } from '../../services/patientPlanService';
import { shareLinkService } from '../../services/shareLinkService';

import { useToast } from '../../hooks/useToast';
import { Clock, AlertCircle, Calendar, ChevronDown, ChevronUp, ShieldX, TimerOff, ChevronsUpDown, ChevronsDownUp } from 'lucide-react';
import PatientContent from './components/PatientContent';
import ProcedureTimeline from './components/ProcedureTimeline';
import CategoryVisualDeck from './components/CategoryVisualDeck';
import PatientImageGallery from './components/PatientImageGallery';
import ProcedureThumb from '../../components/ProcedureThumb';

function VisualsDebugPanel({ planData }) {
  const params = new URLSearchParams(window.location.search);
  if (params.get('debug') !== '1') return null;

  const supabaseUrl = import.meta.env?.VITE_SUPABASE_URL || 'NOT SET';
  const projectRef = supabaseUrl.replace('https://', '').split('.')[0];

  return (
    <div className="bg-accent-soft border border-accent/25 rounded-xl p-4 mb-6 font-mono text-xs text-t2">
      <div className="font-bold mb-3 text-sm text-t1">Visuals Debug Panel</div>
      <div className="mb-2">
        <span className="text-t3">Supabase Project Ref: </span>
        <span className="text-t1">{projectRef}</span>
      </div>
      <div className="mb-2">
        <span className="text-t3">Env Vars: </span>
        <span className={supabaseUrl !== 'NOT SET' ? 'text-success' : 'text-danger'}>VITE_SUPABASE_URL={supabaseUrl !== 'NOT SET' ? 'SET' : 'MISSING'}</span>
        {', '}
        <span className={import.meta.env?.VITE_SUPABASE_ANON_KEY ? 'text-success' : 'text-danger'}>VITE_SUPABASE_ANON_KEY={import.meta.env?.VITE_SUPABASE_ANON_KEY ? 'SET' : 'MISSING'}</span>
      </div>
      <div className="mb-3">
        <span className="text-t3">Route: </span>
        <span className="text-t1">/p/{planData?.treatmentPlan?.publicToken || window.location.pathname}</span>
      </div>
      {planData?.procedures?.map((proc, i) => {
        const lang = planData?.patient?.preferredLanguage || 'EN';
        const content = proc?.library?.content?.[lang] || proc?.library?.content?.EN || [];
        const visualSteps = content.filter(s => s?.visual?.image_url);
        const firstVisual = visualSteps[0];

        return (
          <div key={proc?.id || i} className="bg-bg2 rounded-lg p-3 mb-2">
            <div className="text-warning font-bold mb-1">{proc?.procedureName}</div>
            <div><span className="text-t3">procedure_id: </span><span className="text-t1">{proc?.id || 'N/A'}</span></div>
            <div><span className="text-t3">canonical_slug: </span><span className="text-t1">{proc?.canonicalSlug || 'N/A'}</span></div>
            <div><span className="text-t3">ada_code: </span><span className="text-t1">{proc?.adaCode || 'N/A'}</span></div>
            <div><span className="text-t3">total_steps: </span><span className="text-t1">{content.length}</span></div>
            <div><span className="text-t3">visuals_count: </span><span className={visualSteps.length > 0 ? 'text-success' : 'text-danger'}>{visualSteps.length}</span></div>
            {visualSteps.length === 0 && (
              <div className="text-danger mt-1">No visuals found. Query used canonical_slug="{proc?.canonicalSlug || 'N/A'}"</div>
            )}
            {visualSteps.length === 0 && content.length > 0 && (
              <div className="text-warning mt-1 text-[11px]">Possible causes: RLS blocking anon SELECT on procedure_visuals, or no visuals uploaded for this canonical_slug.</div>
            )}
            {firstVisual && (() => {
              const url = firstVisual?.visual?.image_url || '';
              const urlType = url.includes('supabase.co/storage')
                ? (url.includes('/object/public/') ? 'supabase-public' : 'supabase-private')
                : (url ? 'external' : 'none');
              return (
                <div className="mt-1 border-t border-bd pt-1">
                  <div className="text-t3 mb-0.5">First visual:</div>
                  <div><span className="text-t3">step_id: </span><span className="text-t1">{firstVisual?.step_id || 'N/A'}</span></div>
                  <div><span className="text-t3">title: </span><span className="text-t1">{firstVisual?.title || 'N/A'}</span></div>
                  <div><span className="text-t3">url_type: </span><span className={urlType === 'supabase-public' ? 'text-success' : urlType === 'supabase-private' ? 'text-warning' : 'text-accent'}>{urlType}</span></div>
                  <div className="break-all"><span className="text-t3">image_url: </span><span className="text-t1 text-[10px]">{url || 'null'}</span></div>
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

  const allProcedureIds = planData?.procedures?.map(p => p?.id) || [];
  const allExpanded = allProcedureIds.length > 0 && allProcedureIds.every(id => expandedProcedures.has(id));

  const toggleExpandAll = () => {
    if (allExpanded) {
      setExpandedProcedures(new Set());
    } else {
      setExpandedProcedures(new Set(allProcedureIds));
    }
  };

  const scrollToSection = (sectionId) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
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
          className="text-xl text-t1"
        >
          Loading your treatment plan...
        </motion.div>
      </div>
    );
  }

  if (linkStatus === 'invalid') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4 bg-bg0">
        <div className="max-w-md w-full text-center">
          <div className="flex items-center justify-center gap-2.5 mb-10">
            <ShieldX size={28} className="text-accent" />
            <span className="text-lg font-semibold tracking-tight text-t1">ChairIQ</span>
          </div>
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="rounded-2xl p-8 mb-8 bg-danger/5 border border-danger/15 backdrop-blur-sm"
          >
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 bg-danger/10">
              <ShieldX size={32} className="text-danger" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-semibold mb-3 text-t1">Link Invalid</h2>
            <p className="text-base leading-relaxed mb-6 text-t2">This treatment plan link is not valid. Please contact your dental provider for a new link.</p>
            <div className="w-12 h-px mx-auto mb-6 bg-bd" />
            <p className="text-sm text-t3">Contact your dental office for assistance</p>
          </motion.div>
          <p className="text-xs text-t3">Powered by ChairIQ</p>
        </div>
      </div>
    );
  }

  if (linkStatus === 'expired') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4 bg-bg0">
        <div className="max-w-md w-full text-center">
          <div className="flex items-center justify-center gap-2.5 mb-10">
            <TimerOff size={28} className="text-accent" />
            <span className="text-lg font-semibold tracking-tight text-t1">ChairIQ</span>
          </div>
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="rounded-2xl p-8 mb-8 bg-warning/5 border border-warning/15 backdrop-blur-sm"
          >
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 bg-warning/10">
              <TimerOff size={32} className="text-warning" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-semibold mb-3 text-t1">Link Expired</h2>
            <p className="text-base leading-relaxed mb-6 text-t2">This treatment plan link has expired. Please contact your dental provider to request a new link.</p>
            <div className="w-12 h-px mx-auto mb-6 bg-bd" />
            <p className="text-sm text-t3">Contact your dental office for assistance</p>
          </motion.div>
          <p className="text-xs text-t3">Powered by ChairIQ</p>
        </div>
      </div>
    );
  }

  if (error || !planData) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4 bg-bg0">
        <div className="max-w-md w-full text-center">
          <div className="flex items-center justify-center gap-2.5 mb-10">
            <AlertCircle size={28} className="text-accent" />
            <span className="text-lg font-semibold tracking-tight text-t1">ChairIQ</span>
          </div>
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="rounded-2xl p-8 mb-8 bg-danger/5 border border-danger/15 backdrop-blur-sm"
          >
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 bg-danger/10">
              <AlertCircle size={32} className="text-danger" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-semibold mb-3 text-t1">Plan Not Found</h2>
            <p className="text-base leading-relaxed mb-6 text-t2">{error || 'The treatment plan you are looking for does not exist.'}</p>
            <div className="w-12 h-px mx-auto mb-6 bg-bd" />
            <p className="text-sm text-t3">Contact your dental office for assistance</p>
          </motion.div>
          <p className="text-xs text-t3">Powered by ChairIQ</p>
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
      collapseDetails: 'Collapse Details',
      expandAll: 'Expand All',
      collapseAll: 'Collapse All',
      jumpTo: 'Jump to'
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
      collapseDetails: 'Contraer Detalles',
      expandAll: 'Expandir Todo',
      collapseAll: 'Contraer Todo',
      jumpTo: 'Ir a'
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
        className="rounded-2xl overflow-hidden transition-all ease-out bg-bg1 border border-bd"
        style={{ transitionDuration: '300ms' }}
      >
        {/* Card Header - Always Visible */}
        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <ProcedureThumb
                  canonicalSlug={procedure?.canonicalSlug}
                  name={procedure?.procedureName}
                  size="sm"
                  className="!w-14 !h-9"
                  glow={false}
                />
                <h3 className="text-2xl font-medium text-t1">
                  {procedure?.procedureName}
                </h3>
                {procedure?.toothNumbers && (
                  <motion.span 
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    className="px-3 py-1 rounded-full text-sm font-semibold bg-accent/15 text-accent border border-accent/30"
                  >
                    {procedure?.toothNumbers}
                  </motion.span>
                )}
              </div>
              {procedure?.adaCode && (
                <p className="text-t2">{t?.adaCode}: {procedure?.adaCode}</p>
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
              currentStep={-1}
              language={currentLanguage}
            />
          </div>

          {procedure?.estTime && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center gap-2 mb-3"
            >
              <Clock size={18} className="text-t3" />
              <span className="text-t2">{t?.estimatedTime}: {procedure?.estTime}</span>
            </motion.div>
          )}

          {procedure?.notesForPatient && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="rounded-xl p-4 mb-4 bg-accent-soft border border-accent/20"
            >
              <p className="text-t2">{procedure?.notesForPatient}</p>
            </motion.div>
          )}

          {/* Expand/Collapse Button */}
          <button
            onClick={() => toggleProcedureExpand(procedure?.id)}
            className="flex items-center gap-2 px-6 py-3 font-semibold rounded-xl w-full justify-center transition-all ease-out bg-accent-soft text-accent border border-accent/25 hover:bg-accent-hover"
            style={{ transitionDuration: '200ms' }}
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
            style={{ transitionDuration: '300ms' }}
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
                <div className="rounded-lg p-4 bg-warning/10 border border-warning/20">
                  <p className="text-sm text-warning">
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
        <div className="rounded-2xl p-8 mb-8 transition-all ease-out bg-bg1 border border-bd" style={{ transitionDuration: '300ms' }}>
          <div className="flex justify-between items-start mb-4">
            <div>
              <h1 className="text-4xl font-medium mb-2 text-t1">
                {t?.welcome}, {planData?.patient?.firstName} {planData?.patient?.lastName}
              </h1>
              <p className="text-lg text-t2">
                {t?.yourTreatmentPlan} {t?.from} {planData?.treatmentPlan?.practiceName}
              </p>
              <p className="text-sm mt-2 text-t3">
                {planData?.treatmentPlan?.dentistName}
              </p>
            </div>
            
            {/* iOS-style Language Toggle */}
            <div className="flex rounded-lg p-1 bg-bg2 border border-bd">
              <button
                onClick={() => setCurrentLanguage('EN')}
                className="px-4 py-2 rounded-md font-medium text-sm transition-all ease-out"
                style={{
                  ...(currentLanguage === 'EN' 
                    ? { backgroundColor: 'var(--accent-soft)', color: 'var(--accent)' }
                    : { backgroundColor: 'transparent', color: 'var(--t2)' }),
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
                    ? { backgroundColor: 'var(--accent-soft)', color: 'var(--accent)' }
                    : { backgroundColor: 'transparent', color: 'var(--t2)' }),
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
            <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-accent-soft border border-accent/25">
              <Calendar size={20} className="text-accent" />
              <span className="font-medium text-accent">
                {t?.totalProcedures}: {planData?.procedures?.length}
              </span>
            </div>
          </motion.div>
        </div>

        {/* Expand All / Collapse All + Jump to Section */}
        {planData?.procedures?.length >= 3 && (
          <div 
            className="sticky top-0 z-10 rounded-xl p-3 mb-6 flex flex-wrap items-center gap-3 bg-bg1 border border-bd backdrop-blur-md"
          >
            <button
              onClick={toggleExpandAll}
              className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-all ease-out bg-accent-soft text-accent border border-accent/25 hover:bg-accent-hover"
              style={{ transitionDuration: '200ms' }}
            >
              {allExpanded ? <ChevronsDownUp size={16} /> : <ChevronsUpDown size={16} />}
              {allExpanded ? t?.collapseAll : t?.expandAll}
            </button>

            <div className="h-5 w-px bg-bd" />

            {proceduresByPriority?.Immediate?.length > 0 && (
              <button
                onClick={() => scrollToSection('priority-immediate')}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ease-out bg-danger/10 text-danger border border-danger/20 hover:bg-danger/15"
                style={{ transitionDuration: '200ms' }}
              >
                <AlertCircle size={14} />
                {t?.immediate}
              </button>
            )}
            {proceduresByPriority?.Soon?.length > 0 && (
              <button
                onClick={() => scrollToSection('priority-soon')}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ease-out bg-warning/10 text-warning border border-warning/20 hover:bg-warning/15"
                style={{ transitionDuration: '200ms' }}
              >
                <Clock size={14} />
                {t?.soon}
              </button>
            )}
            {proceduresByPriority?.Future?.length > 0 && (
              <button
                onClick={() => scrollToSection('priority-future')}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ease-out bg-accent/10 text-accent border border-accent/20 hover:bg-accent/15"
                style={{ transitionDuration: '200ms' }}
              >
                <Calendar size={14} />
                {t?.future}
              </button>
            )}
          </div>
        )}

        {planData?.procedures?.length > 0 && planData?.procedures?.length < 3 && (
          <div className="mb-6 flex items-center">
            <button
              onClick={toggleExpandAll}
              className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-all ease-out bg-accent-soft text-accent border border-accent/25 hover:bg-accent-hover"
              style={{ transitionDuration: '200ms' }}
            >
              {allExpanded ? <ChevronsDownUp size={16} /> : <ChevronsUpDown size={16} />}
              {allExpanded ? t?.collapseAll : t?.expandAll}
            </button>
          </div>
        )}

        {/* Priority Sections */}
        {proceduresByPriority?.Immediate?.length > 0 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mb-8"
            id="priority-immediate"
            style={{ scrollMarginTop: '80px' }}
          >
            <div className="flex items-center gap-3 mb-4">
              <AlertCircle size={28} className="text-danger" />
              <h2 className="text-3xl font-medium text-t1">{t?.immediate}</h2>
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
            id="priority-soon"
            style={{ scrollMarginTop: '80px' }}
          >
            <h2 className="text-3xl font-medium mb-4 text-t1">{t?.soon}</h2>
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
            id="priority-future"
            style={{ scrollMarginTop: '80px' }}
          >
            <h2 className="text-3xl font-medium mb-4 text-t1">{t?.future}</h2>
            <div className="space-y-4">
              {proceduresByPriority?.Future?.map((procedure) => renderProcedureCard(procedure))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
