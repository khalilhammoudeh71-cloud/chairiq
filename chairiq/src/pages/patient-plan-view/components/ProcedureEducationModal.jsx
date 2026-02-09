import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, Clock, Calendar } from 'lucide-react';
import PatientContent from './PatientContent';
import CategoryVisualDeck from './CategoryVisualDeck';

/**
 * ProcedureEducationModal
 * Displays full procedure education in a modal overlay with enhanced keyboard navigation
 * Features: Arrow key navigation, Enter to activate, Escape to close, smooth scrolling
 */
export default function ProcedureEducationModal({ procedure, language, onClose }) {
  const [activeSection, setActiveSection] = useState('overview');
  const [focusedTabIndex, setFocusedTabIndex] = useState(0);
  const contentRef = useRef(null);
  const tabsRef = useRef([]);
  const modalRef = useRef(null);

  const sections = [
    { id: 'overview', label: language === 'EN' ? 'Overview' : 'Resumen' },
    { id: 'why', label: language === 'EN' ? 'Why You Need This' : 'Por Qué Lo Necesita' },
    { id: 'steps', label: language === 'EN' ? 'What To Expect' : 'Qué Esperar' },
    { id: 'aftercare', label: language === 'EN' ? 'Aftercare' : 'Cuidados Posteriores' },
    { id: 'faqs', label: language === 'EN' ? 'FAQs' : 'Preguntas Frecuentes' }
  ];

  // Scroll content to top when section changes
  useEffect(() => {
    if (contentRef?.current) {
      contentRef?.current?.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [activeSection]);

  // Focus management for tabs
  useEffect(() => {
    const currentIndex = sections?.findIndex(s => s?.id === activeSection);
    setFocusedTabIndex(currentIndex);
  }, [activeSection]);

  // Keyboard navigation handler
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Escape to close modal
      if (e?.key === 'Escape') {
        onClose();
        return;
      }

      // Arrow key navigation between tabs
      if (e?.key === 'ArrowLeft') {
        e?.preventDefault();
        const currentIdx = sections?.findIndex(s => s?.id === activeSection);
        if (currentIdx > 0) {
          const newSection = sections?.[currentIdx - 1];
          setActiveSection(newSection?.id);
          tabsRef?.current?.[currentIdx - 1]?.focus();
        }
      }

      if (e?.key === 'ArrowRight') {
        e?.preventDefault();
        const currentIdx = sections?.findIndex(s => s?.id === activeSection);
        if (currentIdx < sections?.length - 1) {
          const newSection = sections?.[currentIdx + 1];
          setActiveSection(newSection?.id);
          tabsRef?.current?.[currentIdx + 1]?.focus();
        }
      }

      // Enter to activate focused tab
      if (e?.key === 'Enter' && document?.activeElement?.hasAttribute('data-tab-index')) {
        e?.preventDefault();
        const tabIndex = parseInt(document?.activeElement?.getAttribute('data-tab-index'));
        if (!isNaN(tabIndex) && sections?.[tabIndex]) {
          setActiveSection(sections?.[tabIndex]?.id);
        }
      }
    };

    document?.addEventListener('keydown', handleKeyDown);
    return () => document?.removeEventListener('keydown', handleKeyDown);
  }, [activeSection, sections, onClose]);

  // Focus trap within modal
  useEffect(() => {
    const modal = modalRef?.current;
    if (!modal) return;

    const focusableElements = modal?.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabIndex="-1"])'
    );
    const firstElement = focusableElements?.[0];
    const lastElement = focusableElements?.[focusableElements?.length - 1];

    const handleTabKey = (e) => {
      if (e?.key === 'Tab') {
        if (e?.shiftKey && document?.activeElement === firstElement) {
          e?.preventDefault();
          lastElement?.focus();
        } else if (!e?.shiftKey && document?.activeElement === lastElement) {
          e?.preventDefault();
          firstElement?.focus();
        }
      }
    };

    modal?.addEventListener('keydown', handleTabKey);
    firstElement?.focus();

    return () => modal?.removeEventListener('keydown', handleTabKey);
  }, []);

  const getContent = (sectionId) => {
    const lib = procedure?.library;
    if (!lib) return null;

    switch (sectionId) {
      case 'overview':
        return language === 'EN' ? lib?.summaryEn : lib?.summaryEs;
      case 'why':
        return language === 'EN' ? lib?.whyEn : lib?.whyEs;
      case 'steps':
        return lib?.content?.[language] || [];
      case 'aftercare':
        return language === 'EN' ? lib?.aftercareEn : lib?.aftercareEs;
      case 'faqs':
        return language === 'EN' ? lib?.faqsEn : lib?.faqsEs;
      default:
        return null;
    }
  };

  const renderSectionContent = () => {
    const content = getContent(activeSection);
    
    if (!content) {
      return (
        <div className="text-center py-12">
          <p style={{ color: '#9ca3af' }}>
            {language === 'EN' ? 'Content not available' : 'Contenido no disponible'}
          </p>
        </div>
      );
    }

    if (activeSection === 'steps') {
      return (
        <div className="space-y-6">
          <CategoryVisualDeck 
            steps={content}
            language={language}
            canonicalSlug={procedure?.canonicalSlug}
          />
          <PatientContent 
            sections={content}
            language={language}
          />
        </div>
      );
    }

    if (activeSection === 'why' && Array.isArray(content)) {
      return (
        <div className="space-y-4">
          {content?.map((item, idx) => (
            <div 
              key={idx}
              className="rounded-xl p-4"
              style={{ 
                backgroundColor: 'rgba(107, 124, 232, 0.1)', 
                border: '1px solid rgba(107, 124, 232, 0.2)' 
              }}
            >
              <h4 className="font-semibold mb-2" style={{ color: '#8b9aec' }}>
                {item?.title}
              </h4>
              <p style={{ color: '#b0b3ba' }}>{item?.body}</p>
            </div>
          ))}
        </div>
      );
    }

    if (activeSection === 'faqs' && Array.isArray(content)) {
      return (
        <div className="space-y-4">
          {content?.map((faq, idx) => (
            <div 
              key={idx}
              className="rounded-xl p-4"
              style={{ 
                backgroundColor: 'rgba(255,255,255,0.03)', 
                border: '1px solid rgba(255,255,255,0.08)' 
              }}
            >
              <h4 className="font-semibold mb-2" style={{ color: '#e8e9ed' }}>
                {faq?.question}
              </h4>
              <p style={{ color: '#b0b3ba' }}>{faq?.answer}</p>
            </div>
          ))}
        </div>
      );
    }

    // Default text rendering
    return (
      <div 
        className="prose prose-invert max-w-none"
        style={{ color: '#b0b3ba' }}
        dangerouslySetInnerHTML={{ __html: content?.replace(/\n/g, '<br />') }}
      />
    );
  };

  const handleSectionChange = (sectionId) => {
    setActiveSection(sectionId);
    const index = sections?.findIndex(s => s?.id === sectionId);
    if (index >= 0) {
      tabsRef?.current?.[index]?.focus();
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        style={{ backgroundColor: 'rgba(0, 0, 0, 0.85)' }}
        onClick={onClose}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <motion.div
          ref={modalRef}
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="w-full max-w-4xl max-h-[90vh] overflow-hidden rounded-2xl"
          style={{ 
            backgroundColor: '#2a2d35', 
            border: '1px solid rgba(255,255,255,0.1)' 
          }}
          onClick={(e) => e?.stopPropagation()}
        >
          {/* Modal Header */}
          <div 
            className="flex items-center justify-between p-6 border-b"
            style={{ borderColor: 'rgba(255,255,255,0.1)' }}
          >
            <div>
              <h2 
                id="modal-title"
                className="text-3xl font-medium" 
                style={{ color: '#e8e9ed', fontWeight: 500 }}
              >
                {procedure?.displayTitle || procedure?.procedureName}
              </h2>
              {procedure?.adaCode && (
                <p className="text-sm mt-1" style={{ color: '#9ca3af' }}>
                  ADA Code: {procedure?.adaCode}
                </p>
              )}
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-xl transition-all"
              style={{ 
                backgroundColor: 'rgba(239, 68, 68, 0.1)', 
                color: '#fca5a5' 
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.2)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.1)';
              }}
              aria-label={language === 'EN' ? 'Close modal' : 'Cerrar modal'}
              title={language === 'EN' ? 'Press Escape to close' : 'Presiona Escape para cerrar'}
            >
              <X size={24} />
            </button>
          </div>

          {/* Time and Visits Info */}
          {(procedure?.library?.timeEstimate || procedure?.library?.visitsEstimate) && (
            <div 
              className="flex gap-4 p-4 border-b"
              style={{ 
                backgroundColor: 'rgba(107, 124, 232, 0.05)', 
                borderColor: 'rgba(255,255,255,0.1)' 
              }}
            >
              {procedure?.library?.timeEstimate && (
                <div className="flex items-center gap-2">
                  <Clock size={18} style={{ color: '#8b9aec' }} />
                  <span style={{ color: '#b0b3ba' }}>{procedure?.library?.timeEstimate}</span>
                </div>
              )}
              {procedure?.library?.visitsEstimate && (
                <div className="flex items-center gap-2">
                  <Calendar size={18} style={{ color: '#8b9aec' }} />
                  <span style={{ color: '#b0b3ba' }}>{procedure?.library?.visitsEstimate}</span>
                </div>
              )}
            </div>
          )}

          {/* Section Tabs */}
          <div 
            className="flex overflow-x-auto border-b"
            style={{ borderColor: 'rgba(255,255,255,0.1)' }}
            role="tablist"
            aria-label={language === 'EN' ? 'Procedure information sections' : 'Secciones de información del procedimiento'}
          >
            {sections?.map((section, index) => (
              <button
                key={section?.id}
                ref={(el) => (tabsRef.current[index] = el)}
                onClick={() => handleSectionChange(section?.id)}
                className="px-6 py-4 font-medium whitespace-nowrap transition-all focus:border-accent focus:outline-none"
                style={{
                  color: activeSection === section?.id ? '#8b9aec' : '#9ca3af',
                  backgroundColor: activeSection === section?.id ? 'rgba(107, 124, 232, 0.1)' : 'transparent',
                  borderBottom: activeSection === section?.id ? '2px solid #8b9aec' : '2px solid transparent',
                  outlineColor: '#8b9aec',
                  outlineOffset: '-2px'
                }}
                role="tab"
                aria-selected={activeSection === section?.id}
                aria-controls={`section-${section?.id}`}
                data-tab-index={index}
                tabIndex={activeSection === section?.id ? 0 : -1}
                title={language === 'EN' 
                  ? `Use arrow keys to navigate. Press Enter to activate.`
                  : `Use las flechas para navegar. Presione Enter para activar.`
                }
              >
                {section?.label}
              </button>
            ))}
          </div>

          {/* Modal Content */}
          <motion.div
            ref={contentRef}
            className="p-6 overflow-y-auto scroll-smooth"
            style={{ maxHeight: 'calc(90vh - 300px)' }}
            id={`section-${activeSection}`}
            role="tabpanel"
            aria-labelledby={`tab-${activeSection}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            key={activeSection}
          >
            {renderSectionContent()}
          </motion.div>

          {/* Modal Footer */}
          <div 
            className="flex justify-between items-center p-4 border-t"
            style={{ 
              borderColor: 'rgba(255,255,255,0.1)',
              backgroundColor: 'rgba(255,255,255,0.02)'
            }}
          >
            <button
              onClick={() => {
                const currentIdx = sections?.findIndex(s => s?.id === activeSection);
                if (currentIdx > 0) {
                  handleSectionChange(sections?.[currentIdx - 1]?.id);
                }
              }}
              disabled={sections?.findIndex(s => s?.id === activeSection) === 0}
              className="flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed focus:border-accent focus:outline-none"
              style={{ 
                backgroundColor: 'rgba(107, 124, 232, 0.15)', 
                color: '#8b9aec'
              }}
              aria-label={language === 'EN' ? 'Go to previous section' : 'Ir a la sección anterior'}
            >
              <ChevronLeft size={20} />
              {language === 'EN' ? 'Previous' : 'Anterior'}
            </button>
            
            <div className="text-sm" style={{ color: '#9ca3af' }}>
              {language === 'EN' ?'Use arrow keys to navigate | Press Escape to close' :'Use flechas para navegar | Presione Escape para cerrar'
              }
            </div>
            
            <button
              onClick={() => {
                const currentIdx = sections?.findIndex(s => s?.id === activeSection);
                if (currentIdx < sections?.length - 1) {
                  handleSectionChange(sections?.[currentIdx + 1]?.id);
                }
              }}
              disabled={sections?.findIndex(s => s?.id === activeSection) === sections?.length - 1}
              className="flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed focus:border-accent focus:outline-none"
              style={{ 
                backgroundColor: 'rgba(107, 124, 232, 0.15)', 
                color: '#8b9aec'
              }}
              aria-label={language === 'EN' ? 'Go to next section' : 'Ir a la siguiente sección'}
            >
              {language === 'EN' ? 'Next' : 'Siguiente'}
              <ChevronRight size={20} />
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}