import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, TrendingUp, Sparkles, ChevronDown, ChevronUp, RefreshCw } from 'lucide-react';
import { generateProcedureSummary } from '../../../services/learningJourneySummaryService';

/**
 * LearningSummaryCard Component
 * Displays personalized OpenAI-generated learning journey summaries
 * for the current procedure based on Q&A history and progress
 */
export default function LearningSummaryCard({ procedureId }) {
  const [summary, setSummary] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isExpanded, setIsExpanded] = useState(false);

  /**
   * Loads the learning journey summary for the procedure
   */
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

  /**
   * Auto-load summary when component mounts
   */
  useEffect(() => {
    loadSummary();
  }, [procedureId]);

  /**
   * Determines retention score color
   */
  const getRetentionColor = (score) => {
    if (score >= 80) return 'text-emerald-400';
    if (score >= 60) return 'text-teal-400';
    if (score >= 40) return 'text-yellow-400';
    return 'text-orange-400';
  };

  /**
   * Determines retention score background
   */
  const getRetentionBgColor = (score) => {
    if (score >= 80) return 'bg-emerald-500/20';
    if (score >= 60) return 'bg-teal-500/20';
    if (score >= 40) return 'bg-yellow-500/20';
    return 'bg-orange-500/20';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-xl border border-slate-700/50 shadow-2xl"
    >
      {/* Animated background glow */}
      <div className="absolute inset-0 bg-gradient-to-r from-teal-500/5 via-purple-500/5 to-teal-500/5 animate-pulse" />
      {/* Header */}
      <div className="relative p-6 border-b border-slate-700/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-teal-500 to-cyan-600 shadow-lg">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">Your Learning Journey</h3>
              <p className="text-sm text-slate-400 mt-1">
                Personalized insights powered by AI
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center justify-center w-10 h-10 rounded-lg bg-slate-800 hover:bg-slate-700 transition-all duration-200 border border-slate-600"
            aria-label={isExpanded ? 'Collapse summary' : 'Expand summary'}
          >
            {isExpanded ? (
              <ChevronUp className="w-5 h-5 text-slate-300" />
            ) : (
              <ChevronDown className="w-5 h-5 text-slate-300" />
            )}
          </button>
        </div>
      </div>
      {/* Content */}
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
                <RefreshCw className="w-8 h-8 text-teal-400 animate-spin" />
                <p className="text-slate-300 text-center">
                  Analyzing your learning journey...
                </p>
              </div>
            )}

            {error && (
              <div className="p-6 m-6 rounded-xl bg-red-500/10 border border-red-500/30">
                <p className="text-red-400 text-center">{error}</p>
                <button
                  onClick={loadSummary}
                  className="mt-4 w-full px-4 py-2 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-300 font-medium transition-colors"
                >
                  Try Again
                </button>
              </div>
            )}

            {summary && !isLoading && (
              <div className="p-6 space-y-6">
                {/* Retention Score */}
                <div className="flex items-center justify-between p-4 rounded-xl bg-slate-800/50 border border-slate-700/50">
                  <div className="flex items-center gap-3">
                    <TrendingUp className="w-6 h-6 text-teal-400" />
                    <span className="text-slate-300 font-medium">Retention Score</span>
                  </div>
                  <div className={`px-4 py-2 rounded-lg ${getRetentionBgColor(summary?.retentionScore)} ${getRetentionColor(summary?.retentionScore)} font-bold text-lg`}>
                    {summary?.retentionScore}%
                  </div>
                </div>

                {/* Overall Progress */}
                <div className="space-y-2">
                  <h4 className="text-lg font-semibold text-white flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-teal-400" />
                    Overall Progress
                  </h4>
                  <p className="text-slate-300 leading-relaxed pl-7">
                    {summary?.overallProgress}
                  </p>
                </div>

                {/* Key Insights */}
                {summary?.keyInsights?.length > 0 && (
                  <div className="space-y-3">
                    <h4 className="text-lg font-semibold text-white">Key Insights</h4>
                    <ul className="space-y-2">
                      {summary?.keyInsights?.map((insight, index) => (
                        <motion.li
                          key={index}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="flex items-start gap-3 p-3 rounded-lg bg-teal-500/10 border border-teal-500/20"
                        >
                          <div className="flex-shrink-0 w-6 h-6 rounded-full bg-teal-500/20 flex items-center justify-center mt-0.5">
                            <span className="text-teal-400 text-sm font-bold">
                              {index + 1}
                            </span>
                          </div>
                          <p className="text-slate-300 text-sm leading-relaxed flex-1">
                            {insight}
                          </p>
                        </motion.li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Areas of Focus */}
                {summary?.areasOfFocus?.length > 0 && (
                  <div className="space-y-3">
                    <h4 className="text-lg font-semibold text-white">Areas of Focus</h4>
                    <div className="space-y-3">
                      {summary?.areasOfFocus?.map((area, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="p-4 rounded-lg bg-slate-800/50 border border-slate-700/50"
                        >
                          <h5 className="text-white font-semibold mb-2">
                            {area?.topic}
                          </h5>
                          <p className="text-slate-300 text-sm leading-relaxed">
                            {area?.summary}
                          </p>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Recommendations */}
                {summary?.recommendations?.length > 0 && (
                  <div className="space-y-3">
                    <h4 className="text-lg font-semibold text-white">Recommendations</h4>
                    <ul className="space-y-2">
                      {summary?.recommendations?.map((rec, index) => (
                        <motion.li
                          key={index}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="flex items-start gap-3 p-3 rounded-lg bg-purple-500/10 border border-purple-500/20"
                        >
                          <Sparkles className="w-5 h-5 text-purple-400 flex-shrink-0 mt-0.5" />
                          <p className="text-slate-300 text-sm leading-relaxed flex-1">
                            {rec}
                          </p>
                        </motion.li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Encouragement */}
                {summary?.encouragement && (
                  <div className="p-4 rounded-xl bg-gradient-to-r from-teal-500/10 to-cyan-500/10 border border-teal-500/30">
                    <p className="text-teal-300 text-center italic leading-relaxed">
                      "{summary?.encouragement}"
                    </p>
                  </div>
                )}

                {/* Refresh Button */}
                <button
                  onClick={loadSummary}
                  className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700 text-white font-semibold flex items-center justify-center gap-2 shadow-lg"
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