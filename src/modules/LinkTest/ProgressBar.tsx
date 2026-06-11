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
      <div className="mb-2 flex items-center justify-between text-xs">
        <span className="flex items-center gap-2 font-medium text-zinc-700">
          <span aria-hidden="true" className="h-1.5 w-1.5 animate-pulse rounded-full bg-indigo-500" />
          Testando circuito…
        </span>
        <span className="font-mono text-zinc-500">{Math.round(progress)}%</span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-zinc-100">
        <div
          className="h-full rounded-full bg-indigo-600 transition-all"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
