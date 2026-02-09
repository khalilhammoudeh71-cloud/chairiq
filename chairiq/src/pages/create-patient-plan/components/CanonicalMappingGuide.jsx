import React, { useState, useEffect } from 'react';
import { Info, BookOpen, ChevronDown, ChevronUp, Link2 } from 'lucide-react';
import { adaCodeMappingService } from '../../../services/adaCodeMappingService';

/**
 * Component to show dentists which ADA codes map to the same canonical education
 * Helps prevent duplicate education assignments and understand canonical mappings
 */
export default function CanonicalMappingGuide({ selectedAdaCodes = [] }) {
  const [mappingData, setMappingData] = useState({});
  const [loading, setLoading] = useState(true);
  const [expandedSlugs, setExpandedSlugs] = useState({});
  const [showGuide, setShowGuide] = useState(false);

  useEffect(() => {
    loadMappingData();
  }, []);

  const loadMappingData = async () => {
    setLoading(true);
    try {
      const { data, error } = await adaCodeMappingService?.getAdaCodesByCanonicalSlug();
      if (!error && data) {
        setMappingData(data);
      }
    } catch (error) {
      console.error('Error loading canonical mapping data:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleExpand = (slug) => {
    setExpandedSlugs(prev => ({
      ...prev,
      [slug]: !prev?.[slug]
    }));
  };

  // Get canonical slugs for selected ADA codes
  const getSelectedCanonicalSlugs = () => {
    const slugs = new Set();
    selectedAdaCodes?.forEach(code => {
      Object.values(mappingData)?.forEach(mapping => {
        if (mapping?.adaCodes?.some(ac => ac?.code === code)) {
          slugs?.add(mapping?.canonicalSlug);
        }
      });
    });
    return Array.from(slugs);
  };

  const selectedSlugs = getSelectedCanonicalSlugs();
  const hasSelectedCodes = selectedAdaCodes?.length > 0;

  if (loading) {
    return (
      <div className="card bg-accent/5 border-accent/20">
        <div className="flex items-center gap-3 animate-pulse">
          <Info className="w-5 h-5 text-accent" />
          <p className="text-t2">Loading canonical education mappings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="card bg-accent/10 border-accent/30">
      {/* Header */}
      <button
        onClick={() => setShowGuide(!showGuide)}
        className="w-full flex items-center justify-between gap-4 text-left"
      >
        <div className="flex items-center gap-3">
          <div className="p-2 bg-accent/10 rounded-lg">
            <BookOpen className="w-5 h-5 text-accent" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-t1">Canonical Education Mapping Guide</h3>
            <p className="text-sm text-t2 mt-0.5">
              Understand which ADA codes share the same patient education content
            </p>
          </div>
        </div>
        {showGuide ? (
          <ChevronUp className="w-5 h-5 text-accent flex-shrink-0" />
        ) : (
          <ChevronDown className="w-5 h-5 text-accent flex-shrink-0" />
        )}
      </button>

      {/* Expanded Content */}
      {showGuide && (
        <div className="mt-6 pt-6 border-t border-accent/20">
          {/* Information Banner */}
          <div className="mb-6 p-4 bg-accent/10 rounded-lg border border-accent/30">
            <div className="flex items-start gap-3">
              <Info className="w-5 h-5 text-accent mt-0.5 flex-shrink-0" />
              <div className="text-sm">
                <p className="text-t1 font-semibold mb-2">
                  What is Canonical Education Mapping?
                </p>
                <p className="text-t2">
                  Multiple ADA codes often describe variations of the same procedure. 
                  Our system groups these codes under a single "canonical" education module 
                  to provide consistent, high-quality patient education.
                </p>
                <p className="text-t2 mt-2">
                  <strong>Example:</strong> All crown codes (D2740, D2750, D2782, etc.) use the 
                  same "crown" education content, preventing duplicate assignments.
                </p>
              </div>
            </div>
          </div>

          {/* Selected Codes Highlight */}
          {hasSelectedCodes && selectedSlugs?.length > 0 && (
            <div className="mb-6 p-4 bg-success/10 rounded-lg border border-success/30">
              <div className="flex items-start gap-3">
                <Link2 className="w-5 h-5 text-success mt-0.5 flex-shrink-0" />
                <div className="text-sm">
                  <p className="text-t1 font-semibold mb-2">
                    Your Selected Codes Map To:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {selectedSlugs?.map(slug => {
                      const mapping = mappingData?.[slug];
                      return (
                        <span
                          key={slug}
                          className="px-3 py-1.5 bg-success/20 text-success rounded-full text-xs font-semibold"
                        >
                          {mapping?.displayNameEn || slug}
                        </span>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Mapping List */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-t2 uppercase tracking-wider">
              All Canonical Mappings ({Object.keys(mappingData)?.length})
            </h4>

            {Object.values(mappingData)?.map(mapping => {
              const isExpanded = expandedSlugs?.[mapping?.canonicalSlug];
              const isSelected = selectedSlugs?.includes(mapping?.canonicalSlug);
              const codeCount = mapping?.adaCodes?.length;

              return (
                <div
                  key={mapping?.canonicalSlug}
                  className={`card border-2 transition-all ${
                    isSelected
                      ? 'bg-accent/10 border-accent' :'bg-bg2 border-bd hover:border-accent/30'
                  }`}
                >
                  <button
                    onClick={() => toggleExpand(mapping?.canonicalSlug)}
                    className="w-full flex items-center justify-between gap-4 text-left"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1">
                        <h5 className="text-base font-bold text-t1">
                          {mapping?.displayNameEn}
                        </h5>
                        {isSelected && (
                          <span className="px-2 py-0.5 bg-accent text-bg0 rounded text-xs font-semibold">
                            In Your Plan
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-3 text-xs text-t3">
                        <span className="px-2 py-0.5 bg-bg3 rounded">
                          {mapping?.category}
                        </span>
                        <span className="font-semibold">
                          {codeCount} ADA {codeCount === 1 ? 'Code' : 'Codes'}
                        </span>
                      </div>
                    </div>
                    {isExpanded ? (
                      <ChevronUp className="w-5 h-5 text-t3 flex-shrink-0" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-t3 flex-shrink-0" />
                    )}
                  </button>

                  {/* Expanded ADA Codes List */}
                  {isExpanded && (
                    <div className="mt-4 pt-4 border-t border-bd">
                      <p className="text-xs text-t3 mb-3 font-semibold uppercase tracking-wider">
                        ADA Codes Using This Education:
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {mapping?.adaCodes?.map(code => {
                          const isSelectedCode = selectedAdaCodes?.includes(code?.code);
                          return (
                            <div
                              key={code?.code}
                              className={`p-3 rounded-lg border ${
                                isSelectedCode
                                  ? 'bg-accent/10 border-accent' :'bg-bg3 border-bd'
                              }`}
                            >
                              <div className="flex items-center gap-2 mb-1">
                                <span className={`text-sm font-bold ${
                                  isSelectedCode ? 'text-accent' : 'text-t1'
                                }`}>
                                  {code?.code}
                                </span>
                                {isSelectedCode && (
                                  <span className="px-1.5 py-0.5 bg-accent text-bg0 rounded text-xs font-semibold">
                                    Selected
                                  </span>
                                )}
                              </div>
                              <p className="text-xs text-t2 line-clamp-2">
                                {code?.description}
                              </p>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Footer Note */}
          <div className="mt-6 p-3 bg-bg3 rounded-lg border border-bd">
            <p className="text-xs text-t3 text-center">
              💡 <strong>Pro Tip:</strong> When adding procedures to your treatment plan, 
              codes that share the same canonical education will show the same content to patients, 
              ensuring consistency across your practice.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}