import { useCallback, useRef } from 'react';

export interface SpeechConfig {
  text: string;
  lang: string;
  rate: number;
  pitch: number;
  volume: number;
  cooldownMs: number;
}

const DEFAULT_CONFIG: SpeechConfig = {
  text: 'へい!!らっしゃい！！！',
  lang: 'ja-JP',
  rate: 1.0,
  pitch: 1.2,
  volume: 0.8,
  cooldownMs: 3000
};

export const useSpeechSynthesis = (config: Partial<SpeechConfig> = {}) => {
  const finalConfig = { ...DEFAULT_CONFIG, ...config };
  const lastSpeechTimeRef = useRef(0);

  const speak = useCallback(() => {
    try {
      if (!('speechSynthesis' in window)) {
        console.warn('音声合成がサポートされていません');
        return false;
      }

      // クールダウン時間をチェック
      const currentTime = Date.now();
      if (currentTime - lastSpeechTimeRef.current < finalConfig.cooldownMs) {
        return false;
      }

      const utterance = new SpeechSynthesisUtterance(finalConfig.text);
      utterance.lang = finalConfig.lang;
      utterance.rate = finalConfig.rate;
      utterance.pitch = finalConfig.pitch;
      utterance.volume = finalConfig.volume;

      // 日本語の音声を優先的に選択
      const voices = speechSynthesis.getVoices();
      const preferredVoice = voices.find(voice => voice.lang.includes('ja'));
      if (preferredVoice) {
        utterance.voice = preferredVoice;
      }

      speechSynthesis.speak(utterance);
      lastSpeechTimeRef.current = currentTime;
      return true;
    } catch (error) {
      console.error('音声再生エラー:', error);
      return false;
    }
  }, [finalConfig]);

  const stop = useCallback(() => {
    if ('speechSynthesis' in window && speechSynthesis.speaking) {
      speechSynthesis.cancel();
    }
  }, []);

  const isSpeaking = useCallback(() => {
    return 'speechSynthesis' in window && speechSynthesis.speaking;
  }, []);

  const isSupported = useCallback(() => {
    return 'speechSynthesis' in window;
  }, []);

  return {
    speak,
    stop,
    isSpeaking,
    isSupported
  };
};