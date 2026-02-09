import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';



import ContextualNavigation from '../../components/ui/ContextualNavigation';
import VisualGuide from '../../components/VisualGuide';
import AccessibilityControls from '../../components/AccessibilityControls';
import Icon from '../../components/AppIcon';

import { demoTreatmentPlan } from '../../data/treatmentPlan';
import { getProcedureById } from '../../data/procedures';
import ProcedureHero from './components/ProcedureHero';
import { patientLearningProfileService } from '../../services/patientLearningProfileService';
import { aiPersonalizationService } from '../../services/aiPersonalizationService';



const IndividualProcedureDetail = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [currentLanguage, setCurrentLanguage] = useState('en');
  const [currentProcedureIndex, setCurrentProcedureIndex] = useState(0);
  const [personalizedContent, setPersonalizedContent] = useState(null);
  const [isPersonalizing, setIsPersonalizing] = useState(false);
  const [personalizationError, setPersonalizationError] = useState(null);

  const procedures = demoTreatmentPlan?.procedureIds?.map(id => getProcedureById(id));

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
    const params = new URLSearchParams(location.search);
    const procedureId = params?.get('procedure');
    if (procedureId) {
      const index = procedures?.findIndex((p) => p?.id === procedureId);
      if (index !== -1) {
        setCurrentProcedureIndex(index);
      }
    }
  }, [location?.search]);

  useEffect(() => {
    const personalizeContent = async () => {
      const patientId = localStorage.getItem('chairiq-patient-id');
      const treatmentPlanId = localStorage.getItem('chairiq-treatment-plan-id');
      
      if (!patientId || !treatmentPlanId || !procedures?.[currentProcedureIndex]) {
        return;
      }

      setIsPersonalizing(true);
      setPersonalizationError(null);

      try {
        const learningProfile = await patientLearningProfileService?.getPatientLearningProfile(
          patientId,
          treatmentPlanId
        );

        const procedureEngagementHistory = await patientLearningProfileService?.getProcedureEngagementHistory(
          patientId,
          procedures?.[currentProcedureIndex]?.id
        );

        const baseContent = {
          explanation: currentLanguage === 'en' ? procedures?.[currentProcedureIndex]?.description_en : procedures?.[currentProcedureIndex]?.description_es,
          expectations: [
            {
              phase: currentLanguage === 'en' ? 'Initial Assessment' : 'Evaluación Inicial',
              description: currentLanguage === 'en' ? procedures?.[currentProcedureIndex]?.what_to_expect_en : procedures?.[currentProcedureIndex]?.what_to_expect_es,
              duration: procedures?.[currentProcedureIndex]?.duration,
            },
          ],
          aftercare: currentLanguage === 'en' ? procedures?.[currentProcedureIndex]?.aftercare_en : procedures?.[currentProcedureIndex]?.aftercare_es,
        };

        const personalized = await aiPersonalizationService?.generatePersonalizedContent({
          procedureName: currentLanguage === 'en' ? procedures?.[currentProcedureIndex]?.name_en : procedures?.[currentProcedureIndex]?.name_es,
          baseContent,
          learningProfile,
          procedureEngagementHistory,
          language: currentLanguage,
        });

        setPersonalizedContent(personalized);
      } catch (error) {
        console.error('Failed to personalize content:', error);
        setPersonalizationError(error?.message);
      } finally {
        setIsPersonalizing(false);
      }
    };

    personalizeContent();
  }, [currentProcedureIndex, currentLanguage]);

  const currentProcedure = procedures?.[currentProcedureIndex];

  const handlePrevious = () => {
    if (currentProcedureIndex > 0) {
      const prevProcedure = procedures?.[currentProcedureIndex - 1];
      navigate(`/individual-procedure-detail?procedure=${prevProcedure?.id}`);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleNext = () => {
    if (currentProcedureIndex < procedures?.length - 1) {
      const nextProcedure = procedures?.[currentProcedureIndex + 1];
      navigate(`/individual-procedure-detail?procedure=${nextProcedure?.id}`);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const navigationLabels = currentLanguage === 'en'
    ? { previous: 'Previous Procedure', next: 'Next Procedure', overview: 'Back to Overview' }
    : { previous: 'Procedimiento Anterior', next: 'Siguiente Procedimiento', overview: 'Volver a la Vista General' };

  const pageTitle = currentLanguage === 'en' 
    ? `${currentProcedure?.name_en} - ChairIQ`
    : `${currentProcedure?.name_es} - ChairIQ`;

  const heroImage = currentProcedure?.heroImage || 'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?w=800';

  return (
    <div className="min-h-screen bg-bg0">
      <div className="max-w-6xl mx-auto px-8 sm:px-12 lg:px-16 py-16">
        <div className="mb-12">
          <AccessibilityControls language={currentLanguage} />
        </div>

        <ProcedureHero 
          procedure={currentProcedure}
          language={currentLanguage}
        />

        <div className="mb-20">
          <div className="bg-bg2 rounded-2xl p-12 border border-bd">
            <h2 className="text-4xl sm:text-5xl font-bold text-t1 mb-6 leading-snug">
              {currentLanguage === 'en' ? 'Procedure Explanation' : 'Explicación del Procedimiento'}
            </h2>
            {isPersonalizing && (
              <div className="mb-6 p-4 bg-accent/10 border border-accent/30 rounded-lg">
                <p className="text-accent text-lg">
                  {currentLanguage === 'en' ? '🤖 Personalizing content based on your learning history...' : '🤖 Personalizando contenido según su historial de aprendizaje...'}
                </p>
              </div>
            )}
            {personalizationError && (
              <div className="mb-6 p-4 bg-warning/10 border border-warning/30 rounded-lg">
                <p className="text-warning text-sm">
                  {currentLanguage === 'en' ? '⚠️ Using standard content (personalization unavailable)' : '⚠️ Usando contenido estándar (personalización no disponible)'}
                </p>
              </div>
            )}
            <p className="text-t3 text-xl sm:text-2xl font-light leading-[1.8]">
              {personalizedContent?.explanation || (currentLanguage === 'en' ? currentProcedure?.description_en : currentProcedure?.description_es)}
            </p>
          </div>
        </div>

        <div className="mb-20">
          <div className="bg-bg2 rounded-2xl p-12 border border-bd">
            <h2 className="text-4xl sm:text-5xl font-bold text-t1 mb-6 leading-snug">
              {currentLanguage === 'en' ? 'Why This Treatment' : 'Por Qué Este Tratamiento'}
            </h2>
            <p className="text-t3 text-xl sm:text-2xl font-light leading-[1.8]">
              {currentLanguage === 'en' ?'This treatment is recommended because it provides the most effective solution for your specific dental condition. It addresses the root cause of your problem and offers long-term benefits for your oral health.' :'Este tratamiento se recomienda porque proporciona la solución más efectiva para su condición dental específica. Aborda la causa raíz de su problema y ofrece beneficios a largo plazo para su salud bucal.'}
            </p>
          </div>
        </div>

        <div className="mb-20">
          <div className="bg-bg2 rounded-2xl p-12 border border-bd">
            <h2 className="text-4xl sm:text-5xl font-bold text-t1 mb-6 leading-snug">
              {currentLanguage === 'en' ? 'Visual Step-by-Step Guide' : 'Guía Visual Paso a Paso'}
            </h2>
            <p className="text-t3 text-xl mb-12 font-light leading-relaxed">
              {currentLanguage === 'en' ?'Tap any step to view detailed anatomical illustration showing exactly what happens' :'Toca cualquier paso para ver ilustración anatómica detallada mostrando exactamente qué sucede'}
            </p>

            <VisualGuide
              steps={currentProcedure?.visualGuideSteps || []}
              language={currentLanguage}
            />
          </div>
        </div>

        <section className="mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-t1 mb-8 leading-snug">
            {currentLanguage === 'en' ? 'What to Expect' : 'Qué Esperar'}
          </h2>
          <div className="bg-bg2 border border-bd rounded-2xl p-10">
            <p className="text-t3 text-xl leading-[1.8] font-light">
              {currentLanguage === 'en' ? currentProcedure?.what_to_expect_en : currentProcedure?.what_to_expect_es}
            </p>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-t1 mb-8 leading-snug">
            {currentLanguage === 'en' ? 'Why It\'s Needed' : 'Por Qué Es Necesario'}
          </h2>
          <div className="bg-bg2 border border-bd rounded-2xl p-10">
            <p className="text-t3 text-xl leading-[1.8] font-light">
              {currentLanguage === 'en' ? currentProcedure?.why_needed_en : currentProcedure?.why_needed_es}
            </p>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-t1 mb-8 leading-snug">
            {currentLanguage === 'en' ? 'About This Procedure' : 'Acerca de Este Procedimiento'}
          </h2>
          <div className="bg-bg2 border border-bd rounded-2xl p-10">
            <p className="text-t3 text-xl leading-[1.8] font-light">
              {currentLanguage === 'en' ? currentProcedure?.description_en : currentProcedure?.description_es}
            </p>
          </div>
        </section>

        {currentProcedure?.aftercare_en && (
          <section className="mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-t1 mb-8 leading-snug">
              {currentLanguage === 'en' ? 'Aftercare & Recovery' : 'Cuidados Posteriores y Recuperación'}
            </h2>
            {personalizedContent?.aftercare && (
              <div className="mb-4 inline-flex items-center gap-2 px-4 py-2 bg-success/10 border border-success/30 rounded-lg">
                <Icon name="Sparkles" size={18} className="text-success" />
                <span className="text-success text-sm font-medium">
                  {currentLanguage === 'en' ? 'Personalized aftercare based on your learning style' : 'Cuidados posteriores personalizados según su estilo de aprendizaje'}
                </span>
              </div>
            )}
            <div className="bg-bg2 border border-bd rounded-2xl p-10">
              <p className="text-t3 text-xl leading-[1.8] font-light">
                {personalizedContent?.aftercare || (currentLanguage === 'en' ? currentProcedure?.aftercare_en : currentProcedure?.aftercare_es)}
              </p>
            </div>
          </section>
        )}

        <ContextualNavigation
          showPrevious={currentProcedureIndex > 0}
          showNext={currentProcedureIndex < procedures?.length - 1}
          previousLabel={navigationLabels?.previous}
          nextLabel={navigationLabels?.next}
          onPrevious={handlePrevious}
          onNext={handleNext}
          position="sticky"
          className="mt-8" />
      </div>
    </div>
  );
};

export default IndividualProcedureDetail;
