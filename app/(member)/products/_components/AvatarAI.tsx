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
        left: '24px',
        width: '160px',
        height: '160px',
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
