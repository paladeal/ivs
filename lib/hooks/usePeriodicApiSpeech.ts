import { useCallback, useRef, useEffect, useMemo, useState } from 'react';
import type { TTSVoice } from '@/app/api/_services/OpenAIService';

export interface PeriodicApiSpeechConfig {
  calloutTexts: string[];
  welcomeTexts: string[];
  voice?: TTSVoice;
  speed?: number;
  intervalMs?: number;
}

const kyotoDoctorMonologues = [
  "ほな、今日も手術終わってホッと一息どすなぁ。誰もおらへんと思うけど、ちょっと独り言言わせてもらいますわ。最近な、ええサプリ見つけたんですわ。トゥモローエックス2.0て言うんやけど、ちょっと聞いてもらえます？あのなあ、このコンプレンていう成分、ほんまに興味深いんですわ。蒟蒻芋から作った食物繊維なんやけど、普通のとちゃいますで。酵素と乳酸菌で特別に加工してあるんどす。体の巡りをサポートしてくれるとされてますねん。あ、効果があるとは言えませんけど、栄養補給としては理にかなってますわ〜",
  "今日のオペ、長かったわ〜。でも無事終わって、なんか気分ええんですわ。そうそう、誰かに話したいことがあってな。お酒の健康習慣て言うたら、このトゥモローエックス2.0がええんですわ。手術着のまま失礼しますわ〜。このサプリにはオルニチンて成分が、しじみ何個分やろなあ、ぎょうさん入ってますのや。体調管理に役立つとされる成分どすえ。特に、お酒飲む方の栄養補給をサポートしてくれるんですわ。あ、治療するわけやないですよ、あくまで栄養補給どすからね〜",
  "さっきまで集中治療室やったけど、今はこのサプリに夢中やわ。トゥモローエックス2.0て言うんやけど、持ち運びが便利でなあ。見ておくれやす、この個包装！30錠入りで、一つ一つちゃんと包装されてるんですわ。白衣のポケットに入れても、かさばらへんし、どこでもサッと取り出せますのや。あ、そうそう！水なしでも噛んで飲めるんやて。手術の合間に水取りに行く暇もないんやけど、これやったら...えーっと、チュアブルタイプて言うんやったかな？"
];

const DEFAULT_CONFIG: PeriodicApiSpeechConfig = {
  calloutTexts: kyotoDoctorMonologues,
  welcomeTexts: ['ご来店ありがとうございます', 'いらっしゃいませ！'],
  voice: 'shimmer', // より人間らしい声を選択
  speed: 0.95, // 少しゆっくり目で自然な速度
  intervalMs: 40000
};

export const usePeriodicApiSpeech = (config: Partial<PeriodicApiSpeechConfig> = {}) => {
  const finalConfig = useMemo(() => {
    return { ...DEFAULT_CONFIG, ...config };
  }, [config]);
  
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const hasPersonRef = useRef(false);
  const lastWelcomeTimeRef = useRef(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const speakText = useCallback(async (text: string) => {
    try {
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
      
      return true;
    } catch (error) {
      console.error('音声再生エラー:', error);
      setIsSpeaking(false);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [finalConfig]);

  const startPeriodicCallout = useCallback(() => {
    if (intervalRef.current) return;

    intervalRef.current = setInterval(() => {
      if (!hasPersonRef.current && !isSpeaking && !isLoading) {
        const randomIndex = Math.floor(Math.random() * finalConfig.calloutTexts.length);
        speakText(finalConfig.calloutTexts[randomIndex]);
      }
    }, finalConfig.intervalMs);
  }, [speakText, finalConfig.calloutTexts, finalConfig.intervalMs, isSpeaking, isLoading]);

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
      speakText(finalConfig.welcomeTexts[randomIndex]);
      lastWelcomeTimeRef.current = currentTime;
    }
    hasPersonRef.current = true;
    stopPeriodicCallout();
  }, [speakText, finalConfig.welcomeTexts, stopPeriodicCallout, isSpeaking, isLoading]);

  const onPersonLost = useCallback(() => {
    hasPersonRef.current = false;
    startPeriodicCallout();
  }, [startPeriodicCallout]);

  const cleanup = useCallback(() => {
    stopPeriodicCallout();
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
      setIsSpeaking(false);
    }
  }, [stopPeriodicCallout]);

  useEffect(() => {
    return cleanup;
  }, [cleanup]);

  return {
    onPersonDetected,
    onPersonLost,
    startPeriodicCallout,
    cleanup,
    isLoading,
    isSpeaking
  };
};