import React from 'react';
import { Eye, Clock, BookOpen, Image } from 'lucide-react';

const TreatmentCard = ({ procedure, onViewContent, languageFilter }) => {
  const getCategoryColor = (category) => {
    const colors = {
      restorative: 'bg-accent/10 text-accent',
      periodontal: 'bg-success/10 text-success',
      surgery: 'bg-danger/10 text-danger',
      pediatric: 'bg-bg3 text-t2',
      prosthetics: 'bg-warning/10 text-warning',
      orthodontics: 'bg-bg3 text-t2',
      education: 'bg-bg3 text-t2'
    };
    return colors?.[category] || 'bg-bg3 text-t2';
  };

  const stepCount = procedure?.visualGuideSteps?.length || 0;

  return (
    <div className="bg-bg1 rounded-lg border border-bd overflow-hidden">
      {/* Hero Image */}
      <div className="relative h-48 bg-bg2">
        <img
          src={procedure?.heroImage}
          alt={procedure?.heroImageAlt || `${procedure?.name_en} illustration`}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-3 right-3">
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getCategoryColor(procedure?.category)}`}>
            {procedure?.category}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        {/* Title */}
        <h3 className="text-xl font-bold text-t1 mb-2">
          {languageFilter === 'es' ? procedure?.name_es : procedure?.name_en}
        </h3>
        
        {/* Bilingual Names */}
        {languageFilter === 'both' && (
          <p className="text-sm text-t2 mb-3">
            {procedure?.name_es}
          </p>
        )}

        {/* Stats */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center text-sm text-t2">
            <BookOpen className="w-4 h-4 mr-2" />
            <span>{stepCount} Educational Steps</span>
          </div>
          
          <div className="flex items-center text-sm text-t2">
            <Clock className="w-4 h-4 mr-2" />
            <span>{procedure?.duration}</span>
          </div>

          <div className="flex items-center text-sm text-t2">
            <Image className="w-4 h-4 mr-2" />
            <span>{stepCount} Visual Guides</span>
          </div>
        </div>

        {/* Description Preview */}
        <p className="text-sm text-t2 mb-4 line-clamp-2">
          {languageFilter === 'es' ? procedure?.description_es : procedure?.description_en}
        </p>

        {/* Actions */}
        <div className="flex gap-2">
          <button
            onClick={() => onViewContent(procedure)}
            className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-accent text-white rounded-lg hover:brightness-110 transition-colors"
          >
            <Eye className="w-4 h-4" />
            <span>View Content</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default TreatmentCard;