import { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, ShieldAlert, Award, FileText, Layers, CheckCircle2, RefreshCw } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, PieChart, Pie, Cell, AreaChart, Area } from 'recharts';
import { getAnalyticsMetrics } from '../services/api';
import { useLanguage } from '../context/LanguageContext';

const COLORS = ['#D4AF37', '#38BDF8', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

export default function AnalyticsDashboard() {
  const { t } = useLanguage();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchMetrics = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getAnalyticsMetrics();
      setData(res);
    } catch {
      setError('Could not load analytics metrics from backend.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMetrics();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[360px] space-y-3 animate-fade-in text-slate-100">
        <div className="w-10 h-10 rounded-full border-4 border-gold-500/20 border-t-gold-400 animate-spin" />
        <p className="text-xs sm:text-sm font-semibold text-slate-300">Calculating Enterprise Compliance Metrics...</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="enterprise-card p-6 bg-red-500/10 border-red-500/30 text-red-400 flex items-center justify-between text-xs sm:text-sm">
        <span>{error || 'Failed to load dashboard'}</span>
        <button
          onClick={fetchMetrics}
          className="px-3.5 py-1.5 rounded-xl bg-red-500/20 text-xs font-bold hover:bg-red-500/30 transition-colors cursor-pointer"
        >
          {t.btnRetry}
        </button>
      </div>
    );
  }

  const { overview, standards, sector_distribution, risk_matrix, audit_trends } = data;

  return (
    <div className="space-y-6 animate-fade-in text-slate-100">
      {/* Top Banner */}
      <div className="enterprise-card-elevated p-6 sm:p-7 border-l-4 border-l-gold-500">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold-500/10 border border-gold-500/30 text-gold-400 text-xs font-bold uppercase tracking-wider mb-2">
              <BarChart3 className="w-3.5 h-3.5 text-gold-400" />
              <span>Regulatory Telemetry & KPIs</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
              {t.analyticsBannerTitle}
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-3xl leading-relaxed">
              {t.analyticsBannerDesc}
            </p>
          </div>
          <button
            onClick={fetchMetrics}
            className="p-2.5 rounded-xl bg-white/5 hover:bg-gold-500/10 border border-white/10 hover:border-gold-500/30 text-slate-300 hover:text-gold-400 transition-colors self-start md:self-auto cursor-pointer"
            title="Refresh Metrics"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="enterprise-card p-5 bg-navy-900/80 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">{t.kpiTotalStandards}</span>
            <div className="p-2 rounded-xl bg-gold-500/10 text-gold-400">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-1">
            <span className="text-2xl font-extrabold text-white">{overview.total_standards}</span>
            <p className="text-[11px] text-slate-400 mt-0.5">{overview.total_pages} {t.kpiTotalPages}</p>
          </div>
        </div>

        <div className="enterprise-card p-5 bg-navy-900/80 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">{t.kpiClausesAnalyzed}</span>
            <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400">
              <FileText className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-1">
            <span className="text-2xl font-extrabold text-white">{overview.estimated_clauses}</span>
            <p className="text-[11px] text-blue-400 font-medium mt-0.5">Automated Clause Mapping</p>
          </div>
        </div>

        <div className="enterprise-card p-5 bg-navy-900/80 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">{t.kpiAvgHealth}</span>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-1">
            <span className="text-2xl font-extrabold text-emerald-400">{overview.average_compliance_health}%</span>
            <p className="text-[11px] text-slate-400 mt-0.5">High Statutory Readiness</p>
          </div>
        </div>

        <div className="enterprise-card p-5 bg-navy-900/80 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">{t.kpiCmlLicenses}</span>
            <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-1">
            <span className="text-2xl font-extrabold text-purple-300">{overview.cml_licenses_tracked}</span>
            <p className="text-[11px] text-emerald-400 font-medium mt-0.5">{overview.cml_valid_count} Active • {overview.cml_expired_count} Expired</p>
          </div>
        </div>
      </div>

      {/* Visual Analytics Charts: 2 Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Monthly Audit Activity & Verification Trends */}
        <div className="lg:col-span-8 enterprise-card p-6 bg-navy-900/80 space-y-4">
          <div className="border-b border-white/10 pb-3">
            <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-gold-400" />
              {t.chartMonthlyTitle}
            </h3>
            <p className="text-xs text-slate-400">{t.chartMonthlySub}</p>
          </div>
          
          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={audit_trends}>
                <defs>
                  <linearGradient id="queryGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#D4AF37" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#D4AF37" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="verifGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="month" stroke="#64748B" fontSize={11} />
                <YAxis stroke="#64748B" fontSize={11} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#071527', borderColor: '#D4AF37', borderRadius: '12px', color: '#FFF', fontSize: '11px' }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                <Area type="monotone" dataKey="queries" name="Compliance Queries" stroke="#D4AF37" strokeWidth={2} fillOpacity={1} fill="url(#queryGrad)" />
                <Area type="monotone" dataKey="verifications" name="CM/L Label Scans" stroke="#10B981" strokeWidth={2} fillOpacity={1} fill="url(#verifGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Sector Distribution Pie */}
        <div className="lg:col-span-4 enterprise-card p-6 bg-navy-900/80 space-y-4">
          <div className="border-b border-white/10 pb-3">
            <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-blue-400" />
              {t.chartSectorTitle}
            </h3>
            <p className="text-xs text-slate-400">{t.chartSectorSub}</p>
          </div>
          <div className="h-60 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={sector_distribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={75}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {sector_distribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#071527', borderColor: '#38BDF8', borderRadius: '12px', color: '#FFF', fontSize: '11px' }}
                />
                <Legend wrapperStyle={{ fontSize: '10px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Risk Matrix Bar Chart */}
        <div className="lg:col-span-12 enterprise-card p-6 bg-navy-900/80 space-y-4">
          <div className="border-b border-white/10 pb-3">
            <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-red-400" />
              {t.chartRiskTitle}
            </h3>
            <p className="text-xs text-slate-400">{t.chartRiskSub}</p>
          </div>
          <div className="h-52 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={risk_matrix} layout="vertical" margin={{ left: 20, right: 30 }}>
                <XAxis type="number" stroke="#64748B" fontSize={11} unit="%" />
                <YAxis dataKey="risk_tier" type="category" stroke="#94A3B8" fontSize={11} width={240} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#071527', borderColor: '#F87171', borderRadius: '12px', color: '#FFF', fontSize: '11px' }}
                />
                <Bar dataKey="percentage" name="Risk Weight (%)" radius={[0, 6, 6, 0]}>
                  {risk_matrix.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Standards Repository Catalog Table */}
      <div className="enterprise-card p-6 bg-navy-900/80 space-y-4">
        <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2 border-b border-white/10 pb-3">
          <Layers className="w-4 h-4 text-gold-400" />
          {t.catalogTitle}
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-white/10 text-slate-400 bg-navy-950/60 font-semibold">
                <th className="py-3 px-4">{t.colDoc}</th>
                <th className="py-3 px-4">{t.colCategory}</th>
                <th className="py-3 px-4">{t.colPages}</th>
                <th className="py-3 px-4">{t.colChars}</th>
                <th className="py-3 px-4">{t.colClauses}</th>
                <th className="py-3 px-4">{t.colReadiness}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-slate-300">
              {standards.map((s, idx) => (
                <tr key={idx} className="hover:bg-white/[0.02]">
                  <td className="py-3 px-4 font-bold text-gold-300 flex items-center gap-2">
                    <FileText className="w-3.5 h-3.5 text-gold-400 flex-shrink-0" />
                    <span>{s.name}</span>
                  </td>
                  <td className="py-3 px-4">{s.category}</td>
                  <td className="py-3 px-4 font-mono">{s.pages} pgs</td>
                  <td className="py-3 px-4 font-mono">{s.characters.toLocaleString()}</td>
                  <td className="py-3 px-4 font-mono text-blue-400 font-bold">{s.estimated_clauses}</td>
                  <td className="py-3 px-4">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 font-semibold border border-emerald-500/20 text-[11px]">
                      <CheckCircle2 className="w-3 h-3" /> {s.compliance_readiness}% Ready
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
