import React, { useState } from 'react';
import { X, ChevronLeft, ChevronRight, BookOpen, Clock, Languages } from 'lucide-react';

const ContentViewerModal = ({ treatment, onClose, languageFilter }) => {
  const [currentLanguage, setCurrentLanguage] = useState(languageFilter === 'es' ? 'es' : 'en');
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  const steps = treatment?.visualGuideSteps || [];
  const currentStep = steps?.[currentStepIndex];

  const handlePrevStep = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(currentStepIndex - 1);
    }
  };

  const handleNextStep = () => {
    if (currentStepIndex < steps?.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1);
    }
  };

  const toggleLanguage = () => {
    setCurrentLanguage(currentLanguage === 'en' ? 'es' : 'en');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg max-w-5xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              {currentLanguage === 'es' ? treatment?.name_es : treatment?.name_en}
            </h2>
            <div className="flex items-center gap-4 mt-2">
              <span className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                <Clock className="w-4 h-4 mr-1" />
                {treatment?.duration}
              </span>
              <span className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                <BookOpen className="w-4 h-4 mr-1" />
                {steps?.length} Steps
              </span>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={toggleLanguage}
              className="flex items-center space-x-2 px-3 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              <Languages className="w-4 h-4" />
              <span>{currentLanguage === 'en' ? 'EN' : 'ES'}</span>
            </button>
            
            <button
              onClick={onClose}
              className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Overview Section */}
          <div className="mb-8">
            <div className="mb-6">
              <img
                src={treatment?.heroImage}
                alt={treatment?.heroImageAlt}
                className="w-full h-64 object-cover rounded-lg"
              />
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Description
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {currentLanguage === 'es' ? treatment?.description_es : treatment?.description_en}
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Why It's Needed
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {currentLanguage === 'es' ? treatment?.why_needed_es : treatment?.why_needed_en}
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  What to Expect
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {currentLanguage === 'es' ? treatment?.what_to_expect_es : treatment?.what_to_expect_en}
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Aftercare
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {currentLanguage === 'es' ? treatment?.aftercare_es : treatment?.aftercare_en}
                </p>
              </div>
            </div>
          </div>

          {/* Step-by-Step Visual Guide */}
          <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              Step-by-Step Visual Guide
            </h3>

            {currentStep && (
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
                {/* Step Navigation */}
                <div className="flex items-center justify-between mb-4">
                  <button
                    onClick={handlePrevStep}
                    disabled={currentStepIndex === 0}
                    className="flex items-center space-x-2 px-4 py-2 bg-white dark:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronLeft className="w-5 h-5" />
                    <span>Previous</span>
                  </button>

                  <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Step {currentStepIndex + 1} of {steps?.length}
                  </span>

                  <button
                    onClick={handleNextStep}
                    disabled={currentStepIndex === steps?.length - 1}
                    className="flex items-center space-x-2 px-4 py-2 bg-white dark:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <span>Next</span>
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>

                {/* Step Content */}
                <div className="space-y-4">
                  <h4 className="text-lg font-bold text-gray-900 dark:text-white">
                    {currentLanguage === 'es' ? currentStep?.title_es : currentStep?.title_en}
                  </h4>

                  <div className="bg-white dark:bg-gray-600 rounded-lg overflow-hidden">
                    <img
                      src={currentStep?.visualSrc}
                      alt={currentStep?.visualAlt}
                      className="w-full h-96 object-contain"
                    />
                  </div>

                  <p className="text-gray-600 dark:text-gray-300">
                    {currentLanguage === 'es' ? currentStep?.description_es : currentStep?.description_en}
                  </p>
                </div>

                {/* Progress Dots */}
                <div className="flex justify-center gap-2 mt-6">
                  {steps?.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentStepIndex(index)}
                      className={`w-2 h-2 rounded-full transition-colors ${
                        index === currentStepIndex
                          ? 'bg-blue-600 w-8' :'bg-gray-300 dark:bg-gray-500'
                      }`}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 dark:border-gray-700 p-6">
          <div className="flex justify-end">
            <button
              onClick={onClose}
              className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContentViewerModal;