import React, { useState } from 'react';
import { Clock } from 'lucide-react';
import EnhancedImageViewer from '../../../components/EnhancedImageViewer';
import ProcedureThumb from '../../../components/ProcedureThumb';

const ProcedureHero = ({ procedure, language = 'en' }) => {
  const [showEnhancedViewer, setShowEnhancedViewer] = useState(false);
  const name = language === 'en' ? procedure?.name_en : procedure?.name_es;

  const handleImageClick = () => {
    setShowEnhancedViewer(true);
  };

  const getHeroImages = () => {
    if (!procedure?.heroImage) return [];
    return [{
      src: procedure?.heroImage,
      alt: procedure?.heroImageAlt || `${procedure?.name_en} clinical illustration`
    }];
  };

  return (
    <>
      <div className="relative">
        {!procedure?.heroImage && (
          <figure className="relative w-full rounded-2xl overflow-hidden mb-12 border border-accent/20">
            <ProcedureThumb
              canonicalSlug={procedure?.canonicalSlug}
              slug={procedure?.slug}
              name={procedure?.name_en}
              alt={name || ''}
              size="hero"
              glow={false}
              className="!rounded-none !border-0"
            />
          </figure>
        )}
        {procedure?.heroImage && (
          <figure className="relative w-full h-80 md:h-96 rounded-2xl overflow-hidden mb-12 border border-bd">
            <div 
              className="relative cursor-pointer group h-full"
              onClick={handleImageClick}
            >
              <img
                src={procedure?.heroImage}
                alt={procedure?.heroImageAlt || `${procedure?.name_en} clinical illustration`}
                className="w-full h-full object-cover"
              />
            </div>
            {procedure?.heroImageAlt && (
              <figcaption className="absolute bottom-0 left-0 right-0 bg-[var(--overlay)] px-6 py-4 text-base text-white italic">
                {procedure?.heroImageAlt}
              </figcaption>
            )}
          </figure>
        )}

        <div className="text-center mb-16">
          <h1 className="text-5xl sm:text-6xl font-bold text-t1 mb-6 leading-tight tracking-tight">
            {name}
          </h1>
          <div className="flex items-center justify-center gap-3 text-t3">
            <Clock className="w-6 h-6" />
            <span className="text-xl font-light">
              {language === 'en' ? 'Duration:' : 'Duración:'} {procedure?.duration}
            </span>
          </div>
        </div>
      </div>

      {showEnhancedViewer && (
        <EnhancedImageViewer
          images={getHeroImages()}
          title={name}
          onClose={() => setShowEnhancedViewer(false)}
          language={language}
        />
      )}
    </>
  );
};

export default ProcedureHero;
