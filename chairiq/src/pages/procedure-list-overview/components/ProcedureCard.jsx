import React from 'react';
import { Clock } from 'lucide-react';
import ProcedureThumb from '../../../components/ProcedureThumb';

const ProcedureCard = ({ procedure, index, currentLanguage, onClick }) => {
  const name = currentLanguage === 'en' ? procedure?.name_en : procedure?.name_es;
  const description = currentLanguage === 'en' ? procedure?.description_en : procedure?.description_es;

  return (
    <div
      onClick={onClick}
      className="group bg-bg2 border border-bd rounded-2xl p-8 cursor-pointer hover:border-accent/30"
    >
      <div className="relative mb-6 -mx-2 -mt-2">
        <ProcedureThumb
          canonicalSlug={procedure?.canonicalSlug}
          slug={procedure?.slug}
          name={procedure?.name_en}
          alt={name || ''}
          size="lg"
        />
        <span className="absolute top-3 left-3 w-8 h-8 rounded-lg bg-[rgba(4,7,10,0.65)] backdrop-blur-sm border border-accent/30 flex items-center justify-center text-sm font-bold text-accent tnum">
          {index + 1}
        </span>
      </div>

      <h3 className="text-2xl sm:text-3xl font-semibold text-t1 mb-4">
        {name}
      </h3>

      <p className="text-lg text-t3 mb-6 line-clamp-2 font-light leading-relaxed">
        {description}
      </p>

      <div className="flex items-center gap-3 text-base text-t3">
        <Clock className="w-5 h-5" />
        <span>{procedure?.duration}</span>
      </div>
    </div>
  );
};

export default ProcedureCard;
