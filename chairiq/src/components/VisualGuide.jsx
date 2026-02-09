import React, { useState, useEffect, useRef } from 'react';
import { X, ChevronRight, Volume2 } from 'lucide-react';
import { generateSpeechAudio, revokeAudioUrl } from '../services/ttsService';
import EnhancedImageViewer from './EnhancedImageViewer';

const VisualGuide = ({ steps = [], language = 'en' }) => {
  const [selectedStep, setSelectedStep] = useState(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isLoadingAudio, setIsLoadingAudio] = useState(false);
  const [showEnhancedViewer, setShowEnhancedViewer] = useState(false);
  const audioRef = useRef(null);
  const currentAudioUrlRef = useRef(null);
  
  const handleStepClick = (step) => {
    setSelectedStep({ ...step, number: steps?.indexOf(step) + 1 });
  };

  const handleCloseModal = () => {
    setSelectedStep(null);
    stopSpeaking();
    setShowEnhancedViewer(false);
  };

  const handleKeyDown = (e) => {
    if (e?.key === 'Escape') {
      handleCloseModal();
    }
  };

  const handleBackdropClick = (e) => {
    if (e?.target === e?.currentTarget) {
      handleCloseModal();
    }
  };

  const stopSpeaking = () => {
    // Stop audio playback
    if (audioRef?.current) {
      audioRef?.current?.pause();
      audioRef.current.currentTime = 0;
    }
    
    // Cleanup audio URL
    if (currentAudioUrlRef?.current) {
      revokeAudioUrl(currentAudioUrlRef?.current);
      currentAudioUrlRef.current = null;
    }
    
    setIsSpeaking(false);
    setIsLoadingAudio(false);
  };

  const speakDescription = async (text, lang) => {
    if (!text) return;

    // Stop any existing audio
    stopSpeaking();
    setIsLoadingAudio(true);

    try {
      // Generate audio using OpenAI TTS with natural female voice
      const audioUrl = await generateSpeechAudio(text, lang);
      currentAudioUrlRef.current = audioUrl;

      // Create and play audio
      const audio = new Audio(audioUrl);
      audioRef.current = audio;

      audio.onloadeddata = () => {
        setIsLoadingAudio(false);
        setIsSpeaking(true);
      };

      audio.onended = () => {
        setIsSpeaking(false);
        revokeAudioUrl(currentAudioUrlRef?.current);
        currentAudioUrlRef.current = null;
      };

      audio.onerror = () => {
        setIsSpeaking(false);
        setIsLoadingAudio(false);
        revokeAudioUrl(currentAudioUrlRef?.current);
        currentAudioUrlRef.current = null;
      };

      await audio?.play();
    } catch (error) {
      setIsLoadingAudio(false);
      setIsSpeaking(false);
      // Error is already logged in the service
    }
  };

  const handleImageClick = () => {
    setShowEnhancedViewer(true);
  };

  const modalDescription = selectedStep?.visualSrc 
    ? selectedStep?.visualAlt || selectedStep?.description_en || selectedStep?.description_es
    : selectedStep?.diagramSvg 
      ? 'Educational diagram showing the procedure steps' :'Your dentist will provide visual guidance during the procedure';

  const currentTitle = language === 'en' ? selectedStep?.title_en : selectedStep?.title_es;
  const currentDescription = language === 'en' ? selectedStep?.description_en : selectedStep?.description_es;

  // Check if visualSrc is an array (multiple images) or a single image
  const isMultipleImages = Array.isArray(selectedStep?.visualSrc);
  const hasVisualSrc = selectedStep?.visualSrc && (isMultipleImages ? selectedStep?.visualSrc?.length > 0 : true);

  // Convert current step to image format for enhanced viewer
  const getViewerImages = () => {
    if (!selectedStep) return [];
    
    // Collect all images from the current step
    const images = [];
    
    if (selectedStep?.visualSrc) {
      // Handle array of images (multiple visuals)
      if (Array.isArray(selectedStep?.visualSrc)) {
        selectedStep?.visualSrc?.forEach(imgObj => {
          images?.push({
            src: imgObj?.src,
            alt: imgObj?.alt || modalDescription
          });
        });
      } else {
        // Handle single image (string)
        images?.push({
          src: selectedStep?.visualSrc,
          alt: selectedStep?.visualAlt || modalDescription
        });
      }
    }
    
    return images;
  };

  // Cleanup audio on unmount
  useEffect(() => {
    return () => {
      stopSpeaking();
    };
  }, []);

  return (
    <>
      <div className="space-y-4">
        {steps?.map((step, index) => {
          const title = language === 'en' ? step?.title_en : step?.title_es;
          const description = language === 'en' ? step?.description_en : step?.description_es;

          return (
            <div
              key={index}
              onClick={() => handleStepClick(step)}
              className="bg-bg2 rounded p-5 hover:bg-bg3 cursor-pointer border border-bd group"
              role="button"
              tabIndex={0}
              onKeyPress={(e) => {
                if (e?.key === 'Enter' || e?.key === ' ') {
                  handleStepClick(step);
                }
              }}
              aria-label={`${title}: ${description}`}
            >
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-success/10 border border-success/20 flex items-center justify-center">
                  <span className="text-sm font-bold text-success">
                    {index + 1}
                  </span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-base font-bold text-t1">
                      {title}
                    </h3>
                    <ChevronRight className="w-4 h-4 text-t3 flex-shrink-0 ml-2" />
                  </div>
                  <p className="text-sm font-medium text-t3 line-clamp-2">
                    {description}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal */}
      {selectedStep && !showEnhancedViewer && (
        <div
          className="fixed inset-0 bg-[var(--overlay)] z-50 flex items-center justify-center p-4"
          onClick={handleBackdropClick}
          onKeyDown={handleKeyDown}
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
          aria-describedby="modal-description"
        >
          <div
            className="bg-bg3 rounded max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-bd"
            onClick={(e) => e?.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="sticky top-0 bg-bg3 border-b border-bd p-4 flex items-center justify-between z-10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-success/10 border border-success/20 flex items-center justify-center">
                  <span className="text-lg font-bold text-success">
                    {selectedStep?.number}
                  </span>
                </div>
                <h3 id="modal-title" className="text-xl font-bold text-t1">
                  {currentTitle}
                </h3>
              </div>
              <div className="flex items-center gap-2">
                {/* Audio Description Button with OpenAI TTS */}
                <button
                  onClick={() => speakDescription(`${currentTitle}. ${currentDescription}. ${modalDescription}`, language)}
                  disabled={isLoadingAudio}
                  className={`p-2 rounded-lg transition-colors ${
                    isSpeaking 
                      ? 'bg-success/10 text-success border border-success/20' 
                      : isLoadingAudio
                        ? 'bg-bg2/50 text-t3 cursor-wait' :'hover:bg-bg2/80 text-t3 hover:text-t1'
                  }`}
                  aria-label={language === 'en' ? 'Play audio description' : 'Reproducir descripción de audio'}
                >
                  <Volume2 className={`w-5 h-5 ${isSpeaking ? 'animate-pulse' : isLoadingAudio ? 'animate-spin' : ''}`} />
                </button>
                <button
                  onClick={handleCloseModal}
                  className="p-2 hover:bg-bg2/80 text-t3 hover:text-t1 rounded-lg transition-colors"
                  aria-label={language === 'en' ? 'Close' : 'Cerrar'}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* FULL STEP IMAGE - LARGE, UNCROPPED, CENTERED with enhanced viewing */}
            {hasVisualSrc && (
              <figure className="relative w-full bg-bg2/30">
                {isMultipleImages ? (
                  // Multiple images - side by side layout
                  <div 
                    className="grid grid-cols-1 md:grid-cols-2 gap-4 p-6 cursor-pointer group"
                    onClick={handleImageClick}
                  >
                    {selectedStep?.visualSrc?.map((imgObj, idx) => (
                      <div key={idx} className="relative">
                        <img
                          src={imgObj?.src}
                          alt={imgObj?.alt || modalDescription}
                          className="w-full h-auto max-h-[500px] object-contain rounded-lg border border-bd/30"
                          loading="eager"
                        />
                      </div>
                    ))}
                  </div>
                ) : (
                  // Single image - centered layout
                  <div 
                    className="relative cursor-pointer group"
                    onClick={handleImageClick}
                  >
                    <img
                      src={selectedStep?.visualSrc}
                      alt={selectedStep?.visualAlt || modalDescription}
                      className="max-w-full max-h-[600px] w-auto h-auto object-contain mx-auto p-6"
                      loading="eager"
                    />
                  </div>
                )}
                {/* Image Caption */}
                <figcaption className="px-6 pb-4 text-sm text-t3 italic text-center border-t border-bd/50 bg-bg2/30">
                  {selectedStep?.visualAlt || modalDescription}
                </figcaption>
              </figure>
            )}

            {/* Fallback for procedures without realistic illustrations yet */}
            {!hasVisualSrc && selectedStep?.diagramSvg && (
              <figure className="w-full bg-bg2/30">
                <div 
                  className="p-4"
                  dangerouslySetInnerHTML={{ __html: selectedStep?.diagramSvg }}
                  role="img"
                  aria-label="Educational diagram showing the procedure steps"
                />
                <figcaption className="px-6 pb-4 text-sm text-t3 italic text-center border-t border-bd/50">
                  Educational diagram showing the procedure steps
                </figcaption>
              </figure>
            )}

            {/* Educational explanation below image */}
            <div className="p-6" id="modal-description">
              <div className="prose prose-invert prose-teal max-w-none">
                <p className="text-t3 text-base leading-relaxed">
                  {currentDescription}
                </p>
              </div>
            </div>

            {/* Close Button */}
            <div className="p-6 border-t border-bd/50 flex justify-end gap-3">
              {isSpeaking && (
                <button
                  onClick={stopSpeaking}
                  className="px-6 py-2 bg-danger hover:brightness-110 text-white rounded transition-colors font-medium"
                >
                  {language === 'en' ? 'Stop Audio' : 'Detener Audio'}
                </button>
              )}
              <button
                onClick={handleCloseModal}
                className="px-6 py-2 bg-success hover:brightness-110 text-white rounded transition-colors font-medium"
              >
                {language === 'en' ? 'Close' : 'Cerrar'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Enhanced Image Viewer */}
      {showEnhancedViewer && selectedStep && (
        <EnhancedImageViewer
          images={getViewerImages()}
          title={currentTitle}
          onClose={() => setShowEnhancedViewer(false)}
          language={language}
        />
      )}
    </>
  );
};

export default VisualGuide;