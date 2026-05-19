import { useEffect } from 'react';

export type SpeakOptions = {
  rate?: number;
  pitch?: number;
  lang?: string;
  onStart?: () => void;
  onEnd?: () => void;
};

export function useSpeechSynthesis() {
  const supported =
    typeof window !== 'undefined' &&
    'speechSynthesis' in window &&
    'SpeechSynthesisUtterance' in window;

  useEffect(() => {
    return () => {
      if (supported) {
        window.speechSynthesis.cancel();
      }
    };
  }, [supported]);

  function speak(text: string, options: SpeakOptions = {}) {
    if (!supported || !text.trim()) {
      options.onEnd?.();
      return;
    }

    const start = () => {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = options.lang ?? 'pt-BR';
      utterance.rate = options.rate ?? 1;
      utterance.pitch = options.pitch ?? 1;

      const voices = window.speechSynthesis.getVoices();
      const ptVoice = voices.find((voice) => voice.lang.toLowerCase().startsWith('pt'));
      if (ptVoice) utterance.voice = ptVoice;

      if (options.onStart) utterance.onstart = options.onStart;
      utterance.onend = () => options.onEnd?.();
      utterance.onerror = () => options.onEnd?.();

      window.speechSynthesis.speak(utterance);
    };

    const voices = window.speechSynthesis.getVoices();
    if (voices.length === 0) {
      window.speechSynthesis.addEventListener('voiceschanged', start, { once: true });
    } else {
      start();
    }
  }

  function cancel() {
    if (supported) window.speechSynthesis.cancel();
  }

  return { speak, cancel, supported };
}
