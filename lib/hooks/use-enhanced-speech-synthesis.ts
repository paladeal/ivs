import { useCallback, useRef, useState } from 'react';

export type VoiceProvider = 'voicevox' | 'browser';
export type VoiceVoxSpeaker = 'normal' | 'happy' | 'tsundere' | 'whisper' | 'male_normal' | 'female_normal' | 'girl_normal' | 'boy_normal';

export interface EnhancedSpeechConfig {
  provider?: VoiceProvider;
  voicevoxSpeaker?: VoiceVoxSpeaker;
  speed?: number;
  pitch?: number;
  volume?: number;
  cooldownMs?: number;
}

const DEFAULT_CONFIG: EnhancedSpeechConfig = {
  provider: 'voicevox',
  voicevoxSpeaker: 'female_normal',
  speed: 1.0,
  pitch: 1.0,
  volume: 0.8,
  cooldownMs: 1000
};

export const useEnhancedSpeechSynthesis = (config: EnhancedSpeechConfig = {}) => {
  const finalConfig = { ...DEFAULT_CONFIG, ...config };
  const lastSpeechTimeRef = useRef(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [currentProvider, setCurrentProvider] = useState<VoiceProvider>(finalConfig.provider || 'voicevox');

  // ブラウザの音声合成を使用
  const speakWithBrowser = useCallback((text: string) => {
    try {
      if (!('speechSynthesis' in window)) {
        console.warn('音声合成がサポートされていません');
        return false;
      }

      if (speechSynthesis.speaking) {
        speechSynthesis.cancel();
      }

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'ja-JP';
      utterance.rate = finalConfig.speed || 1.0;
      utterance.pitch = finalConfig.pitch || 1.0;
      utterance.volume = finalConfig.volume || 0.8;

      // 日本語の音声を優先的に選択
      const voices = speechSynthesis.getVoices();
      const preferredVoice = voices.find(voice => voice.lang.includes('ja'));
      if (preferredVoice) {
        utterance.voice = preferredVoice;
      }

      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);

      speechSynthesis.speak(utterance);
      return true;
    } catch (error) {
      console.error('ブラウザ音声再生エラー:', error);
      setIsSpeaking(false);
      return false;
    }
  }, [finalConfig]);

  // VoiceVox APIを使用
  const speakWithVoiceVox = useCallback(async (text: string) => {
    try {
      setIsLoading(true);
      
      const response = await fetch('/api/text-to-speech/voicevox', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text,
          speaker: finalConfig.voicevoxSpeaker,
          speed: finalConfig.speed,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        if (errorData.fallback) {
          console.warn('VoiceVoxが利用できません。ブラウザ音声合成にフォールバックします。');
          setCurrentProvider('browser');
          return speakWithBrowser(text);
        }
        throw new Error('音声生成に失敗しました');
      }

      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);

      audioRef.current = new Audio(audioUrl);
      audioRef.current.volume = finalConfig.volume || 0.8;
      audioRef.current.onplay = () => setIsSpeaking(true);
      audioRef.current.onended = () => {
        setIsSpeaking(false);
        URL.revokeObjectURL(audioUrl);
      };
      audioRef.current.onerror = () => {
        setIsSpeaking(false);
        URL.revokeObjectURL(audioUrl);
        // エラー時はブラウザ音声合成にフォールバック
        console.warn('音声再生エラー。ブラウザ音声合成にフォールバックします。');
        setCurrentProvider('browser');
        speakWithBrowser(text);
      };

      await audioRef.current.play();
      return true;
    } catch (error) {
      console.error('VoiceVox音声再生エラー:', error);
      // エラー時はブラウザ音声合成にフォールバック
      setCurrentProvider('browser');
      return speakWithBrowser(text);
    } finally {
      setIsLoading(false);
    }
  }, [finalConfig, speakWithBrowser]);

  const speak = useCallback(async (text: string) => {
    // クールダウン時間をチェック
    const currentTime = Date.now();
    if (currentTime - lastSpeechTimeRef.current < (finalConfig.cooldownMs || 1000)) {
      return false;
    }

    // 既存の音声を停止
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    if ('speechSynthesis' in window && speechSynthesis.speaking) {
      speechSynthesis.cancel();
    }

    lastSpeechTimeRef.current = currentTime;

    // 現在のプロバイダーに応じて音声合成を実行
    if (currentProvider === 'voicevox') {
      return await speakWithVoiceVox(text);
    } else {
      return speakWithBrowser(text);
    }
  }, [currentProvider, finalConfig.cooldownMs, speakWithVoiceVox, speakWithBrowser]);

  const stop = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    if ('speechSynthesis' in window && speechSynthesis.speaking) {
      speechSynthesis.cancel();
    }
    setIsSpeaking(false);
  }, []);

  const isSupported = useCallback(() => {
    return true; // 常にサポート（フォールバックがあるため）
  }, []);

  return {
    speak,
    stop,
    isSpeaking,
    isLoading,
    isSupported,
    currentProvider,
    setProvider: setCurrentProvider
  };
};