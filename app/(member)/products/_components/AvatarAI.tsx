"use client";
import React, { useEffect, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF, useAnimations  } from "@react-three/drei";
import { Suspense } from "react";
import * as THREE from 'three';

const Model = () => {
  const myAvatarUrl =
    "https://models.readyplayer.me/686526abe615b40eba23e7ee.glb";
    const group = useRef<THREE.Group>(null);
  const { scene, animations } = useGLTF(myAvatarUrl);
  const { actions, names } = useAnimations(animations, group);
   useEffect(() => {
    console.log("利用可能なアニメーション:", actions);

    // デフォルトで最初のアニメーションを再生する
    if (names.length > 0) {
      const defaultAnimationName = names[0];
      console.log(`アニメーション "${defaultAnimationName}" を再生します。`);
      
      const action = actions[defaultAnimationName];
      if (action) {
        action.play();
      }
    }

    return () => {
      names.forEach(name => actions[name]?.stop());
    };
  }, [actions, names]);
  return <primitive object={scene} scale={2} position={[0, -3, 0]}/>;
};
export const AvatarAI: React.FC = () => {
  return (
    <Canvas>
      <ambientLight intensity={1} />
      <directionalLight position={[0, 2, 2]} intensity={1} />
      <Suspense fallback={null}>
        <Model />
      </Suspense>
      <OrbitControls />
    </Canvas>
  );
};
