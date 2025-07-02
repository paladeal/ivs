'use client';

import React, { useEffect, useRef, useState } from 'react';

export default function VideoProcessingPage() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDetecting, setIsDetecting] = useState(false);
  const [detectionStatus, setDetectionStatus] = useState('カメラを起動中...');
  const animationIdRef = useRef<number>(0);
  const [lastDetectionTime, setLastDetectionTime] = useState(0);

  const playDetectionSound = () => {
    try {
      if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance('こんにちは！！');
        utterance.lang = 'ja-JP';
        utterance.rate = 1.0;
        utterance.pitch = 1.2;
        utterance.volume = 0.8;
        
        // 日本語の音声を優先的に選択
        const voices = speechSynthesis.getVoices();
        const japaneseVoice = voices.find(voice => voice.lang.includes('ja'));
        if (japaneseVoice) {
          utterance.voice = japaneseVoice;
        }
        
        speechSynthesis.speak(utterance);
      } else {
        console.warn('音声合成がサポートされていません');
      }
    } catch (error) {
      console.error('音声再生エラー:', error);
    }
  };

  useEffect(() => {
    let stream: MediaStream | null = null;
    let model: any = null;

    const loadCocoSsdModel = async () => {
      // @ts-ignore
      if (typeof window !== 'undefined' && window.cocoSsd) {
        try {
          // @ts-ignore
          model = await window.cocoSsd.load();
          return model;
        } catch (error) {
          console.error('モデルの読み込みに失敗しました:', error);
          setDetectionStatus('人物検知モデルの読み込みに失敗しました');
        }
      }
      return null;
    };

    const startCamera = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({ 
          video: { 
            width: { ideal: 640 },
            height: { ideal: 480 }
          }, 
          audio: false 
        });
        
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          setDetectionStatus('カメラ起動完了');
          
          // モデルを読み込んで検知を開始
          const loadedModel = await loadCocoSsdModel();
          if (loadedModel) {
            model = loadedModel;
            setIsDetecting(true);
            detectHumans(loadedModel);
          }
        }
      } catch (error) {
        console.error('カメラの起動に失敗しました:', error);
        setDetectionStatus('カメラへのアクセスが拒否されました');
      }
    };

    const detectHumans = async (detectionModel: any) => {
      if (!videoRef.current || !canvasRef.current || !detectionModel) return;

      const video = videoRef.current;
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');

      if (!ctx) return;

      // キャンバスのサイズをビデオに合わせる
      canvas.width = video.videoWidth || 640;
      canvas.height = video.videoHeight || 480;

      const detect = async () => {
        if (!video.paused && !video.ended) {
          try {
            // 物体検出を実行
            const predictions = await detectionModel.detect(video);
            
            // キャンバスをクリア
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            // 人間の検出結果をフィルタリング
            const humans = predictions.filter((p: any) => p.class === 'person');
            
            // 検出状態を更新
            if (humans.length > 0) {
              setDetectionStatus(`${humans.length}人の人物を検出中`);
              
              // 人物検出時の音声通知（3秒間隔で制限）
              const currentTime = Date.now();
              if (currentTime - lastDetectionTime > 3000) {
                playDetectionSound();
                setLastDetectionTime(currentTime);
              }
              
              // 検出結果を描画
              humans.forEach((prediction: any) => {
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
            } else {
              setDetectionStatus('人物を検出していません');
            }
          } catch (error) {
            console.error('検出エラー:', error);
          }
          
          // 次のフレームで再度検出
          animationIdRef.current = requestAnimationFrame(detect);
        }
      };

      // 検出を開始
      detect();
    };

    startCamera();

    // クリーンアップ
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }
    };
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">ビデオ処理 - 人物検知</h1>
      
      <div className="mb-4">
        <p className="text-lg">ステータス: <span className="font-semibold">{detectionStatus}</span></p>
      </div>
      
      <div className="relative inline-block">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          className="border border-gray-300"
          style={{ maxWidth: '100%' }}
        />
        <canvas
          ref={canvasRef}
          className="absolute top-0 left-0 pointer-events-none"
          style={{ maxWidth: '100%' }}
        />
      </div>
      
      {!isDetecting && (
        <div className="mt-4 p-4 bg-yellow-100 border border-yellow-400 rounded">
          <p className="text-sm">
            人物検知機能を使用するには、TensorFlow.jsとCOCO-SSDモデルが必要です。
          </p>
        </div>
      )}
      
      <script src="https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@latest" defer></script>
      <script src="https://cdn.jsdelivr.net/npm/@tensorflow-models/coco-ssd@latest" defer></script>
    </div>
  );
}