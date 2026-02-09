import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';



import ContextualNavigation from '../../components/ui/ContextualNavigation';
import VisualGuide from '../../components/VisualGuide';
import AccessibilityControls from '../../components/AccessibilityControls';
import PatientChatAssistant from './components/PatientChatAssistant';
import EnhancedImageViewer from '../../components/EnhancedImageViewer';
import Icon from '../../components/AppIcon';



import { demoTreatmentPlan } from '../../data/treatmentPlan';
import { getProcedureById } from '../../data/procedures';
import { getCurrentStep, saveCurrentStep } from '../../utils/treatmentProgress';
import { patientLearningProfileService } from '../../services/patientLearningProfileService';
import { aiPersonalizationService } from '../../services/aiPersonalizationService';

export default function StepByStepTreatmentFlow() {
  const navigate = useNavigate();
  const location = useLocation();
  const [currentLanguage, setCurrentLanguage] = useState('en');
  const [currentStep, setCurrentStep] = useState(1);
  const [showBookmark, setShowBookmark] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [showEnhancedViewer, setShowEnhancedViewer] = useState(false);
  const [personalizedSteps, setPersonalizedSteps] = useState({});
  const [isPersonalizing, setIsPersonalizing] = useState(false);

  const procedures = demoTreatmentPlan?.procedureIds?.map(id => getProcedureById(id));
  const totalSteps = procedures?.length;

  const currentProcedure = procedures?.[currentStep - 1];

  useEffect(() => {
    const savedLanguage = localStorage.getItem('chairiq-language');
    if (savedLanguage) {
      setCurrentLanguage(savedLanguage);
    }

    const params = new URLSearchParams(location.search);
    const isFreshStart = params?.get('start') === 'fresh';

    if (isFreshStart) {
      setCurrentStep(1);
      saveCurrentStep(1);
    } else {
      const saved = getCurrentStep();
      if (saved > 0) {
        setCurrentStep(saved);
      }
    }

    const handleLanguageChange = (event) => {
      setCurrentLanguage(event?.detail?.language);
    };

    window.addEventListener('languageChange', handleLanguageChange);
    return () => window.removeEventListener('languageChange', handleLanguageChange);
  }, [location?.search]);

  useEffect(() => {
    saveCurrentStep(currentStep);
  }, [currentStep]);

  useEffect(() => {
    if (currentStep > totalSteps) {
      setIsCompleted(true);
    }
  }, [currentStep, totalSteps]);

  useEffect(() => {
    const personalizeStep = async () => {
      const patientId = localStorage.getItem('chairiq-patient-id');
      const treatmentPlanId = localStorage.getItem('chairiq-treatment-plan-id');
      
      if (!patientId || !treatmentPlanId || !currentProcedure) {
        return;
      }

      if (personalizedSteps?.[currentProcedure?.id]) {
        return;
      }

      setIsPersonalizing(true);

      try {
        const learningProfile = await patientLearningProfileService?.getPatientLearningProfile(
          patientId,
          treatmentPlanId
        );

        const procedureEngagementHistory = await patientLearningProfileService?.getProcedureEngagementHistory(
          patientId,
          currentProcedure?.id
        );

        const baseExpectations = currentProcedure?.visualGuideSteps?.map((step, idx) => ({
          phase: currentLanguage === 'en' ? step?.title_en : step?.title_es,
          description: currentLanguage === 'en' ? step?.description_en : step?.description_es,
          duration: `Step ${idx + 1}`,
        })) || [];

        const adaptedExpectations = await aiPersonalizationService?.adaptComplexityLevel({
          procedureName: currentLanguage === 'en' ? currentProcedure?.name_en : currentProcedure?.name_es,
          baseExpectations,
          learningProfile,
          procedureEngagementHistory,
          language: currentLanguage,
        });

        const adaptedAftercare = await aiPersonalizationService?.adaptAftercareInstructions({
          procedureName: currentLanguage === 'en' ? currentProcedure?.name_en : currentProcedure?.name_es,
          baseAftercare: currentLanguage === 'en' ? currentProcedure?.aftercare_en : currentProcedure?.aftercare_es,
          learningProfile,
          language: currentLanguage,
        });

        setPersonalizedSteps(prev => ({
          ...prev,
          [currentProcedure?.id]: {
            expectations: adaptedExpectations,
            aftercare: adaptedAftercare,
            adaptedFor: learningProfile?.engagementPatterns,
          },
        }));
      } catch (error) {
        console.error('Failed to personalize step:', error);
      } finally {
        setIsPersonalizing(false);
      }
    };

    personalizeStep();
  }, [currentStep, currentProcedure, currentLanguage]);

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      setIsCompleted(true);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePause = () => {
    setShowBookmark(false);
    alert(currentLanguage === 'en' ? 'Your progress has been saved. You can return anytime using your SMS link.' : 'Su progreso ha sido guardado. Puede regresar en cualquier momento usando su enlace SMS.');
  };

  const handleHeroImageClick = () => {
    setShowEnhancedViewer(true);
  };

  const getHeroImages = () => {
    if (!currentProcedure?.heroImage) return [];
    return [{
      src: currentProcedure?.heroImage,
      alt: currentProcedure?.heroImageAlt || `${currentProcedure?.name_en} procedure illustration`
    }];
  };

  const heroImage = currentProcedure?.heroImage || 'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?w=800';

  return (
    <div className="min-h-screen bg-bg0">
      <div className="max-w-4xl mx-auto px-8 sm:px-12 lg:px-16 py-16">
        <div className="mb-12">
          <AccessibilityControls language={currentLanguage} />
        </div>

        <div className="mb-16 text-center">
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold text-t1 mb-6 leading-tight tracking-tight">
            {currentProcedure?.name_en || currentProcedure?.name_es}
          </h1>
          <p className="text-2xl sm:text-3xl text-accent font-light">
            {currentLanguage === 'en' ? 'Step-by-Step Guide' : 'Guía Paso a Paso'}
          </p>
        </div>

        {currentProcedure?.heroImage && (
          <figure className="mb-16 rounded-2xl overflow-hidden border border-bd">
            <div 
              className="relative cursor-pointer group"
              onClick={handleHeroImageClick}
            >
              <img
                src={currentProcedure?.heroImage}
                alt={currentProcedure?.heroImageAlt || `${currentProcedure?.name_en} procedure illustration`}
                className="w-full h-64 sm:h-80 md:h-96 object-cover"
              />
            </div>
            {currentProcedure?.heroImageAlt && (
              <figcaption className="bg-bg2 px-6 py-4 text-base text-t3 italic text-center border-t border-bd">
                {currentProcedure?.heroImageAlt}
              </figcaption>
            )}
          </figure>
        )}

        <div className="text-center mb-16">
          <h1 className="text-4xl sm:text-5xl font-bold text-t1 mb-6 leading-snug">
            {currentLanguage === 'en' ? currentProcedure?.name_en : currentProcedure?.name_es}
          </h1>
          <p className="text-t3 flex items-center justify-center gap-3 text-xl">
            <span className="text-lg font-medium text-t3">
              {currentLanguage === 'en' ? 'Estimated time:' : 'Tiempo estimado:'}
            </span>
            <span className="font-semibold text-accent">{currentProcedure?.duration}</span>
          </p>
        </div>

        <div className="bg-bg2 rounded-2xl p-10 md:p-12 mb-16 border border-bd">
          <h2 className="text-3xl sm:text-4xl font-bold text-t1 mb-4 leading-snug">
            {currentLanguage === 'en' ? 'Visual Guide' : 'Guía Visual'}
          </h2>
          {isPersonalizing && (
            <div className="mb-6 p-4 bg-accent/10 border border-accent/30 rounded-lg">
              <div className="flex items-center gap-3">
                <Icon name="Loader" size={20} className="text-accent animate-spin" />
                <p className="text-accent text-base">
                  {currentLanguage === 'en' ? 'Adapting content to your learning pace...' : 'Adaptando contenido a su ritmo de aprendizaje...'}
                </p>
              </div>
            </div>
          )}
          {personalizedSteps?.[currentProcedure?.id] && (
            <div className="mb-6 p-4 bg-accent/10 border border-accent/30 rounded-lg">
              <div className="flex items-center gap-3">
                <Icon name="Sparkles" size={20} className="text-accent" />
                <div>
                  <p className="text-accent text-base font-medium">
                    {currentLanguage === 'en' ? 'AI-Personalized Content' : 'Contenido Personalizado por IA'}
                  </p>
                  <p className="text-t3 text-sm mt-1">
                    {currentLanguage === 'en' 
                      ? `Adapted for ${personalizedSteps?.[currentProcedure?.id]?.adaptedFor?.engagementLevel} engagement, ${personalizedSteps?.[currentProcedure?.id]?.adaptedFor?.learningPace} pace`
                      : `Adaptado para compromiso ${personalizedSteps?.[currentProcedure?.id]?.adaptedFor?.engagementLevel}, ritmo ${personalizedSteps?.[currentProcedure?.id]?.adaptedFor?.learningPace}`}
                  </p>
                </div>
              </div>
            </div>
          )}
          <p className="text-t3 text-lg mb-10 font-light leading-relaxed">
            {currentLanguage === 'en' ?'Tap a step to see detailed illustration' :'Toca un paso para ver ilustración detallada'}
          </p>

          <VisualGuide
            steps={currentProcedure?.visualGuideSteps || []}
            language={currentLanguage}
          />
        </div>

        <section className="bg-bg2 border border-bd rounded-2xl p-10 mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold text-t1 mb-6 leading-snug">
            {currentLanguage === 'en' ? 'What to Expect' : 'Qué Esperar'}
          </h2>
          <p className="text-t3 text-xl leading-[1.8] font-light">
            {currentLanguage === 'en' ? currentProcedure?.what_to_expect_en : currentProcedure?.what_to_expect_es}
          </p>
        </section>

        <section className="bg-bg2 border border-bd rounded-2xl p-10 mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold text-t1 mb-6 leading-snug">
            {currentLanguage === 'en' ? 'Why It\'s Needed' : 'Por Qué Es Necesario'}
          </h2>
          <p className="text-t3 text-xl leading-[1.8] font-light">
            {currentLanguage === 'en' ? currentProcedure?.why_needed_en : currentProcedure?.why_needed_es}
          </p>
        </section>

        {currentProcedure?.aftercare_en && (
          <section className="bg-bg2 border border-bd rounded-2xl p-10 mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-t1 mb-6 leading-snug">
              {currentLanguage === 'en' ? 'Aftercare' : 'Cuidados Posteriores'}
            </h2>
            {personalizedSteps?.[currentProcedure?.id]?.aftercare && (
              <div className="mb-4 inline-flex items-center gap-2 px-4 py-2 bg-success/10 border border-success/30 rounded-lg">
                <Icon name="Sparkles" size={18} className="text-success" />
                <span className="text-success text-sm font-medium">
                  {currentLanguage === 'en' ? 'Personalized for your learning style' : 'Personalizado para su estilo de aprendizaje'}
                </span>
              </div>
            )}
            <p className="text-t3 text-xl leading-[1.8] font-light">
              {personalizedSteps?.[currentProcedure?.id]?.aftercare || (currentLanguage === 'en' ? currentProcedure?.aftercare_en : currentProcedure?.aftercare_es)}
            </p>
          </section>
        )}

        <ContextualNavigation
          showPrevious={currentStep > 1}
          showNext={true}
          previousLabel={currentLanguage === 'en' ? 'Previous Step' : 'Paso Anterior'}
          nextLabel={currentStep === totalSteps ?
            currentLanguage === 'en' ? 'Complete' : 'Completar' :
            currentLanguage === 'en' ? 'Next Step' : 'Siguiente Paso'}
          onPrevious={handlePrevious}
          onNext={handleNext}
          position="sticky" />
      </div>
      <PatientChatAssistant 
        procedure={currentProcedure} 
        language={currentLanguage} 
      />
      {showEnhancedViewer && (
        <EnhancedImageViewer
          images={getHeroImages()}
          title={currentLanguage === 'en' ? currentProcedure?.name_en : currentProcedure?.name_es}
          onClose={() => setShowEnhancedViewer(false)}
          language={currentLanguage}
        />
      )}
    </div>
  );
}
