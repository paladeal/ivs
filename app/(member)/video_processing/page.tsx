'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useCamera } from '@/lib/hooks/use-camera';
import { useHumanDetection, type HumanDetectionResult } from '@/lib/hooks/use-human-detection';
import { useSpeechSynthesis } from '@/lib/hooks/use-speech-synthesis';
import { VideoDisplay } from './_components/video-display';
import { DetectionCanvas } from './_components/detection-canvas';
import { StatusDisplay } from './_components/status-display';
import { WarningMessage } from './_components/warning-message';

export default function VideoProcessingPage() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDetecting, setIsDetecting] = useState(false);
  const [detectionStatus, setDetectionStatus] = useState('カメラを起動中...');
  
  const camera = useCamera();
  const humanDetection = useHumanDetection();
  const speech = useSpeechSynthesis();

  const handleDetection = (result: HumanDetectionResult) => {
    if (result.count > 0) {
      setDetectionStatus(`${result.count}人の人物を検出中`);
      speech.speak();
    } else {
      setDetectionStatus('人物を検出していません');
      speech.stop();
    }
  };

  useEffect(() => {
    const initializeSystem = async () => {
      if (!videoRef.current || !canvasRef.current) return;

      try {
        // カメラを起動
        await camera.startCamera(videoRef.current);
        setDetectionStatus('カメラ起動完了');

        // 人物検知モデルを読み込み
        await humanDetection.loadModel();
        setIsDetecting(true);

        // 検知を開始
        humanDetection.detect(videoRef.current, canvasRef.current, handleDetection);
      } catch (error) {
        console.error('初期化エラー:', error);
        setDetectionStatus(error instanceof Error ? error.message : 'システムの初期化に失敗しました');
      }
    };

    initializeSystem();

    // クリーンアップ
    return () => {
      humanDetection.stopDetection();
      camera.stopCamera();
      speech.stop();
    };
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">ビデオ処理 - 人物検知</h1>
      
      <StatusDisplay status={detectionStatus} />
      
      <div className="relative inline-block">
        <VideoDisplay ref={videoRef} />
        <DetectionCanvas ref={canvasRef} />
      </div>
      
      <WarningMessage show={!isDetecting} />
      
      <script src="https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@latest" defer></script>
      <script src="https://cdn.jsdelivr.net/npm/@tensorflow-models/coco-ssd@latest" defer></script>
    </div>
  );
}