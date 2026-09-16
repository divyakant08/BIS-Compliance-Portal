import { useState, useEffect } from 'react';

export default function ProgressBar({ isLoading, isComplete }) {
  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState('Extracting Document Text');

  useEffect(() => {
    let interval;
    if (isLoading) {
      setProgress(15);
      setPhase('Extracting Document Text');

      const timer1 = setTimeout(() => {
        setProgress(45);
        setPhase('Analyzing Standard Clauses with AI');
      }, 1200);

      const timer2 = setTimeout(() => {
        setProgress(75);
        setPhase('Evaluating Compliance Verdict');
      }, 3500);

      const timer3 = setTimeout(() => {
        setProgress(90);
        setPhase('Finalizing Citation References');
      }, 6500);

      return () => {
        clearTimeout(timer1);
        clearTimeout(timer2);
        clearTimeout(timer3);
      };
    } else if (isComplete) {
      setProgress(100);
      setPhase('Complete');
      const resetTimer = setTimeout(() => {
        setProgress(0);
      }, 1000);
      return () => clearTimeout(resetTimer);
    } else {
      setProgress(0);
    }
  }, [isLoading, isComplete]);

  if (!isLoading && progress === 0) return null;

  return (
    <div className="w-full space-y-1.5 animate-fade-in py-1">
      <div className="flex items-center justify-between text-xs text-slate-600">
        <span className="font-semibold text-blue-700 flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-blue-700 animate-pulse" />
          {phase}
        </span>
        <span className="font-mono font-bold text-slate-700">{progress}%</span>
      </div>
      <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
        <div
          className="h-full bg-blue-700 rounded-full transition-all duration-300 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
