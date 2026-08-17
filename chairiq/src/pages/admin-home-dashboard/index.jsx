import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Users, FileText, TrendingUp, Clock } from 'lucide-react';
import DentistNavigation from '../../components/DentistNavigation';
import { dashboardAnalyticsService } from '../../services/dashboardAnalyticsService';
import { useAuth } from '../../contexts/AuthContext';
import PageShell from '../../components/ui/PageShell';
import Card from '../../components/ui/Card';
import ButtonPrimary from '../../components/ui/ButtonPrimary';
import StatCard from './components/StatCard';
import RecentPlansCard from './components/RecentPlansCard';
import PendingActionsCard from './components/PendingActionsCard';
import ShortcutsCard from './components/ShortcutsCard';
import PatientSearchCard from './components/PatientSearchCard';
import TreatmentDetailsCard from './components/TreatmentDetailsCard';
import TestEmailCard from './components/TestEmailCard';
import TestSmsCard from './components/TestSmsCard';

export default function AdminHomeDashboard() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState(null);
  const [recentPlans, setRecentPlans] = useState([]);
  const [pendingActions, setPendingActions] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [statsData, plansData, actionsData] = await Promise.all([
        dashboardAnalyticsService?.getDashboardStats(),
        dashboardAnalyticsService?.getRecentPatientPlans(5),
        dashboardAnalyticsService?.getPendingActions(),
      ]);

      setStats(statsData);
      setRecentPlans(plansData);
      setPendingActions(actionsData);
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError(err?.message || 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const getCurrentDate = () => {
    return new Date()?.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const handlePatientSelect = (patient) => {
    setSelectedPatient(patient);
  };

  const handlePatientDeleted = () => {
    // Clear selected patient and refresh dashboard data
    setSelectedPatient(null);
    fetchDashboardData();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-bg0">
        <DentistNavigation />
        <div className="flex items-center justify-center min-h-[calc(100vh-64px)]">
          <div className="text-t1 text-xl">Loading dashboard...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-bg0">
        <DentistNavigation />
        <div className="flex items-center justify-center min-h-[calc(100vh-64px)]">
          <Card className="bg-danger/10 border-danger max-w-md">
            <p className="text-danger mb-4">{error}</p>
            <ButtonPrimary onClick={fetchDashboardData} className="w-full">
              Try Again
            </ButtonPrimary>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Admin Dashboard - ChairIQ</title>
        <meta name="description" content="ChairIQ dentist admin dashboard" />
      </Helmet>
      
      <div className="min-h-screen bg-bg0">
        <DentistNavigation />
        
        <PageShell>
          {/* Welcome Header */}
          <div className="mb-7 flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="section-label mb-1.5">{getCurrentDate()}</p>
              <h1 className="text-2xl font-bold text-t1 tracking-tight mb-0">
                Welcome back, {user?.user_metadata?.full_name || 'Doctor'}
              </h1>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-accent/25 bg-accent/5">
              <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
              <span className="text-xs font-medium text-t2">Practice overview</span>
            </div>
          </div>

          <div className="space-y-8">
            <section>
              <div className="flex items-center gap-2.5 mb-4">
                <div className="w-1 h-4 rounded-full bg-accent shadow-[0_0_8px_rgba(34,211,224,0.5)]" />
                <h2 className="text-[0.9375rem] font-semibold text-t1 tracking-tight mb-0">Key Metrics</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard
                  title="Active Patients"
                  value={stats?.totalPatients}
                  icon={Users}
                  accentColor="blue"
                />
                <StatCard
                  title="Plans This Month"
                  value={stats?.monthlyPlans}
                  icon={FileText}
                  accentColor="green"
                />
                <StatCard
                  title="Completion Rate"
                  value={stats?.completionRate}
                  suffix="%"
                  icon={TrendingUp}
                  accentColor="amber"
                />
                <StatCard
                  title="Avg. Engagement"
                  value={stats?.avgEngagementMinutes}
                  suffix="min"
                  icon={Clock}
                  accentColor="accent"
                />
              </div>
            </section>

            <section>
              <div className="flex items-center gap-2.5 mb-4">
                <div className="w-1 h-4 rounded-full bg-accent shadow-[0_0_8px_rgba(34,211,224,0.5)]" />
                <h2 className="text-[0.9375rem] font-semibold text-t1 tracking-tight mb-0">Patient Lookup</h2>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <PatientSearchCard onPatientSelect={handlePatientSelect} />
                <TreatmentDetailsCard 
                  selectedPatient={selectedPatient} 
                  onPatientDeleted={handlePatientDeleted}
                />
              </div>
            </section>

            <section>
              <div className="flex items-center gap-2.5 mb-4">
                <div className="w-1 h-4 rounded-full bg-accent shadow-[0_0_8px_rgba(34,211,224,0.5)]" />
                <h2 className="text-[0.9375rem] font-semibold text-t1 tracking-tight mb-0">Plans & Actions</h2>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <RecentPlansCard plans={recentPlans} onRefresh={fetchDashboardData} />
                <PendingActionsCard actions={pendingActions} />
              </div>
            </section>

            <section>
              <div className="flex items-center gap-2.5 mb-4">
                <div className="w-1 h-4 rounded-full bg-accent shadow-[0_0_8px_rgba(34,211,224,0.5)]" />
                <h2 className="text-[0.9375rem] font-semibold text-t1 tracking-tight mb-0">Quick Actions</h2>
              </div>
              <ShortcutsCard />
            </section>

            <section>
              <div className="flex items-center gap-2.5 mb-4">
                <div className="w-1 h-4 rounded-full bg-accent shadow-[0_0_8px_rgba(34,211,224,0.5)]" />
                <h2 className="text-[0.9375rem] font-semibold text-t1 tracking-tight mb-0">System Diagnostics</h2>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <TestEmailCard />
                <TestSmsCard />
              </div>
            </section>
          </div>
        </PageShell>
      </div>
    </>
  );
}