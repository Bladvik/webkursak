// frontend/src/components/3d/PCModel.jsx
import React, { useMemo, useRef } from 'react';
import { useGLTF, Center } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useStore } from '../../store/useStore';
import * as THREE from 'three';

function ModelPart({ url, position, rotation, scale, partColors, partType }) {
  const { scene } = useGLTF(url);
  const { rgbSync, globalRgbColor, rgbEnabled, baseSync, globalBaseColor } = useStore();
  
  // Реф для інерції вентилятора
  const fanSpeed = useRef(0);

  const { clonedScene, rgbMaterials, baseMaterials, fanBlades } = useMemo(() => {
    const clone = scene.clone();
    const rgbMats = [];
    const baseMats = [];
    const blades = [];
    
    clone.traverse((node) => {
      const nodeName = (node.name || '').toLowerCase();

      // --- ЛОГІКА ПОШУКУ ЛОПАТЕЙ (Тільки робочі імена для курсової) ---
      const isWorkingFanBlade = nodeName.includes('plano') || 
                                nodeName.includes('rculo') || 
                                nodeName.includes('blade') || 
                                nodeName.includes('rotor');

      if ((node.isMesh || node.isGroup) && isWorkingFanBlade) {
        blades.push(node);
      }

      // --- ОБРОБКА МАТЕРІАЛІВ (Фікс стабільності) ---
      if (node.isMesh && node.material) {
        try {
          const materials = Array.isArray(node.material) ? node.material : [node.material];
          const newMaterials = materials.map(mat => {
            const newMat = mat.clone();
            const matName = (newMat.name || '').toLowerCase();
            
            newMat.userData.originalColor = newMat.color ? newMat.color.clone() : new THREE.Color('#ffffff');
            newMat.userData.originalEmissive = newMat.emissive ? newMat.emissive.clone() : new THREE.Color('#000000');
            newMat.userData.originalIntensity = newMat.emissiveIntensity ?? 1;

            const isEmissive = matName.includes('rgb') || matName.includes('led') || 
                               matName.includes('emissive') || matName.includes('glow') || 
                               (newMat.emissive && newMat.emissive.getHex() > 0);
            
            if (isEmissive) {
              if (newMat.color) newMat.color = new THREE.Color('#000000');
              rgbMats.push(newMat);
            } else {
              const isGlass = matName.includes('glass') || matName.includes('window');
              const isMetal = matName.includes('metal') || matName.includes('silver') || matName.includes('pin');
              if (!isGlass && !isMetal) {
                if (!newMat.color) newMat.color = new THREE.Color('#ffffff');
                baseMats.push(newMat);
              }
            }
            return newMat;
          });
          node.material = Array.isArray(node.material) ? newMaterials : newMaterials[0];
        } catch (err) {
          console.warn(`[PCModel] Error on ${node.name}:`, err);
        }
      }
    });
    
    return { clonedScene: clone, rgbMaterials: rgbMats, baseMaterials: baseMats, fanBlades: blades };
  }, [scene]);

  const targetRgbColor = useMemo(() => new THREE.Color(), []);
  const targetBaseColor = useMemo(() => new THREE.Color(), []);
  const blackColor = useMemo(() => new THREE.Color('#000000'), []);

  useFrame((state, delta) => {
    const activeRgb = rgbSync ? globalRgbColor : partColors?.rgb;
    const activeBase = baseSync ? globalBaseColor : partColors?.base;
    const lerpFactor = Math.min(8 * delta, 1);
    
    // Плавна зміна кольорів
    rgbMaterials.forEach(mat => {
      if (activeRgb) {
        targetRgbColor.set(activeRgb);
        mat.emissive.lerp(targetRgbColor, lerpFactor);
        mat.emissiveIntensity = THREE.MathUtils.lerp(mat.emissiveIntensity, rgbEnabled ? 4 : 0, lerpFactor);
        if (mat.color) mat.color.lerp(blackColor, lerpFactor);
      } else {
        mat.emissive.lerp(mat.userData.originalEmissive, lerpFactor);
        mat.emissiveIntensity = THREE.MathUtils.lerp(mat.emissiveIntensity, rgbEnabled ? mat.userData.originalIntensity : 0, lerpFactor);
        if (mat.color) mat.color.lerp(mat.userData.originalColor, lerpFactor);
      }
    });
    
    baseMaterials.forEach(mat => {
      if (activeBase) {
        targetBaseColor.set(activeBase);
        if (mat.color) mat.color.lerp(targetBaseColor, lerpFactor);
      } else {
        if (mat.color) mat.color.lerp(mat.userData.originalColor, lerpFactor);
      }
    });

    // --- АНІМАЦІЯ ОБЕРТАННЯ ВЕНТИЛЯТОРІВ ---
    const targetSpeed = rgbEnabled ? 12 : 0;
    fanSpeed.current = THREE.MathUtils.lerp(fanSpeed.current, targetSpeed, 1.2 * delta);

    fanBlades.forEach(blade => {
      // Обертання навколо осі Z (стандарт)
      blade.rotation.z += fanSpeed.current * delta;
    });
  });

  // ВАЖЛИВИЙ ФІКС: Гарантуємо fallback для primitive, щоб деталі не розліталися
  return (
    <group 
      position={position || [0,0,0]} 
      rotation={rotation || [0,0,0]} 
      scale={scale || [1,1,1]}
    >
      <Center>
        <primitive object={clonedScene} />
      </Center>
    </group>
  );
}

export default function PCModel() {
  const { selectedParts, catalog, partColors } = useStore();
  
  if (!catalog || !selectedParts) return null;

  const getPartData = (id) => catalog.find(p => p.id === id);

  const renderStandardPart = (type) => {
    const partId = selectedParts[type];
    if (!partId) return null;
    
    const partData = getPartData(partId);
    if (!partData || !partData.modelUrl) return null;

    const colors = partColors?.[type] || {}; 
    const activeCase = getPartData(selectedParts.Case);

    if (partData.transforms && Array.isArray(partData.transforms)) {
      return partData.transforms.map((t, index) => (
        <ModelPart 
          key={`${type}-${partId}-${index}`} 
          url={partData.modelUrl} 
          position={t.position || [0,0,0]} 
          rotation={t.rotation || [0,0,0]} 
          scale={t.scale || [1,1,1]} 
          partColors={colors} 
          partType={type} 
        />
      ));
    }

    if (partData.transform) {
      // ФІКС ПОЗИЦІОНУВАННЯ: Повертаємо жорсткі fallbacks та правильний шлях до слотів
      let finalPos = partData.transform.position || [0,0,0];
      let finalRot = partData.transform.rotation || [0,0,0];
      let finalScale = partData.transform.scale || [1,1,1];

      if (type === 'PSU' && activeCase?.psuSlot) {
        finalPos = activeCase.psuSlot.pos || finalPos; 
        finalRot = activeCase.psuSlot.rot || finalRot; 
        finalScale = activeCase.psuSlot.scale || finalScale; 
      } else if (type === 'SSD' && activeCase?.ssdSlot) {
        finalPos = activeCase.ssdSlot.pos || finalPos; 
        finalRot = activeCase.ssdSlot.rot || finalRot; 
        finalScale = activeCase.ssdSlot.scale || finalScale; 
      }

      return (
        <ModelPart 
          key={`${type}-${partId}`} 
          url={partData.modelUrl} 
          position={finalPos} 
          rotation={finalRot} 
          scale={finalScale} 
          partColors={colors} 
          partType={type} 
        />
      );
    }
    return null;
  };

  const renderCaseFans = () => {
    const activeCase = getPartData(selectedParts.Case);
    if (!activeCase || !activeCase.fanSlots || !selectedParts.CaseFans) return null;

    return Object.entries(activeCase.fanSlots).map(([slotName, slotTransform]) => {
      const fanId = selectedParts.CaseFans[slotName];
      if (!fanId) return null;
      const fanData = getPartData(fanId);
      if (!fanData || !fanData.modelUrl) return null;

      const colors = partColors?.CaseFans || {};

      // ФІКС: Гарантуємо, що scale завжди існує
      const fanScale = fanData.transform?.scale || [1,1,1];

      return (
        <ModelPart 
          key={`fan-${slotName}-${fanId}-${activeCase.id}`} 
          url={fanData.modelUrl} 
          position={slotTransform.pos || [0,0,0]} 
          rotation={slotTransform.rot || [0,0,0]} 
          scale={fanScale} 
          partColors={colors} 
          partType="CaseFans" 
        />
      );
    });
  };

  return (
    <group position={[0, -1, 0]}>
      {['Case', 'Motherboard', 'CPU', 'RAM', 'GPU', 'PSU', 'SSD'].map(renderStandardPart)}
      {renderCaseFans()}
    </group>
  );
}