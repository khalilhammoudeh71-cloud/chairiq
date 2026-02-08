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
          <div className="mb-8">
            <h1 className="text-4xl font-semibold text-t1 mb-2 tracking-tight">
              Welcome back, {user?.user_metadata?.full_name || 'Doctor'}!
            </h1>
            <p className="text-t2 text-lg">{getCurrentDate()}</p>
          </div>

          {/* KPI Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard
              title="Active Patients"
              value={stats?.totalPatients}
              icon={Users}
            />
            <StatCard
              title="Plans This Month"
              value={stats?.monthlyPlans}
              icon={FileText}
            />
            <StatCard
              title="Completion Rate"
              value={stats?.completionRate}
              suffix="%"
              icon={TrendingUp}
            />
            <StatCard
              title="Avg. Engagement"
              value={stats?.avgEngagementMinutes}
              suffix="min"
              icon={Clock}
            />
          </div>

          {/* Patient Search and Treatment Details Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <PatientSearchCard onPatientSelect={handlePatientSelect} />
            <TreatmentDetailsCard 
              selectedPatient={selectedPatient} 
              onPatientDeleted={handlePatientDeleted}
            />
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <RecentPlansCard plans={recentPlans} onRefresh={fetchDashboardData} />
            <PendingActionsCard actions={pendingActions} />
          </div>

          {/* Shortcuts Section */}
          <ShortcutsCard />
        </PageShell>
      </div>
    </>
  );
}