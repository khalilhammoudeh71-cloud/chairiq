import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AlertCircle, ArrowLeft, Languages } from 'lucide-react';
import procedureLibraryService from '../../services/procedureLibraryService';
import ProcedureHero from '../individual-procedure-detail/components/ProcedureHero';
import ProcedureExplanation from '../individual-procedure-detail/components/ProcedureExplanation';
import WhyThisTreatment from '../individual-procedure-detail/components/WhyThisTreatment';
import WhatToExpect from '../individual-procedure-detail/components/WhatToExpect';
import VisualGallery from '../individual-procedure-detail/components/VisualGallery';

const EnhancedPatientProcedureDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [procedure, setProcedure] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [language, setLanguage] = useState('EN');

  useEffect(() => {
    loadProcedure();
  }, [slug]);

  const loadProcedure = async () => {
    try {
      setLoading(true);
      setError('');
      
      const data = await procedureLibraryService?.getBySlug(slug);
      setProcedure(data);
    } catch (err) {
      setError('Procedure not found');
      console.error('Error loading procedure:', err);
    } finally {
      setLoading(false);
    }
  };

  // Get content based on selected language
  const getLocalizedContent = () => {
    if (!procedure) return null;

    const isEnglish = language === 'EN';
    
    return {
      title: isEnglish ? procedure?.titleEn : procedure?.titleEs,
      summary: isEnglish ? procedure?.summaryEn : procedure?.summaryEs,
      why: isEnglish ? procedure?.whyEn : procedure?.whyEs,
      whatIfNot: isEnglish ? procedure?.whatIfNotEn : procedure?.whatIfNotEs,
      steps: isEnglish ? procedure?.stepsEn : procedure?.stepsEs,
      anesthesia: isEnglish ? procedure?.anesthesiaEn : procedure?.anesthesiaEs,
      risks: isEnglish ? procedure?.risksEn : procedure?.risksEs,
      aftercare: isEnglish ? procedure?.aftercareEn : procedure?.aftercareEs,
      faqs: isEnglish ? procedure?.faqsEn : procedure?.faqsEs,
      timeEstimate: procedure?.timeEstimate,
      visitsEstimate: procedure?.visitsEstimate,
      visuals: procedure?.visuals,
    };
  };

  const content = getLocalizedContent();

  if (loading) {
    return (
      <div className="min-h-screen bg-bg0 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto mb-4"></div>
          <p className="text-t2">Loading procedure details...</p>
        </div>
      </div>
    );
  }

  if (error || !procedure) {
    return (
      <div className="min-h-screen bg-bg0 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <AlertCircle className="w-16 h-16 text-danger mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-t1 mb-2">
            Procedure Not Found
          </h2>
          <p className="text-t2 mb-6">
            We could not find the procedure you are looking for. It may have been removed or the link is incorrect.
          </p>
          <button
            onClick={() => navigate(-1)}
            className="flex items-center space-x-2 px-6 py-3 bg-accent text-white rounded-lg hover:brightness-110 transition-colors mx-auto"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Go Back</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg0">
      {/* Language Toggle */}
      <div className="bg-bg1 border-b border-bd">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center space-x-2 text-t2 hover:text-t1 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back</span>
          </button>

          <div className="flex items-center space-x-2">
            <Languages className="w-5 h-5 text-t2" />
            <button
              onClick={() => setLanguage('EN')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                language === 'EN' ? 'bg-accent text-white' : 'bg-bg2 text-t2 hover:bg-bg3'
              }`}
            >
              English
            </button>
            <button
              onClick={() => setLanguage('ES')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                language === 'ES' ? 'bg-accent text-white' : 'bg-bg2 text-t2 hover:bg-bg3'
              }`}
            >
              Español
            </button>
          </div>
        </div>
      </div>
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Hero Section */}
        {content?.visuals?.heroKey && (
          <ProcedureHero
            procedure={procedure}
            procedureName={content?.title}
            description={content?.summary}
            duration={content?.timeEstimate}
            visits={content?.visitsEstimate}
            imageUrl={content?.visuals?.heroKey}
          />
        )}

        {/* Main Content */}
        <div className="space-y-8">
          {content?.why && (
            <WhyThisTreatment
              content={content?.why}
              title={language === 'EN' ? 'Why You Need This Treatment' : 'Por Qué Necesita Este Tratamiento'}
            />
          )}

          {content?.whatIfNot && (
            <ProcedureExplanation
              content={content?.whatIfNot}
              title={language === 'EN' ? 'What If I Do Not Get This Treatment?' : '¿Qué Pasa Si No Me Hago Este Tratamiento?'}
            />
          )}

          {content?.steps && content?.steps?.length > 0 && (
            <WhatToExpect
              steps={content?.steps}
              title={language === 'EN' ? 'Step by Step: What to Expect' : 'Paso a Paso: Qué Esperar'}
            />
          )}

          {content?.anesthesia && (
            <ProcedureExplanation
              content={content?.anesthesia}
              title={language === 'EN' ? 'Anesthesia & Comfort' : 'Anestesia y Comodidad'}
            />
          )}

          {content?.risks && (
            <ProcedureExplanation
              content={content?.risks}
              title={language === 'EN' ? 'Risks & Considerations' : 'Riesgos y Consideraciones'}
            />
          )}

          {content?.aftercare && (
            <ProcedureExplanation
              content={content?.aftercare}
              title={language === 'EN' ? 'Aftercare Instructions' : 'Instrucciones de Cuidado Posterior'}
            />
          )}

          {content?.faqs && content?.faqs?.length > 0 && (
            <div className="card p-6">
              <h2 className="text-2xl font-bold text-t1 mb-4">
                {language === 'EN' ? 'Frequently Asked Questions' : 'Preguntas Frecuentes'}
              </h2>
              <div className="space-y-4">
                {content?.faqs?.map((faq, index) => (
                  <div key={index} className="border-b border-bd pb-4 last:border-0">
                    <h3 className="font-semibold text-t1 mb-2">
                      {faq?.q}
                    </h3>
                    <p className="text-t2">
                      {faq?.a}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {content?.visuals?.stepKeys && content?.visuals?.stepKeys?.length > 0 && (
            <VisualGallery 
              images={content?.visuals?.stepKeys} 
              currentLanguage={language}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default EnhancedPatientProcedureDetail;