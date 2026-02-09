import React from 'react';
import { X, FileText, Image as ImageIcon, List } from 'lucide-react';

const PreviewModal = ({ procedure, formData, language, onClose }) => {
  const currentLang = language;

  return (
    <div 
      className="fixed inset-0 bg-[var(--overlay)] backdrop-blur-sm z-50 overflow-y-auto"
      onClick={onClose}
    >
      <div className="min-h-screen flex items-center justify-center p-4">
        <div 
          className="max-w-4xl w-full bg-bg2 rounded-xl shadow-lg"
          onClick={(e) => e?.stopPropagation()}
        >
          <div className="flex items-center justify-between p-6 border-b border-bd">
            <div>
              <h2 className="text-2xl font-bold text-t1">
                Preview: {formData?.title?.[currentLang] || procedure?.name}
              </h2>
              <p className="text-t3 mt-1">
                {currentLang === 'en' ? 'English Version' : 'Versión en Español'}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-bg3 rounded-lg transition-colors"
            >
              <X className="w-6 h-6 text-t1" />
            </button>
          </div>

          <div className="p-6 space-y-8 max-h-[70vh] overflow-y-auto">
            <section>
              <div className="flex items-center gap-2 mb-4">
                <FileText className="w-5 h-5 text-accent" />
                <h3 className="text-lg font-semibold text-t1">Description</h3>
              </div>
              <div 
                className="prose prose-invert max-w-none text-t3"
                dangerouslySetInnerHTML={{ 
                  __html: formData?.description?.[currentLang] || '<p class="text-t3">No description available</p>' 
                }}
              />
            </section>

            {formData?.whyNeeded?.[currentLang] && (
              <section>
                <h3 className="text-lg font-semibold text-t1 mb-4">
                  Why This Treatment is Needed
                </h3>
                <div 
                  className="prose prose-invert max-w-none text-t3"
                  dangerouslySetInnerHTML={{ __html: formData?.whyNeeded?.[currentLang] }}
                />
              </section>
            )}

            {formData?.steps?.length > 0 && (
              <section>
                <div className="flex items-center gap-2 mb-4">
                  <List className="w-5 h-5 text-accent" />
                  <h3 className="text-lg font-semibold text-t1">Step-by-Step Process</h3>
                </div>
                <div className="space-y-4">
                  {formData?.steps?.map((step, index) => (
                    <div key={index} className="bg-bg3 rounded-lg p-4 border border-bd">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="flex items-center justify-center w-8 h-8 bg-accent text-white rounded-full font-semibold text-sm">
                          {index + 1}
                        </span>
                        <h4 className="text-t1 font-medium">
                          {step?.title?.[currentLang] || `Step ${index + 1}`}
                        </h4>
                      </div>
                      {step?.description?.[currentLang] && (
                        <div 
                          className="prose prose-invert prose-sm max-w-none text-t3 ml-11"
                          dangerouslySetInnerHTML={{ __html: step?.description?.[currentLang] }}
                        />
                      )}
                    </div>
                  ))}
                </div>
              </section>
            )}

            {formData?.whatToExpect?.[currentLang] && (
              <section>
                <h3 className="text-lg font-semibold text-t1 mb-4">
                  What to Expect
                </h3>
                <div 
                  className="prose prose-invert max-w-none text-t3"
                  dangerouslySetInnerHTML={{ __html: formData?.whatToExpect?.[currentLang] }}
                />
              </section>
            )}

            {formData?.images?.length > 0 && (
              <section>
                <div className="flex items-center gap-2 mb-4">
                  <ImageIcon className="w-5 h-5 text-accent" />
                  <h3 className="text-lg font-semibold text-t1">Images</h3>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {formData?.images?.map((image, index) => (
                    <div key={index} className="bg-bg3 rounded-lg overflow-hidden border border-bd">
                      <img
                        src={image?.url || image?.src}
                        alt={image?.alt || `Treatment image ${index + 1}`}
                        className="w-full aspect-video object-cover"
                      />
                      {image?.caption?.[currentLang] && (
                        <p className="text-xs text-t3 p-2">
                          {image?.caption?.[currentLang]}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>

          <div className="p-6 border-t border-bd">
            <button
              onClick={onClose}
              className="w-full px-6 py-3 bg-accent text-white rounded-lg hover:brightness-110 transition-colors font-medium"
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