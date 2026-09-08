import React, { useState, useEffect } from 'react';
import { patientAnalyticsService } from '../../services/patientAnalyticsService';
import { patientPlanService } from '../../services/patientPlanService';
import { emailService } from '../../services/emailService';
import { buildPatientPlanUrl } from '../../services/shareLinkService';
import { AlertTriangle, Download, Send, Copy, Mail, MessageSquare, Users, FileText, TrendingUp, BarChart3, Info, CalendarDays } from 'lucide-react';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import DentistNavigation from '../../components/DentistNavigation';
import Card from '../../components/ui/Card';
import ButtonSecondary from '../../components/ui/ButtonSecondary';
import Select from '../../components/ui/Select';
import Badge from '../../components/ui/Badge';
import Sparkline from '../../components/ui/Sparkline';

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
      const link = buildPatientPlanUrl(publicToken);
      
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

      const planUrl = buildPatientPlanUrl(publicToken);
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
      icon: Users,
      accentColor: 'blue',
    },
    {
      label: 'Active Plans',
      value: overallMetrics?.activePlans || 0,
      change: overallMetrics?.plansChange || 0,
      icon: FileText,
      accentColor: 'green',
    },
    {
      label: 'Avg. Engagement',
      value: overallMetrics?.averageEngagement ? `${overallMetrics?.averageEngagement}%` : '0%',
      change: overallMetrics?.engagementChange || 0,
      icon: BarChart3,
      accentColor: 'amber',
      tooltip: 'Average percentage of treatment plan content viewed by patients across all active plans',
    },
    {
      label: 'Completion Rate',
      value: overallMetrics?.completionRate ? `${overallMetrics?.completionRate}%` : '0%',
      change: overallMetrics?.completionChange || 0,
      icon: TrendingUp,
      accentColor: 'accent',
      tooltip: 'Percentage of patients who viewed all steps and procedures in their treatment plan',
    }
  ];

  const statColorMap = {
    blue: {
      border: 'border-l-accent',
      iconBg: 'bg-accent/10',
      iconBorder: 'border-accent/20',
      iconText: 'text-accent',
    },
    green: {
      border: 'border-l-success',
      iconBg: 'bg-success/10',
      iconBorder: 'border-success/20',
      iconText: 'text-success',
    },
    amber: {
      border: 'border-l-warning',
      iconBg: 'bg-warning/10',
      iconBorder: 'border-warning/20',
      iconText: 'text-warning',
    },
    accent: {
      border: 'border-l-accent',
      iconBg: 'bg-accent/10',
      iconBorder: 'border-accent/20',
      iconText: 'text-accent',
    },
  };

  const COLORS = ['#22d3e0', '#34d399', '#f2b63c', '#f26d6d', '#59e2ec'];

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
            className="btn-primary w-full"
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
          <div className="relative overflow-hidden rounded-2xl border border-bd bg-bg1 panel-glow mb-7">
            <div className="absolute inset-y-0 right-0 w-1/2 hidden md:flex items-center justify-end gap-3 pr-6 pointer-events-none select-none" aria-hidden="true">
              <div className="absolute inset-0 bg-gradient-to-r from-bg1 via-bg1/70 to-transparent z-10" />
              {['orthodontics', 'cleaning', 'exam'].map((slug, i) => (
                <img
                  key={slug}
                  src={`/visuals/${slug}/thumb.jpg`}
                  alt=""
                  loading="lazy"
                  onError={(e) => { e.currentTarget.style.display = 'none'; }}
                  className="w-36 h-24 object-cover rounded-xl border border-accent/20 shadow-lg"
                  style={{ transform: `translateY(${i % 2 === 0 ? '-6px' : '10px'}) rotate(${(i - 1) * 3}deg)`, opacity: 0.85 - i * 0.12 }}
                />
              ))}
            </div>
            <div className="relative z-20 p-6 flex flex-wrap items-end justify-between gap-3">
              <div>
                <p className="section-label mb-1.5">Practice Intelligence</p>
                <h1 className="text-2xl font-bold text-t1 mb-1 tracking-tight">Analytics</h1>
                <p className="text-t2 text-sm mb-0">Track patient engagement and treatment effectiveness</p>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-accent/25 bg-accent/5 text-t2 text-xs font-medium">
                <CalendarDays size={13} className="text-accent" />
                <span>Last {timeRange === '7d' ? '7 days' : timeRange === '30d' ? '30 days' : '90 days'}</span>
              </div>
            </div>
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
            <div className="flex flex-wrap gap-4 items-center">
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
            {statsData?.map((stat, index) => {
              const colors = statColorMap[stat.accentColor] || statColorMap.accent;
              const StatIcon = stat.icon;
              const sparkColor = stat.accentColor === 'green' ? 'var(--success)' : stat.accentColor === 'amber' ? 'var(--warning)' : 'var(--accent)';
              return (
                <div key={index} className={`relative overflow-hidden bg-bg1 border border-bd border-l-[3px] ${colors.border} rounded-xl p-5 panel-glow hover:border-accent/30 hover:-translate-y-0.5 transition-all duration-300`}>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-1.5 mb-2">
                        <p className="section-label">{stat?.label}</p>
                        {stat?.tooltip && (
                          <div className="group relative">
                            <button
                              type="button"
                              className="text-t3 cursor-help focus:outline-none focus:text-t1"
                              aria-label={`Info about ${stat.label}`}
                              aria-describedby={`tooltip-${index}`}
                            >
                              <Info size={13} />
                            </button>
                            <div
                              id={`tooltip-${index}`}
                              role="tooltip"
                              className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-bg2 border border-bd text-t2 text-xs rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible group-focus-within:opacity-100 group-focus-within:visible transition-all duration-200 w-52 text-center z-10 pointer-events-none"
                            >
                              {stat.tooltip}
                            </div>
                          </div>
                        )}
                      </div>
                      <p className="text-t1 text-[1.75rem] leading-none font-bold tracking-tight tnum">{stat?.value}</p>
                      {stat?.change !== 0 && (
                        <Badge 
                          variant={stat?.change > 0 ? 'success' : 'danger'}
                          size="sm"
                          className="mt-2.5"
                        >
                          {stat?.change > 0 ? '+' : ''}{stat?.change}%
                        </Badge>
                      )}
                    </div>
                    <div className={`${colors.iconBg} p-2.5 rounded-lg border ${colors.iconBorder}`}>
                      <StatIcon size={18} className={colors.iconText} />
                    </div>
                  </div>
                  <div className="mt-3 -mb-1 opacity-80">
                    <Sparkline seed={`${stat?.label}-${stat?.value}`} color={sparkColor} height={24} />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Patient List with Resend and Copy Buttons */}
          <Card className="mb-8">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-1 h-6 bg-accent rounded-full"></div>
              <h3 className="text-t1 font-semibold text-lg">Patient Engagement List</h3>
            </div>
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
                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium border border-accent/30 bg-accent/10 text-accent hover:bg-accent/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                {resendingToken === patient?.publicToken ? (
                                  <>
                                    <div className="animate-spin rounded-full h-3.5 w-3.5 border-2 border-t-transparent border-current"></div>
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
                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium border border-success/30 bg-success/10 text-success hover:bg-success/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                {resendingEmailToken === patient?.publicToken ? (
                                  <>
                                    <div className="animate-spin rounded-full h-3.5 w-3.5 border-2 border-t-transparent border-current"></div>
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
                                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium border border-success/30 bg-success/10 text-success hover:bg-success/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
                      <td colSpan="5" className="py-12 text-center">
                        <Users size={32} className="text-t3 mx-auto mb-3" />
                        <p className="text-t2 font-medium">No patient data available</p>
                        <p className="text-t3 text-sm mt-1">Patient engagement data will appear here once plans are created</p>
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
              <div className="flex items-center gap-3 mb-5">
                <div className="w-1 h-6 bg-accent rounded-full"></div>
                <h3 className="text-t1 font-semibold text-lg">Engagement Trends</h3>
              </div>
              {engagementTrends?.length > 0 ? (
                <div className="bg-bg0/50 rounded-lg border border-bd/50 p-4">
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={engagementTrends}>
                      <defs>
                        <linearGradient id="gradViews" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="var(--accent)" stopOpacity={0.28} />
                          <stop offset="100%" stopColor="var(--accent)" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="gradProc" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="var(--success)" stopOpacity={0.22} />
                          <stop offset="100%" stopColor="var(--success)" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="gradComp" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="var(--warning)" stopOpacity={0.18} />
                          <stop offset="100%" stopColor="var(--warning)" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="2 6" stroke="var(--bd)" vertical={false} />
                      <XAxis dataKey="date" stroke="transparent" tickLine={false} axisLine={false} tick={{ fill: 'var(--t3)', fontSize: 11, fontFamily: 'JetBrains Mono' }} dy={6} />
                      <YAxis stroke="transparent" tickLine={false} axisLine={false} tick={{ fill: 'var(--t3)', fontSize: 11, fontFamily: 'JetBrains Mono' }} width={34} />
                      <Tooltip 
                        cursor={{ stroke: 'var(--accent)', strokeOpacity: 0.35, strokeDasharray: '3 3' }}
                        contentStyle={{ backgroundColor: 'var(--bg2)', border: '1px solid var(--bd)', borderRadius: '12px', color: 'var(--t1)', boxShadow: 'var(--shadow-lg)', fontSize: 12.5 }}
                        labelStyle={{ color: 'var(--t3)', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}
                      />
                      <Legend iconType="plainline" wrapperStyle={{ fontSize: 12, color: 'var(--t3)' }} />
                      <Area type="monotone" dataKey="planViews" stroke="var(--accent)" strokeWidth={2.25} fill="url(#gradViews)" dot={false} activeDot={{ r: 4, strokeWidth: 0 }} name="Plan Views" />
                      <Area type="monotone" dataKey="procedureViews" stroke="var(--success)" strokeWidth={2} fill="url(#gradProc)" dot={false} activeDot={{ r: 4, strokeWidth: 0 }} name="Procedure Views" />
                      <Area type="monotone" dataKey="completions" stroke="var(--warning)" strokeWidth={2} fill="url(#gradComp)" dot={false} activeDot={{ r: 4, strokeWidth: 0 }} name="Completions" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="bg-bg0/50 rounded-lg border border-dashed border-bd p-6 flex flex-col items-center justify-center">
                  <div className="w-12 h-12 rounded-full bg-accent/10 border border-accent/20 flex items-center justify-center mb-3">
                    <TrendingUp size={22} className="text-accent/60" />
                  </div>
                  <p className="text-t2 font-medium">No engagement data yet</p>
                  <p className="text-t3 text-sm mt-1 text-center max-w-xs">Trends will appear as patients interact with their treatment plans</p>
                </div>
              )}
            </Card>
            <Card>
              <div className="flex items-center gap-3 mb-5">
                <div className="w-1 h-6 bg-success rounded-full"></div>
                <h3 className="text-t1 font-semibold text-lg">Completion Rates</h3>
              </div>
              {procedureAnalytics?.length > 0 ? (
                <div className="bg-bg0/50 rounded-lg border border-bd/50 p-4">
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={procedureAnalytics?.slice(0, 5)} barSize={26}>
                      <defs>
                        <linearGradient id="gradBar" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="var(--accent)" stopOpacity={0.95} />
                          <stop offset="100%" stopColor="var(--accent)" stopOpacity={0.35} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="2 6" stroke="var(--bd)" vertical={false} />
                      <XAxis dataKey="procedureName" stroke="transparent" tickLine={false} axisLine={false} tick={{ fill: 'var(--t3)', fontSize: 11 }} dy={6} />
                      <YAxis stroke="transparent" tickLine={false} axisLine={false} tick={{ fill: 'var(--t3)', fontSize: 11, fontFamily: 'JetBrains Mono' }} width={34} />
                      <Tooltip 
                        cursor={{ fill: 'var(--accent-soft)' }}
                        contentStyle={{ backgroundColor: 'var(--bg2)', border: '1px solid var(--bd)', borderRadius: '12px', color: 'var(--t1)', boxShadow: 'var(--shadow-lg)', fontSize: 12.5 }}
                        labelStyle={{ color: 'var(--t3)', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}
                      />
                      <Bar dataKey="completionRate" fill="url(#gradBar)" radius={[6, 6, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="bg-bg0/50 rounded-lg border border-dashed border-bd p-6 flex flex-col items-center justify-center">
                  <div className="w-12 h-12 rounded-full bg-success/10 border border-success/20 flex items-center justify-center mb-3">
                    <BarChart3 size={22} className="text-success/60" />
                  </div>
                  <p className="text-t2 font-medium">No completion data yet</p>
                  <p className="text-t3 text-sm mt-1 text-center max-w-xs">Completion rates will display once patients begin viewing procedures</p>
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}