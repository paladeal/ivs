import { useRef, useCallback, useEffect } from 'react';

export interface CameraConfig {
  width: number;
  height: number;
}

const DEFAULT_CONFIG: CameraConfig = {
  width: 640,
  height: 480
};

export const useCamera = (config: Partial<CameraConfig> = {}) => {
  const finalConfig = { ...DEFAULT_CONFIG, ...config };
  const streamRef = useRef<MediaStream | null>(null);

  const startCamera = useCallback(async (videoElement: HTMLVideoElement): Promise<void> => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: finalConfig.width },
          height: { ideal: finalConfig.height }
        },
        audio: false
      });

      streamRef.current = stream;
      videoElement.srcObject = stream;
    } catch (error) {
      console.error('カメラの起動に失敗しました:', error);
      throw new Error('カメラへのアクセスが拒否されました');
    }
  }, [finalConfig]);

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
  }, []);

  const isActive = useCallback(() => {
    return streamRef.current !== null;
  }, []);

  // コンポーネントのアンマウント時にカメラを停止
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, [stopCamera]);

  return {
    startCamera,
    stopCamera,
    isActive,
    stream: streamRef.current
  };
};