import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import { generateVisualDescription } from '../../../services/visualDescriptionService';

export default function CategoryVisualDeck({ steps, language, canonicalSlug }) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [imageLoadStatus, setImageLoadStatus] = useState({});
  const [aiDescriptions, setAiDescriptions] = useState({});
  const [loadingDescriptions, setLoadingDescriptions] = useState({});

  // ✅ FIX: Filter steps that have visuals using step_id matching
  const stepsWithVisuals = steps?.filter(step => step?.visual?.image_url) || [];

  // ✅ FIX: Show per-step "Visual coming soon" message for steps without visuals
  const hasAnyVisuals = stepsWithVisuals?.length > 0;

  // If NO visuals at all for this procedure, show friendly placeholder
  if (!hasAnyVisuals) {
    return (
      <div 
        className="rounded-xl p-6 text-center"
        style={{ 
          backgroundColor: 'rgba(107, 124, 232, 0.05)', 
          border: '1px solid rgba(107, 124, 232, 0.1)' 
        }}
      >
        <p style={{ color: '#9ca3af', fontSize: '0.9rem' }}>
          {language === 'EN' ? 'Visuals coming soon for this procedure' : 'Las imágenes estarán disponibles pronto'}
        </p>
      </div>
    );
  }

  const currentStep = stepsWithVisuals?.[currentStepIndex];

  // ✅ CACHE-BUSTING: Ensure image URL has proper cache-busting parameter
  const getCacheBustedImageUrl = (imageUrl, visual) => {
    if (!imageUrl) return imageUrl;

    // Check if URL already has cache-busting parameter
    if (imageUrl?.includes('?v=') || imageUrl?.includes('&v=')) {
      return imageUrl;
    }

    // Determine cache-buster value: updated_at → visual_id → timestamp
    let cacheBusterValue;
    if (visual?.updated_at) {
      cacheBusterValue = new Date(visual?.updated_at)?.getTime();
    } else if (currentStep?.step_id) {
      cacheBusterValue = currentStep?.step_id;
    } else {
      cacheBusterValue = Date.now();
    }

    // Handle existing query parameters
    const separator = imageUrl?.includes('?') ? '&' : '?';
    return `${imageUrl}${separator}v=${cacheBusterValue}`;
  };

  // Generate AI description when image fails to load or is missing
  useEffect(() => {
    if (!currentStep) return;

    const shouldGenerateDescription = 
      !currentStep?.visual?.image_url || 
      imageLoadStatus?.[currentStep?.step_id] === 'error';

    if (shouldGenerateDescription && !aiDescriptions?.[currentStep?.step_id] && !loadingDescriptions?.[currentStep?.step_id]) {
      setLoadingDescriptions(prev => ({ ...prev, [currentStep?.step_id]: true }));

      generateVisualDescription({
        procedureName: canonicalSlug || 'procedure',
        stepTitle: currentStep?.title,
        stepBody: currentStep?.body || '',
        language,
      })?.then((description) => {
          setAiDescriptions(prev => ({ ...prev, [currentStep?.step_id]: description }));
        })?.finally(() => {
          setLoadingDescriptions(prev => ({ ...prev, [currentStep?.step_id]: false }));
        });
    }
  }, [currentStep, imageLoadStatus, canonicalSlug, language, aiDescriptions, loadingDescriptions]);

  const handleImageLoad = (stepId) => {
    setImageLoadStatus(prev => ({
      ...prev,
      [stepId]: 'loaded'
    }));
  };

  const handleImageError = (stepId, imageUrl) => {
    setImageLoadStatus(prev => ({
      ...prev,
      [stepId]: 'error'
    }));
    
    console.error(`🚨 [IMAGE ERROR] Failed to load image for step ${stepId}:`, {
      image_url: imageUrl,
      canonical_slug: canonicalSlug,
      step_index: currentStepIndex
    });
  };

  const goToNext = () => {
    if (currentStepIndex < stepsWithVisuals?.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1);
    }
  };

  const goToPrevious = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(currentStepIndex - 1);
    }
  };

  const loadStatus = imageLoadStatus?.[currentStep?.step_id] || 'loading';
  const aiDescription = aiDescriptions?.[currentStep?.step_id];
  const isLoadingDescription = loadingDescriptions?.[currentStep?.step_id];
  const showAiDescription = (!currentStep?.visual?.image_url || loadStatus === 'error') && (aiDescription || isLoadingDescription);

  // ✅ CACHE-BUSTING: Get cache-busted image URL for current step
  const displayImageUrl = getCacheBustedImageUrl(currentStep?.visual?.image_url, currentStep?.visual);

  return (
    <div className="space-y-4">
      {/* Visual Carousel */}
      <div 
        className="relative rounded-2xl overflow-hidden"
        style={{ 
          backgroundColor: 'rgba(255,255,255,0.03)', 
          border: '1px solid rgba(255,255,255,0.08)',
          minHeight: '300px'
        }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep?.step_id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="relative w-full h-full"
          >
            {/* AI-Generated Visual Description */}
            {showAiDescription && (
              <div 
                className="absolute inset-0 flex flex-col items-center justify-center p-8"
                style={{ 
                  background: 'linear-gradient(135deg, rgba(107, 124, 232, 0.08) 0%, rgba(139, 154, 236, 0.05) 100%)',
                  backdropFilter: 'blur(8px)'
                }}
              >
                <div className="max-w-2xl text-center space-y-4">
                  {/* AI Icon */}
                  <div 
                    className="w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4"
                    style={{ 
                      backgroundColor: 'rgba(107, 124, 232, 0.15)',
                      border: '2px solid rgba(107, 124, 232, 0.3)'
                    }}
                  >
                    <Sparkles size={32} style={{ color: '#8b9aec' }} />
                  </div>

                  {/* Loading State */}
                  {isLoadingDescription && (
                    <div className="space-y-3">
                      <div 
                        className="h-8 w-8 border-4 rounded-full animate-spin mx-auto"
                        style={{ 
                          borderColor: 'rgba(107, 124, 232, 0.3)', 
                          borderTopColor: '#6b7ce8' 
                        }}
                      />
                      <p className="text-sm" style={{ color: '#9ca3af' }}>
                        {language === 'EN' ?'Generating visual description...' :'Generando descripción visual...'}
                      </p>
                    </div>
                  )}

                  {/* AI Description Content */}
                  {!isLoadingDescription && aiDescription && (
                    <>
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full mb-3"
                        style={{ backgroundColor: 'rgba(107, 124, 232, 0.1)' }}
                      >
                        <Sparkles size={14} style={{ color: '#8b9aec' }} />
                        <span className="text-xs font-medium" style={{ color: '#8b9aec' }}>
                          {language === 'EN' ? 'AI-Generated Visual Description' : 'Descripción Visual Generada por IA'}
                        </span>
                      </div>
                      
                      <h4 className="text-xl font-medium mb-3" style={{ color: '#e8e9ed' }}>
                        {currentStep?.title}
                      </h4>
                      
                      <div 
                        className="text-base leading-relaxed p-6 rounded-xl"
                        style={{ 
                          color: '#b0b3ba',
                          backgroundColor: 'rgba(255,255,255,0.03)',
                          border: '1px solid rgba(107, 124, 232, 0.2)'
                        }}
                      >
                        {aiDescription}
                      </div>

                      <p className="text-xs mt-4" style={{ color: '#6b7280' }}>
                        {language === 'EN' ?'This description helps you visualize what patients typically see during this step.' :'Esta descripción te ayuda a visualizar lo que los pacientes suelen ver durante este paso.'}
                      </p>
                    </>
                  )}
                </div>
              </div>
            )}

            {/* Original Image Loading/Error States */}
            {!showAiDescription && (
              <>
                {/* Loading State */}
                {loadStatus === 'loading' && (
                  <div 
                    className="absolute inset-0 flex items-center justify-center"
                    style={{ backgroundColor: 'rgba(0,0,0,0.3)' }}
                  >
                    <div 
                      className="h-8 w-8 border-4 rounded-full animate-spin"
                      style={{ 
                        borderColor: 'rgba(107, 124, 232, 0.3)', 
                        borderTopColor: '#6b7ce8' 
                      }}
                    />
                  </div>
                )}

                {/* Actual Image with cache-busting */}
                <img
                  src={displayImageUrl}
                  alt={currentStep?.visual?.alt_text || currentStep?.title}
                  className="w-full h-auto object-contain"
                  style={{ maxHeight: '400px' }}
                  onLoad={() => handleImageLoad(currentStep?.step_id)}
                  onError={() => handleImageError(currentStep?.step_id, displayImageUrl)}
                />

                {/* Step Title Overlay */}
                <div 
                  className="absolute bottom-0 left-0 right-0 p-4"
                  style={{ 
                    background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)' 
                  }}
                >
                  <h4 className="text-lg font-medium" style={{ color: '#e8e9ed' }}>
                    {currentStep?.title}
                  </h4>
                </div>
              </>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Navigation Arrows */}
        {stepsWithVisuals?.length > 1 && (
          <>
            <button
              onClick={goToPrevious}
              disabled={currentStepIndex === 0}
              className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full transition-all disabled:opacity-30 disabled:cursor-not-allowed"
              style={{ 
                backgroundColor: 'rgba(0,0,0,0.5)', 
                backdropFilter: 'blur(4px)' 
              }}
              onMouseEnter={(e) => {
                if (currentStepIndex !== 0) {
                  e.currentTarget.style.backgroundColor = 'rgba(0,0,0,0.7)';
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(0,0,0,0.5)';
              }}
            >
              <ChevronLeft size={24} style={{ color: '#e8e9ed' }} />
            </button>

            <button
              onClick={goToNext}
              disabled={currentStepIndex === stepsWithVisuals?.length - 1}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full transition-all disabled:opacity-30 disabled:cursor-not-allowed"
              style={{ 
                backgroundColor: 'rgba(0,0,0,0.5)', 
                backdropFilter: 'blur(4px)' 
              }}
              onMouseEnter={(e) => {
                if (currentStepIndex !== stepsWithVisuals?.length - 1) {
                  e.currentTarget.style.backgroundColor = 'rgba(0,0,0,0.7)';
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(0,0,0,0.5)';
              }}
            >
              <ChevronRight size={24} style={{ color: '#e8e9ed' }} />
            </button>
          </>
        )}
      </div>
      {/* Step Dots Navigation */}
      {stepsWithVisuals?.length > 1 && (
        <div className="flex justify-center gap-2">
          {stepsWithVisuals?.map((step, idx) => (
            <button
              key={step?.step_id}
              onClick={() => setCurrentStepIndex(idx)}
              className="w-3 h-3 rounded-full transition-all"
              style={{
                backgroundColor: idx === currentStepIndex 
                  ? '#6b7ce8' :'rgba(107, 124, 232, 0.3)'
              }}
              aria-label={`Go to step ${idx + 1}`}
            />
          ))}
        </div>
      )}
      {new URLSearchParams(window.location.search).get('debug') === '1' && currentStep && (
        <div 
          className="rounded-xl p-4 text-xs font-mono"
          style={{ 
            backgroundColor: 'rgba(59, 130, 246, 0.05)', 
            border: '1px solid rgba(59, 130, 246, 0.1)' 
          }}
        >
          <div style={{ color: '#93c5fd', marginBottom: '8px', fontWeight: 'bold' }}>
            Visual Debug
          </div>
          <div style={{ color: '#9ca3af', display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '4px 12px' }}>
            <span>canonical_slug:</span>
            <span style={{ color: '#e8e9ed' }}>{canonicalSlug || 'N/A'}</span>
            
            <span>step_id:</span>
            <span style={{ color: '#e8e9ed' }}>{currentStep?.step_id}</span>
            
            <span>visuals_found:</span>
            <span style={{ color: '#e8e9ed' }}>{stepsWithVisuals?.length}</span>
            
            <span>load_status:</span>
            <span style={{ 
              color: loadStatus === 'loaded' ? '#10b981' : loadStatus === 'error' ? '#ef4444' : '#fbbf24' 
            }}>
              {loadStatus}
            </span>
            
            <span>image_url:</span>
            <span style={{ 
              color: '#e8e9ed', 
              wordBreak: 'break-all',
              fontSize: '10px' 
            }}>
              {displayImageUrl?.substring(0, 100)}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}