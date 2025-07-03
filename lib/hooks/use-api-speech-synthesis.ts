import { useCallback, useRef, useState } from 'react';
import type { TTSVoice } from '@/app/api/_services/OpenAIService';

export interface ApiSpeechConfig {
  voice?: TTSVoice;
  speed?: number;
  cooldownMs?: number;
}

const DEFAULT_CONFIG: ApiSpeechConfig = {
  voice: 'alloy',
  speed: 1.0,
  cooldownMs: 1000
};

export const useApiSpeechSynthesis = (config: ApiSpeechConfig = {}) => {
  const finalConfig = { ...DEFAULT_CONFIG, ...config };
  const lastSpeechTimeRef = useRef(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const speak = useCallback(async (text: string) => {
    try {
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

      setIsLoading(true);
      
      // APIリクエスト
      const response = await fetch('/api/text-to-speech', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text,
          voice: finalConfig.voice,
          speed: finalConfig.speed,
        }),
      });

      console.log('response', response.error);
      if (!response.ok) {
        throw new Error('音声生成に失敗しました');
      }

      // 音声データを取得してBlobに変換
      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);

      // Audioオブジェクトを作成して再生
      audioRef.current = new Audio(audioUrl);
      audioRef.current.onplay = () => setIsSpeaking(true);
      audioRef.current.onended = () => {
        setIsSpeaking(false);
        URL.revokeObjectURL(audioUrl);
      };
      audioRef.current.onerror = () => {
        setIsSpeaking(false);
        URL.revokeObjectURL(audioUrl);
      };

      await audioRef.current.play();
      lastSpeechTimeRef.current = currentTime;
      
      return true;
    } catch (error) {
      console.error('音声再生エラー:', error);
      setIsSpeaking(false);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [finalConfig]);

  const stop = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
      setIsSpeaking(false);
    }
  }, []);

  const isSupported = useCallback(() => {
    return true; // API経由なので常にサポート
  }, []);

  return {
    speak,
    stop,
    isSpeaking,
    isLoading,
    isSupported
  };
};