import React, { useState } from 'react';
import { Sparkles, Copy, Check, RefreshCw } from 'lucide-react';
import Icon from '../../../components/AppIcon';


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
    <div className="bg-bg1 rounded-lg border border-bd shadow-sm overflow-hidden">
      <div className={`${color} p-4 border-b border-bd`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-bg1 rounded-lg flex items-center justify-center">
              <Icon className="w-5 h-5 text-t2" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-t1">{title}</h3>
              <p className="text-sm text-t2">{description}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onGenerate}
              disabled={isGenerating}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                isGenerating
                  ? 'bg-bg2 text-t3 cursor-not-allowed' :'bg-accent text-white hover:brightness-110'
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
                className="p-2 rounded-lg hover:bg-bg1/50 transition-colors"
                title="Copy content"
              >
                {copied ? (
                  <Check className="w-5 h-5 text-success" />
                ) : (
                  <Copy className="w-5 h-5 text-t2" />
                )}
              </button>
            )}
          </div>
        </div>
      </div>
      <div className="p-6">
        {!content && !isGenerating && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-bg2 rounded-full mx-auto mb-4 flex items-center justify-center">
              <Icon className="w-8 h-8 text-t3" />
            </div>
            <p className="text-t3 mb-4">No content generated yet</p>
            <p className="text-sm text-t3">Click "Generate" to create AI-powered content</p>
          </div>
        )}

        {isGenerating && (
          <div className="space-y-3 animate-pulse">
            <div className="h-4 bg-bg2 rounded w-3/4"></div>
            <div className="h-4 bg-bg2 rounded w-full"></div>
            <div className="h-4 bg-bg2 rounded w-5/6"></div>
            <div className="h-4 bg-bg2 rounded w-full"></div>
            <div className="h-4 bg-bg2 rounded w-2/3"></div>
          </div>
        )}

        {content && !isGenerating && (
          <div className="prose max-w-none">
            <div 
              className="text-t2 whitespace-pre-wrap"
              dangerouslySetInnerHTML={{ __html: content?.replace(/\n/g, '<br/>') }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default ContentGenerationPanel;