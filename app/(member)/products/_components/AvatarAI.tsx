"use client";
import React, { Suspense, useEffect, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useFBX, useAnimations } from '@react-three/drei';
import * as THREE from 'three';
import { useVoiceRecognition } from '@/app/_hooks/useVoiceRecognition';

interface AnimatedAvatarModelProps {
  isListening?: boolean;
}

const AnimatedAvatarModel: React.FC<AnimatedAvatarModelProps> = ({ isListening = false }) => {
  const modelSrc = "/dummy.fbx"; 
  const group = useRef<THREE.Group>(null);

  const fbx = useFBX(modelSrc);
  const { actions, names } = useAnimations(fbx.animations, group);

  useEffect(() => {
    console.log('Available animations:', names);
    if (actions && names.length > 0) {
      const firstActionName = names[0];
      const action = actions[firstActionName];
      if (action) {
        action.reset().fadeIn(0.5).play();
        console.log(`Playing animation: ${firstActionName}`);
      }
    } else {
      console.log("No animations found in the provided FBX. Please ensure the FBX model includes animations.");
    }
  }, [actions, names]);

  // アニメーションの更新を確実にする
  useFrame(() => {
    if (group.current) {
      // 音声認識中は少し速く回転
      const rotationSpeed = isListening ? 0.02 : 0.01;
      group.current.rotation.y += rotationSpeed;
      
      // 音声認識中は軽く上下に動かす
      if (isListening) {
        group.current.position.y = -1 + Math.sin(Date.now() * 0.002) * 0.05;
      }
    }
  });
  
  return (
    <group ref={group} scale={0.01} position={[0, -1, 0]}>
      <primitive object={fbx} />
    </group>
  );
};

export const AvatarAI: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [chatHistory, setChatHistory] = useState<Array<{ role: 'user' | 'assistant', content: string }>>([]);
  const [isLoading, setIsLoading] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const lastProcessedMessageRef = useRef<string>('');
  
  // Auto-scroll to bottom when new messages are added
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatHistory]);
  
  const sendToGPT = async (message: string) => {
    // 同じメッセージの重複送信を防ぐ
    if (lastProcessedMessageRef.current === message || isLoading) {
      console.log('Duplicate message or already loading, skipping...');
      return;
    }
    
    lastProcessedMessageRef.current = message;
    setIsLoading(true);
    setChatHistory(prev => [...prev, { role: 'user', content: message }]);
    
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        if (response.status === 429) {
          setChatHistory(prev => [...prev, { 
            role: 'assistant', 
            content: data.error || 'API利用制限に達しました。しばらくしてから再度お試しください。' 
          }]);
        } else {
          throw new Error(data.error || 'Failed to get response');
        }
        return;
      }

      setChatHistory(prev => [...prev, { role: 'assistant', content: data.response }]);
    } catch (error) {
      console.error('Error calling GPT API:', error);
      setChatHistory(prev => [...prev, { 
        role: 'assistant', 
        content: '申し訳ございません。エラーが発生しました。もう一度お試しください。' 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const {
    isListening,
    interimTranscript,
    startListening,
    stopListening,
    resetTranscript,
    isSupported
  } = useVoiceRecognition({
    onResult: async (text) => {
      console.log('音声認識結果:', text);
      await sendToGPT(text);
    },
    onError: (error) => {
      console.error('音声認識エラー:', error);
    }
  });

  const handleMicClick = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  return (
    <div 
      style={{ 
        position: 'fixed',
        bottom: '24px',
        left: '24px',
        width: isExpanded ? '320px' : '160px',
        height: isExpanded ? '400px' : '160px',
        zIndex: 9999,
        pointerEvents: 'auto',
        transition: 'all 0.3s ease-in-out',
        background: isExpanded ? 'rgba(255, 255, 255, 0.95)' : 'transparent',
        borderRadius: '12px',
        boxShadow: isExpanded ? '0 4px 20px rgba(0, 0, 0, 0.15)' : 'none'
      }}
    >
      <div style={{ position: 'relative', width: '100%', height: '100%' }}>
        <Canvas 
          camera={{ position: [0, 1.5, 3], fov: 40 }}
          style={{ 
            width: isExpanded ? '160px' : '100%', 
            height: '160px',
            position: 'absolute',
            top: 0,
            left: 0
          }}
          gl={{ preserveDrawingBuffer: true, antialias: true }}
        >
          <ambientLight intensity={0.8} />
          <directionalLight position={[0, 3, 2]} intensity={0.5} />
          <Suspense fallback={null}>
            <AnimatedAvatarModel isListening={isListening} />
          </Suspense>
        </Canvas>

        {/* 音声認識コントロール */}
        <div style={{
          position: 'absolute',
          bottom: '8px',
          right: '8px',
          display: 'flex',
          gap: '8px'
        }}>
          {isSupported && (
            <button
              onClick={handleMicClick}
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                border: 'none',
                background: isListening ? '#ef4444' : '#3b82f6',
                color: 'white',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '20px',
                transition: 'background 0.3s',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)'
              }}
              title={isListening ? '音声認識を停止' : '音声認識を開始'}
            >
              {isListening ? '🔴' : '🎤'}
            </button>
          )}
          
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              border: 'none',
              background: '#6b7280',
              color: 'white',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '16px',
              transition: 'transform 0.3s',
              transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)'
            }}
          >
            ↗️
          </button>
        </div>

        {/* チャット表示 */}
        {isExpanded && (
          <div 
            ref={chatContainerRef}
            style={{
            position: 'absolute',
            top: '170px',
            left: '10px',
            right: '10px',
            bottom: '60px',
            padding: '12px',
            overflowY: 'auto',
            borderTop: '1px solid #e5e7eb',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px'
          }}>
            <h3 style={{ 
              fontSize: '14px', 
              fontWeight: 'bold', 
              marginBottom: '8px',
              color: '#374151'
            }}>
              AIアシスタント
            </h3>
            
            {/* チャット履歴 */}
            {chatHistory.map((message, index) => (
              <div
                key={index}
                style={{
                  padding: '8px 12px',
                  borderRadius: '8px',
                  fontSize: '13px',
                  maxWidth: '85%',
                  alignSelf: message.role === 'user' ? 'flex-end' : 'flex-start',
                  background: message.role === 'user' ? '#3b82f6' : '#f3f4f6',
                  color: message.role === 'user' ? 'white' : '#374151',
                  wordBreak: 'break-word'
                }}
              >
                {message.content}
              </div>
            ))}

            {/* 音声認識中の表示 */}
            {isListening && (
              <div style={{
                padding: '8px',
                background: '#fef3c7',
                borderRadius: '6px',
                fontSize: '12px',
                color: '#92400e',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}>
                🎤 聞き取り中...
                {interimTranscript && (
                  <span style={{ fontStyle: 'italic' }}>{interimTranscript}</span>
                )}
              </div>
            )}

            {/* ローディング表示 */}
            {isLoading && (
              <div style={{
                padding: '8px',
                background: '#e0e7ff',
                borderRadius: '6px',
                fontSize: '12px',
                color: '#4338ca',
                alignSelf: 'flex-start'
              }}>
                考え中...
              </div>
            )}

            {/* チャット履歴クリアボタン */}
            {chatHistory.length > 0 && (
              <button
                onClick={() => {
                  setChatHistory([]);
                  resetTranscript();
                }}
                style={{
                  marginTop: '8px',
                  padding: '6px 12px',
                  fontSize: '12px',
                  background: '#f3f4f6',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  color: '#6b7280',
                  alignSelf: 'center'
                }}
              >
                チャットをクリア
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
