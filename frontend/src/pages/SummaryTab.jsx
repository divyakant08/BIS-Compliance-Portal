import { useState } from 'react';
import { FileBarChart, Sparkles, AlertCircle, Zap, ShieldCheck, Layers } from 'lucide-react';
import { getSummary } from '../services/api';
import { useLanguage } from '../context/LanguageContext';
import ProgressBar from '../components/ProgressBar';
import ResultCard from '../components/ResultCard';
import InteractivePdfViewer from '../components/InteractivePdfViewer';

export default function SummaryTab({ documents = [], selectedDocuments = [] }) {
  const { language, t } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [complete, setComplete] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [viewerDoc, setViewerDoc] = useState(null);
  const [viewerPage, setViewerPage] = useState(1);

  const effectiveDocs = selectedDocuments.length > 0 ? selectedDocuments : ['ALL'];

  const handleGenerateSummary = async () => {
    if (documents.length === 0 || (selectedDocuments.length === 0 && !selectedDocuments.includes('ALL'))) {
      setError(t.noDocsWarningTitle || 'Please select at least one standard in the sidebar.');
      return;
    }

    setLoading(true);
    setComplete(false);
    setError(null);
    setResult(null);

    try {
      const data = await getSummary(language, effectiveDocs);
      setResult(data);
      setComplete(true);
    } catch (err) {
      setError(err.response?.data?.detail || err.message || 'Failed to generate summary.');
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
      <div className="enterprise-card-elevated p-6 sm:p-7 border-l-4 border-l-gold-500">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold-500/10 border border-gold-500/30 text-gold-400 text-xs font-bold uppercase tracking-wider mb-2">
              <FileBarChart className="w-3.5 h-3.5" />
              <span>Executive Regulatory Briefing</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
              {t.summaryBannerTitle}
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-3xl leading-relaxed">
              {t.summaryBannerDesc}
            </p>
          </div>

          <button
            onClick={handleGenerateSummary}
            disabled={loading || documents.length === 0}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-gold-500 to-gold-400 hover:from-gold-400 hover:to-gold-300 text-navy-950 font-extrabold text-xs sm:text-sm shadow-md shadow-gold-500/20 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2 self-start md:self-auto transition-all cursor-pointer"
          >
            {loading ? <span className="animate-spin">⏳</span> : <Sparkles className="w-4 h-4" />}
            <span>{loading ? t.btnSynthesizing : t.btnGenerateSummary}</span>
          </button>
        </div>
      </div>

      {/* Feature Highlights Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="enterprise-card p-4 flex items-start gap-3 bg-navy-900/80">
          <div className="p-2 rounded-xl bg-gold-500/10 text-gold-400 flex-shrink-0">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider">{t.featureMandatory}</h4>
            <p className="text-xs text-slate-400 mt-0.5">{t.featureMandatoryDesc}</p>
          </div>
        </div>

        <div className="enterprise-card p-4 flex items-start gap-3 bg-navy-900/80">
          <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400 flex-shrink-0">
            <Zap className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider">{t.featureLab}</h4>
            <p className="text-xs text-slate-400 mt-0.5">{t.featureLabDesc}</p>
          </div>
        </div>

        <div className="enterprise-card p-4 flex items-start gap-3 bg-navy-900/80">
          <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 flex-shrink-0">
            <Layers className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider">{t.featureMatrix}</h4>
            <p className="text-xs text-slate-400 mt-0.5">{t.featureMatrixDesc}</p>
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
            title={`${t.tab_summary} (${language})`}
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
