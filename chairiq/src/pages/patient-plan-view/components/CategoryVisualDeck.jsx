import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import { generateVisualDescription } from '../../../services/visualDescriptionService';
import { trackEvent } from '../../../utils/analytics';

export default function CategoryVisualDeck({ steps, language, canonicalSlug, routeAlias }) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [imageLoadStatus, setImageLoadStatus] = useState({});
  const [aiDescriptions, setAiDescriptions] = useState({});
  const [loadingDescriptions, setLoadingDescriptions] = useState({});
  const initialViewTracked = useRef(false);

  // ✅ FIX: Filter steps that have visuals using step_id matching
  const stepsWithVisuals = steps?.filter(step => step?.visual?.image_url) || [];

  // ✅ FIX: Show per-step "Visual coming soon" message for steps without visuals
  const hasAnyVisuals = stepsWithVisuals?.length > 0;

  useEffect(() => {
    if (!hasAnyVisuals || initialViewTracked.current) return;
    initialViewTracked.current = true;
    trackEvent('procedure_visual_viewed', {
      step_number: 1,
      direction: 'initial',
    }, routeAlias ? { routeAlias } : undefined);
  }, [hasAnyVisuals, routeAlias]);

  // If NO visuals at all for this procedure, show friendly placeholder
  if (!hasAnyVisuals) {
    return (
      <div className="rounded-xl p-6 text-center bg-accent-soft border border-accent/10">
        <p className="text-t2 text-sm">
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
    setImageLoadStatus(prev => ({ ...prev, [stepId]: 'loaded' }));
  };

  const handleImageError = (stepId, imageUrl) => {
    setImageLoadStatus(prev => ({ ...prev, [stepId]: 'error' }));
    console.error(`🚨 [IMAGE ERROR] Failed to load image for step ${stepId}:`, {
      image_url: imageUrl,
      canonical_slug: canonicalSlug,
      step_index: currentStepIndex
    });
  };

  const goToNext = () => {
    if (currentStepIndex < stepsWithVisuals?.length - 1) {
      trackEvent('procedure_visual_viewed', {
        step_number: currentStepIndex + 2,
        direction: 'next',
      }, routeAlias ? { routeAlias } : undefined);
      setCurrentStepIndex(currentStepIndex + 1);
    }
  };

  const goToPrevious = () => {
    if (currentStepIndex > 0) {
      trackEvent('procedure_visual_viewed', {
        step_number: currentStepIndex,
        direction: 'previous',
      }, routeAlias ? { routeAlias } : undefined);
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
        className="relative rounded-2xl overflow-hidden bg-bg2 border border-bd"
        style={{ minHeight: '300px' }}
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
                className="absolute inset-0 flex flex-col items-center justify-center p-8 bg-accent-soft backdrop-blur-sm"
              >
                <div className="max-w-2xl text-center space-y-4">
                  {/* AI Icon */}
                  <div className="w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4 bg-accent-soft border-2 border-accent/30">
                    <Sparkles size={32} className="text-accent" />
                  </div>

                  {/* Loading State */}
                  {isLoadingDescription && (
                    <div className="space-y-3">
                      <div className="h-8 w-8 border-4 border-accent/30 border-t-accent rounded-full animate-spin mx-auto" />
                      <p className="text-sm text-t2">
                        {language === 'EN' ? 'Generating visual description...' : 'Generando descripción visual...'}
                      </p>
                    </div>
                  )}

                  {/* AI Description Content */}
                  {!isLoadingDescription && aiDescription && (
                    <>
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full mb-3 bg-accent-soft">
                        <Sparkles size={14} className="text-accent" />
                        <span className="text-xs font-medium text-accent">
                          {language === 'EN' ? 'AI-Generated Visual Description' : 'Descripción Visual Generada por IA'}
                        </span>
                      </div>

                      <h4 className="text-xl font-medium mb-3 text-t1">
                        {currentStep?.title}
                      </h4>

                      <div className="text-base leading-relaxed p-6 rounded-xl text-t2 bg-bg1 border border-accent/20">
                        {aiDescription}
                      </div>

                      <p className="text-xs mt-4 text-t3">
                        {language === 'EN'
                          ? 'This description helps you visualize what patients typically see during this step.'
                          : 'Esta descripción te ayuda a visualizar lo que los pacientes suelen ver durante este paso.'}
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
                  <div className="absolute inset-0 flex items-center justify-center bg-bg3/50">
                    <div className="h-8 w-8 border-4 border-accent/30 border-t-accent rounded-full animate-spin" />
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
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/70 to-transparent">
                  <h4 className="text-lg font-medium text-white">
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
              className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full transition-all disabled:opacity-30 disabled:cursor-not-allowed bg-black/50 hover:bg-black/70 backdrop-blur-sm"
            >
              <ChevronLeft size={24} className="text-white" />
            </button>

            <button
              onClick={goToNext}
              disabled={currentStepIndex === stepsWithVisuals?.length - 1}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full transition-all disabled:opacity-30 disabled:cursor-not-allowed bg-black/50 hover:bg-black/70 backdrop-blur-sm"
            >
              <ChevronRight size={24} className="text-white" />
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
              onClick={() => {
                if (idx === currentStepIndex) return;
                trackEvent('procedure_visual_viewed', {
                  step_number: idx + 1,
                  direction: 'direct',
                }, routeAlias ? { routeAlias } : undefined);
                setCurrentStepIndex(idx);
              }}
              className={`w-3 h-3 rounded-full transition-all ${
                idx === currentStepIndex ? 'bg-accent' : 'bg-accent/30'
              }`}
              aria-label={`Go to step ${idx + 1}`}
            />
          ))}
        </div>
      )}

      {/* Debug panel */}
      {new URLSearchParams(window.location.search).get('debug') === '1' && currentStep && (
        <div className="rounded-xl p-4 text-xs font-mono bg-accent-soft border border-accent/10">
          <div className="text-accent font-bold mb-2">Visual Debug</div>
          <div className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 text-t3">
            <span>canonical_slug:</span>
            <span className="text-t1">{canonicalSlug || 'N/A'}</span>
            <span>step_id:</span>
            <span className="text-t1">{currentStep?.step_id}</span>
            <span>visuals_found:</span>
            <span className="text-t1">{stepsWithVisuals?.length}</span>
            <span>load_status:</span>
            <span className={loadStatus === 'loaded' ? 'text-success' : loadStatus === 'error' ? 'text-danger' : 'text-warning'}>
              {loadStatus}
            </span>
            <span>image_url:</span>
            <span className="text-t1 break-all text-[10px]">
              {displayImageUrl?.substring(0, 100)}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
