import { useRef, useCallback } from 'react';

export interface Detection {
  bbox: [number, number, number, number];
  class: string;
  score: number;
}

export interface HumanDetectionResult {
  humans: Detection[];
  count: number;
}

export const useHumanDetection = () => {
  const modelRef = useRef<any>(null);
  const animationIdRef = useRef<number>(0);

  const loadModel = useCallback(async (): Promise<any> => {
    if (typeof window !== 'undefined' && (window as any).cocoSsd) {
      try {
        const model = await (window as any).cocoSsd.load();
        modelRef.current = model;
        return model;
      } catch (error) {
        console.error('モデルの読み込みに失敗しました:', error);
        throw new Error('人物検知モデルの読み込みに失敗しました');
      }
    }
    throw new Error('COCO-SSDモデルが利用できません');
  }, []);

  const detect = useCallback(async (
    video: HTMLVideoElement,
    canvas: HTMLCanvasElement,
    onDetection: (result: HumanDetectionResult) => void
  ) => {
    if (!modelRef.current || !video || !canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;

    const detectFrame = async () => {
      if (!video.paused && !video.ended && modelRef.current) {
        try {
          const predictions = await modelRef.current.detect(video);
          ctx.clearRect(0, 0, canvas.width, canvas.height);

          const humans = predictions.filter((p: Detection) => p.class === 'person');
          
          humans.forEach((prediction: Detection) => {
            // バウンディングボックスを描画
            ctx.strokeStyle = '#00FF00';
            ctx.lineWidth = 2;
            ctx.strokeRect(
              prediction.bbox[0],
              prediction.bbox[1],
              prediction.bbox[2],
              prediction.bbox[3]
            );
            
            // ラベルを描画
            ctx.fillStyle = '#00FF00';
            ctx.font = '16px Arial';
            ctx.fillText(
              `Person (${Math.round(prediction.score * 100)}%)`,
              prediction.bbox[0],
              prediction.bbox[1] > 20 ? prediction.bbox[1] - 5 : prediction.bbox[1] + 15
            );
          });

          onDetection({ humans, count: humans.length });
        } catch (error) {
          console.error('検出エラー:', error);
        }
        
        animationIdRef.current = requestAnimationFrame(detectFrame);
      }
    };

    detectFrame();
  }, []);

  const stopDetection = useCallback(() => {
    if (animationIdRef.current) {
      cancelAnimationFrame(animationIdRef.current);
      animationIdRef.current = 0;
    }
  }, []);

  return {
    loadModel,
    detect,
    stopDetection,
    isModelLoaded: !!modelRef.current
  };
};