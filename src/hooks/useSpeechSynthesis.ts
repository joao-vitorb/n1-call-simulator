import { useEffect, useRef } from 'react';

export type SpeakOptions = {
  rate?: number;
  pitch?: number;
  lang?: string;
};

export function useSpeechSynthesis() {
  const supported =
    typeof window !== 'undefined' && 'speechSynthesis' in window && 'SpeechSynthesisUtterance' in window;
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    return () => {
      if (supported) {
        window.speechSynthesis.cancel();
      }
    };
  }, [supported]);

  function speak(text: string, options: SpeakOptions = {}) {
    if (!supported || !text.trim()) return;

    const start = () => {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = options.lang ?? 'pt-BR';
      utterance.rate = options.rate ?? 1;
      utterance.pitch = options.pitch ?? 1;

      const voices = window.speechSynthesis.getVoices();
      const ptVoice = voices.find((voice) => voice.lang.toLowerCase().startsWith('pt'));
      if (ptVoice) utterance.voice = ptVoice;

      utteranceRef.current = utterance;
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
    if (!supported) return;
    window.speechSynthesis.cancel();
  }

  return { speak, cancel, supported };
}
