import React, { useState, useEffect } from 'react';
import { patientAnalyticsService } from '../../services/patientAnalyticsService';
import { patientPlanService } from '../../services/patientPlanService';
import { emailService } from '../../services/emailService';
import { AlertTriangle, Download, Send, Copy, Mail, MessageSquare } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import DentistNavigation from '../../components/DentistNavigation';
import Card from '../../components/ui/Card';
import ButtonSecondary from '../../components/ui/ButtonSecondary';
import Select from '../../components/ui/Select';
import Badge from '../../components/ui/Badge';

export default function DentistAdminAnalyticsDashboard() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [overallMetrics, setOverallMetrics] = useState(null);
  const [engagementTrends, setEngagementTrends] = useState([]);
  const [patientList, setPatientList] = useState([]);
  const [languageDistribution, setLanguageDistribution] = useState([]);
  const [dropoutAnalysis, setDropoutAnalysis] = useState([]);
  const [procedureAnalytics, setProcedureAnalytics] = useState([]);
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [dateRange, setDateRange] = useState('30');
  const [timeRange, setTimeRange] = useState('30d');
  const [resendingToken, setResendingToken] = useState(null);
  const [resendingEmailToken, setResendingEmailToken] = useState(null);
  const [emailPrompt, setEmailPrompt] = useState(null);
  const [emailInput, setEmailInput] = useState('');
  const [copyingToken, setCopyingToken] = useState(null);
  const [successMessages, setSuccessMessages] = useState({});
  const [errorMessage, setErrorMessage] = useState('');
  const [messageTimer, setMessageTimer] = useState(null);

  useEffect(() => {
    loadAnalyticsData();
  }, [selectedFilter, dateRange, timeRange]);

  useEffect(() => {
    // Cleanup timer on unmount
    return () => {
      if (messageTimer) {
        clearTimeout(messageTimer);
      }
    };
  }, [messageTimer]);

  const loadAnalyticsData = async () => {
    try {
      setLoading(true);
      setError('');

      const [
        metrics,
        trends,
        patients,
        languages,
        dropouts,
        procedures
      ] = await Promise.all([
        patientAnalyticsService?.getOverallAnalytics(),
        patientAnalyticsService?.getEngagementTrends(parseInt(dateRange)),
        patientAnalyticsService?.getPatientEngagementList({ language: selectedFilter !== 'all' ? selectedFilter : null }),
        patientAnalyticsService?.getLanguageDistribution(),
        patientAnalyticsService?.getDropoutAnalysis(),
        patientAnalyticsService?.getProcedureAnalytics()
      ]);

      setOverallMetrics(metrics);
      setEngagementTrends(trends);
      setPatientList(patients);
      setLanguageDistribution(languages);
      setDropoutAnalysis(dropouts);
      setProcedureAnalytics(procedures);
    } catch (err) {
      console.error('Error loading analytics:', err);
      setError(err?.message || 'Failed to load analytics data');
    } finally {
      setLoading(false);
    }
  };

  const handleCopyLink = async (publicToken, patientName) => {
    try {
      setCopyingToken(publicToken);
      const link = `${window.location?.origin}/treatment-plan-landing?token=${publicToken}`;
      
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(link);
      } else {
        const textArea = document.createElement('textarea');
        textArea.value = link;
        textArea.style.position = 'fixed';
        textArea.style.left = '-9999px';
        textArea.style.top = '-9999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
      }
      
      if (messageTimer) {
        clearTimeout(messageTimer);
      }
      
      setSuccessMessages({ [publicToken]: 'Link copied' });
      setErrorMessage('');
      
      // Auto-hide after 2 seconds
      const timer = setTimeout(() => {
        setSuccessMessages({});
      }, 2000);
      
      setMessageTimer(timer);
    } catch (err) {
      console.error('Error copying link:', err);
      
      // Clear any existing timer
      if (messageTimer) {
        clearTimeout(messageTimer);
      }
      
      setErrorMessage('Failed to copy link');
      setSuccessMessages({});
      
      // Auto-hide after 2 seconds
      const timer = setTimeout(() => {
        setErrorMessage('');
      }, 2000);
      
      setMessageTimer(timer);
    } finally {
      setCopyingToken(null);
    }
  };

  const handleResendLink = async (publicToken, patientName) => {
    try {
      setResendingToken(publicToken);
      
      // Clear any existing timer
      if (messageTimer) {
        clearTimeout(messageTimer);
      }
      
      setSuccessMessages({});
      setErrorMessage('');

      const result = await patientPlanService?.resendTreatmentPlanLink(publicToken);

      if (result?.success) {
        setSuccessMessages({ [publicToken]: 'Message sent' });
        
        // Auto-hide after 2 seconds
        const timer = setTimeout(() => {
          setSuccessMessages({});
        }, 2000);
        
        setMessageTimer(timer);
      } else {
        setErrorMessage(result?.userMessage || 'Failed to resend link');
        
        // Auto-hide after 2 seconds
        const timer = setTimeout(() => {
          setErrorMessage('');
        }, 2000);
        
        setMessageTimer(timer);
      }
    } catch (err) {
      console.error('Error resending link:', err);
      
      // Clear any existing timer
      if (messageTimer) {
        clearTimeout(messageTimer);
      }
      
      setErrorMessage(err?.message || 'Failed to resend treatment plan link');
      
      // Auto-hide after 2 seconds
      const timer = setTimeout(() => {
        setErrorMessage('');
      }, 2000);
      
      setMessageTimer(timer);
    } finally {
      setResendingToken(null);
    }
  };

  const handleResendViaEmail = async (publicToken, patientName, email) => {
    try {
      setResendingEmailToken(publicToken);
      if (messageTimer) clearTimeout(messageTimer);
      setSuccessMessages({});
      setErrorMessage('');

      const planUrl = `${window?.location?.origin}/treatment-plan-landing?token=${publicToken}`;
      const result = await emailService.sendNotification({
        method: 'email',
        toEmail: email,
        patientName: patientName || 'Patient',
        planUrl,
      });

      if (result?.success) {
        setSuccessMessages({ [publicToken]: 'Email sent' });
        setEmailPrompt(null);
        setEmailInput('');
        const timer = setTimeout(() => setSuccessMessages({}), 2000);
        setMessageTimer(timer);
      } else {
        setErrorMessage(result?.error || 'Failed to send email');
        const timer = setTimeout(() => setErrorMessage(''), 3000);
        setMessageTimer(timer);
      }
    } catch (err) {
      console.error('Error sending email:', err);
      if (messageTimer) clearTimeout(messageTimer);
      setErrorMessage(err?.message || 'Failed to send email');
      const timer = setTimeout(() => setErrorMessage(''), 3000);
      setMessageTimer(timer);
    } finally {
      setResendingEmailToken(null);
    }
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };

  const handleExport = () => {
    // Export functionality placeholder
    console.log('Exporting data...');
  };

  const statsData = [
    {
      label: 'Total Patients',
      value: overallMetrics?.totalPatients || 0,
      change: overallMetrics?.patientChange || 0,
      icon: AlertTriangle
    },
    {
      label: 'Active Plans',
      value: overallMetrics?.activePlans || 0,
      change: overallMetrics?.plansChange || 0,
      icon: AlertTriangle
    },
    {
      label: 'Avg. Engagement',
      value: overallMetrics?.averageEngagement ? `${overallMetrics?.averageEngagement}%` : '0%',
      change: overallMetrics?.engagementChange || 0,
      icon: AlertTriangle
    },
    {
      label: 'Completion Rate',
      value: overallMetrics?.completionRate ? `${overallMetrics?.completionRate}%` : '0%',
      change: overallMetrics?.completionChange || 0,
      icon: AlertTriangle
    }
  ];

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

  if (loading) {
    return (
      <div className="min-h-screen bg-bg0 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-accent mx-auto mb-4"></div>
          <p className="text-t2 font-medium">Loading Analytics...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-bg0 flex items-center justify-center">
        <div className="bg-bg2 rounded-xl shadow-lg p-8 max-w-md border border-bd">
          <AlertTriangle className="w-12 h-12 text-danger mx-auto mb-4" />
          <h2 className="text-xl font-bold text-t1 mb-2 text-center">Error Loading Analytics</h2>
          <p className="text-t2 text-center mb-4">{error}</p>
          <button
            onClick={loadAnalyticsData}
            className="w-full bg-accent text-t1 px-6 py-3 rounded-lg font-medium hover:bg-accent2 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-bg0">
        <DentistNavigation />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-t1 mb-2">Analytics Dashboard</h1>
            <p className="text-t2">Track patient engagement and treatment effectiveness</p>
          </div>

          {/* Success/Error Messages */}
          {successMessages && Object.keys(successMessages)?.length > 0 && (
            <div className="mb-6 bg-success/10 border border-success text-success px-4 py-3 rounded-lg">
              {Object.values(successMessages)?.join(', ')}
            </div>
          )}
          {errorMessage && (
            <div className="mb-6 bg-danger/10 border border-danger text-danger px-4 py-3 rounded-lg">
              {errorMessage}
            </div>
          )}

          {/* Filters */}
          <Card className="mb-6">
            <div className="flex flex-wrap gap-4">
              <Select
                value={timeRange}
                onChange={(e) => setTimeRange(e?.target?.value)}
                className="w-48"
              >
                <option value="7d">Last 7 Days</option>
                <option value="30d">Last 30 Days</option>
                <option value="90d">Last 90 Days</option>
              </Select>
              <ButtonSecondary onClick={handleExport}>
                <Download size={16} className="mr-2" />
                Export Data
              </ButtonSecondary>
            </div>
          </Card>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {statsData?.map((stat, index) => (
              <Card key={index} padding="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-t2 text-sm mb-1">{stat?.label}</p>
                    <p className="text-t1 text-2xl font-bold">{stat?.value}</p>
                    {stat?.change && (
                      <Badge 
                        variant={stat?.change > 0 ? 'success' : 'danger'}
                        size="sm"
                        className="mt-2"
                      >
                        {stat?.change > 0 ? '+' : ''}{stat?.change}%
                      </Badge>
                    )}
                  </div>
                  <stat.icon className="text-accent" size={24} />
                </div>
              </Card>
            ))}
          </div>

          {/* Patient List with Resend and Copy Buttons */}
          <Card className="mb-8">
            <h3 className="text-t1 font-semibold text-lg mb-4">Patient Engagement List</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-bd">
                    <th className="text-left py-3 px-4 text-t2 font-medium">Patient</th>
                    <th className="text-left py-3 px-4 text-t2 font-medium">Language</th>
                    <th className="text-left py-3 px-4 text-t2 font-medium">Time Spent</th>
                    <th className="text-left py-3 px-4 text-t2 font-medium">Completion</th>
                    <th className="text-left py-3 px-4 text-t2 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {patientList?.length > 0 ? (
                    patientList?.map((patient, index) => (
                      <tr key={index} className="border-b border-bd hover:bg-bg1">
                        <td className="py-3 px-4 text-t1">{patient?.patientName}</td>
                        <td className="py-3 px-4">
                          <Badge variant={patient?.language === 'EN' ? 'default' : 'warning'} size="sm">
                            {patient?.language}
                          </Badge>
                        </td>
                        <td className="py-3 px-4 text-t2">{formatTime(patient?.timeSpent)}</td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <span className="text-t1">{patient?.completionStatus}</span>
                            <Badge 
                              variant={patient?.completionPercentage > 50 ? 'success' : 'warning'}
                              size="sm"
                            >
                              {patient?.completionPercentage}%
                            </Badge>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="relative">
                            <div className="flex items-center gap-2 flex-wrap">
                              <button
                                onClick={() => handleResendLink(patient?.publicToken, patient?.patientName)}
                                disabled={resendingToken === patient?.publicToken}
                                className="flex items-center gap-1.5 bg-accent text-white px-3 py-1.5 rounded-lg text-sm font-medium hover:brightness-110 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                {resendingToken === patient?.publicToken ? (
                                  <>
                                    <div className="animate-spin rounded-full h-3.5 w-3.5 border-2 border-t-transparent border-white"></div>
                                    <span>Sending...</span>
                                  </>
                                ) : (
                                  <>
                                    <MessageSquare size={14} />
                                    <span>SMS</span>
                                  </>
                                )}
                              </button>
                              <button
                                onClick={() => {
                                  setEmailPrompt(emailPrompt === patient?.publicToken ? null : patient?.publicToken);
                                  setEmailInput('');
                                }}
                                disabled={resendingEmailToken === patient?.publicToken}
                                className="flex items-center gap-1.5 text-white px-3 py-1.5 rounded-lg text-sm font-medium hover:brightness-110 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                style={{ backgroundColor: '#2D7D46' }}
                              >
                                {resendingEmailToken === patient?.publicToken ? (
                                  <>
                                    <div className="animate-spin rounded-full h-3.5 w-3.5 border-2 border-t-transparent border-white"></div>
                                    <span>Sending...</span>
                                  </>
                                ) : (
                                  <>
                                    <Mail size={14} />
                                    <span>Email</span>
                                  </>
                                )}
                              </button>
                              <button
                                onClick={() => handleCopyLink(patient?.publicToken, patient?.patientName)}
                                disabled={copyingToken === patient?.publicToken}
                                className="flex items-center gap-1.5 bg-bg2 text-t1 px-3 py-1.5 rounded-lg text-sm font-medium hover:brightness-110 transition-colors disabled:opacity-50 disabled:cursor-not-allowed border border-bd"
                              >
                                {copyingToken === patient?.publicToken ? (
                                  <>
                                    <div className="animate-spin rounded-full h-3.5 w-3.5 border-2 border-t-transparent border-t1"></div>
                                    <span>Copying...</span>
                                  </>
                                ) : (
                                  <>
                                    <Copy size={14} />
                                    <span>Copy</span>
                                  </>
                                )}
                              </button>
                            </div>
                            {emailPrompt === patient?.publicToken && (
                              <div className="mt-2 flex items-center gap-2">
                                <input
                                  type="email"
                                  value={emailInput}
                                  onChange={(e) => setEmailInput(e.target.value)}
                                  placeholder="patient@email.com"
                                  className="flex-1 bg-bg1 border border-bd rounded-lg px-3 py-1.5 text-sm text-t1 placeholder-t3 focus:outline-none focus:border-accent"
                                  onKeyDown={(e) => {
                                    if (e.key === 'Enter' && emailInput) {
                                      handleResendViaEmail(patient?.publicToken, patient?.patientName, emailInput);
                                    }
                                  }}
                                />
                                <button
                                  onClick={() => handleResendViaEmail(patient?.publicToken, patient?.patientName, emailInput)}
                                  disabled={!emailInput || resendingEmailToken === patient?.publicToken}
                                  className="flex items-center gap-1.5 text-white px-3 py-1.5 rounded-lg text-sm font-medium hover:brightness-110 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                  style={{ backgroundColor: '#2D7D46' }}
                                >
                                  <Send size={14} />
                                  <span>Send</span>
                                </button>
                              </div>
                            )}
                            {successMessages?.[patient?.publicToken] && (
                              <div className="absolute left-0 top-full mt-2 text-success text-sm animate-fadeIn whitespace-nowrap">
                                {successMessages?.[patient?.publicToken]}
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="py-8 text-center text-t2">
                        No patient data available
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </Card>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <h3 className="text-t1 font-semibold text-lg mb-4">Engagement Trends</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={engagementTrends}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
                  <XAxis dataKey="date" stroke="#9aa6c4" />
                  <YAxis stroke="#9aa6c4" />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#17213a', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', color: '#f5f7fb' }}
                  />
                  <Legend />
                  <Line type="monotone" dataKey="planViews" stroke="#3b82f6" strokeWidth={2} name="Plan Views" />
                  <Line type="monotone" dataKey="procedureViews" stroke="#22c55e" strokeWidth={2} name="Procedure Views" />
                  <Line type="monotone" dataKey="completions" stroke="#3b82f6" strokeWidth={2} name="Completions" />
                </LineChart>
              </ResponsiveContainer>
            </Card>
            <Card>
              <h3 className="text-t1 font-semibold text-lg mb-4">Completion Rates</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={procedureAnalytics?.slice(0, 5)}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
                  <XAxis dataKey="procedureName" stroke="#9aa6c4" />
                  <YAxis stroke="#9aa6c4" />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#17213a', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', color: '#f5f7fb' }}
                  />
                  <Bar dataKey="completionRate" fill="#10b981" />
                </BarChart>
              </ResponsiveContainer>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}