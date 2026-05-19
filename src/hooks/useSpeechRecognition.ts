import { useEffect, useRef } from 'react';

type RecognitionResultItem = {
  transcript: string;
  confidence: number;
};

type RecognitionResult = {
  isFinal: boolean;
  0: RecognitionResultItem;
  length: number;
};

type RecognitionEvent = {
  results: { [index: number]: RecognitionResult; length: number };
  resultIndex: number;
};

interface RecognitionInstance extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start: () => void;
  stop: () => void;
  abort: () => void;
  onresult: ((event: RecognitionEvent) => void) | null;
  onerror: ((event: { error: string }) => void) | null;
  onend: (() => void) | null;
}

type RecognitionConstructor = new () => RecognitionInstance;

declare global {
  interface Window {
    SpeechRecognition?: RecognitionConstructor;
    webkitSpeechRecognition?: RecognitionConstructor;
  }
}

function getRecognitionCtor(): RecognitionConstructor | null {
  if (typeof window === 'undefined') return null;
  return window.SpeechRecognition ?? window.webkitSpeechRecognition ?? null;
}

export type UseSpeechRecognitionOptions = {
  active: boolean;
  lang?: string;
  onResult: (transcript: string) => void;
  onError?: (error: string) => void;
};

const RETRYABLE_ERRORS = new Set(['network', 'no-speech', 'aborted', 'audio-capture']);

export function useSpeechRecognition(options: UseSpeechRecognitionOptions) {
  const { active, lang = 'pt-BR', onResult, onError } = options;
  const supported = getRecognitionCtor() !== null;

  const activeRef = useRef(active);
  const onResultRef = useRef(onResult);
  const onErrorRef = useRef(onError);
  const recognitionRef = useRef<RecognitionInstance | null>(null);
  const retryTimerRef = useRef<number | null>(null);

  useEffect(() => {
    activeRef.current = active;
  }, [active]);
  useEffect(() => {
    onResultRef.current = onResult;
  }, [onResult]);
  useEffect(() => {
    onErrorRef.current = onError;
  }, [onError]);

  useEffect(() => {
    const Ctor = getRecognitionCtor();
    if (!Ctor) return;

    const rec = new Ctor();
    rec.lang = lang;
    rec.continuous = true;
    rec.interimResults = false;

    rec.onresult = (event) => {
      const last = event.results[event.results.length - 1];
      const transcript = last?.[0]?.transcript ?? '';
      if (transcript.trim()) {
        onResultRef.current(transcript.trim());
      }
    };
    rec.onerror = (event) => {
      onErrorRef.current?.(event.error);
      if (activeRef.current && RETRYABLE_ERRORS.has(event.error)) {
        if (retryTimerRef.current !== null) {
          window.clearTimeout(retryTimerRef.current);
        }
        retryTimerRef.current = window.setTimeout(() => {
          retryTimerRef.current = null;
          if (activeRef.current) {
            try {
              rec.start();
            } catch {
              // already running
            }
          }
        }, 1500);
      }
    };
    rec.onend = () => {
      if (activeRef.current) {
        try {
          rec.start();
        } catch {
          // already running
        }
      }
    };

    recognitionRef.current = rec;

    return () => {
      activeRef.current = false;
      if (retryTimerRef.current !== null) {
        window.clearTimeout(retryTimerRef.current);
        retryTimerRef.current = null;
      }
      rec.onresult = null;
      rec.onerror = null;
      rec.onend = null;
      try {
        rec.abort();
      } catch {
        // ignore
      }
      recognitionRef.current = null;
    };
  }, [lang]);

  useEffect(() => {
    const rec = recognitionRef.current;
    if (!rec) return;
    if (active) {
      try {
        rec.start();
      } catch {
        // already running
      }
    } else {
      try {
        rec.stop();
      } catch {
        // already stopped
      }
    }
  }, [active]);

  return { supported };
}
