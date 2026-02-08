// Treatment progress management utilities

// Keys used in localStorage for progress tracking
const PROGRESS_KEYS = {
  CURRENT_STEP: 'chairiq-current-step',
  PROGRESS: 'chairiq-progress',
  SELECTED_PROCEDURE: 'selectedProcedureIndex',
  STEP_INDEX: 'chairiq_step_index'
};

/**
 * Resets all treatment progress in localStorage
 * Call this when user clicks "Start My Treatment Plan" for fresh start
 */
export const resetTreatmentProgress = () => {
  Object.values(PROGRESS_KEYS)?.forEach(key => {
    localStorage.removeItem(key);
  });
  
  // Also clear any other potential progress keys
  const allKeys = Object.keys(localStorage);
  allKeys?.forEach(key => {
    if (key?.includes('chairiq') && key?.includes('step')) {
      localStorage.removeItem(key);
    }
  });
};

/**
 * Gets current step from localStorage
 * @returns {number} Current step index (0-based)
 */
export const getCurrentStep = () => {
  const saved = localStorage.getItem(PROGRESS_KEYS?.CURRENT_STEP);
  return saved ? parseInt(saved) : 0;
};

/**
 * Saves current step to localStorage
 * @param {number} step - Step index to save
 */
export const saveCurrentStep = (step) => {
  localStorage.setItem(PROGRESS_KEYS?.CURRENT_STEP, step?.toString());
};

/**
 * Checks if user has saved progress
 * @returns {boolean} True if progress exists
 */
export const hasSavedProgress = () => {
  return localStorage.getItem(PROGRESS_KEYS?.CURRENT_STEP) !== null;
};

export default {
  resetTreatmentProgress,
  getCurrentStep,
  saveCurrentStep,
  hasSavedProgress,
  PROGRESS_KEYS
};