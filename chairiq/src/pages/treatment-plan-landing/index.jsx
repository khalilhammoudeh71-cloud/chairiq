import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useSearchParams, useNavigate } from 'react-router-dom';
import LanguageToggle from '../../components/ui/LanguageToggle';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import Icon from '../../components/AppIcon';
import Image from '../../components/AppImage';
import { patientPlanService } from '../../services/patientPlanService';
import { useAuth } from '../../contexts/AuthContext';

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
      // Closing the card
      setExpandedProcedure(null);
      setShowFullDetails(null);
    } else {
      // Opening a new card
      setExpandedProcedure(procedureId);
      setShowFullDetails(null); // Reset to preview mode
    }
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
      <div className="min-h-screen flex items-center justify-center px-5 bg-bg0">
        <div className="max-w-md text-center">
          <Icon name="AlertCircle" size={48} style={{ color: '#ffb74d', margin: '0 auto 1.5rem' }} />
          <h1 className="text-3xl mb-6 text-t1 font-semibold">
            {text?.errorTitle}
          </h1>
          <p className="mb-8 text-t3 text-xl leading-relaxed">
            {error}
          </p>
          <p className="text-t3 text-lg">
            {text?.contactOffice}
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
        <div className="max-w-4xl mx-auto px-8 sm:px-12 lg:px-16 py-16 md:py-24">
          
          {/* Language Toggle */}
          <div className="flex justify-end items-center mb-16">
            <LanguageToggle />
          </div>

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

          {/* HEADER */}
          <header className="mb-32">
            <h1 
              className="text-5xl sm:text-6xl lg:text-7xl mb-8 text-t1 font-bold leading-tight tracking-tight"
            >
              {text?.title}
            </h1>
            <p 
              className="mb-6 text-t3 text-2xl sm:text-3xl font-light leading-relaxed"
            >
              {text?.subtitle}
            </p>
            <p 
              className="text-t3 text-xl sm:text-2xl font-light leading-[1.7]"
            >
              {text?.reassurance}
            </p>
          </header>

          {/* OVERVIEW SUMMARY CARD */}
          <section className="mb-40">
            <h2 
              className="text-2xl sm:text-3xl mb-12 text-t3 font-light"
            >
              {text?.overviewTitle}
            </h2>
            <div 
              className="rounded-2xl p-12" 
              style={{ 
                backgroundColor: '#1A1F2E',
                border: '1px solid #2D3748'
              }}
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-16">
                <div>
                  <div 
                    className="text-6xl sm:text-7xl mb-6 text-accent font-semibold"
                  >
                    {procedureCount}
                  </div>
                  <div 
                    className="text-t3 text-lg leading-relaxed"
                  >
                    {text?.proceduresLabel}
                  </div>
                </div>
                <div>
                  <div 
                    className="text-6xl sm:text-7xl mb-6 text-accent font-semibold"
                  >
                    {calculateEstimatedVisits()}
                  </div>
                  <div 
                    className="text-t3 text-lg leading-relaxed"
                  >
                    {text?.visitsLabel}
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* RECOMMENDED CARE LIST */}
          <section className="mb-40">
            <h2 
              className="text-4xl sm:text-5xl mb-20 text-t1 font-semibold leading-snug"
            >
              {text?.proceduresTitle}
            </h2>
            
            <div className="space-y-8">
              {procedures?.length > 0 ? (
                procedures?.map((procedure) => {
                  const isExpanded = expandedProcedure === procedure?.id;
                  const isFullDetailsVisible = showFullDetails === procedure?.id;
                  const lang = currentLanguage === 'es' ? 'Es' : 'En';
                  
                  // Get correct language content with proper fallbacks
                  const hasLibraryContent = procedure?.library !== null && procedure?.library !== undefined;
                  const title = procedure?.library?.[`title${lang}`] || procedure?.displayTitle || procedure?.procedureName || 'Not specified';
                  const summary = procedure?.library?.[`summary${lang}`] || null;
                  const why = procedure?.library?.[`why${lang}`] || null;
                  const steps = procedure?.library?.[`steps${lang}`] || null;
                  const aftercare = procedure?.library?.[`aftercare${lang}`] || null;
                  const whatIfNot = procedure?.library?.[`whatIfNot${lang}`] || null;
                  const faqs = procedure?.library?.[`faqs${lang}`] || null;
                  const visuals = procedure?.library?.visuals || null;

                  // 🔍 DEBUG: Log visual data when procedure is expanded
                  if (isExpanded) {
                    console.log('🔍 [UI DEBUG] Procedure expanded - Visual data:', {
                      procedure_id: procedure?.id,
                      procedure_name: procedure?.procedureName,
                      canonical_slug: procedure?.canonicalSlug || 'N/A',
                      ada_code: procedure?.adaCode || 'N/A',
                      visuals_found: visuals ? 'YES' : 'NO',
                      visual_count: visuals ? (visuals?.heroKey ? 1 : 0) + (visuals?.stepKeys?.length || 0) : 0,
                      hero_url: visuals?.heroKey || 'N/A',
                      step_urls: visuals?.stepKeys || []
                    });
                  }

                  // Preview text - first 2 sentences or 180 chars from summary
                  const previewText = summary 
                    ? (summary?.split('.')?.slice(0, 2)?.join('.') + '.')?.slice(0, 180)
                    : 'Click to learn more about this procedure.';

                  return (
                    <div 
                      key={procedure?.id}
                      role="button"
                      tabIndex={0}
                      onClick={() => toggleProcedure(procedure?.id)}
                      onKeyDown={(e) => {
                        if (e?.key === 'Enter' || e?.key === ' ') {
                          e?.preventDefault();
                          toggleProcedure(procedure?.id);
                        }
                      }}
                      className="rounded-2xl overflow-hidden transition-all duration-300 cursor-pointer hover:border-accent/30 focus:border-accent focus:outline-none"
                      style={{ 
                        backgroundColor: '#1A1F2E',
                        border: '1px solid #2D3748',
                        minHeight: '48px',
                        touchAction: 'manipulation'
                      }}
                      aria-expanded={isExpanded}
                      aria-label={`${title} - ${isExpanded ? 'Collapse' : 'Expand'} details`}
                    >
                      {/* Collapsed state - Preview Card */}
                      <div className="p-10">
                        <div className="mb-6">
                          <h3 
                            className="text-2xl sm:text-3xl mb-6 text-t1 font-semibold leading-snug"
                          >
                            {title}
                            {procedure?.adaCode && (
                              <span className="text-t3 text-base font-mono font-normal ml-3">
                                ({procedure?.adaCode})
                              </span>
                            )}
                          </h3>

                          {/* Tooth Numbers */}
                          {procedure?.toothNumbers && (
                            <p 
                              className="mb-5 text-t3 text-lg"
                            >
                              {currentLanguage === 'es' ? 'Dientes' : 'Teeth'}: {procedure?.toothNumbers}
                            </p>
                          )}
                          
                          {/* Priority Badge */}
                          {procedure?.priority && (
                            <div 
                              className="inline-block px-5 py-2 rounded-full text-base mb-6"
                              style={{
                                backgroundColor: procedure?.priority === 'Immediate' ? 'rgba(255, 183, 77, 0.15)' 
                                  : procedure?.priority === 'Soon' ? 'rgba(74, 111, 165, 0.15)' : 'rgba(156, 163, 175, 0.15)',
                                color: procedure?.priority === 'Immediate' ? '#ffb74d'
                                  : procedure?.priority === 'Soon' ? '#4A6FA5' : '#9ca3af'
                              }}
                            >
                              {text?.priority?.[procedure?.priority] || procedure?.priority}
                            </div>
                          )}
                        </div>
                        
                        {/* Preview Text - Always visible */}
                        {!isExpanded && (
                          <p 
                            className="mb-0 text-t3 text-xl sm:text-2xl font-light leading-[1.8]"
                          >
                            {previewText}
                            {previewText?.length >= 180 && summary?.length > 180 ? '...' : ''}
                          </p>
                        )}

                        {/* Hero image - visible by default, hidden when full details shown */}
                        {!isFullDetailsVisible && visuals?.heroKey && (
                          <div className="flex justify-center my-6">
                            <Image
                              src={visuals?.heroKey}
                              alt={`${title} illustration`}
                              className="rounded-xl"
                              style={{ 
                                maxWidth: '100%', 
                                maxHeight: '280px', 
                                objectFit: 'contain'
                              }}
                              onError={(e) => {
                                e.target.style.display = 'none';
                              }}
                            />
                          </div>
                        )}
                        
                        {/* Expand/Collapse indicator */}
                        <div 
                          className="flex items-center justify-between mt-8"
                          aria-hidden="true"
                        >
                          <span
                            className="text-accent text-lg font-medium"
                          >
                            {isExpanded ? text?.seeLess : text?.seeMore}
                          </span>
                          <Icon 
                            name={isExpanded ? "ChevronUp" : "ChevronDown"} 
                            size={24}
                            style={{ color: '#60A5FA' }}
                          />
                        </div>
                      </div>
                      
                      {/* Expanded state - Preview + Full Details */}
                      {isExpanded && (
                        <div 
                          className="px-10 pb-10 space-y-10 animate-slideDown"
                          style={{ 
                            borderTop: '1px solid #2D3748',
                            paddingTop: '2.5rem'
                          }}
                        >
                          
                          {/* 🔍 DEV-ONLY DEBUG BLOCK - Enhanced for iPad debugging */}
                          {debugMode && (
                            <div 
                              className="p-5 rounded-xl space-y-3"
                              style={{ 
                                backgroundColor: 'rgba(255, 183, 77, 0.12)',
                                border: '1px solid rgba(255, 183, 77, 0.35)',
                                fontFamily: 'monospace',
                                fontSize: '0.8125rem'
                              }}
                            >
                              <div style={{ 
                                color: '#ffb74d', 
                                fontWeight: 600, 
                                fontSize: '0.875rem',
                                marginBottom: '0.5rem'
                              }}>
                                🔍 Debug Info
                              </div>
                              
                              <div style={{ color: '#c2c6cf' }}>
                                <span style={{ color: '#9ba1ad' }}>canonical_slug:</span>{' '}
                                <span style={{ color: '#e8e9ed' }}>
                                  {procedure?.canonicalSlug || 'null'}
                                </span>
                              </div>
                              
                              <div style={{ color: '#c2c6cf' }}>
                                <span style={{ color: '#9ba1ad' }}>ada_code:</span>{' '}
                                <span style={{ color: '#e8e9ed' }}>
                                  {procedure?.adaCode || 'null'}
                                </span>
                              </div>
                              
                              <div style={{ color: '#c2c6cf' }}>
                                <span style={{ color: '#9ba1ad' }}>procedure_name:</span>{' '}
                                <span style={{ color: '#e8e9ed' }}>
                                  {procedure?.procedureName || 'null'}
                                </span>
                              </div>
                              
                              <div style={{ color: '#c2c6cf' }}>
                                <span style={{ color: '#9ba1ad' }}>key_used:</span>{' '}
                                <span style={{ 
                                  color: '#7a8cf5',
                                  fontWeight: 500
                                }}>
                                  {procedure?.canonicalSlug ? 'canonical_slug' : procedure?.adaCode ?'ada_code' : procedure?.procedureName ?'procedure_name' :'none'}
                                </span>
                              </div>
                              
                              <div style={{ color: '#c2c6cf' }}>
                                <span style={{ color: '#9ba1ad' }}>visuals_found:</span>{' '}
                                <span style={{ 
                                  color: visuals ? '#22c55e' : '#ef4444',
                                  fontWeight: 600
                                }}>
                                  {visuals 
                                    ? (visuals?.heroKey ? 1 : 0) + (visuals?.stepKeys?.length || 0)
                                    : 0}
                                </span>
                              </div>
                              
                              <div style={{ color: '#c2c6cf' }}>
                                <span style={{ color: '#9ba1ad' }}>first_image_url:</span>{' '}
                                {visuals?.heroKey ? (
                                  <a 
                                    href={visuals?.heroKey} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    onClick={(e) => e?.stopPropagation()}
                                    style={{ 
                                      color: '#7a8cf5',
                                      textDecoration: 'underline',
                                      wordBreak: 'break-all',
                                      display: 'inline-block',
                                      marginTop: '0.25rem'
                                    }}
                                  >
                                    {visuals?.heroKey?.length > 60 
                                      ? `${visuals?.heroKey?.substring(0, 60)}...`
                                      : visuals?.heroKey}
                                  </a>
                                ) : (
                                  <span style={{ color: '#9ba1ad' }}>null</span>
                                )}
                              </div>
                              
                              <div style={{ color: '#c2c6cf' }}>
                                <span style={{ color: '#9ba1ad' }}>image_load_status:</span>{' '}
                                <span style={{ 
                                  color: visuals?.heroKey ? '#ffb74d' : '#9ba1ad',
                                  fontStyle: 'italic'
                                }}>
                                  {visuals?.heroKey ? 'attempting_load' : 'not_attempted'}
                                </span>
                              </div>
                              
                              {/* Additional step images if present */}
                              {visuals?.stepKeys && visuals?.stepKeys?.length > 0 && (
                                <div style={{ 
                                  marginTop: '1rem',
                                  paddingTop: '1rem',
                                  borderTop: '1px solid rgba(255, 183, 77, 0.25)'
                                }}>
                                  <div style={{ 
                                    color: '#ffb74d',
                                    fontWeight: 500,
                                    marginBottom: '0.5rem'
                                  }}>
                                    Step Images ({visuals?.stepKeys?.length}):
                                  </div>
                                  {visuals?.stepKeys?.map((stepUrl, idx) => (
                                    <div key={idx} style={{ marginBottom: '0.5rem' }}>
                                      <span style={{ color: '#9ba1ad' }}>step_{idx + 1}:</span>{' '}
                                      <a 
                                        href={stepUrl} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        onClick={(e) => e?.stopPropagation()}
                                        style={{ 
                                          color: '#7a8cf5',
                                          textDecoration: 'underline',
                                          wordBreak: 'break-all',
                                          fontSize: '0.75rem'
                                        }}
                                      >
                                        {stepUrl?.length > 50 
                                          ? `${stepUrl?.substring(0, 50)}...`
                                          : stepUrl}
                                      </a>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          )}
                          
                          {/* "What this is" preview - Always shown when expanded */}
                          {summary && (
                            <div>
                              <h4 
                                className="text-2xl mb-6 text-accent font-semibold"
                              >
                                {text?.sections?.whatThis}
                              </h4>
                              <div
                                className="text-t3 text-xl sm:text-2xl font-light leading-[1.8]"
                                dangerouslySetInnerHTML={{ 
                                  __html: summary?.replace(/\n/g, '<br />') 
                                }}
                              />
                            </div>
                          )}

                          {/* Show Full Details Toggle Button */}
                          {hasLibraryContent && (
                            <button
                              onClick={(e) => toggleFullDetails(procedure?.id, e)}
                              className="w-full py-4 px-8 rounded-xl transition-all duration-200 hover:brightness-110 focus:border-accent focus:outline-none"
                              style={{ 
                                backgroundColor: '#4A6FA5',
                                color: 'white',
                                fontSize: '1.125rem',
                                fontWeight: 500,
                                minHeight: '48px'
                              }}
                              aria-expanded={isFullDetailsVisible}
                            >
                              {isFullDetailsVisible ? text?.hideFullDetails : text?.showFullDetails}
                            </button>
                          )}

                          {/* Show message if no library content available */}
                          {!hasLibraryContent && (
                            <div 
                              className="p-8 rounded-xl"
                              style={{ 
                                backgroundColor: 'rgba(255, 183, 77, 0.1)',
                                border: '1px solid rgba(255, 183, 77, 0.2)'
                              }}
                            >
                              <p 
                                className="text-warning text-lg leading-relaxed"
                              >
                                {text?.noContentAvailable}
                              </p>
                            </div>
                          )}

                          {/* Full Details Section - Only shown when toggle is active */}
                          {isFullDetailsVisible && (
                            <div className="space-y-16 pt-6 animate-slideDown">

                              {/* Why it's recommended */}
                              {why && (
                                <div>
                                  <h4 
                                    className="text-2xl mb-6 text-accent font-semibold"
                                  >
                                    {text?.sections?.whyNeed}
                                  </h4>
                                  <div
                                    className="text-t3 text-xl sm:text-2xl font-light leading-[1.8]"
                                    dangerouslySetInnerHTML={{ 
                                      __html: why?.replace(/\n/g, '<br />') 
                                    }}
                                  />
                                </div>
                              )}

                              {/* How it works (steps) with fallback placeholders */}
                              {steps && steps?.length > 0 && (
                                <div>
                                  <h4 
                                    className="text-2xl mb-10 text-accent font-semibold"
                                  >
                                    {text?.sections?.howItWorks}
                                  </h4>
                                  <div className="space-y-12">
                                    {steps?.map((step, idx) => (
                                      <div key={idx}>
                                        {visuals?.stepKeys?.[idx] ? (
                                          <div>
                                            <div className="flex justify-center mb-5">
                                              <Image
                                                src={visuals?.stepKeys?.[idx]}
                                                alt={`Step ${idx + 1} of ${title}`}
                                                className="rounded-xl"
                                                style={{ 
                                                  maxWidth: '100%', 
                                                  maxHeight: '280px', 
                                                  objectFit: 'contain' 
                                                }}
                                                onError={(e) => {
                                                  console.warn(`⚠️ [IMAGE DEBUG] Failed to load step ${idx + 1} image:`, {
                                                    url: visuals?.stepKeys?.[idx],
                                                    procedure_name: procedure?.procedureName,
                                                    canonical_slug: procedure?.canonicalSlug,
                                                    step_index: idx,
                                                    error_type: 'image_load_failed'
                                                  });
                                                  e.target.style.display = 'none';
                                                  const placeholder = e?.target?.parentElement?.querySelector('.visual-placeholder');
                                                  if (placeholder) placeholder.style.display = 'flex';
                                                }}
                                              />
                                              <div 
                                                className="visual-placeholder rounded-xl items-center justify-center p-6"
                                                style={{ 
                                                  display: 'none',
                                                  backgroundColor: 'rgba(122, 140, 245, 0.08)',
                                                  border: '1px solid rgba(122, 140, 245, 0.15)',
                                                  color: '#7a8cf5',
                                                  fontSize: '0.875rem',
                                                  textAlign: 'center',
                                                  minHeight: '120px'
                                                }}
                                              >
                                                <div>
                                                  <Icon name="ImageOff" size={24} style={{ margin: '0 auto 0.5rem', color: '#7a8cf5' }} />
                                                  <p>{currentLanguage === 'es' ? 'Visual próximamente' : 'Visual coming soon'}</p>
                                                  {debugMode && (
                                                    <p style={{ fontSize: '0.7rem', marginTop: '0.5rem', opacity: 0.7 }}>
                                                      Image failed to load
                                                    </p>
                                                  )}
                                                </div>
                                              </div>
                                            </div>
                                            
                                            {/* 🔍 DEV-ONLY DEBUG LINE for steps */}
                                            {debugMode && (
                                              <div style={{ 
                                                fontSize: '0.7rem', 
                                                color: '#ffb74d', 
                                                marginBottom: '0.5rem',
                                                textAlign: 'center',
                                                fontFamily: 'monospace'
                                              }}>
                                                visuals found: {visuals?.stepKeys?.length || 0} | key used: step_{idx + 1}
                                              </div>
                                            )}
                                          </div>
                                        ) : (
                                          <div>
                                            <div 
                                              className="flex justify-center mb-5 rounded-xl items-center p-6"
                                              style={{ 
                                                backgroundColor: 'rgba(122, 140, 245, 0.08)',
                                                border: '1px solid rgba(122, 140, 245, 0.15)',
                                                color: '#7a8cf5',
                                                fontSize: '0.875rem',
                                                textAlign: 'center',
                                                minHeight: '120px'
                                              }}
                                            >
                                              <div>
                                                <Icon name="ImageOff" size={24} style={{ margin: '0 auto 0.5rem', color: '#7a8cf5' }} />
                                                <p>{currentLanguage === 'es' ? 'Visual próximamente' : 'Visual coming soon'}</p>
                                              </div>
                                            </div>
                                            
                                            {/* 🔍 DEV-ONLY DEBUG LINE for missing steps */}
                                            {debugMode && (
                                              <div style={{ 
                                                fontSize: '0.7rem', 
                                                color: '#ffb74d', 
                                                marginBottom: '0.5rem',
                                                textAlign: 'center',
                                                fontFamily: 'monospace'
                                              }}>
                                                visuals found: 0 | key used: none
                                              </div>
                                            )}
                                          </div>
                                        )}
                                        {step?.title && (
                                          <h5 
                                            className="mb-5 text-t1 text-xl font-semibold"
                                          >
                                            {step?.title}
                                          </h5>
                                        )}
                                        <p 
                                          className="text-t3 text-xl sm:text-2xl font-light leading-[1.8]"
                                        >
                                          {step?.description || step?.content}
                                        </p>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}

                              {/* Time & Visits Estimate */}
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
                                      <span className="text-accent text-lg font-semibold">
                                        {currentLanguage === 'es' ? 'Tiempo: ' : 'Time: '}
                                      </span>
                                      <span className="text-t3 text-lg">
                                        {procedure?.library?.timeEstimate}
                                      </span>
                                    </div>
                                  )}
                                  {procedure?.library?.visitsEstimate && (
                                    <div>
                                      <span className="text-accent text-lg font-semibold">
                                        {currentLanguage === 'es' ? 'Visitas: ' : 'Visits: '}
                                      </span>
                                      <span className="text-t3 text-lg">
                                        {procedure?.library?.visitsEstimate}
                                      </span>
                                    </div>
                                  )}
                                </div>
                              )}

                              {/* If you delay */}
                              {whatIfNot && (
                                <div>
                                  <h4 
                                    className="text-2xl mb-6 text-warning font-semibold"
                                  >
                                    {text?.sections?.ifDelay}
                                  </h4>
                                  <div
                                    className="text-t3 text-xl sm:text-2xl font-light leading-[1.8]"
                                    dangerouslySetInnerHTML={{ 
                                      __html: whatIfNot?.replace(/\n/g, '<br />') 
                                    }}
                                  />
                                </div>
                              )}

                              {/* Aftercare */}
                              {aftercare && (
                                <div>
                                  <h4 
                                    className="text-2xl mb-6 text-accent font-semibold"
                                  >
                                    {text?.sections?.aftercare}
                                  </h4>
                                  <div
                                    className="text-t3 text-xl sm:text-2xl font-light leading-[1.8]"
                                    dangerouslySetInnerHTML={{ 
                                      __html: aftercare?.replace(/\n/g, '<br />') 
                                    }}
                                  />
                                </div>
                              )}

                              {/* FAQs */}
                              {faqs && faqs?.length > 0 && (
                                <div>
                                  <h4 
                                    className="text-2xl mb-10 text-accent font-semibold"
                                  >
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
                                        <p 
                                          className="mb-5 text-t1 text-xl font-semibold"
                                        >
                                          {faq?.q}
                                        </p>
                                        <p 
                                          className="text-t3 text-lg leading-[1.8]"
                                        >
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
                      )}
                    </div>
                  );
                })
              ) : (
                <div 
                  className="rounded-2xl p-16 text-center"
                  style={{ 
                    backgroundColor: '#1A1F2E',
                    border: '1px solid #2D3748'
                  }}
                >
                  <p className="text-t3 text-xl">
                    {currentLanguage === 'es' ?'No se encontraron procedimientos en su plan de tratamiento.' :'No procedures found in your treatment plan.'}
                  </p>
                </div>
              )}
            </div>
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