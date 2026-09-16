import { useState, useEffect } from 'react';
import { Copy, Check, FileDown, TableProperties, Sparkles, BookOpen, Volume2, Square } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { exportAuditPdf, exportAuditExcel } from '../services/api';
import { useLanguage } from '../context/LanguageContext';
import { speakText, stopSpeaking } from '../utils/speech';

export default function ResultCard({ content, title, docNames = [], onCitationClick }) {
  const { language, t } = useLanguage();
  const [copied, setCopied] = useState(false);
  const [exportingPdf, setExportingPdf] = useState(false);
  const [exportingExcel, setExportingExcel] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  useEffect(() => {
    return () => {
      stopSpeaking();
    };
  }, []);

  if (!content) return null;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleToggleSpeak = () => {
    if (isSpeaking) {
      stopSpeaking();
      setIsSpeaking(false);
    } else {
      speakText(
        content,
        language,
        () => setIsSpeaking(true),
        () => setIsSpeaking(false)
      );
    }
  };

  const handleExportPdf = async () => {
    try {
      setExportingPdf(true);
      await exportAuditPdf(title || 'Compliance_Report', content, docNames);
    } catch {
      alert('PDF export failed. Please try again.');
    } finally {
      setExportingPdf(false);
    }
  };

  const handleExportExcel = async () => {
    try {
      setExportingExcel(true);
      await exportAuditExcel(title || 'Compliance_Checklist', content, docNames);
    } catch {
      alert('Excel export failed. Please try again.');
    } finally {
      setExportingExcel(false);
    }
  };

  const components = {
    p: ({ children }) => {
      return <p className="leading-relaxed mb-3 text-slate-200">{children}</p>;
    },
    code: ({ node, inline, className, children, ...props }) => {
      const text = String(children);
      const match = text.match(/Doc:\s*([a-zA-Z0-9_.-]+)\s*\|\s*Page\s*(\d+)/i);
      if (match && onCitationClick) {
        const doc = match[1];
        const page = parseInt(match[2], 10);
        return (
          <button
            onClick={() => onCitationClick(doc, page)}
            className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg bg-gold-500/20 hover:bg-gold-500/30 border border-gold-500/40 text-gold-300 font-mono text-xs font-semibold cursor-pointer transition-all hover:scale-105 shadow-sm"
            title={`Click to preview ${doc} on Page ${page}`}
          >
            <BookOpen className="w-3 h-3 text-gold-400" />
            <span>{text}</span>
          </button>
        );
      }
      return (
        <code className="bg-navy-950 px-1.5 py-0.5 rounded text-gold-300 font-mono text-xs border border-white/10" {...props}>
          {children}
        </code>
      );
    }
  };

  return (
    <div className="enterprise-card bg-navy-900/90 border-l-4 border-l-gold-500 animate-fade-in shadow-xl">
      {/* Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-3.5 border-b border-white/10">
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-gold-500/10 text-gold-400">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-gold-400">
              {title || t.auditHeader}
            </h3>
            <p className="text-[10px] text-slate-400">
              Verified Against Bureau of Indian Standards Specifications
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-1.5 flex-wrap">
          {/* Read Aloud Button */}
          <button
            onClick={handleToggleSpeak}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
              isSpeaking
                ? 'bg-red-500/20 hover:bg-red-500/30 border-red-400 text-red-300 animate-pulse'
                : 'bg-gold-500/10 hover:bg-gold-500/20 border-gold-500/30 text-gold-300'
            }`}
            title="Read response aloud (TTS)"
          >
            {isSpeaking ? <Square className="w-3.5 h-3.5 fill-current" /> : <Volume2 className="w-3.5 h-3.5 text-gold-400" />}
            <span>{isSpeaking ? (t.stopAudio || 'Stop Audio') : (t.readAloud || '🔊 Read Aloud')}</span>
          </button>

          {/* PDF Report Export */}
          <button
            onClick={handleExportPdf}
            disabled={exportingPdf}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gold-500/10 hover:bg-gold-500/20 border border-gold-500/30 text-gold-300 text-xs font-semibold transition-all hover:scale-105 disabled:opacity-50 cursor-pointer"
            title="Download Official Audit PDF"
          >
            <FileDown className="w-3.5 h-3.5" />
            <span>{exportingPdf ? 'Exporting...' : t.btnPdfReport}</span>
          </button>

          {/* Excel Export */}
          <button
            onClick={handleExportExcel}
            disabled={exportingExcel}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-xs font-semibold transition-all hover:scale-105 disabled:opacity-50 cursor-pointer"
            title="Export Structured Excel Audit Sheet"
          >
            <TableProperties className="w-3.5 h-3.5" />
            <span>{exportingExcel ? 'Exporting...' : t.btnExcelSheet}</span>
          </button>

          {/* Copy Button */}
          <button
            onClick={handleCopy}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white transition-colors cursor-pointer"
            title={t.btnCopy}
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Markdown Body */}
      <div className="p-5 markdown-content">
        <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
          {content}
        </ReactMarkdown>
      </div>

      {/* Footer / Citation guide */}
      <div className="px-5 py-2.5 bg-navy-950/80 border-t border-white/5 flex items-center justify-between text-[11px] text-slate-400">
        <span>{t.citationNotice}</span>
        <span className="text-gold-400 font-mono font-medium">Official Standards Database</span>
      </div>
    </div>
  );
}
