import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';
import LanguageToggle from '../../components/ui/LanguageToggle';
import Button from '../../components/ui/Button';
import ProcedureCard from './components/ProcedureCard';
import ProcedureStats from './components/ProcedureStats';
import FilterTabs from './components/FilterTabs';
import EmptyState from './components/EmptyState';
import { demoTreatmentPlan } from '../../data/treatmentPlan';
import { getProcedureById } from '../../data/procedures';

const ProcedureListOverview = () => {
  const navigate = useNavigate();
  const [currentLanguage, setCurrentLanguage] = useState('en');
  const [activeFilter, setActiveFilter] = useState('all');

  const allProcedures = demoTreatmentPlan?.procedureIds?.map(id => getProcedureById(id));

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

  const filteredProcedures = activeFilter === 'all' 
    ? allProcedures
    : allProcedures?.filter(p => p?.category === activeFilter);

  const pageContent = {
    en: {
      title: "Your Treatment Procedures - ChairIQ",
      description: "Explore all procedures in your treatment plan with detailed information and visual guides.",
      heading: "Your Treatment Procedures",
      subtitle: "Learn about each procedure in your personalized treatment plan"
    },
    es: {
      title: "Sus Procedimientos de Tratamiento - ChairIQ",
      description: "Explore todos los procedimientos en su plan de tratamiento con información detallada y guías visuales.",
      heading: "Sus Procedimientos de Tratamiento",
      subtitle: "Aprenda sobre cada procedimiento en su plan de tratamiento personalizado"
    }
  };

  const content = pageContent?.[currentLanguage];

  return (
    <>
      <Helmet>
        <title>{content?.title}</title>
        <meta name="description" content={content?.description} />
      </Helmet>
      <div className="min-h-screen bg-bg0">
        <header className="sticky top-0 z-40 bg-bg2 border-b border-bd">
          <div className="max-w-7xl mx-auto px-8 sm:px-12 lg:px-16 py-6">
            <div className="flex items-center justify-between">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/treatment-plan-landing')}
                iconName="ArrowLeft"
                iconPosition="left"
                className="text-t3 hover:text-t1">

                {currentLanguage === 'en' ? 'Back to Overview' : 'Volver a Vista General'}
              </Button>
              <LanguageToggle />
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-8 sm:px-12 lg:px-16 py-16">
          <div className="text-center mb-20">
            <h1 className="text-5xl sm:text-6xl font-bold text-t1 mb-6 leading-tight tracking-tight">
              {content?.heading}
            </h1>
            <p className="text-t3 text-2xl font-light leading-relaxed">
              {content?.subtitle}
            </p>
          </div>

          <ProcedureStats 
            totalProcedures={allProcedures?.length}
            stats={allProcedures}
            language={currentLanguage} 
          />

          <FilterTabs 
            activeFilter={activeFilter}
            onFilterChange={setActiveFilter}
            language={currentLanguage}
          />

          {filteredProcedures?.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProcedures?.map((procedure, index) => (
                <ProcedureCard 
                  key={procedure?.id}
                  procedure={procedure}
                  index={index}
                  currentLanguage={currentLanguage}
                  onClick={() => navigate(`/individual-procedure-detail?procedure=${procedure?.id}`)}
                />
              ))}
            </div>
          ) : (
            <EmptyState language={currentLanguage} />
          )}
        </main>
      </div>
    </>
  );

};

export default ProcedureListOverview;
