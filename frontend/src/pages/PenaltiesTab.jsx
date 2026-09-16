import { useState } from 'react';
import { Scale, Sparkles, AlertCircle, AlertOctagon, Gavel, ShieldCheck } from 'lucide-react';
import { getPenalties } from '../services/api';
import { useLanguage } from '../context/LanguageContext';
import ProgressBar from '../components/ProgressBar';
import ResultCard from '../components/ResultCard';
import InteractivePdfViewer from '../components/InteractivePdfViewer';

export default function PenaltiesTab({ documents = [], selectedDocuments = [] }) {
  const { language, t } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [complete, setComplete] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [viewerDoc, setViewerDoc] = useState(null);
  const [viewerPage, setViewerPage] = useState(1);

  const effectiveDocs = selectedDocuments.length > 0 ? selectedDocuments : ['ALL'];

  const handleExtractPenalties = async () => {
    if (documents.length === 0 || (selectedDocuments.length === 0 && !selectedDocuments.includes('ALL'))) {
      setError(t.noDocsWarningTitle || 'Please select at least one standard in the sidebar.');
      return;
    }

    setLoading(true);
    setComplete(false);
    setError(null);
    setResult(null);

    try {
      const data = await getPenalties(language, effectiveDocs);
      setResult(data);
      setComplete(true);
    } catch (err) {
      setError(err.response?.data?.detail || err.message || 'Failed to extract penalties.');
    } finally {
      setLoading(false);
    }
  };

  const handleCitationClick = (docName, page) => {
    setViewerDoc(docName);
    setViewerPage(page);
  };

  return (
    <div className="space-y-6 animate-fade-in text-slate-100">
      {/* Header Banner */}
      <div className="enterprise-card-elevated p-6 sm:p-7 border-l-4 border-l-red-500">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-bold uppercase tracking-wider mb-2">
              <Scale className="w-3.5 h-3.5" />
              <span>BIS Act 2016 Statutory Risk Engine</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
              {t.penaltiesBannerTitle}
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-3xl leading-relaxed">
              {t.penaltiesBannerDesc}
            </p>
          </div>

          <button
            onClick={handleExtractPenalties}
            disabled={loading || documents.length === 0}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-400 hover:to-rose-500 text-white font-extrabold text-xs sm:text-sm shadow-md shadow-red-500/20 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2 self-start md:self-auto transition-all cursor-pointer"
          >
            {loading ? <span className="animate-spin">⏳</span> : <Gavel className="w-4 h-4" />}
            <span>{loading ? t.btnEvaluatingRisk : t.btnExtractPenalties}</span>
          </button>
        </div>
      </div>

      {/* Feature Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="enterprise-card p-4 flex items-start gap-3 bg-navy-900/80 border-red-500/20">
          <div className="p-2 rounded-xl bg-red-500/10 text-red-400 flex-shrink-0">
            <AlertOctagon className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider">{t.penaltyImprisonment}</h4>
            <p className="text-xs text-slate-400 mt-0.5">{t.penaltyImprisonmentDesc}</p>
          </div>
        </div>

        <div className="enterprise-card p-4 flex items-start gap-3 bg-navy-900/80 border-amber-500/20">
          <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 flex-shrink-0">
            <Gavel className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider">{t.penaltyCompounding}</h4>
            <p className="text-xs text-slate-400 mt-0.5">{t.penaltyCompoundingDesc}</p>
          </div>
        </div>

        <div className="enterprise-card p-4 flex items-start gap-3 bg-navy-900/80 border-emerald-500/20">
          <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 flex-shrink-0">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider">{t.penaltyMitigation}</h4>
            <p className="text-xs text-slate-400 mt-0.5">{t.penaltyMitigationDesc}</p>
          </div>
        </div>
      </div>

      {/* Progress */}
      <ProgressBar isLoading={loading} isComplete={complete} />

      {/* Error Message */}
      {error && (
        <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-400 flex items-center gap-3 text-xs sm:text-sm">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Result */}
      {result && (
        <div className="space-y-4">
          <ResultCard
            title={`${t.tab_penalties} (${language})`}
            content={result.response}
            docNames={result.documents_analyzed || documents}
            onCitationClick={handleCitationClick}
          />
        </div>
      )}

      {/* Interactive PDF Viewer Modal */}
      {viewerDoc && (
        <InteractivePdfViewer
          docName={viewerDoc}
          initialPage={viewerPage}
          onClose={() => setViewerDoc(null)}
        />
      )}
    </div>
  );
}
