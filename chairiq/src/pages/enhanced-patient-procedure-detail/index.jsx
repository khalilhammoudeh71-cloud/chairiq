import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AlertCircle, ArrowLeft, Languages, ShieldCheck } from 'lucide-react';
import procedureLibraryService from '../../services/procedureLibraryService';
import ProcedureHero from '../individual-procedure-detail/components/ProcedureHero';
import ProcedureExplanation from '../individual-procedure-detail/components/ProcedureExplanation';
import WhyThisTreatment from '../individual-procedure-detail/components/WhyThisTreatment';
import WhatToExpect from '../individual-procedure-detail/components/WhatToExpect';
import VisualGallery from '../individual-procedure-detail/components/VisualGallery';
import ProcedureThumb from '../../components/ProcedureThumb';

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
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 rounded-full border-2 border-accent border-t-transparent animate-spin" />
          <p className="text-t3 text-sm">Loading procedure details…</p>
        </div>
      </div>
    );
  }

  if (error || !procedure) {
    return (
      <div className="min-h-screen bg-bg0 flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center">
          <div className="flex items-center justify-center gap-2.5 mb-10">
            <ShieldCheck size={26} className="text-accent" />
            <span className="text-lg font-semibold tracking-tight text-t1">ChairIQ</span>
          </div>
          <div className="card rounded-2xl p-8 mb-8 bg-danger/5 border border-danger/15">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 bg-danger/10">
              <AlertCircle size={32} className="text-danger" />
            </div>
            <h2 className="text-2xl font-semibold mb-3 text-t1">Procedure Not Found</h2>
            <p className="text-t2 mb-6 leading-relaxed">
              We could not find the procedure you are looking for. It may have been removed or the link is incorrect.
            </p>
            <button
              onClick={() => navigate(-1)}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold bg-accent transition-all hover:brightness-105"
              style={{ color: 'var(--accent-ink)' }}
            >
              <ArrowLeft size={18} />
              Go Back
            </button>
          </div>
          <p className="text-xs text-t3">Powered by ChairIQ</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg0">
      {/* Top Nav */}
      <div className="bg-bg1 border-b border-bd shadow-sm sticky top-0 z-20">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          {/* Left: Logo + back */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-1.5 text-t3 hover:text-t1 transition-colors text-sm font-medium"
            >
              <ArrowLeft size={16} />
              <span className="hidden sm:inline">Back</span>
            </button>
            <div className="h-4 w-px bg-bd hidden sm:block" />
            <div className="hidden sm:flex items-center gap-2">
              <ShieldCheck size={18} className="text-accent" />
              <span className="text-sm font-semibold text-t1 tracking-tight">ChairIQ</span>
            </div>
          </div>

          {/* Right: Language toggle */}
          <div className="flex items-center gap-2">
            <Languages size={16} className="text-t3" />
            <div className="flex rounded-lg overflow-hidden border border-bd bg-bg2 p-0.5 gap-0.5">
              <button
                onClick={() => setLanguage('EN')}
                className="px-3 py-1.5 rounded-md font-medium text-sm transition-all"
                style={language === 'EN'
                  ? { backgroundColor: 'var(--accent)', color: 'var(--accent-ink)' }
                  : { backgroundColor: 'transparent', color: 'var(--t2)' }
                }
              >
                EN
              </button>
              <button
                onClick={() => setLanguage('ES')}
                className="px-3 py-1.5 rounded-md font-medium text-sm transition-all"
                style={language === 'ES'
                  ? { backgroundColor: 'var(--accent)', color: 'var(--accent-ink)' }
                  : { backgroundColor: 'transparent', color: 'var(--t2)' }
                }
              >
                ES
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Hero Section */}
        {!content?.visuals?.heroKey && (
          <div className="relative mb-8 overflow-hidden rounded-2xl border border-accent/20">
            <ProcedureThumb
              canonicalSlug={procedure?.canonicalSlug}
              slug={procedure?.slug}
              name={procedure?.titleEn}
              alt={content?.title || ''}
              size="hero"
              glow={false}
              className="!rounded-none !border-0"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[rgba(4,7,10,0.85)] via-transparent to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-6">
              <h1 className="text-2xl md:text-3xl font-bold text-white mb-0 tracking-tight">{content?.title}</h1>
            </div>
          </div>
        )}
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

        {/* Quick-facts strip */}
        {(content?.timeEstimate || content?.visitsEstimate) && (
          <div className="flex flex-wrap gap-3 mb-8 -mt-2">
            {content?.timeEstimate && (
              <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-accent-soft border border-accent/20 text-sm">
                <span className="text-accent font-semibold">{language === 'EN' ? 'Duration' : 'Duración'}:</span>
                <span className="text-t1">{content.timeEstimate}</span>
              </div>
            )}
            {content?.visitsEstimate && (
              <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-accent-soft border border-accent/20 text-sm">
                <span className="text-accent font-semibold">{language === 'EN' ? 'Visits' : 'Visitas'}:</span>
                <span className="text-t1">{content.visitsEstimate}</span>
              </div>
            )}
          </div>
        )}

        {/* Main Content */}
        <div className="space-y-6">
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

        {/* Footer */}
        <div className="mt-16 pt-8 border-t border-bd text-center">
          <p className="text-xs text-t3">Powered by ChairIQ</p>
        </div>
      </div>
    </div>
  );
};

export default EnhancedPatientProcedureDetail;
