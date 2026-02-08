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

  // Get all procedures from treatment plan
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

  // NEW: Personalize content based on patient learning profile
  useEffect(() => {
    const personalizeContent = async () => {
      // Only personalize if we have patient context (in real app, get from auth/URL)
      const patientId = localStorage.getItem('chairiq-patient-id');
      const treatmentPlanId = localStorage.getItem('chairiq-treatment-plan-id');
      
      if (!patientId || !treatmentPlanId || !procedures?.[currentProcedureIndex]) {
        return; // Skip personalization if no patient context
      }

      setIsPersonalizing(true);
      setPersonalizationError(null);

      try {
        // Get patient learning profile
        const learningProfile = await patientLearningProfileService?.getPatientLearningProfile(
          patientId,
          treatmentPlanId
        );

        // Get procedure-specific engagement history
        const procedureEngagementHistory = await patientLearningProfileService?.getProcedureEngagementHistory(
          patientId,
          procedures?.[currentProcedureIndex]?.id
        );

        // Prepare base content
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

        // Generate personalized content
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
        // Continue with base content on error
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

  // Fallback hero image
  const heroImage = currentProcedure?.heroImage || 'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?w=800';

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="max-w-6xl mx-auto px-8 sm:px-12 lg:px-16 py-16">
        {/* Accessibility Controls */}
        <div className="mb-12">
          <AccessibilityControls language={currentLanguage} />
        </div>

        {/* Hero Section */}
        <ProcedureHero 
          procedure={currentProcedure}
          language={currentLanguage}
        />

        {/* Procedure Explanation */}
        <div className="mb-20">
          <div className="bg-gray-800 rounded-2xl p-12 border border-gray-700">
            <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6 leading-snug">
              {currentLanguage === 'en' ? 'Procedure Explanation' : 'Explicación del Procedimiento'}
            </h2>
            {isPersonalizing && (
              <div className="mb-6 p-4 bg-blue-900/30 border border-blue-700 rounded-lg">
                <p className="text-blue-300 text-lg">
                  {currentLanguage === 'en' ? '🤖 Personalizing content based on your learning history...' : '🤖 Personalizando contenido según su historial de aprendizaje...'}
                </p>
              </div>
            )}
            {personalizationError && (
              <div className="mb-6 p-4 bg-yellow-900/30 border border-yellow-700 rounded-lg">
                <p className="text-yellow-300 text-sm">
                  {currentLanguage === 'en' ? '⚠️ Using standard content (personalization unavailable)' : '⚠️ Usando contenido estándar (personalización no disponible)'}
                </p>
              </div>
            )}
            <p className="text-gray-300 text-xl sm:text-2xl font-light leading-[1.8]">
              {personalizedContent?.explanation || (currentLanguage === 'en' ? currentProcedure?.description_en : currentProcedure?.description_es)}
            </p>
          </div>
        </div>

        {/* Why This Treatment */}
        <div className="mb-20">
          <div className="bg-gray-800 rounded-2xl p-12 border border-gray-700">
            <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6 leading-snug">
              {currentLanguage === 'en' ? 'Why This Treatment' : 'Por Qué Este Tratamiento'}
            </h2>
            <p className="text-gray-300 text-xl sm:text-2xl font-light leading-[1.8]">
              {currentLanguage === 'en' ?'This treatment is recommended because it provides the most effective solution for your specific dental condition. It addresses the root cause of your problem and offers long-term benefits for your oral health.' :'Este tratamiento se recomienda porque proporciona la solución más efectiva para su condición dental específica. Aborda la causa raíz de su problema y ofrece beneficios a largo plazo para su salud bucal.'}
            </p>
          </div>
        </div>

        {/* Visual Guide Section */}
        <div className="mb-20">
          <div className="bg-gray-800 rounded-2xl p-12 border border-gray-700">
            <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6 leading-snug">
              {currentLanguage === 'en' ? 'Visual Step-by-Step Guide' : 'Guía Visual Paso a Paso'}
            </h2>
            <p className="text-gray-300 text-xl mb-12 font-light leading-relaxed">
              {currentLanguage === 'en' ?'Tap any step to view detailed anatomical illustration showing exactly what happens' :'Toca cualquier paso para ver ilustración anatómica detallada mostrando exactamente qué sucede'}
            </p>

            <VisualGuide
              steps={currentProcedure?.visualGuideSteps || []}
              language={currentLanguage}
            />
          </div>
        </div>

        {/* What to Expect */}
        <section className="mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-8 leading-snug">
            {currentLanguage === 'en' ? 'What to Expect' : 'Qué Esperar'}
          </h2>
          <div className="bg-gray-800 border border-gray-700 rounded-2xl p-10">
            <p className="text-gray-300 text-xl leading-[1.8] font-light">
              {currentLanguage === 'en' ? currentProcedure?.what_to_expect_en : currentProcedure?.what_to_expect_es}
            </p>
          </div>
        </section>

        {/* Why It's Needed */}
        <section className="mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-8 leading-snug">
            {currentLanguage === 'en' ? 'Why It\'s Needed' : 'Por Qué Es Necesario'}
          </h2>
          <div className="bg-gray-800 border border-gray-700 rounded-2xl p-10">
            <p className="text-gray-300 text-xl leading-[1.8] font-light">
              {currentLanguage === 'en' ? currentProcedure?.why_needed_en : currentProcedure?.why_needed_es}
            </p>
          </div>
        </section>

        {/* Description */}
        <section className="mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-8 leading-snug">
            {currentLanguage === 'en' ? 'About This Procedure' : 'Acerca de Este Procedimiento'}
          </h2>
          <div className="bg-gray-800 border border-gray-700 rounded-2xl p-10">
            <p className="text-gray-300 text-xl leading-[1.8] font-light">
              {currentLanguage === 'en' ? currentProcedure?.description_en : currentProcedure?.description_es}
            </p>
          </div>
        </section>

        {/* Aftercare */}
        {currentProcedure?.aftercare_en && (
          <section className="mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-8 leading-snug">
              {currentLanguage === 'en' ? 'Aftercare & Recovery' : 'Cuidados Posteriores y Recuperación'}
            </h2>
            {personalizedContent?.aftercare && (
              <div className="mb-4 inline-flex items-center gap-2 px-4 py-2 bg-green-900/30 border border-green-700 rounded-lg">
                <Icon name="Sparkles" size={18} className="text-green-400" />
                <span className="text-green-300 text-sm font-medium">
                  {currentLanguage === 'en' ? 'Personalized aftercare based on your learning style' : 'Cuidados posteriores personalizados según su estilo de aprendizaje'}
                </span>
              </div>
            )}
            <div className="bg-gray-800 border border-gray-700 rounded-2xl p-10">
              <p className="text-gray-300 text-xl leading-[1.8] font-light">
                {personalizedContent?.aftercare || (currentLanguage === 'en' ? currentProcedure?.aftercare_en : currentProcedure?.aftercare_es)}
              </p>
            </div>
          </section>
        )}

        {/* Navigation */}
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