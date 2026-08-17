import React, { useState, useEffect, useCallback } from 'react';
import { Helmet } from 'react-helmet';
import { useSearchParams, useNavigate } from 'react-router-dom';
import LanguageToggle from '../../components/ui/LanguageToggle';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import Icon from '../../components/AppIcon';
import Image from '../../components/AppImage';
import { patientPlanService } from '../../services/patientPlanService';
import { useAuth } from '../../contexts/AuthContext';
import ProcedureThumb from '../../components/ProcedureThumb';

const heroSlides = [
  '/assets/images/hero-slide-1.png',
  '/assets/images/hero-slide-2.png',
  '/assets/images/hero-slide-3.png',
  '/assets/images/hero-slide-4.png',
];

const procedureIconMap = {
  'root-canal': 'Zap',
  'root-canal-retreatment': 'Zap',
  'crown': 'Crown',
  'dental-crown': 'Crown',
  'filling': 'Droplets',
  'extraction': 'Scissors',
  'tooth-extraction': 'Scissors',
  'implant': 'Anchor',
  'bridge': 'Link2',
  'denture': 'Smile',
  'complete-denture': 'Smile',
  'immediate-complete-denture': 'Smile',
  'resin-partial-denture': 'Smile',
  'cast-partial-denture': 'Smile',
  'immediate-partial-denture': 'Smile',
  'denture-reline': 'Smile',
  'veneer': 'Sparkles',
  'whitening': 'Sun',
  'cleaning': 'Sparkles',
  'sealant': 'Shield',
  'dental-sealant': 'Shield',
  'exam': 'Search',
  'periodic-oral-exam': 'Search',
  'comprehensive-oral-exam': 'Search',
  'limited-oral-exam': 'Search',
  'detailed-oral-exam': 'Search',
  're-evaluation-exam': 'Search',
  'comprehensive-periodontal-exam': 'Search',
  'x-ray': 'Scan',
  'radiograph': 'Scan',
  'scaling': 'Layers',
  'scaling-root-planing': 'Layers',
  'scaling-and-root-planing': 'Layers',
  'srp': 'Layers',
  'full-mouth-debridement': 'Layers',
  'periodontal-maintenance': 'Activity',
  'gum-treatment': 'Heart',
  'gum-graft': 'Heart',
  'orthodontics': 'AlignCenter',
  'braces': 'AlignCenter',
  'retainer': 'Lock',
  'night-guard': 'Moon',
  'bone-graft': 'Mountain',
  'sinus-lift': 'ArrowUp',
  'periodontal': 'Activity',
  'deep-cleaning': 'Filter',
  'fluoride': 'Droplet',
  'fluoride-treatment': 'Droplet',
  'sedation': 'Syringe',
  'inlay-onlay': 'Layers',
  'core-buildup': 'Building2',
  'pulpotomy': 'Zap',
  'apicoectomy': 'Zap',
  'frenectomy': 'Scissors',
  'crown-lengthening': 'TrendingUp',
  'space-maintainer': 'Maximize2',
  'tmj-treatment': 'Activity',
  'sleep-apnea-appliance': 'Moon',
  'emergency-palliative': 'AlertCircle',
  'nutritional-counseling': 'Apple',
  'tobacco-counseling': 'MessageCircle',
  'oral-hygiene-instructions': 'BookOpen',
};

const getProcedureIcon = (procedure) => {
  const slug = procedure?.canonicalSlug?.toLowerCase() || '';
  if (procedureIconMap[slug]) return procedureIconMap[slug];
  
  const name = (procedure?.procedureName || procedure?.displayTitle || procedure?.library?.titleEn || procedure?.library?.titleEs || '').toLowerCase();
  if (name.includes('root canal') || name.includes('endodontic')) return 'Zap';
  if (name.includes('crown')) return 'Crown';
  if (name.includes('filling') || name.includes('composite') || name.includes('amalgam') || name.includes('resin')) return 'Droplets';
  if (name.includes('extract')) return 'Scissors';
  if (name.includes('implant')) return 'Anchor';
  if (name.includes('bridge') || name.includes('pontic')) return 'Link2';
  if (name.includes('denture')) return 'Smile';
  if (name.includes('veneer')) return 'Sparkles';
  if (name.includes('whiten') || name.includes('bleach')) return 'Sun';
  if (name.includes('clean') || name.includes('prophylaxis')) return 'Sparkles';
  if (name.includes('seal')) return 'Shield';
  if (name.includes('exam') || name.includes('evaluation') || name.includes('oral')) return 'Search';
  if (name.includes('x-ray') || name.includes('radiograph') || name.includes('panoramic')) return 'Scan';
  if (name.includes('scaling') || name.includes('root planing')) return 'Layers';
  if (name.includes('gum graft') || name.includes('soft tissue graft') || name.includes('connective tissue')) return 'Heart';
  if (name.includes('gum') || name.includes('gingiv') || name.includes('periodontal')) return 'Activity';
  if (name.includes('orthodon') || name.includes('brace') || name.includes('align') || name.includes('retainer')) return 'AlignCenter';
  if (name.includes('fluoride')) return 'Droplet';
  if (name.includes('guard') || name.includes('splint') || name.includes('occlusal')) return 'Moon';
  if (name.includes('sinus') || name.includes('sinus lift')) return 'ArrowUp';
  if (name.includes('bone') || name.includes('graft') || name.includes('osseous')) return 'Mountain';
  if (name.includes('inlay') || name.includes('onlay')) return 'Layers';
  if (name.includes('buildup') || name.includes('build-up') || name.includes('core')) return 'Building2';
  if (name.includes('sedation') || name.includes('anesthesia') || name.includes('nitrous')) return 'Syringe';
  if (name.includes('pulpotomy')) return 'Zap';
  if (name.includes('apicoectomy')) return 'Zap';
  if (name.includes('frenectomy') || name.includes('frenum')) return 'Scissors';
  if (name.includes('crown lengthening')) return 'TrendingUp';
  if (name.includes('space maintainer')) return 'Maximize2';
  if (name.includes('tmj') || name.includes('temporomandibular')) return 'Activity';
  if (name.includes('sleep apnea')) return 'Moon';
  if (name.includes('palliative') || name.includes('emergency')) return 'AlertCircle';
  if (name.includes('debridement')) return 'Layers';
  if (name.includes('reline') || name.includes('rebase')) return 'Smile';
  if (name.includes('retreatment')) return 'Zap';
  if (name.includes('counseling') || name.includes('instruction')) return 'BookOpen';
  return 'Stethoscope';
};

const listItemShades = [
  '#1A1F2E',
  '#1D2233',
  '#1F2538',
  '#22283D',
  '#242B42',
  '#272E47',
  '#29314C',
  '#2C3451',
];

const TreatmentPlanLanding = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [currentLanguage, setCurrentLanguage] = useState('en');
  const [expandedProcedure, setExpandedProcedure] = useState(null);
  const [showFullDetails, setShowFullDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [planData, setPlanData] = useState(null);
  const [resending, setResending] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);
  const [resendError, setResendError] = useState(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [activeStepImage, setActiveStepImage] = useState(null);

  // Debug mode - controlled by URL parameter
  const debugMode = searchParams?.get('debug') === '1';
  const publicToken = searchParams?.get('token');

  useEffect(() => {
    const savedLanguage = localStorage.getItem('chairiq-language');
    if (savedLanguage) {
      setCurrentLanguage(savedLanguage);
    }

    const handleLanguageChange = (event) => {
      setCurrentLanguage(event?.detail?.language);
    };

    window.addEventListener('languageChange', handleLanguageChange);
    return () => window.removeEventListener('languageChange', handleLanguageChange);
  }, []);

  useEffect(() => {
    const fetchPlanData = async () => {
      if (!publicToken) {
        setError('No treatment plan link provided. Please contact your dental office.');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const result = await patientPlanService?.getEnrichedPatientPlan(publicToken);
        
        if (!result?.success) {
          throw new Error(result?.error || 'Failed to load treatment plan');
        }

        setPlanData(result);
        setError(null);
      } catch (err) {
        console.error('Error loading treatment plan:', err);
        setError(err?.message || 'This link is invalid or expired. Please contact the office.');
      } finally {
        setLoading(false);
      }
    };

    fetchPlanData();
  }, [publicToken]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const handleResendLink = async () => {
    if (!publicToken || !user) return;

    try {
      setResending(true);
      setResendError(null);
      setResendSuccess(false);

      const result = await patientPlanService?.resendTreatmentPlanLink(publicToken);

      if (!result?.success) {
        throw new Error(result?.userMessage || result?.error || 'Failed to resend link');
      }

      setResendSuccess(true);
      
      // Auto-hide success message after 5 seconds
      setTimeout(() => {
        setResendSuccess(false);
      }, 5000);
    } catch (err) {
      console.error('Error resending treatment plan link:', err);
      setResendError(err?.message || 'Failed to resend treatment plan link. Please try again.');
      
      // Auto-hide error message after 8 seconds
      setTimeout(() => {
        setResendError(null);
      }, 8000);
    } finally {
      setResending(false);
    }
  };

  const content = {
    en: {
      title: "Your Dental Treatment Plan",
      subtitle: planData?.treatmentPlan?.dentistName 
        ? `Prepared by Dr. ${planData?.treatmentPlan?.dentistName}`
        : 'Prepared by your dentist',
      reassurance: "This page explains your care in simple terms. Take your time — there\'s nothing you need to decide right now.",
      overviewTitle: "At a glance",
      proceduresLabel: "recommended procedures",
      visitsLabel: "estimated visits",
      proceduresTitle: "Your recommended care",
      seeMore: "Learn more",
      seeLess: "Show less",
      showFullDetails: "Show full details",
      hideFullDetails: "Hide full details",
      priority: {
        Immediate: "Important",
        Soon: "Recommended soon",
        Future: "Can wait a bit"
      },
      sections: {
        whatThis: "What this is",
        whyNeed: "Why it\'s recommended",
        howItWorks: "How it works",
        aftercare: "After your appointment",
        ifDelay: "If you delay",
        faqs: "Common questions"
      },
      noContentAvailable: "Details not available yet for this procedure. Please contact our office.",
      footer: "Questions? Call or text our office — we\'re happy to help.",
      errorTitle: "Unable to Load Treatment Plan",
      contactOffice: "Please contact your dental office for assistance."
    },
    es: {
      title: "Su plan de tratamiento dental",
      subtitle: planData?.treatmentPlan?.dentistName
        ? `Preparado por Dr. ${planData?.treatmentPlan?.dentistName}`
        : 'Preparado por su dentista',
      reassurance: "Esta página explica su cuidado en términos simples. Tómese su tiempo — no hay nada que deba decidir ahora mismo.",
      overviewTitle: "De un vistazo",
      proceduresLabel: "procedimientos recomendados",
      visitsLabel: "visitas estimadas",
      proceduresTitle: "Su cuidado recomendado",
      seeMore: "Ver más",
      seeLess: "Ver menos",
      showFullDetails: "Ver detalles completos",
      hideFullDetails: "Ocultar detalles completos",
      priority: {
        Immediate: "Importante",
        Soon: "Recomendado pronto",
        Future: "Puede esperar un poco"
      },
      sections: {
        whatThis: "Qué es esto",
        whyNeed: "Por qué se recomienda",
        howItWorks: "Cómo funciona",
        aftercare: "Después de su cita",
        ifDelay: "Si lo retrasa",
        faqs: "Preguntas frecuentes"
      },
      noContentAvailable: "Los detalles aún no están disponibles para este procedimiento. Por favor, contacte a nuestra oficina.",
      footer: "¿Preguntas? Llame o envíe un mensaje a nuestra oficina — estamos aquí para ayudar.",
      errorTitle: "No se puede cargar el plan de tratamiento",
      contactOffice: "Póngase en contacto con su consultorio dental para obtener ayuda."
    }
  };

  const text = content?.[currentLanguage] || content?.en;

  const toggleProcedure = (procedureId) => {
    if (expandedProcedure === procedureId) {
      setExpandedProcedure(null);
      setShowFullDetails(null);
      setActiveStepImage(null);
    } else {
      setExpandedProcedure(procedureId);
      setShowFullDetails(null);
      setActiveStepImage(null);
    }
  };

  const toggleStepImage = (stepIdx, e) => {
    e?.stopPropagation();
    setActiveStepImage(activeStepImage === stepIdx ? null : stepIdx);
  };

  const toggleFullDetails = (procedureId, e) => {
    e?.stopPropagation(); // Prevent triggering card click
    setShowFullDetails(showFullDetails === procedureId ? null : procedureId);
  };

  // Calculate estimated visits
  const calculateEstimatedVisits = () => {
    if (!planData?.procedures?.length) return '1-2';
    
    const proceduresWithEstimates = planData?.procedures?.filter(
      proc => proc?.library?.visitsEstimate
    );
    
    if (proceduresWithEstimates?.length === 0) return '2-3';
    
    // Simple logic: count unique visit requirements
    const totalProcedures = planData?.procedures?.length;
    return totalProcedures <= 2 ? '1-2' : '2-4';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg0">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-5" style={{ background: 'linear-gradient(165deg, #0c0e14 0%, #151825 50%, #1a1f2e 100%)' }}>
        <div className="max-w-md w-full text-center">
          <div className="flex items-center justify-center gap-2.5 mb-10">
            <Icon name="ShieldCheck" size={28} style={{ color: '#6B8AEE' }} />
            <span className="text-lg font-semibold tracking-tight" style={{ color: '#e8e9ed' }}>ChairIQ</span>
          </div>
          <div
            className="rounded-2xl p-8 mb-8"
            style={{
              backgroundColor: 'rgba(255, 183, 77, 0.06)',
              border: '1px solid rgba(255, 183, 77, 0.15)',
              backdropFilter: 'blur(12px)',
            }}
          >
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6"
              style={{ backgroundColor: 'rgba(255, 183, 77, 0.12)' }}
            >
              <Icon name="AlertCircle" size={32} style={{ color: '#ffb74d' }} />
            </div>
            <h1 className="text-2xl sm:text-3xl mb-4 font-semibold" style={{ color: '#e8e9ed' }}>
              {text?.errorTitle}
            </h1>
            <p className="mb-6 text-base sm:text-lg leading-relaxed" style={{ color: '#9ca3af' }}>
              {error}
            </p>
            <div className="w-12 h-px mx-auto mb-6" style={{ backgroundColor: 'rgba(255,255,255,0.1)' }} />
            <p className="text-sm sm:text-base" style={{ color: '#6b7280' }}>
              {text?.contactOffice}
            </p>
          </div>
          <p className="text-xs" style={{ color: '#4b5563' }}>
            Powered by ChairIQ
          </p>
        </div>
      </div>
    );
  }

  const procedures = planData?.procedures || [];
  const procedureCount = procedures?.length || 0;

  return (
    <>
      <Helmet>
        <title>{text?.title}</title>
        <meta name="description" content={text?.reassurance} />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0" />
      </Helmet>
      <div className="min-h-screen bg-bg0">
        {/* Hero Slideshow */}
        <div className="relative w-full overflow-hidden" style={{ height: 'clamp(360px, 56vw, 560px)' }}>
          {heroSlides.map((src, i) => (
            <div
              key={i}
              className="absolute inset-0 transition-opacity duration-1000 ease-in-out"
              style={{ opacity: currentSlide === i ? 1 : 0 }}
            >
              <img
                src={src}
                alt=""
                className="w-full h-full object-cover"
                loading={i === 0 ? 'eager' : 'lazy'}
              />
            </div>
          ))}
          <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.35) 0%, rgba(0,0,0,0.55) 100%)' }} />
          <div className="absolute top-4 right-4 z-10">
            <LanguageToggle />
          </div>
          <div className="absolute inset-0 flex flex-col justify-end p-8 sm:p-12 lg:p-16 z-10">
            <h1 className="text-3xl sm:text-5xl lg:text-6xl mb-4 text-white font-bold leading-tight tracking-tight drop-shadow-lg">
              {text?.title}
            </h1>
            <p className="mb-3 text-white/90 text-lg sm:text-2xl font-light leading-relaxed drop-shadow">
              {text?.subtitle}
            </p>
            <p className="text-white/75 text-base sm:text-lg font-light leading-relaxed max-w-2xl drop-shadow">
              {text?.reassurance}
            </p>
          </div>
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-10">
            {heroSlides.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentSlide(i)}
                className="rounded-full transition-all duration-300"
                style={{
                  width: currentSlide === i ? 24 : 8,
                  height: 8,
                  backgroundColor: currentSlide === i ? '#ffffff' : 'rgba(255,255,255,0.45)',
                }}
                aria-label={`Slide ${i + 1}`}
              />
            ))}
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-8 sm:px-12 lg:px-16 py-16 md:py-24">

          {/* Patient Name Greeting */}
          {planData?.patient?.firstName && (
            <h2 
              className="text-3xl sm:text-4xl mb-12 text-t1 font-semibold"
            >
              {currentLanguage === 'es' 
                ? `Hola, ${planData?.patient?.firstName}` 
                : `Hi, ${planData?.patient?.firstName}`}
            </h2>
          )}

          {/* Resend Success Message */}
          {resendSuccess && (
            <div 
              className="mb-12 p-6 rounded-xl flex items-center gap-4"
              style={{ 
                backgroundColor: 'rgba(34, 197, 94, 0.1)',
                border: '1px solid rgba(34, 197, 94, 0.3)'
              }}
            >
              <Icon name="CheckCircle" size={24} style={{ color: '#22c55e' }} />
              <p style={{ color: '#22c55e', fontSize: '1.125rem', fontWeight: 500 }}>
                Treatment plan link sent successfully to {planData?.patient?.phone}
              </p>
            </div>
          )}

          {/* Resend Error Message */}
          {resendError && (
            <div 
              className="mb-12 p-6 rounded-xl flex items-start gap-4"
              style={{ 
                backgroundColor: 'rgba(239, 68, 68, 0.1)',
                border: '1px solid rgba(239, 68, 68, 0.3)'
              }}
            >
              <Icon name="AlertCircle" size={24} style={{ color: '#ef4444' }} />
              <div>
                <p style={{ color: '#ef4444', fontSize: '1.125rem', fontWeight: 500, marginBottom: '0.5rem' }}>
                  Failed to resend link
                </p>
                <p style={{ color: '#fca5a5', fontSize: '1rem' }}>
                  {resendError}
                </p>
              </div>
            </div>
          )}

          {/* Debug Panel */}
          {debugMode && planData && (
            <div 
              className="mb-10 p-5 rounded-xl text-sm"
              style={{ 
                backgroundColor: 'rgba(255, 183, 77, 0.1)',
                border: '1px solid rgba(255, 183, 77, 0.3)',
                color: '#ffb74d'
              }}
            >
              <strong>Debug Mode</strong>
              <div className="mt-2 space-y-1" style={{ fontSize: '0.875rem', color: '#c2c6cf' }}>
                <div>Plan ID: {planData?.treatmentPlan?.createdAt ? 'Loaded' : 'N/A'}</div>
                <div>Procedures loaded: {procedureCount}</div>
                <div>Token: {publicToken?.slice(0, 8)}...</div>
                <div>Fields mapped: procedure_name, display_title, priority, tooth_numbers, library content</div>
              </div>
            </div>
          )}

          {/* OVERVIEW SUMMARY CARD */}
          <section className="mb-16">
            <h2 
              className="text-xl sm:text-2xl mb-6 text-t3 font-light"
            >
              {text?.overviewTitle}
            </h2>
            <div 
              className="rounded-xl px-8 py-5 flex items-center justify-between" 
              style={{ 
                backgroundColor: '#1A1F2E',
                border: '1px solid #2D3748'
              }}
            >
              <div className="flex items-center gap-2">
                <span className="text-2xl sm:text-3xl text-accent font-semibold">
                  {procedureCount}
                </span>
                <span className="text-t3 text-sm sm:text-base">
                  {text?.proceduresLabel}
                </span>
              </div>
              <div 
                style={{ width: '1px', height: '28px', backgroundColor: '#2D3748' }}
              />
              <div className="flex items-center gap-2">
                <span className="text-2xl sm:text-3xl text-accent font-semibold">
                  {calculateEstimatedVisits()}
                </span>
                <span className="text-t3 text-sm sm:text-base">
                  {text?.visitsLabel}
                </span>
              </div>
            </div>
          </section>

          {/* TREATMENT LIST */}
          <section className="mb-40">
            <h2 
              className="text-2xl sm:text-3xl mb-10 text-t1 font-semibold leading-snug"
            >
              {text?.proceduresTitle}
            </h2>
            
            {procedures?.length > 0 ? (
              <>
                <div className="rounded-xl overflow-hidden mb-10" style={{ border: '1px solid #2D3748' }}>
                  {procedures?.map((procedure, procIdx) => {
                    const lang = currentLanguage === 'es' ? 'Es' : 'En';
                    const title = procedure?.library?.[`title${lang}`] || procedure?.displayTitle || procedure?.procedureName || 'Not specified';
                    const isSelected = expandedProcedure === procedure?.id;
                    const shade = listItemShades[procIdx % listItemShades.length];
                    const iconName = getProcedureIcon(procedure);

                    const hasLibraryContent = procedure?.library !== null && procedure?.library !== undefined;
                    const summary = procedure?.library?.[`summary${lang}`] || null;
                    const why = procedure?.library?.[`why${lang}`] || null;
                    const steps = procedure?.library?.[`steps${lang}`] || null;
                    const aftercare = procedure?.library?.[`aftercare${lang}`] || null;
                    const whatIfNot = procedure?.library?.[`whatIfNot${lang}`] || null;
                    const faqs = procedure?.library?.[`faqs${lang}`] || null;
                    const visuals = procedure?.library?.visuals || null;
                    const isFullDetailsVisible = showFullDetails === procedure?.id;

                    return (
                      <div key={procedure?.id}>
                        <button
                          onClick={() => toggleProcedure(procedure?.id)}
                          className="w-full text-left px-6 py-4 transition-all duration-200 focus:outline-none"
                          style={{
                            backgroundColor: isSelected ? '#4A6FA5' : shade,
                            borderBottom: (!isSelected && procIdx < procedures.length - 1) ? '1px solid rgba(45,55,72,0.5)' : 'none',
                            minHeight: '44px',
                          }}
                          aria-expanded={isSelected}
                          aria-label={`${title} - ${isSelected ? 'Selected' : 'Select'}`}
                        >
                          <div className="flex items-center justify-between gap-3">
                            <div className="flex items-center gap-4 min-w-0">
                              <ProcedureThumb
                                canonicalSlug={procedure?.canonicalSlug}
                                name={title}
                                size="sm"
                                className="!w-14 !h-9"
                                glow={false}
                              />
                              <div className="min-w-0">
                                <h3 
                                  className="text-base sm:text-lg font-medium leading-snug truncate"
                                  style={{ color: isSelected ? '#ffffff' : 'var(--t1)' }}
                                >
                                  {title}
                                </h3>
                                <div className="flex items-center gap-2 mt-0.5">
                                  {procedure?.adaCode && (
                                    <span 
                                      className="text-xs font-mono"
                                      style={{ color: isSelected ? 'rgba(255,255,255,0.65)' : 'var(--t3)' }}
                                    >
                                      {procedure?.adaCode}
                                    </span>
                                  )}
                                  {procedure?.toothNumbers && (
                                    <span 
                                      className="text-xs"
                                      style={{ color: isSelected ? 'rgba(255,255,255,0.65)' : 'var(--t3)' }}
                                    >
                                      {currentLanguage === 'es' ? 'Dientes' : 'Teeth'}: {procedure?.toothNumbers}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                            <Icon 
                              name={isSelected ? 'ChevronDown' : 'ChevronRight'} 
                              size={18} 
                              style={{ color: isSelected ? '#ffffff' : 'rgba(74,111,165,0.6)', flexShrink: 0 }} 
                            />
                          </div>
                        </button>

                        {isSelected && (
                          <div 
                            className="overflow-hidden animate-slideDown"
                            style={{
                              backgroundColor: '#1A1F2E',
                              borderBottom: procIdx < procedures.length - 1 ? '1px solid rgba(45,55,72,0.5)' : 'none',
                            }}
                          >
                            {visuals?.heroKey && (
                              <div className="w-full">
                                <Image
                                  src={visuals?.heroKey}
                                  alt={`${title} illustration`}
                                  className="w-full"
                                  style={{ maxHeight: '400px', objectFit: 'cover' }}
                                  onError={(e) => { e.target.style.display = 'none'; }}
                                />
                              </div>
                            )}

                            <div className="p-8 sm:p-10 space-y-10">
                              <div>
                                <h3 className="text-2xl sm:text-3xl mb-3 text-t1 font-semibold leading-snug">
                                  {title}
                                </h3>
                                {procedure?.toothNumbers && (
                                  <p className="text-t3 text-base">
                                    {currentLanguage === 'es' ? 'Dientes' : 'Teeth'}: {procedure?.toothNumbers}
                                  </p>
                                )}
                              </div>

                              {debugMode && (
                                <div 
                                  className="p-5 rounded-xl space-y-2"
                                  style={{ 
                                    backgroundColor: 'rgba(255, 183, 77, 0.12)',
                                    border: '1px solid rgba(255, 183, 77, 0.35)',
                                    fontFamily: 'monospace',
                                    fontSize: '0.8125rem'
                                  }}
                                >
                                  <div style={{ color: '#ffb74d', fontWeight: 600 }}>Debug Info</div>
                                  <div style={{ color: '#c2c6cf' }}>
                                    <span style={{ color: '#9ba1ad' }}>slug:</span> {procedure?.canonicalSlug || 'null'}
                                    {' | '}
                                    <span style={{ color: '#9ba1ad' }}>ada:</span> {procedure?.adaCode || 'null'}
                                    {' | '}
                                    <span style={{ color: '#9ba1ad' }}>visuals:</span>{' '}
                                    <span style={{ color: visuals ? '#22c55e' : '#ef4444' }}>
                                      {visuals ? (visuals?.heroKey ? 1 : 0) + (visuals?.stepKeys?.length || 0) : 0}
                                    </span>
                                  </div>
                                </div>
                              )}

                              {summary && (
                                <div>
                                  <h4 className="text-2xl sm:text-3xl mb-6 font-semibold" style={{ color: '#F5C542' }}>
                                    {text?.sections?.whatThis}
                                  </h4>
                                  <div
                                    className="text-base sm:text-lg font-light leading-[1.8]"
                                    style={{ color: '#ffffff' }}
                                    dangerouslySetInnerHTML={{ __html: summary?.replace(/\n/g, '<br />') }}
                                  />
                                </div>
                              )}

                              {steps && steps?.length > 0 && (
                                <div>
                                  <h4 className="text-2xl sm:text-3xl mb-8 font-semibold" style={{ color: '#F5C542' }}>
                                    {text?.sections?.howItWorks}
                                  </h4>
                                  <div className="space-y-6">
                                    {steps?.map((step, idx) => {
                                      const hasStepImage = !!visuals?.stepKeys?.[idx];

                                      return (
                                        <div key={idx}>
                                          <div
                                            className="w-full text-left rounded-xl"
                                            style={{
                                              backgroundColor: '#232936',
                                              border: '1px solid #2D3748',
                                              padding: '1.25rem 1.5rem',
                                            }}
                                          >
                                            <div className="flex items-start gap-4">
                                              <span 
                                                className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold mt-0.5"
                                                style={{
                                                  backgroundColor: '#4A6FA5',
                                                  color: '#ffffff',
                                                }}
                                              >
                                                {idx + 1}
                                              </span>
                                              <div className="flex-1 min-w-0">
                                                <h5 className="text-lg sm:text-xl font-semibold leading-snug" style={{ color: '#F5C542' }}>
                                                  {step?.title || `${currentLanguage === 'es' ? 'Paso' : 'Step'} ${idx + 1}`}
                                                </h5>
                                                <p className="text-sm sm:text-base font-light leading-relaxed mt-2" style={{ color: '#ffffff' }}>
                                                  {step?.description || step?.content}
                                                </p>
                                              </div>
                                            </div>
                                          </div>

                                          {hasStepImage && (
                                            <div className="mt-3 mb-2 px-4">
                                              <div className="flex justify-center rounded-xl overflow-hidden" style={{ backgroundColor: '#0F1218' }}>
                                                <Image
                                                  src={visuals?.stepKeys?.[idx]}
                                                  alt={`${currentLanguage === 'es' ? 'Paso' : 'Step'} ${idx + 1}: ${step?.title || title}`}
                                                  className="rounded-xl"
                                                  style={{ maxWidth: '100%', maxHeight: '360px', objectFit: 'contain' }}
                                                  onError={(e) => {
                                                    e.target.parentElement.innerHTML = `<div style="padding:2rem;text-align:center;color:#7a8cf5;font-size:0.875rem"><p>${currentLanguage === 'es' ? 'Visual próximamente' : 'Visual coming soon'}</p></div>`;
                                                  }}
                                                />
                                              </div>
                                            </div>
                                          )}
                                        </div>
                                      );
                                    })}
                                  </div>
                                </div>
                              )}

                              {hasLibraryContent && (why || whatIfNot || aftercare || (faqs && faqs?.length > 0)) && (
                                <button
                                  onClick={(e) => toggleFullDetails(procedure?.id, e)}
                                  className="w-full py-4 px-8 rounded-xl transition-all duration-200 hover:brightness-110 focus:outline-none"
                                  style={{ 
                                    backgroundColor: isFullDetailsVisible ? '#2D3748' : '#4A6FA5',
                                    color: 'white',
                                    fontSize: '1.125rem',
                                    fontWeight: 500,
                                    minHeight: '48px'
                                  }}
                                >
                                  {isFullDetailsVisible ? text?.hideFullDetails : text?.showFullDetails}
                                </button>
                              )}

                              {!hasLibraryContent && (
                                <div 
                                  className="p-8 rounded-xl"
                                  style={{ 
                                    backgroundColor: 'rgba(255, 183, 77, 0.1)',
                                    border: '1px solid rgba(255, 183, 77, 0.2)'
                                  }}
                                >
                                  <p className="text-warning text-lg leading-relaxed">
                                    {text?.noContentAvailable}
                                  </p>
                                </div>
                              )}

                              {isFullDetailsVisible && (
                                <div className="space-y-16 pt-6 animate-slideDown">
                                  {why && (
                                    <div>
                                      <h4 className="text-2xl sm:text-3xl mb-6 font-semibold" style={{ color: '#F5C542' }}>
                                        {text?.sections?.whyNeed}
                                      </h4>
                                      <div
                                        className="text-base sm:text-lg font-light leading-[1.8]"
                                        style={{ color: '#ffffff' }}
                                        dangerouslySetInnerHTML={{ __html: why?.replace(/\n/g, '<br />') }}
                                      />
                                    </div>
                                  )}

                                  {(procedure?.library?.timeEstimate || procedure?.library?.visitsEstimate) && (
                                    <div 
                                      className="p-8 rounded-xl"
                                      style={{ 
                                        backgroundColor: 'rgba(74, 111, 165, 0.1)',
                                        border: '1px solid rgba(74, 111, 165, 0.2)'
                                      }}
                                    >
                                      {procedure?.library?.timeEstimate && (
                                        <div className="mb-4">
                                          <span className="text-lg font-semibold" style={{ color: '#F5C542' }}>
                                            {currentLanguage === 'es' ? 'Tiempo: ' : 'Time: '}
                                          </span>
                                          <span className="text-base" style={{ color: '#ffffff' }}>
                                            {procedure?.library?.timeEstimate}
                                          </span>
                                        </div>
                                      )}
                                      {procedure?.library?.visitsEstimate && (
                                        <div>
                                          <span className="text-lg font-semibold" style={{ color: '#F5C542' }}>
                                            {currentLanguage === 'es' ? 'Visitas: ' : 'Visits: '}
                                          </span>
                                          <span className="text-base" style={{ color: '#ffffff' }}>
                                            {procedure?.library?.visitsEstimate}
                                          </span>
                                        </div>
                                      )}
                                    </div>
                                  )}

                                  {whatIfNot && (
                                    <div>
                                      <h4 className="text-2xl sm:text-3xl mb-6 font-semibold" style={{ color: '#F5C542' }}>
                                        {text?.sections?.ifDelay}
                                      </h4>
                                      <div
                                        className="text-base sm:text-lg font-light leading-[1.8]"
                                        style={{ color: '#ffffff' }}
                                        dangerouslySetInnerHTML={{ __html: whatIfNot?.replace(/\n/g, '<br />') }}
                                      />
                                    </div>
                                  )}

                                  {aftercare && (
                                    <div>
                                      <h4 className="text-2xl sm:text-3xl mb-6 font-semibold" style={{ color: '#F5C542' }}>
                                        {text?.sections?.aftercare}
                                      </h4>
                                      <div
                                        className="text-base sm:text-lg font-light leading-[1.8]"
                                        style={{ color: '#ffffff' }}
                                        dangerouslySetInnerHTML={{ __html: aftercare?.replace(/\n/g, '<br />') }}
                                      />
                                    </div>
                                  )}

                                  {faqs && faqs?.length > 0 && (
                                    <div>
                                      <h4 className="text-2xl sm:text-3xl mb-10 font-semibold" style={{ color: '#F5C542' }}>
                                        {text?.sections?.faqs}
                                      </h4>
                                      <div className="space-y-8">
                                        {faqs?.map((faq, idx) => (
                                          <div 
                                            key={idx}
                                            className="p-8 rounded-xl"
                                            style={{ 
                                              backgroundColor: '#232936',
                                              border: '1px solid #2D3748'
                                            }}
                                          >
                                            <p className="mb-5 text-lg font-semibold" style={{ color: '#ffffff' }}>
                                              {faq?.q}
                                            </p>
                                            <p className="text-base leading-[1.8]" style={{ color: '#ffffff' }}>
                                              {faq?.a}
                                            </p>
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </>
            ) : (
              <div 
                className="rounded-2xl p-16 text-center"
                style={{ 
                  backgroundColor: '#1A1F2E',
                  border: '1px solid #2D3748'
                }}
              >
                <p className="text-t3 text-xl">
                  {currentLanguage === 'es' ? 'No se encontraron procedimientos en su plan de tratamiento.' : 'No procedures found in your treatment plan.'}
                </p>
              </div>
            )}
          </section>

          {/* FOOTER */}
          <footer className="pt-16">
            <div className="text-center">
              <p 
                className="mb-0 text-t3 text-xl sm:text-2xl font-light leading-[1.8]"
              >
                {text?.footer}
              </p>
            </div>
          </footer>

        </div>
      </div>
    </>
  );
};

export default TreatmentPlanLanding;