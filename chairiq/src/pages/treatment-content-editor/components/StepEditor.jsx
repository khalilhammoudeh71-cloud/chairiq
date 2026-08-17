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
          <h3 className="text-lg font-semibold text-t1">
            Step-by-Step Instructions
          </h3>
          <p className="text-sm text-t3 mt-1">
            Drag to reorder • Edit titles and descriptions • Add images
          </p>
        </div>
        <button
          onClick={handleAddStep}
          className="flex items-center gap-2 px-4 py-2 bg-accent text-accent-foreground rounded-lg hover:brightness-110 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Add Step
        </button>
      </div>
      {steps?.length === 0 ? (
        <div className="text-center py-12 bg-bg3 rounded-lg border-2 border-dashed border-bd">
          <p className="text-t3 mb-4">No steps added yet</p>
          <button
            onClick={handleAddStep}
            className="px-6 py-3 bg-accent text-accent-foreground rounded-lg hover:brightness-110 transition-colors"
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
              className={`bg-bg3 rounded-lg border border-bd overflow-hidden transition-all ${
                draggedStep === index ? 'opacity-50' : 'opacity-100'
              }`}
            >
              <div className="flex items-center gap-4 p-4 bg-bg2 border-b border-bd">
                <div className="cursor-move text-t3 hover:text-t2">
                  <GripVertical className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <span className="text-sm font-semibold text-accent">
                    Step {index + 1}
                  </span>
                  {step?.title?.[language] && (
                    <h4 className="text-t1 font-medium mt-1">
                      {step?.title?.[language]}
                    </h4>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setEditingStep(editingStep === index ? null : index)}
                    className="p-2 text-t3 hover:text-t1 hover:bg-bg3 rounded-lg transition-colors"
                  >
                    {editingStep === index ? (
                      <Check className="w-5 h-5" />
                    ) : (
                      <Edit2 className="w-5 h-5" />
                    )}
                  </button>
                  <button
                    onClick={() => handleDeleteStep(index)}
                    className="p-2 text-danger hover:text-danger hover:bg-danger/10 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {editingStep === index ? (
                <div className="p-6 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-t3 mb-2">
                      Step Title ({language === 'en' ? 'English' : 'Spanish'})
                    </label>
                    <input
                      type="text"
                      value={step?.title?.[language] || ''}
                      onChange={(e) => handleUpdateStep(index, 'title', e?.target?.value)}
                      className="w-full px-4 py-2 bg-bg2 border border-bd rounded-lg text-t1 focus:border-accent focus:outline-none"
                      placeholder="Enter step title"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-t3 mb-2">
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
                      className="text-t3 prose prose-invert max-w-none"
                      dangerouslySetInnerHTML={{ __html: step?.description?.[language] }}
                    />
                  ) : (
                    <p className="text-t3 italic">No description added yet</p>
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