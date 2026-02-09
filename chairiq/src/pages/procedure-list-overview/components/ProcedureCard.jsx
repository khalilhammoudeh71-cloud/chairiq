import React from 'react';
import { Clock } from 'lucide-react';

const ProcedureCard = ({ procedure, index, currentLanguage, onClick }) => {
  const name = currentLanguage === 'en' ? procedure?.name_en : procedure?.name_es;
  const description = currentLanguage === 'en' ? procedure?.description_en : procedure?.description_es;

  return (
    <div
      onClick={onClick}
      className="group bg-bg2 border border-bd rounded-2xl p-8 cursor-pointer hover:border-accent/30"
    >
      <div className="flex items-start justify-between mb-6">
        <div className="w-14 h-14 rounded-lg bg-accent/10 flex items-center justify-center">
          <span className="text-2xl font-bold text-accent">
            {index + 1}
          </span>
        </div>
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
