import React from 'react';
import { Eye, Clock, BookOpen, Image } from 'lucide-react';

const TreatmentCard = ({ procedure, onViewContent, languageFilter }) => {
  const getCategoryColor = (category) => {
    const colors = {
      restorative: 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200',
      periodontal: 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200',
      surgery: 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200',
      pediatric: 'bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200',
      prosthetics: 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200',
      orthodontics: 'bg-pink-100 dark:bg-pink-900 text-pink-800 dark:text-pink-200',
      education: 'bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200'
    };
    return colors?.[category] || 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200';
  };

  const stepCount = procedure?.visualGuideSteps?.length || 0;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
      {/* Hero Image */}
      <div className="relative h-48 bg-gray-200 dark:bg-gray-700">
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
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
          {languageFilter === 'es' ? procedure?.name_es : procedure?.name_en}
        </h3>
        
        {/* Bilingual Names */}
        {languageFilter === 'both' && (
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
            {procedure?.name_es}
          </p>
        )}

        {/* Stats */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
            <BookOpen className="w-4 h-4 mr-2" />
            <span>{stepCount} Educational Steps</span>
          </div>
          
          <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
            <Clock className="w-4 h-4 mr-2" />
            <span>{procedure?.duration}</span>
          </div>

          <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
            <Image className="w-4 h-4 mr-2" />
            <span>{stepCount} Visual Guides</span>
          </div>
        </div>

        {/* Description Preview */}
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
          {languageFilter === 'es' ? procedure?.description_es : procedure?.description_en}
        </p>

        {/* Actions */}
        <div className="flex gap-2">
          <button
            onClick={() => onViewContent(procedure)}
            className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
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