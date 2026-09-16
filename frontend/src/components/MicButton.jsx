import { Mic } from 'lucide-react';

export default function MicButton({ isListening, onClick, disabled, title }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={`p-2 rounded-xl border transition-all cursor-pointer disabled:opacity-40 ${
        isListening
          ? 'bg-red-500/20 border-red-400 text-red-300 animate-pulse'
          : 'bg-gold-500/10 hover:bg-gold-500/20 border-gold-500/30 text-gold-300'
      }`}
    >
      <Mic className="w-4 h-4" />
    </button>
  );
}
