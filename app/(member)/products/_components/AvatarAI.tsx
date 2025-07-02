// "use client";
// import React, { useEffect, useRef } from "react";
// import { Canvas } from "@react-three/fiber";
// import { OrbitControls, useGLTF, useAnimations  } from "@react-three/drei";
// import { Suspense } from "react";
// import * as THREE from 'three';

// const Model = () => {
//   // const modelSrc = "https://models.readyplayer.me/686537c60a9e32fd24d3801b.glb";
//   // const modelSrc = "https://models.readyplayer.me/686537c60a9e32fd24d3801b.glb"
//   const modelSrc = "/dummy.fbx"; 
//   const group = useRef<THREE.Group | null>(null);
//   const { scene, animations } = useGLTF(modelSrc);
//   const { actions } = useAnimations(animations, group);

//   useEffect(() => {
//     if (actions && Object.keys(actions).length > 0) {
//       const firstActionName = Object.keys(actions)[0];
//       actions[firstActionName]?.reset().fadeIn(0.5).play();
//       console.log(`Playing animation: ${firstActionName}`);
//     } else {
//       console.log("No animations found in GLTF.");
//     }
//   }, [actions]); 

//   return <primitive object={scene} ref={group} scale={0.8} position={[0, -1, 0]} />;
// };
// export const AvatarAI: React.FC = () => {
//   return (
//     <Canvas>
//       <ambientLight intensity={1} />
//       <directionalLight position={[0, 2, 2]} intensity={1} />
//       <Suspense fallback={null}>
//         <Model />
//       </Suspense>
//       <OrbitControls />
//     </Canvas>
//   );
// };

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
  const {
    isListening,
    transcript,
    interimTranscript,
    startListening,
    stopListening,
    resetTranscript,
    isSupported
  } = useVoiceRecognition({
    onResult: (text) => {
      console.log('音声認識結果:', text);
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

        {/* 音声認識結果表示 */}
        {isExpanded && (
          <div style={{
            position: 'absolute',
            top: '170px',
            left: '10px',
            right: '10px',
            bottom: '60px',
            padding: '12px',
            overflowY: 'auto',
            borderTop: '1px solid #e5e7eb'
          }}>
            <h3 style={{ 
              fontSize: '14px', 
              fontWeight: 'bold', 
              marginBottom: '8px',
              color: '#374151'
            }}>
              音声認識結果
            </h3>
            
            {isListening && (
              <div style={{
                padding: '8px',
                background: '#fef3c7',
                borderRadius: '6px',
                marginBottom: '8px',
                fontSize: '12px',
                color: '#92400e'
              }}>
                🎤 聞き取り中...
              </div>
            )}

            {interimTranscript && (
              <div style={{
                padding: '8px',
                background: '#f3f4f6',
                borderRadius: '6px',
                marginBottom: '8px',
                fontSize: '13px',
                color: '#6b7280',
                fontStyle: 'italic'
              }}>
                {interimTranscript}
              </div>
            )}

            {transcript && (
              <div style={{
                padding: '8px',
                background: '#f9fafb',
                borderRadius: '6px',
                fontSize: '13px',
                color: '#111827',
                whiteSpace: 'pre-wrap'
              }}>
                {transcript}
              </div>
            )}

            {transcript && (
              <button
                onClick={resetTranscript}
                style={{
                  marginTop: '8px',
                  padding: '6px 12px',
                  fontSize: '12px',
                  background: '#f3f4f6',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  color: '#6b7280'
                }}
              >
                クリア
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
