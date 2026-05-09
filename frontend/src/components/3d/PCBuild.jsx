// // src/components/3d/PCBuild.jsx
// import { Suspense, useMemo } from 'react';
// import { useGLTF, Html } from '@react-three/drei';
// import { useStore, translations } from '../../store/useStore';
// import * as THREE from 'three';

// // Added partType for raycasting identification
// function ModelPart({ url, position, rotation, scale, rgbColor, baseColor, partType }) {
//   const { scene } = useGLTF(url);
//   const { setFocusedPartType } = useStore();
  
//   const clonedScene = useMemo(() => {
//     const clone = scene.clone();
//     clone.traverse((node) => {
//       if (node.isMesh && node.material) {
//         node.material = node.material.clone();
//         if (baseColor) node.material.color = new THREE.Color(baseColor);
//         if (rgbColor) {
//           node.material.emissive = new THREE.Color(rgbColor);
//           node.material.emissiveIntensity = 0.5; 
//         }
//       }
//     });
//     return clone;
//   }, [scene, rgbColor, baseColor]);

//   return (
//     <group position={position} rotation={rotation}>
//       <primitive 
//         object={clonedScene} 
//         scale={scale} 
//         // 3D Raycasting! Stop event bubbling so clicking CPU doesn't click Case
//         onClick={(e) => {
//           e.stopPropagation();
//           if (partType) setFocusedPartType(partType);
//         }}
//       />
//       {rgbColor && (
//         <pointLight color={rgbColor} intensity={2} distance={3} decay={2} />
//       )}
//     </group>
//   );
// }

// export default function PCBuild() {
//   const { selectedParts, catalog, partColors, language } = useStore();
//   const t = translations[language];

//   const getPartData = (partId) => catalog.find(item => item.id === partId);

//   const renderPart = (type) => {
//     // 1. Dynamic Slot Rendering Logic for CaseFans
//     if (type === 'CaseFans') {
//       const activeCase = getPartData(selectedParts.Case);
//       if (!activeCase || !activeCase.fanSlots) return null;

//       return Object.entries(activeCase.fanSlots).map(([slotName, slotTransform]) => {
//         const fanId = selectedParts.CaseFans[slotName];
//         if (!fanId) return null; // Slot is empty

//         const fanData = getPartData(fanId);
//         const colors = partColors['CaseFans'] || { base: null, rgb: null };

//         return (
//           <ModelPart 
//             key={`${fanId}-${slotName}`}
//             url={`/models/${fanId}.glb`} 
//             position={slotTransform.pos} // Position from Slot
//             rotation={slotTransform.rot} // Rotation from Slot
//             scale={fanData.transform.scale} // Scale from the Fan model itself
//             rgbColor={colors.rgb}
//             baseColor={colors.base}
//             partType="CaseFans"
//           />
//         );
//       });
//     }

//     // 2. Standard Single-Part Rendering Logic
//     const partId = selectedParts[type];
//     if (!partId) return null;

//     const partData = getPartData(partId);
//     if (!partData) return null;

//     const { position, rotation, scale } = partData.transform;
//     const colors = partColors[type] || { base: null, rgb: null };

//     return (
//       <ModelPart 
//         key={`${partId}-${type}`}
//         url={`/models/${partId}.glb`} 
//         position={position} 
//         rotation={rotation} 
//         scale={scale} 
//         rgbColor={colors.rgb}
//         baseColor={colors.base}
//         partType={type}
//       />
//     );
//   };

//   return (
//     <group position={[0, -1, 0]}>
//       <Suspense fallback={<Html center><div className="px-6 py-3 bg-white text-black font-bold rounded shadow">{t.loading}</div></Html>}>
//         {renderPart('Case')}
//         {renderPart('Motherboard')}
//         {renderPart('CPU')}
//         {renderPart('RAM')}
//         {renderPart('SSD')}
//         {renderPart('GPU')}
//         {renderPart('PSU')}
//         {renderPart('CaseFans')}
//       </Suspense>
//     </group>
//   );
// }