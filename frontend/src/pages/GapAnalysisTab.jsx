import { useState } from 'react';
import { CheckCircle2, XCircle, AlertTriangle, Sparkles, FileDown, TableProperties, ShieldAlert, AlertCircle } from 'lucide-react';
import { runGapAnalysis, exportAuditPdf, exportAuditExcel } from '../services/api';
import { useLanguage } from '../context/LanguageContext';
import ProgressBar from '../components/ProgressBar';

const PRESET_TEMPLATES = [
  {
    name: '💧 IS 14543: Packaged Drinking Water',
    category: 'Water & Beverages',
    specs: `Product: Packaged Drinking Water (20 Litre Jar)
Applicable Standard: IS 14543:2004
1. Total Dissolved Solids (TDS): 620 mg/L
2. pH Value: 7.2
3. Turbidity: 1.2 NTU
4. Lead (as Pb): 0.008 mg/L
5. Total Coliform Bacteria: Absent in 250ml
6. Aerobic Microbial Count (24h at 37°C): 180 cfu/ml
7. Yeast and Mould Count: 3 cfu/250ml
8. Marking / Labeling: ISI Logo present, Best Before date printed in 2.5mm font.`,
  },
  {
    name: '⚡ IS 13252: IT Safety Power Adapter',
    category: 'IT & Electronics Safety',
    specs: `Product: 65W USB-C Laptop Power Adapter
Applicable Standard: IS 13252 (Part 1):2010
1. Input Voltage Rating: 100V - 240V AC, 50/60Hz
2. Output Voltage Regulation: 20V DC ± 5%
3. Maximum Temperature Rise of Enclosure: 68°C (at 40°C ambient)
4. Electric Strength (Dielectric Test): 3000V AC applied for 60 seconds (No Flashover)
5. Insulation Resistance: 15 Megaohms at 500V DC
6. Creepage Distance: 5.2 mm
7. Enclosure Flammability: UL94-V0 rated polycarbonate`,
  },
  {
    name: '🏗️ IS 1786: TMT Steel Rebar Fe 500D',
    category: 'Steel & Metallurgy',
    specs: `Product: High Strength Deformed Steel Bar (16mm Dia)
Applicable Standard: IS 1786:2008 Grade Fe 500D
1. 0.2% Proof Stress / Yield Strength: 515 N/mm²
2. Ultimate Tensile Strength (UTS): 610 N/mm²
3. UTS / Yield Strength Ratio: 1.18
4. Total Elongation at Maximum Force: 6.2%
5. Carbon Content: 0.26%
6. Sulphur + Phosphorus Content: 0.082%
7. Bend and Re-bend Test: No visible transverse cracks observed`,
  },
];

export default function GapAnalysisTab({ hasDocuments, documents = [] }) {
  const { language, t } = useLanguage();
  const [specsText, setSpecsText] = useState(PRESET_TEMPLATES[0].specs);
  const [loading, setLoading] = useState(false);
  const [complete, setComplete] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [exportingPdf, setExportingPdf] = useState(false);
  const [exportingExcel, setExportingExcel] = useState(false);

  const handleRunAnalysis = async (customText) => {
    const input = customText || specsText;
    if (!input.trim()) return;

    setLoading(true);
    setComplete(false);
    setError(null);
    setResult(null);

    try {
      const data = await runGapAnalysis(input, null, language);
      setResult(data);
      setComplete(true);
    } catch (err) {
      setError(err.response?.data?.detail || err.message || 'Gap analysis evaluation failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleExportPdf = async () => {
    if (!result) return;
    try {
      setExportingPdf(true);
      let content = `## ${t.gapSummaryTitle}\n${result.summary}\n\n## ${t.paramTableTitle}\n`;
      result.parameters?.forEach((p) => {
        content += `- **${p.parameter}**: Submitted: \`${p.user_value}\` | BIS Limit: \`${p.bis_limit}\` | Verdict: **${p.status}** (${p.clause})\n  Observation: ${p.observation} - Remedy: ${p.remedy || 'N/A'}\n`;
      });
      await exportAuditPdf('Predictive_Gap_Analysis', content, result.documents_evaluated || documents);
    } catch {
      alert('PDF export failed.');
    } finally {
      setExportingPdf(false);
    }
  };

  const handleExportExcel = async () => {
    if (!result) return;
    try {
      setExportingExcel(true);
      let content = `## Executive Summary\n${result.summary}\n\n## Compliance Checklist\n`;
      result.parameters?.forEach((p) => {
        content += `- ${p.parameter}: ${p.status} - ${p.observation} (${p.clause})\n`;
      });
      await exportAuditExcel('Predictive_Gap_Analysis', content, result.documents_evaluated || documents);
    } catch {
      alert('Excel export failed.');
    } finally {
      setExportingExcel(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status?.toUpperCase()) {
      case 'PASS':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            {t.statusPass}
          </span>
        );
      case 'WARNING':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold bg-amber-500/20 text-amber-400 border border-amber-500/40">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
            {t.statusWarning}
          </span>
        );
      case 'FAIL':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold bg-red-500/20 text-red-400 border border-red-500/40">
            <XCircle className="w-3.5 h-3.5 text-red-400" />
            {t.statusFail}
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-xs font-medium bg-slate-700/50 text-slate-300">
            {status || 'N/A'}
          </span>
        );
    }
  };

  const getOverallBadge = (status) => {
    switch (status?.toUpperCase()) {
      case 'COMPLIANT':
        return (
          <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-extrabold bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 tracking-wider">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            {t.statusCompliant}
          </span>
        );
      case 'NON_COMPLIANT':
      case 'NON-COMPLIANT':
        return (
          <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-extrabold bg-red-500/20 text-red-400 border border-red-500/40 tracking-wider">
            <XCircle className="w-4 h-4 text-red-400" />
            {t.statusNonCompliant}
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-extrabold bg-amber-500/20 text-amber-400 border border-amber-500/40 tracking-wider">
            <AlertTriangle className="w-4 h-4 text-amber-400" />
            {t.statusReview}
          </span>
        );
    }
  };

  return (
    <div className="space-y-6 animate-fade-in text-slate-100">
      {/* Enterprise Header Banner */}
      <div className="enterprise-card-elevated p-6 sm:p-7 border-l-4 border-l-gold-500">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold-500/10 border border-gold-500/30 text-gold-400 text-xs font-bold uppercase tracking-wider mb-2">
              <Sparkles className="w-3.5 h-3.5 text-gold-400" />
              <span>Predictive Compliance Intelligence</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
              {t.gapBannerTitle}
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-3xl leading-relaxed">
              {t.gapBannerDesc}
            </p>
          </div>
        </div>
      </div>

      {/* Input Section: Preset Chips & Spec Textarea */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Preset Templates */}
        <div className="lg:col-span-4 space-y-3">
          <div className="enterprise-card p-4 space-y-3">
            <span className="text-xs font-bold text-gold-400 uppercase tracking-wider block">
              {t.samplePresetsTitle}
            </span>
            <div className="flex flex-col gap-2">
              {PRESET_TEMPLATES.map((tmpl, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setSpecsText(tmpl.specs);
                    handleRunAnalysis(tmpl.specs);
                  }}
                  className="text-left p-3 rounded-xl bg-navy-950/80 hover:bg-gold-500/10 border border-white/5 hover:border-gold-500/30 transition-all cursor-pointer group"
                >
                  <p className="text-xs font-bold text-white group-hover:text-gold-300">
                    {tmpl.name}
                  </p>
                  <p className="text-[11px] text-slate-400 mt-0.5">{tmpl.category}</p>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Specification Editor & Trigger */}
        <div className="lg:col-span-8 flex flex-col space-y-3">
          <div className="enterprise-card p-5 space-y-3 flex-1">
            <label className="text-xs font-bold text-gold-400 uppercase tracking-wider block">
              {t.specsInputLabel}
            </label>
            <textarea
              rows={8}
              value={specsText}
              onChange={(e) => setSpecsText(e.target.value)}
              placeholder={t.specsPlaceholder}
              className="w-full p-4 rounded-xl border border-gold-500/30 focus:outline-none focus:border-gold-400 focus:ring-1 focus:ring-gold-400 text-xs sm:text-sm font-mono text-slate-100 placeholder-slate-500 bg-navy-950/90 shadow-inner"
            />
            <div className="flex items-center justify-between pt-1">
              <span className="text-[11px] text-slate-400">
                Supports freeform parameter key-value text or JSON
              </span>
              <button
                onClick={() => handleRunAnalysis()}
                disabled={loading || !specsText.trim() || !hasDocuments}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-gold-500 to-gold-400 hover:from-gold-400 hover:to-gold-300 text-navy-950 font-extrabold text-xs sm:text-sm shadow-md shadow-gold-500/20 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2 transition-all cursor-pointer"
              >
                {loading ? <span className="animate-spin">⏳</span> : <Sparkles className="w-4 h-4" />}
                <span>{loading ? t.btnEvaluating : t.btnRunGapAnalysis}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Progress */}
      <ProgressBar isLoading={loading} isComplete={complete} />

      {/* Error */}
      {error && (
        <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-400 flex items-center gap-3 text-xs sm:text-sm animate-fade-in">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Results Section */}
      {result && (
        <div className="space-y-6 animate-fade-in">
          
          {/* Verdict Overview Card */}
          <div className="enterprise-card p-6 border-l-4 border-l-gold-500 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
              <div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  {t.gapOverallStatus}
                </span>
                <div className="mt-1 flex items-center gap-3">
                  {getOverallBadge(result.overall_status)}
                  <span className="text-xs text-slate-300">
                    Standard: <strong className="text-gold-400">{result.applicable_standard}</strong>
                  </span>
                </div>
              </div>

              {/* KPI Breakdown */}
              <div className="flex items-center gap-3">
                <div className="text-center px-3.5 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30">
                  <span className="text-sm text-emerald-400 font-bold block">{result.passed_count || 0}</span>
                  <span className="text-[10px] text-emerald-300 font-medium">Passed</span>
                </div>
                <div className="text-center px-3.5 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/30">
                  <span className="text-sm text-amber-400 font-bold block">{result.warnings_count || 0}</span>
                  <span className="text-[10px] text-amber-300 font-medium">Warnings</span>
                </div>
                <div className="text-center px-3.5 py-1.5 rounded-xl bg-red-500/10 border border-red-500/30">
                  <span className="text-sm text-red-400 font-bold block">{result.critical_failures_count || 0}</span>
                  <span className="text-[10px] text-red-300 font-medium">Failures</span>
                </div>
                <div className="text-center px-4 py-1.5 rounded-xl bg-gold-500/10 border border-gold-500/30">
                  <span className="text-lg text-gold-300 font-extrabold block">{result.compliance_score || 0}%</span>
                  <span className="text-[10px] text-gold-400 font-bold">{t.gapComplianceScore}</span>
                </div>
              </div>
            </div>

            {/* Executive Summary */}
            <div className="space-y-1">
              <h4 className="text-xs font-bold text-gold-400 uppercase tracking-wider">
                {t.gapSummaryTitle}
              </h4>
              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                {result.summary}
              </p>
            </div>

            {/* Export Toolbar */}
            <div className="flex items-center justify-end gap-2 pt-2 border-t border-white/10">
              <button
                onClick={handleExportPdf}
                disabled={exportingPdf}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gold-500/10 hover:bg-gold-500/20 text-gold-300 text-xs font-semibold border border-gold-500/30 transition-all cursor-pointer"
              >
                <FileDown className="w-3.5 h-3.5" />
                <span>{exportingPdf ? 'Exporting...' : t.btnPdfReport}</span>
              </button>
              <button
                onClick={handleExportExcel}
                disabled={exportingExcel}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 text-xs font-semibold border border-emerald-500/30 transition-all cursor-pointer"
              >
                <TableProperties className="w-3.5 h-3.5" />
                <span>{exportingExcel ? 'Exporting...' : t.btnExcelSheet}</span>
              </button>
            </div>
          </div>

          {/* Parameter Compliance Heatmap Table */}
          <div className="enterprise-card overflow-hidden space-y-3 p-5">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-gold-400" />
              {t.paramTableTitle}
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-white/10 text-slate-400 font-semibold bg-navy-950/60">
                    <th className="py-3 px-3.5">{t.colParam}</th>
                    <th className="py-3 px-3.5">{t.colUserVal}</th>
                    <th className="py-3 px-3.5">{t.colBisLimit}</th>
                    <th className="py-3 px-3.5">{t.colStatus}</th>
                    <th className="py-3 px-3.5">{t.colClause}</th>
                    <th className="py-3 px-3.5">{t.colObservation}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-slate-200">
                  {result.parameters?.map((param, i) => (
                    <tr
                      key={i}
                      className={`hover:bg-white/[0.02] transition-colors ${
                        param.status?.toUpperCase() === 'FAIL' ? 'bg-red-500/5' :
                        param.status?.toUpperCase() === 'WARNING' ? 'bg-amber-500/5' : ''
                      }`}
                    >
                      <td className="py-3.5 px-3.5 font-bold text-white">{param.parameter}</td>
                      <td className="py-3.5 px-3.5 font-mono text-gold-300">{param.user_value}</td>
                      <td className="py-3.5 px-3.5 font-mono text-slate-300 font-medium">{param.bis_limit}</td>
                      <td className="py-3.5 px-3.5">{getStatusBadge(param.status)}</td>
                      <td className="py-3.5 px-3.5 text-slate-400 text-[11px] font-mono">{param.clause}</td>
                      <td className="py-3.5 px-3.5 text-xs leading-relaxed max-w-sm">
                        <div className="text-slate-200">{param.observation}</div>
                        {param.remedy && (
                          <div className="text-gold-400/90 text-[11px] mt-1 font-medium">
                            <strong>Remedy:</strong> {param.remedy}
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
