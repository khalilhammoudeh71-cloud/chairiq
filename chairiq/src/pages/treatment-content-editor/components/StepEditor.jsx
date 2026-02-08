import React, { useState } from 'react';
import { GripVertical, Plus, Trash2, Edit2, Check } from 'lucide-react';
import RichTextEditor from './RichTextEditor';

const StepEditor = ({ steps, language, onUpdate }) => {
  const [editingStep, setEditingStep] = useState(null);
  const [draggedStep, setDraggedStep] = useState(null);

  const handleAddStep = () => {
    const newStep = {
      id: Date.now(),
      title: { en: '', es: '' },
      description: { en: '', es: '' },
      image: null
    };
    onUpdate([...steps, newStep]);
    setEditingStep(steps?.length);
  };

  const handleDeleteStep = (index) => {
    if (window.confirm('Are you sure you want to delete this step?')) {
      const updatedSteps = steps?.filter((_, i) => i !== index);
      onUpdate(updatedSteps);
    }
  };

  const handleUpdateStep = (index, field, value) => {
    const updatedSteps = [...steps];
    updatedSteps[index] = {
      ...updatedSteps?.[index],
      [field]: {
        ...updatedSteps?.[index]?.[field],
        [language]: value
      }
    };
    onUpdate(updatedSteps);
  };

  const handleDragStart = (e, index) => {
    setDraggedStep(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e, index) => {
    e?.preventDefault();
    if (draggedStep === null || draggedStep === index) return;

    const updatedSteps = [...steps];
    const draggedItem = updatedSteps?.[draggedStep];
    updatedSteps?.splice(draggedStep, 1);
    updatedSteps?.splice(index, 0, draggedItem);
    
    setDraggedStep(index);
    onUpdate(updatedSteps);
  };

  const handleDragEnd = () => {
    setDraggedStep(null);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-white">
            Step-by-Step Instructions
          </h3>
          <p className="text-sm text-gray-400 mt-1">
            Drag to reorder • Edit titles and descriptions • Add images
          </p>
        </div>
        <button
          onClick={handleAddStep}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Add Step
        </button>
      </div>
      {steps?.length === 0 ? (
        <div className="text-center py-12 bg-gray-900 rounded-lg border-2 border-dashed border-gray-700">
          <p className="text-gray-400 mb-4">No steps added yet</p>
          <button
            onClick={handleAddStep}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Add First Step
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {steps?.map((step, index) => (
            <div
              key={step?.id || index}
              draggable
              onDragStart={(e) => handleDragStart(e, index)}
              onDragOver={(e) => handleDragOver(e, index)}
              onDragEnd={handleDragEnd}
              className={`bg-gray-900 rounded-lg border border-gray-700 overflow-hidden transition-all ${
                draggedStep === index ? 'opacity-50' : 'opacity-100'
              }`}
            >
              {/* Step Header */}
              <div className="flex items-center gap-4 p-4 bg-gray-800 border-b border-gray-700">
                <div className="cursor-move text-gray-500 hover:text-gray-300">
                  <GripVertical className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <span className="text-sm font-semibold text-blue-400">
                    Step {index + 1}
                  </span>
                  {step?.title?.[language] && (
                    <h4 className="text-white font-medium mt-1">
                      {step?.title?.[language]}
                    </h4>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setEditingStep(editingStep === index ? null : index)}
                    className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
                  >
                    {editingStep === index ? (
                      <Check className="w-5 h-5" />
                    ) : (
                      <Edit2 className="w-5 h-5" />
                    )}
                  </button>
                  <button
                    onClick={() => handleDeleteStep(index)}
                    className="p-2 text-red-400 hover:text-red-300 hover:bg-red-900/20 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Step Content */}
              {editingStep === index ? (
                <div className="p-6 space-y-4">
                  {/* Title */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Step Title ({language === 'en' ? 'English' : 'Spanish'})
                    </label>
                    <input
                      type="text"
                      value={step?.title?.[language] || ''}
                      onChange={(e) => handleUpdateStep(index, 'title', e?.target?.value)}
                      className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter step title"
                    />
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Step Description ({language === 'en' ? 'English' : 'Spanish'})
                    </label>
                    <RichTextEditor
                      value={step?.description?.[language] || ''}
                      onChange={(value) => handleUpdateStep(index, 'description', value)}
                      placeholder="Describe this step in detail..."
                    />
                  </div>
                </div>
              ) : (
                <div className="p-6">
                  {step?.description?.[language] ? (
                    <div 
                      className="text-gray-300 prose prose-invert max-w-none"
                      dangerouslySetInnerHTML={{ __html: step?.description?.[language] }}
                    />
                  ) : (
                    <p className="text-gray-500 italic">No description added yet</p>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default StepEditor;