// Demo treatment plan configuration
// Expand this list to test with 10-12 procedures

export const demoTreatmentPlan = {
  patientName: 'Maria Rodriguez',
  treatmentPlanId: 'TP-2025-001',
  estimatedTimeline: 12,
  // Dynamic list of procedure IDs - easily expandable
  procedureIds: [
    'root-canal',
    'dental-crown',
    'dental-bridge',
    'scaling-root-planing',
    'simple-extraction',
    'wisdom-teeth-education',
    'valplast-education'
  ]
};

export default demoTreatmentPlan;