import { useState, useCallback, useEffect } from 'react';
import { ScanLine, Upload, CheckCircle2, XCircle, AlertTriangle, Building2, Award, Database, ShieldCheck, Eye } from 'lucide-react';
import { verifyCMLEnhanced, getCMLRegistry } from '../services/api';
import { useLanguage } from '../context/LanguageContext';

export default function CMLScannerTab() {
  const { t } = useLanguage();
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [registryRecords, setRegistryRecords] = useState([]);
  const [showRegistry, setShowRegistry] = useState(false);

  useEffect(() => {
    getCMLRegistry()
      .then((data) => setRegistryRecords(data.records || []))
      .catch(() => {});
  }, []);

  const handleImageFile = (selected) => {
    if (!selected || !selected.type.startsWith('image/')) {
      setError('Please upload a valid image file (PNG, JPEG, WebP).');
      return;
    }
    setFile(selected);
    setError(null);
    setResult(null);

    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result);
    };
    reader.readAsDataURL(selected);
  };

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleImageFile(e.dataTransfer.files[0]);
    }
  }, []);

  const handleVerify = async () => {
    if (!file) return;

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const data = await verifyCMLEnhanced(file);
      setResult(data);
    } catch (err) {
      setError(err.response?.data?.detail || err.message || 'Verification failed.');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'VALID':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 tracking-wider">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            {t.statusValid}
          </span>
        );
      case 'EXPIRED':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold bg-amber-500/20 text-amber-400 border border-amber-500/40 tracking-wider">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
            {t.statusExpired}
          </span>
        );
      case 'SUSPENDED':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold bg-red-500/20 text-red-400 border border-red-500/40 tracking-wider">
            <XCircle className="w-3.5 h-3.5 text-red-400" />
            {t.statusSuspended}
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold bg-slate-700/50 text-slate-300 border border-slate-600 tracking-wider">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
            {t.statusUnregistered}
          </span>
        );
    }
  };

  return (
    <div className="space-y-6 animate-fade-in text-slate-100">
      {/* Top Banner */}
      <div className="enterprise-card-elevated p-6 sm:p-7 border-l-4 border-l-emerald-500">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-2">
              <ScanLine className="w-3.5 h-3.5" />
              <span>Gemini Vision OCR + Statutory Registry</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
              {t.cmlBannerTitle}
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-3xl leading-relaxed">
              {t.cmlBannerDesc}
            </p>
          </div>
          <button
            onClick={() => setShowRegistry(!showRegistry)}
            className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-emerald-500/10 border border-white/10 hover:border-emerald-500/30 text-slate-200 hover:text-emerald-300 text-xs font-bold transition-all flex items-center gap-2 cursor-pointer self-start md:self-auto"
          >
            <Database className="w-4 h-4 text-emerald-400" />
            <span>{showRegistry ? t.btnHideRegistry : t.btnBrowseRegistry}</span>
            <span className="px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-mono">
              {registryRecords.length}
            </span>
          </button>
        </div>
      </div>

      {/* Registry Database Panel (Toggleable) */}
      {showRegistry && (
        <div className="enterprise-card p-5 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-2">
              <Database className="w-4 h-4" />
              National BIS CM/L Verification Database ({registryRecords.length} Licenses)
            </h3>
            <span className="text-xs text-slate-400 font-mono">cml_database.json</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-white/10 text-slate-400 bg-navy-950/60 font-semibold">
                  <th className="py-2.5 px-3">CM/L Number</th>
                  <th className="py-2.5 px-3">Manufacturer</th>
                  <th className="py-2.5 px-3">Standard</th>
                  <th className="py-2.5 px-3">Validity</th>
                  <th className="py-2.5 px-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-slate-300 font-mono">
                {registryRecords.map((r, i) => (
                  <tr key={i} className="hover:bg-white/[0.02]">
                    <td className="py-2 px-3 text-gold-400 font-bold">{r.cml_number}</td>
                    <td className="py-2 px-3 font-sans font-medium text-slate-200">{r.manufacturer}</td>
                    <td className="py-2 px-3 text-emerald-400">{r.standard}</td>
                    <td className="py-2 px-3 text-slate-400 text-[11px]">{r.valid_from} to {r.valid_to}</td>
                    <td className="py-2 px-3">{getStatusBadge(r.status)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 12-Col Grid: Upload on Left (5) & Results on Right (7) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Image Upload & Preview */}
        <div className="lg:col-span-5 space-y-4">
          <label
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            className={`enterprise-card flex flex-col items-center justify-center p-6 border-2 border-dashed cursor-pointer transition-all min-h-[280px] ${
              isDragging
                ? 'border-emerald-400 bg-emerald-500/10'
                : preview
                ? 'border-emerald-500/40 bg-navy-900/60'
                : 'border-slate-700 hover:border-emerald-500/50 bg-navy-900/40'
            }`}
          >
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="hidden"
              onChange={(e) => e.target.files?.[0] && handleImageFile(e.target.files[0])}
            />

            {preview ? (
              <div className="space-y-3 w-full text-center">
                <img
                  src={preview}
                  alt="Product Label Preview"
                  className="max-h-56 mx-auto rounded-xl object-contain border border-white/10 shadow-lg"
                />
                <p className="text-xs text-slate-400 truncate">{file?.name}</p>
                <span className="inline-block px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 text-xs font-semibold">
                  Click to replace image
                </span>
              </div>
            ) : (
              <div className="flex flex-col items-center text-center space-y-3">
                <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                  <Upload className="w-7 h-7" />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-200">
                    {t.dropImageText}
                  </p>
                  <p className="text-xs text-slate-400 mt-1 max-w-[220px]">
                    {t.dropImageSubtitle}
                  </p>
                </div>
              </div>
            )}
          </label>

          <button
            onClick={handleVerify}
            disabled={loading || !file}
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-navy-950 font-extrabold text-sm transition-all shadow-lg shadow-emerald-500/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
          >
            {loading ? <span className="animate-spin">⏳</span> : <ScanLine className="w-5 h-5" />}
            <span>{loading ? t.btnVerifyingCml : t.btnVerifyCml}</span>
          </button>
        </div>

        {/* Right Column: OCR Extraction & Registry Results */}
        <div className="lg:col-span-7 space-y-4">
          {error && (
            <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-400 flex items-center gap-3 text-sm">
              <XCircle className="w-5 h-5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {!result && !loading && (
            <div className="enterprise-card h-full min-h-[280px] flex flex-col items-center justify-center p-8 text-center text-slate-500">
              <ShieldCheck className="w-12 h-12 text-slate-600 mb-3" />
              <p className="text-sm font-semibold text-slate-400">Awaiting Product Label Image</p>
              <p className="text-xs text-slate-500 mt-1 max-w-sm">
                Upload an image on the left to extract CM/L details and cross-check with the official BIS database.
              </p>
            </div>
          )}

          {loading && (
            <div className="enterprise-card h-full min-h-[280px] flex flex-col items-center justify-center p-8 text-center space-y-3 bg-navy-900/50">
              <div className="w-12 h-12 rounded-full border-4 border-emerald-500/20 border-t-emerald-400 animate-spin" />
              <p className="text-sm font-bold text-slate-200">Analyzing Label with Gemini Vision...</p>
              <p className="text-xs text-slate-400">Extracting CM/L numbers, standard codes, and manufacturer credentials.</p>
            </div>
          )}

          {result && (
            <div className="space-y-4 animate-fade-in">
              {/* Composite Status Badge */}
              <div className="enterprise-card p-5 bg-navy-900/80 border-l-4 border-l-emerald-500 flex items-center justify-between shadow-xl">
                <div>
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                    {t.cmlOutcome}
                  </span>
                  <div className="text-base font-extrabold text-white">
                    {result.registry_verification?.message || 'Verification complete'}
                  </div>
                </div>
                <div>{getStatusBadge(result.composite_status)}</div>
              </div>

              {/* Structured Extracted Data Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="enterprise-card p-4 bg-navy-900/60 space-y-1">
                  <span className="text-[11px] text-slate-400 flex items-center gap-1.5 font-medium">
                    <Award className="w-3.5 h-3.5 text-gold-400" />
                    {t.cmlExtractedNo}
                  </span>
                  <p className="text-sm font-mono font-bold text-gold-300">
                    {result.ocr_findings?.cml_number || 'Not Found'}
                  </p>
                </div>

                <div className="enterprise-card p-4 bg-navy-900/60 space-y-1">
                  <span className="text-[11px] text-slate-400 flex items-center gap-1.5 font-medium">
                    <Building2 className="w-3.5 h-3.5 text-blue-400" />
                    {t.cmlManufacturer}
                  </span>
                  <p className="text-sm font-bold text-slate-200 truncate">
                    {result.ocr_findings?.manufacturer || 'Not Found'}
                  </p>
                </div>

                <div className="enterprise-card p-4 bg-navy-900/60 space-y-1">
                  <span className="text-[11px] text-slate-400 flex items-center gap-1.5 font-medium">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    {t.cmlStandard}
                  </span>
                  <p className="text-sm font-bold text-emerald-300">
                    {result.ocr_findings?.standard || 'Not Found'}
                  </p>
                </div>

                <div className="enterprise-card p-4 bg-navy-900/60 space-y-1">
                  <span className="text-[11px] text-slate-400 flex items-center gap-1.5 font-medium">
                    <Database className="w-3.5 h-3.5 text-indigo-400" />
                    {t.cmlDbMatch}
                  </span>
                  <p className={`text-sm font-bold ${result.registry_verification?.db_matched ? 'text-emerald-400' : 'text-slate-400'}`}>
                    {result.registry_verification?.db_matched ? `✓ ${t.confirmedDb}` : `✕ ${t.notInDb}`}
                  </p>
                </div>
              </div>

              {/* Matched Registry Record Details */}
              {result.registry_verification?.db_record && (
                <div className="enterprise-card p-5 bg-emerald-950/30 border-emerald-500/30 space-y-2">
                  <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" />
                    {t.cmlOfficialRecord}
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-300">
                    <div><strong>Product:</strong> {result.registry_verification.db_record.product_name}</div>
                    <div><strong>Brand:</strong> {result.registry_verification.db_record.brand_name}</div>
                    <div><strong>Validity:</strong> {result.registry_verification.db_record.valid_from} to {result.registry_verification.db_record.valid_to}</div>
                    <div><strong>Marking Fee:</strong> {result.registry_verification.db_record.marking_fee_status}</div>
                    <div className="sm:col-span-2"><strong>Factory:</strong> {result.registry_verification.db_record.factory_address}</div>
                  </div>
                </div>
              )}

              {/* AI Vision Observations */}
              <div className="enterprise-card p-4 bg-navy-900/40 space-y-1">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Eye className="w-3.5 h-3.5 text-gold-400" />
                  {t.cmlVisionNotes}
                </span>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {result.ocr_findings?.details}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
