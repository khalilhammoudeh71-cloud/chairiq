import React from "react";
import { BrowserRouter, Routes as RouterRoutes, Route, Navigate } from "react-router-dom";
import ScrollToTop from "components/ScrollToTop";
import ErrorBoundary from "components/ErrorBoundary";
import NotFound from "pages/NotFound";
import TreatmentPlanLanding from './pages/treatment-plan-landing';
import IndividualProcedureDetail from './pages/individual-procedure-detail';
import StepByStepTreatmentFlow from './pages/step-by-step-treatment-flow';
import ProcedureListOverview from './pages/procedure-list-overview';
import TreatmentCompletion from './pages/treatment-completion';
import CreatePatientPlan from './pages/create-patient-plan';
import PatientPlanView from './pages/patient-plan-view';
import DentistAdminAnalyticsDashboard from "pages/dentist-admin-analytics-dashboard";
import DentistLoginAuthentication from './pages/dentist-login-authentication';
import AccessDenied from './pages/access-denied';
import ProtectedRoute from './components/ProtectedRoute';
import AdminHomeDashboard from './pages/admin-home-dashboard';
import TreatmentContentManagementDashboard from "pages/treatment-content-management-dashboard";
import TreatmentContentEditor from './pages/treatment-content-editor';
import ProcedureLibraryManagement from './pages/procedure-library-management';
import MarkdownContentEditor from './pages/markdown-content-editor';
import AdminProcedureLibrary from './pages/admin-procedure-library';
import AdminProcedureCodesImport from 'pages/admin-procedure-codes-import';
import AIContentGenerationStudio from './pages/ai-content-generation-studio';
import BatchJobDetails from './pages/batch-job-details';
import AdaCodeManagementDashboard from "./pages/ada-code-management-dashboard";
import Privacy from './pages/privacy-policy';
import Terms from './pages/terms-of-service';
import SmsDisclosure from './pages/sms';
import Landing from './pages/landing';
import DentistSignUpPage from './pages/dentist-sign-up-page';
function ProjectRoutes() {
  return (
    <BrowserRouter>
      <ErrorBoundary>
        <ScrollToTop />
        <RouterRoutes>
          {/* Public Landing Page */}
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<DentistLoginAuthentication />} />
          <Route path="/signup" element={<DentistSignUpPage />} />
          {/* Public Routes */}
          <Route path="/treatment-plan-landing" element={<TreatmentPlanLanding />} />
          <Route path="/individual-procedure-detail" element={<IndividualProcedureDetail />} />
          <Route path="/step-by-step-treatment-flow" element={<StepByStepTreatmentFlow />} />
          <Route path="/procedure-list-overview" element={<ProcedureListOverview />} />
          <Route path="/treatment-completion" element={<TreatmentCompletion />} />
          <Route path="/ada-code-management-dashboard" element={<AdaCodeManagementDashboard />} />
          <Route path="/p/:publicToken" element={<PatientPlanView />} />
          <Route path="/privacy-policy" element={<Privacy />} />
          <Route path="/terms-of-service" element={<Terms />} />
          <Route path="/sms" element={<SmsDisclosure />} />
          {/* Authentication Routes - /dentist-login-authentication redirects to /login */}
          <Route path="/dentist-login-authentication" element={<Navigate to="/login" replace />} />
          <Route path="/access-denied" element={<AccessDenied />} />
          {/* Protected Dentist Routes */}
          <Route 
            path="/admin-home-dashboard" 
            element={
              <ProtectedRoute requireDentist={true}>
                <AdminHomeDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/create-patient-plan" 
            element={
              <ProtectedRoute requireDentist={true}>
                <CreatePatientPlan />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/dentist-admin-analytics-dashboard" 
            element={
              <ProtectedRoute requireDentist={true}>
                <DentistAdminAnalyticsDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/treatment-content-management-dashboard" 
            element={
              <ProtectedRoute>
                <TreatmentContentManagementDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/treatment-content-editor" 
            element={
              <ProtectedRoute>
                <TreatmentContentEditor />
              </ProtectedRoute>
            } 
          />
          {/* New Procedure Library Routes */}
          <Route
            path="/procedure-library-management"
            element={
              <ProtectedRoute>
                <ProcedureLibraryManagement />
              </ProtectedRoute>
            }
          />
          <Route
            path="/markdown-content-editor"
            element={
              <ProtectedRoute>
                <MarkdownContentEditor />
              </ProtectedRoute>
            }
          />
          <Route path="/admin-procedure-library" element={
            <ProtectedRoute>
              <AdminProcedureLibrary />
            </ProtectedRoute>
          } />
          <Route
            path="/admin/procedure-codes-import"
            element={
              <ProtectedRoute>
                <AdminProcedureCodesImport />
              </ProtectedRoute>
            }
          />
          <Route path="/admin/procedure-library" element={
            <ProtectedRoute>
              <ProcedureLibraryManagement />
            </ProtectedRoute>
          } />
          <Route path="/admin/ai-content-generation" element={
            <ProtectedRoute>
              <AIContentGenerationStudio />
            </ProtectedRoute>
          } />
          <Route path="/admin/batch-jobs/:jobId" element={
            <ProtectedRoute>
              <BatchJobDetails />
            </ProtectedRoute>
          } />
          <Route path="*" element={<NotFound />} />
        </RouterRoutes>
      </ErrorBoundary>
    </BrowserRouter>
  );
}
export default ProjectRoutes;