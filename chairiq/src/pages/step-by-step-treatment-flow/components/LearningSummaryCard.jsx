import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, TrendingUp, Sparkles, ChevronDown, ChevronUp, RefreshCw } from 'lucide-react';
import { generateProcedureSummary } from '../../../services/learningJourneySummaryService';

export default function LearningSummaryCard({ procedureId }) {
  const [summary, setSummary] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isExpanded, setIsExpanded] = useState(false);

  const loadSummary = async () => {
    if (!procedureId) return;

    setIsLoading(true);
    setError(null);

    try {
      const summaryData = await generateProcedureSummary(procedureId);
      setSummary(summaryData);
      setIsExpanded(true);
    } catch (err) {
      setError(err?.message || 'Failed to generate learning summary');
      setSummary(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadSummary();
  }, [procedureId]);

  const getRetentionColor = (score) => {
    if (score >= 80) return 'text-success';
    if (score >= 60) return 'text-success';
    if (score >= 40) return 'text-warning';
    return 'text-warning';
  };

  const getRetentionBgColor = (score) => {
    if (score >= 80) return 'bg-success/10';
    if (score >= 60) return 'bg-success/10';
    if (score >= 40) return 'bg-warning/10';
    return 'bg-warning/10';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="relative overflow-hidden rounded-2xl bg-bg2 backdrop-blur-xl border border-bd shadow-lg"
    >
      <div className="relative p-6 border-b border-bd">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-accent shadow-md">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-t1">Your Learning Journey</h3>
              <p className="text-sm text-t3 mt-1">
                Personalized insights powered by AI
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center justify-center w-10 h-10 rounded-lg bg-bg3 hover:brightness-110 transition-all duration-200 border border-bd"
            aria-label={isExpanded ? 'Collapse summary' : 'Expand summary'}
          >
            {isExpanded ? (
              <ChevronUp className="w-5 h-5 text-t3" />
            ) : (
              <ChevronDown className="w-5 h-5 text-t3" />
            )}
          </button>
        </div>
      </div>
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="relative overflow-hidden"
          >
            {isLoading && (
              <div className="p-8 flex flex-col items-center justify-center gap-4">
                <RefreshCw className="w-8 h-8 text-accent animate-spin" />
                <p className="text-t3 text-center">
                  Analyzing your learning journey...
                </p>
              </div>
            )}

            {error && (
              <div className="p-6 m-6 rounded-xl bg-danger/10 border border-danger/30">
                <p className="text-danger text-center">{error}</p>
                <button
                  onClick={loadSummary}
                  className="mt-4 w-full px-4 py-2 rounded-lg bg-danger/10 hover:bg-danger/20 text-danger font-medium transition-colors"
                >
                  Try Again
                </button>
              </div>
            )}

            {summary && !isLoading && (
              <div className="p-6 space-y-6">
                <div className="flex items-center justify-between p-4 rounded-xl bg-bg3 border border-bd">
                  <div className="flex items-center gap-3">
                    <TrendingUp className="w-6 h-6 text-accent" />
                    <span className="text-t2 font-medium">Retention Score</span>
                  </div>
                  <div className={`px-4 py-2 rounded-lg ${getRetentionBgColor(summary?.retentionScore)} ${getRetentionColor(summary?.retentionScore)} font-bold text-lg`}>
                    {summary?.retentionScore}%
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="text-lg font-semibold text-t1 flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-accent" />
                    Overall Progress
                  </h4>
                  <p className="text-t3 leading-relaxed pl-7">
                    {summary?.overallProgress}
                  </p>
                </div>

                {summary?.keyInsights?.length > 0 && (
                  <div className="space-y-3">
                    <h4 className="text-lg font-semibold text-t1">Key Insights</h4>
                    <ul className="space-y-2">
                      {summary?.keyInsights?.map((insight, index) => (
                        <motion.li
                          key={index}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="flex items-start gap-3 p-3 rounded-lg bg-success/10 border border-success/20"
                        >
                          <div className="flex-shrink-0 w-6 h-6 rounded-full bg-success/10 flex items-center justify-center mt-0.5">
                            <span className="text-success text-sm font-bold">
                              {index + 1}
                            </span>
                          </div>
                          <p className="text-t3 text-sm leading-relaxed flex-1">
                            {insight}
                          </p>
                        </motion.li>
                      ))}
                    </ul>
                  </div>
                )}

                {summary?.areasOfFocus?.length > 0 && (
                  <div className="space-y-3">
                    <h4 className="text-lg font-semibold text-t1">Areas of Focus</h4>
                    <div className="space-y-3">
                      {summary?.areasOfFocus?.map((area, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="p-4 rounded-lg bg-bg3 border border-bd"
                        >
                          <h5 className="text-t1 font-semibold mb-2">
                            {area?.topic}
                          </h5>
                          <p className="text-t3 text-sm leading-relaxed">
                            {area?.summary}
                          </p>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}

                {summary?.recommendations?.length > 0 && (
                  <div className="space-y-3">
                    <h4 className="text-lg font-semibold text-t1">Recommendations</h4>
                    <ul className="space-y-2">
                      {summary?.recommendations?.map((rec, index) => (
                        <motion.li
                          key={index}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="flex items-start gap-3 p-3 rounded-lg bg-accent/10 border border-accent/20"
                        >
                          <Sparkles className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                          <p className="text-t3 text-sm leading-relaxed flex-1">
                            {rec}
                          </p>
                        </motion.li>
                      ))}
                    </ul>
                  </div>
                )}

                {summary?.encouragement && (
                  <div className="p-4 rounded-xl bg-accent/10 border border-accent/30">
                    <p className="text-accent text-center italic leading-relaxed">
                      "{summary?.encouragement}"
                    </p>
                  </div>
                )}

                <button
                  onClick={loadSummary}
                  className="w-full py-3 px-4 rounded-xl bg-accent hover:brightness-110 text-white font-semibold flex items-center justify-center gap-2 shadow-md"
                >
                  <RefreshCw className="w-5 h-5" />
                  Regenerate Summary
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
