import { useCallback, useRef, useEffect, useMemo } from 'react';

export interface PeriodicSpeechConfig {
  calloutText: string;
  welcomeText: string;
  lang: string;
  rate: number;
  pitch: number;
  volume: number;
  intervalMs: number;
}

const DEFAULT_CONFIG: PeriodicSpeechConfig = {
  calloutText: 'だれかきて',
  welcomeText: 'お待ちしていました',
  lang: 'ja-JP',
  rate: 1.0,
  pitch: 1.2,
  volume: 0.8,
  intervalMs: 15000
};

export const usePeriodicSpeech = (config: Partial<PeriodicSpeechConfig> = {}) => {
  const finalConfig = useMemo(() => {
  return { ...DEFAULT_CONFIG, ...config };
}, [config]);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const hasPersonRef = useRef(false);
  const lastWelcomeTimeRef = useRef(0);

  const speakText = useCallback((text: string) => {
    try {
      if (!('speechSynthesis' in window)) {
        console.warn('音声合成がサポートされていません');
        return false;
      }

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = finalConfig.lang;
      utterance.rate = finalConfig.rate;
      utterance.pitch = finalConfig.pitch;
      utterance.volume = finalConfig.volume;

      const voices = speechSynthesis.getVoices();
      const preferredVoice = voices.find(voice => voice.lang.includes('ja'));
      if (preferredVoice) {
        utterance.voice = preferredVoice;
      }

      speechSynthesis.speak(utterance);
      return true;
    } catch (error) {
      console.error('音声再生エラー:', error);
      return false;
    }
  }, [finalConfig]);

  const startPeriodicCallout = useCallback(() => {
    if (intervalRef.current) return;

    intervalRef.current = setInterval(() => {
      if (!hasPersonRef.current) {
        speakText(finalConfig.calloutText);
      }
    }, finalConfig.intervalMs);
  }, [speakText, finalConfig.calloutText, finalConfig.intervalMs]);

  const stopPeriodicCallout = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const onPersonDetected = useCallback(() => {
    const currentTime = Date.now();
    if (!hasPersonRef.current && currentTime - lastWelcomeTimeRef.current > 5000) {
      speakText(finalConfig.welcomeText);
      lastWelcomeTimeRef.current = currentTime;
    }
    hasPersonRef.current = true;
    stopPeriodicCallout();
  }, [speakText, finalConfig.welcomeText, stopPeriodicCallout]);

  const onPersonLost = useCallback(() => {
    hasPersonRef.current = false;
    startPeriodicCallout();
  }, [startPeriodicCallout]);

  const cleanup = useCallback(() => {
    stopPeriodicCallout();
    if ('speechSynthesis' in window && speechSynthesis.speaking) {
      speechSynthesis.cancel();
    }
  }, [stopPeriodicCallout]);

  useEffect(() => {
    return cleanup;
  }, [cleanup]);

  return {
    onPersonDetected,
    onPersonLost,
    startPeriodicCallout,
    cleanup
  };
};