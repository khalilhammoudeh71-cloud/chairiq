import React from 'react';
import { X, FileText, Image as ImageIcon, List } from 'lucide-react';

const PreviewModal = ({ procedure, formData, language, onClose }) => {
  const currentLang = language;

  return (
    <div 
      className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 overflow-y-auto"
      onClick={onClose}
    >
      <div className="min-h-screen flex items-center justify-center p-4">
        <div 
          className="max-w-4xl w-full bg-gray-800 rounded-xl shadow-2xl"
          onClick={(e) => e?.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-700">
            <div>
              <h2 className="text-2xl font-bold text-white">
                Preview: {formData?.title?.[currentLang] || procedure?.name}
              </h2>
              <p className="text-gray-400 mt-1">
                {currentLang === 'en' ? 'English Version' : 'Versión en Español'}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
            >
              <X className="w-6 h-6 text-white" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-8 max-h-[70vh] overflow-y-auto">
            {/* Main Description */}
            <section>
              <div className="flex items-center gap-2 mb-4">
                <FileText className="w-5 h-5 text-blue-400" />
                <h3 className="text-lg font-semibold text-white">Description</h3>
              </div>
              <div 
                className="prose prose-invert max-w-none text-gray-300"
                dangerouslySetInnerHTML={{ 
                  __html: formData?.description?.[currentLang] || '<p class="text-gray-500">No description available</p>' 
                }}
              />
            </section>

            {/* Why Needed */}
            {formData?.whyNeeded?.[currentLang] && (
              <section>
                <h3 className="text-lg font-semibold text-white mb-4">
                  Why This Treatment is Needed
                </h3>
                <div 
                  className="prose prose-invert max-w-none text-gray-300"
                  dangerouslySetInnerHTML={{ __html: formData?.whyNeeded?.[currentLang] }}
                />
              </section>
            )}

            {/* Steps */}
            {formData?.steps?.length > 0 && (
              <section>
                <div className="flex items-center gap-2 mb-4">
                  <List className="w-5 h-5 text-blue-400" />
                  <h3 className="text-lg font-semibold text-white">Step-by-Step Process</h3>
                </div>
                <div className="space-y-4">
                  {formData?.steps?.map((step, index) => (
                    <div key={index} className="bg-gray-900 rounded-lg p-4 border border-gray-700">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="flex items-center justify-center w-8 h-8 bg-blue-600 text-white rounded-full font-semibold text-sm">
                          {index + 1}
                        </span>
                        <h4 className="text-white font-medium">
                          {step?.title?.[currentLang] || `Step ${index + 1}`}
                        </h4>
                      </div>
                      {step?.description?.[currentLang] && (
                        <div 
                          className="prose prose-invert prose-sm max-w-none text-gray-300 ml-11"
                          dangerouslySetInnerHTML={{ __html: step?.description?.[currentLang] }}
                        />
                      )}
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* What to Expect */}
            {formData?.whatToExpect?.[currentLang] && (
              <section>
                <h3 className="text-lg font-semibold text-white mb-4">
                  What to Expect
                </h3>
                <div 
                  className="prose prose-invert max-w-none text-gray-300"
                  dangerouslySetInnerHTML={{ __html: formData?.whatToExpect?.[currentLang] }}
                />
              </section>
            )}

            {/* Images */}
            {formData?.images?.length > 0 && (
              <section>
                <div className="flex items-center gap-2 mb-4">
                  <ImageIcon className="w-5 h-5 text-blue-400" />
                  <h3 className="text-lg font-semibold text-white">Images</h3>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {formData?.images?.map((image, index) => (
                    <div key={index} className="bg-gray-900 rounded-lg overflow-hidden border border-gray-700">
                      <img
                        src={image?.url || image?.src}
                        alt={image?.alt || `Treatment image ${index + 1}`}
                        className="w-full aspect-video object-cover"
                      />
                      {image?.caption?.[currentLang] && (
                        <p className="text-xs text-gray-400 p-2">
                          {image?.caption?.[currentLang]}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-gray-700">
            <button
              onClick={onClose}
              className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Close Preview
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PreviewModal;