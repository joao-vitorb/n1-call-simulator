import { useEffect, useRef, useState } from 'react';

type ProgressBarProps = {
  durationMs: number;
  onComplete: () => void;
};

export function ProgressBar({ durationMs, onComplete }: ProgressBarProps) {
  const [progress, setProgress] = useState(0);
  const onCompleteRef = useRef(onComplete);

  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    const startedAt = Date.now();
    const intervalId = window.setInterval(() => {
      const elapsed = Date.now() - startedAt;
      setProgress(Math.min(100, (elapsed / durationMs) * 100));
    }, 100);
    const timeoutId = window.setTimeout(() => {
      window.clearInterval(intervalId);
      setProgress(100);
      onCompleteRef.current();
    }, durationMs);
    return () => {
      window.clearInterval(intervalId);
      window.clearTimeout(timeoutId);
    };
  }, [durationMs]);

  return (
    <div>
      <div className="mb-2 flex justify-between text-xs text-zinc-600">
        <span>Testando circuito...</span>
        <span>{Math.round(progress)}%</span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-zinc-200">
        <div
          className="h-full bg-emerald-500 transition-all"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
