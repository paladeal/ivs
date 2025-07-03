import { useCallback, useRef, useEffect, useMemo } from 'react';
import { useEnhancedSpeechSynthesis, type VoiceVoxSpeaker } from './use-enhanced-speech-synthesis';

export interface EnhancedPeriodicSpeechConfig {
  calloutTexts: string[];
  welcomeTexts: string[];
  voicevoxSpeaker?: VoiceVoxSpeaker;
  speed?: number;
  intervalMs?: number;
}

const kyotoDoctorMonologues = [
  "ほな、今日も手術終わってホッと一息どすなぁ。誰もおらへんと思うけど、ちょっと独り言言わせてもらいますわ。最近な、ええサプリ見つけたんですわ。トゥモローエックス2.0て言うんやけど、ちょっと聞いてもらえます？",
  "今日のオペ、長かったわ〜。でも無事終わって、なんか気分ええんですわ。そうそう、誰かに話したいことがあってな。お酒の健康習慣て言うたら、このトゥモローエックス2.0がええんですわ。",
  "さっきまで集中治療室やったけど、今はこのサプリに夢中やわ。トゥモローエックス2.0て言うんやけど、持ち運びが便利でなあ。見ておくれやす、この個包装！"
];

const DEFAULT_CONFIG: EnhancedPeriodicSpeechConfig = {
  calloutTexts: kyotoDoctorMonologues,
  welcomeTexts: ['ご来店ありがとうございます', 'いらっしゃいませ！'],
  voicevoxSpeaker: 'female_normal',
  speed: 0.95,
  intervalMs: 40000
};

export const useEnhancedPeriodicSpeech = (config: Partial<EnhancedPeriodicSpeechConfig> = {}) => {
  const finalConfig = useMemo(() => {
    return { ...DEFAULT_CONFIG, ...config };
  }, [config]);
  
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const hasPersonRef = useRef(false);
  const lastWelcomeTimeRef = useRef(0);
  
  const {
    speak,
    stop,
    isSpeaking,
    isLoading,
    currentProvider,
    setProvider
  } = useEnhancedSpeechSynthesis({
    voicevoxSpeaker: finalConfig.voicevoxSpeaker,
    speed: finalConfig.speed,
  });

  const startPeriodicCallout = useCallback(() => {
    if (intervalRef.current) return;

    intervalRef.current = setInterval(() => {
      if (!hasPersonRef.current && !isSpeaking && !isLoading) {
        const randomIndex = Math.floor(Math.random() * finalConfig.calloutTexts.length);
        speak(finalConfig.calloutTexts[randomIndex]);
      }
    }, finalConfig.intervalMs);
  }, [speak, finalConfig.calloutTexts, finalConfig.intervalMs, isSpeaking, isLoading]);

  const stopPeriodicCallout = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const onPersonDetected = useCallback(() => {
    const currentTime = Date.now();
    if (!hasPersonRef.current && currentTime - lastWelcomeTimeRef.current > 5000 && !isSpeaking && !isLoading) {
      const randomIndex = Math.floor(Math.random() * finalConfig.welcomeTexts.length);
      speak(finalConfig.welcomeTexts[randomIndex]);
      lastWelcomeTimeRef.current = currentTime;
    }
    hasPersonRef.current = true;
    stopPeriodicCallout();
  }, [speak, finalConfig.welcomeTexts, stopPeriodicCallout, isSpeaking, isLoading]);

  const onPersonLost = useCallback(() => {
    hasPersonRef.current = false;
    startPeriodicCallout();
  }, [startPeriodicCallout]);

  const cleanup = useCallback(() => {
    stopPeriodicCallout();
    stop();
  }, [stopPeriodicCallout, stop]);

  useEffect(() => {
    return cleanup;
  }, [cleanup]);

  return {
    onPersonDetected,
    onPersonLost,
    startPeriodicCallout,
    cleanup,
    isLoading,
    isSpeaking,
    currentProvider,
    setProvider
  };
};