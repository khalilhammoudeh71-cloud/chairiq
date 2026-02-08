import React, { useState } from 'react';
import { Sparkles, Copy, Check, RefreshCw } from 'lucide-react';
import Icon from '../../../components/AppIcon';


/**
 * Panel component for generating specific content type
 */
const ContentGenerationPanel = ({
  title,
  description,
  content,
  isGenerating,
  onGenerate,
  onCopy,
  icon: Icon,
  color
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    onCopy();
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
      {/* Header */}
      <div className={`${color} p-4 border-b border-gray-200`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
              <Icon className="w-5 h-5 text-gray-700" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
              <p className="text-sm text-gray-600">{description}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onGenerate}
              disabled={isGenerating}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                isGenerating
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed' :'bg-blue-600 text-white hover:bg-blue-700 active:scale-95'
              }`}
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  Generate
                </>
              )}
            </button>
            {content && (
              <button
                onClick={handleCopy}
                className="p-2 rounded-lg hover:bg-white/50 transition-colors"
                title="Copy content"
              >
                {copied ? (
                  <Check className="w-5 h-5 text-green-600" />
                ) : (
                  <Copy className="w-5 h-5 text-gray-600" />
                )}
              </button>
            )}
          </div>
        </div>
      </div>
      {/* Content Area */}
      <div className="p-6">
        {!content && !isGenerating && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center">
              <Icon className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-gray-500 mb-4">No content generated yet</p>
            <p className="text-sm text-gray-400">Click "Generate" to create AI-powered content</p>
          </div>
        )}

        {isGenerating && (
          <div className="space-y-3 animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-full"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            <div className="h-4 bg-gray-200 rounded w-full"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
          </div>
        )}

        {content && !isGenerating && (
          <div className="prose max-w-none">
            <div 
              className="text-gray-700 whitespace-pre-wrap"
              dangerouslySetInnerHTML={{ __html: content?.replace(/\n/g, '<br/>') }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default ContentGenerationPanel;