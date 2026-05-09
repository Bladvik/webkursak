// frontend/src/components/3d/Scene.jsx
import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, Html, useProgress } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import PCModel from './PCModel';
import { useThree } from '@react-three/fiber';
import { useEffect } from 'react';

// Custom HTML Loader that displays while .glb files are downloading
function CanvasLoader() {
  const { progress } = useProgress();
  return (
    <Html center>
      <div className="flex flex-col items-center justify-center space-y-4">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-white font-bold tracking-widest text-sm whitespace-nowrap bg-black/50 px-4 py-1 rounded">
          LOADING ASSETS {progress.toFixed(0)}%
        </p>
      </div>
    </Html>
  );
}
// Цей "фотограф" тимчасово перехоплює камеру для ідеального кадру
function SnapshotCameraSetup() {
// Отримуємо доступ до внутрішніх інструментів Three.js
// Отримуємо доступ до внутрішніх інструментів Three.js
  const { camera, gl, scene } = useThree();

  useEffect(() => {
    // Створюємо глобальну функцію для знімка
    window.forceStandardScreenshot = () => {
      // Запам'ятовуємо поточне положення камери користувача
      const originalPosition = camera.position.clone();
      const originalRotation = camera.rotation.clone();

      // --- НАЛАШТУВАННЯ ІДЕАЛЬНОГО РАКУРСУ ---
      // X: 6 (зміщуємо вбік, щоб бачити перед і бік)
      // Y: 3 (трішки зверху)
      // Z: 10 (віддаляємося, щоб корпус вліз повністю)
      camera.position.set(5, 2, 6); 
      camera.lookAt(0, -0.9, 0);
gl.clear();
      // Примусово рендеримо кадр із нової позиції
      gl.render(scene, camera);

      // Робимо скріншот полотна
      const dataUrl = gl.domElement.toDataURL('image/jpeg', 0.8);

      // Миттєво повертаємо камеру на місце
      camera.position.copy(originalPosition);
      camera.rotation.copy(originalRotation);

      gl.clear();
      camera.lookAt(0, 0.5, 0);
      gl.render(scene, camera);

      return dataUrl;
    };

    return () => { window.forceStandardScreenshot = null; };
  }, [camera, gl, scene]);

  return null;
}
export default function Scene() {
  return (
    <div className="w-full h-full cursor-grab active:cursor-grabbing">
      <Canvas camera={{ position: [0, 0, 8],fov: 55 }}
  gl={{ preserveDrawingBuffer: true }}>
        <SnapshotCameraSetup /> {/* <--- ДОДАЙ СЮДИ */}
        {/* Base Studio Lighting Setup */}
        <ambientLight intensity={0.4} />
        <spotLight position={[5, 10, 5]} angle={0.15} penumbra={1} intensity={1} castShadow />
        <spotLight position={[-5, 5, -5]} angle={0.15} penumbra={1} intensity={0.5} />
        
        {/* HDRI Environment for realistic metallic/glass reflections */}
        <Environment preset="city" />

        {/* Dynamic 3D Models */}
        <Suspense fallback={<CanvasLoader />}>
          <PCModel />
        </Suspense>

        {/* Camera Controls */}
        <OrbitControls 
          makeDefault 
          minDistance={2} 
          maxDistance={30} 
          target={[0, 0.5, 0]} 
          enablePan={false} // Disable panning to keep the PC centered
        />

        {/* Post-Processing Pipeline */}
        <EffectComposer disableNormalPass>
          <Bloom 
            intensity={1.5} 
            luminanceThreshold={1} // Only materials with emissiveIntensity > 1 will glow
            luminanceSmoothing={0.9} 
            height={300} 
            mipmapBlur // Smoother, more realistic glow dispersion
          />
        </EffectComposer>
      </Canvas>
    </div>
  );
}