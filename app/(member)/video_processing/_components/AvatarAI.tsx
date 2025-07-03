"use client";
import React, { Suspense, useEffect, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useFBX, useAnimations } from '@react-three/drei';
import * as THREE from 'three';

const AnimatedAvatarModel = () => {
  const modelSrc = "/dummy.fbx"; 
  const group = useRef<THREE.Group>(null);
  const fbx = useFBX(modelSrc);
  const { actions, names } = useAnimations(fbx.animations, group);

  useEffect(() => {
    if (actions && names.length > 0) {
      const firstActionName = names[0];
      const action = actions[firstActionName];
      if (action) {
        action.reset().fadeIn(0.5).play();
      }
    } else {
      console.log("No animations found in the provided FBX. Please ensure the FBX model includes animations.");
    }
  }, [actions, names]);

  // アニメーションの更新を確実にする
  useFrame(() => {
    if (group.current) {
      group.current.rotation.y += 0.01; // テスト用の回転
    }
  });

  return (
    <group ref={group} scale={0.01} position={[0, -1, 0]}>
      <primitive object={fbx} />
    </group>
  );
};

export const AvatarAI: React.FC = () => {
  return (
    <div 
      style={{ 
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        width: '80%',
        height: '80%',
        zIndex: 9999,
        pointerEvents: 'auto'
      }}
    >
      <Canvas 
        camera={{ position: [0, 1.5, 3], fov: 40 }}
        style={{ width: '100%', height: '100%' }}
        gl={{ preserveDrawingBuffer: true, antialias: true }}
      >
        <ambientLight intensity={0.8} />
        <directionalLight position={[0, 3, 2]} intensity={0.5} />
        <Suspense fallback={null}>
          {/* AnimatedAvatarModelコンポーネントを呼び出し、FBXファイルのパスを渡します。 */}
          <AnimatedAvatarModel />
        </Suspense>
        {/* <OrbitControls /> */}
      </Canvas>
    </div>
  );
};