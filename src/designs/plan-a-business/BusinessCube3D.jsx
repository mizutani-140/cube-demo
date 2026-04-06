/**
 * BusinessCube3D - Three.js cube-related components
 * Extracted from BusinessCube.jsx
 *
 * Contains: useCubeGesture, BusinessFace, CornerAccents, Scene
 */

import React, { useRef, useEffect, useMemo, useCallback } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';

import { ParticleSystem } from '../../shared/components/3d';
import { businesses as corporateBusinesses } from '../../shared/data/corporate';

// ============================================
// Constants
// ============================================

export const CUBE_SIZE = 1.8;
export const CUBE_SIZE_MOBILE = 1.3;
const FACE_THICKNESS = 0.02;

// Rotation targets for each face (Euler angles)
export const FACE_ROTATIONS = [
  { x: 0, y: 0 },                    // 0: WORKS (Front)
  { x: 0, y: -Math.PI },             // 1: ABOUT (Back)
  { x: 0, y: -Math.PI / 2 },         // 2: ACCESS (Right)
  { x: 0, y: -(3 * Math.PI / 2) },   // 3: CONTACT (Left)
  { x: Math.PI / 2, y: 0 },          // 4: LAMBCHAN (Top)
  { x: -Math.PI / 2, y: 0 },         // 5: LIFENOSTALGIA (Bottom)
];

// Horizontal ring: Front → Right → Back → Left
export const HORIZONTAL_RING = [0, 2, 1, 3];

const SWIPE_THRESHOLD_PX = 40;
const SWIPE_VELOCITY_THRESHOLD = 0.3; // px/ms
export const ANIMATION_DURATION = 0.4; // seconds
export const IDLE_RESUME_DELAY = 2; // seconds before cube resumes free rotation after interaction

const facePositions = (size) => {
  const offset = size / 2;
  return [
    { position: [0, 0, offset], rotation: [0, 0, 0] },
    { position: [0, 0, -offset], rotation: [0, Math.PI, 0] },
    { position: [offset, 0, 0], rotation: [0, Math.PI / 2, 0] },
    { position: [-offset, 0, 0], rotation: [0, -Math.PI / 2, 0] },
    { position: [0, offset, 0], rotation: [-Math.PI / 2, 0, 0] },
    { position: [0, -offset, 0], rotation: [Math.PI / 2, 0, 0] },
  ];
};

// ============================================
// Custom Hook: useCubeGesture
// ============================================

export function useCubeGesture({ onSwipeLeft, onSwipeRight, onSwipeUp, onSwipeDown, enabled }) {
  const pointerStart = useRef(null);
  const wasSwipeRef = useRef(false);

  const handlePointerDown = useCallback((e) => {
    if (!enabled) return;
    pointerStart.current = {
      x: e.clientX,
      y: e.clientY,
      time: Date.now(),
    };
    wasSwipeRef.current = false;
  }, [enabled]);

  const handlePointerUp = useCallback((e) => {
    if (!enabled || !pointerStart.current) return;
    const dx = e.clientX - pointerStart.current.x;
    const dy = e.clientY - pointerStart.current.y;
    const dt = Date.now() - pointerStart.current.time;
    const dist = Math.sqrt(dx * dx + dy * dy);
    const velocity = dist / Math.max(dt, 1);

    pointerStart.current = null;

    if (dist < SWIPE_THRESHOLD_PX && velocity < SWIPE_VELOCITY_THRESHOLD) {
      return; // Not a swipe - it's a tap
    }

    wasSwipeRef.current = true;

    const absDx = Math.abs(dx);
    const absDy = Math.abs(dy);

    if (absDx > absDy) {
      // Horizontal swipe
      if (dx < 0) onSwipeLeft();
      else onSwipeRight();
    } else {
      // Vertical swipe
      if (dy < 0) onSwipeUp();
      else onSwipeDown();
    }
  }, [enabled, onSwipeLeft, onSwipeRight, onSwipeUp, onSwipeDown]);

  return { handlePointerDown, handlePointerUp, wasSwipeRef };
}

// ============================================
// 3D Components
// ============================================

export function BusinessFace({ business, index, isActive, onClick, cubeSize }) {
  const groupRef = useRef();
  const scaleRef = useRef({ value: 1 });
  const positions = facePositions(cubeSize);
  const { position, rotation } = positions[index];

  const accentColor = useMemo(() => new THREE.Color(business.color), [business.color]);

  // Load texture with CORS support + cover-fit cropping
  const texture = useMemo(() => {
    const loader = new THREE.TextureLoader();
    loader.crossOrigin = 'anonymous';
    const tex = loader.load(business.image, (loadedTex) => {
      const img = loadedTex.image;
      if (img && img.width && img.height) {
        const aspect = img.width / img.height;
        if (aspect > 1) {
          // Landscape: crop sides to fit square
          tex.repeat.set(1 / aspect, 1);
          tex.offset.set((1 - 1 / aspect) / 2, 0);
        } else if (aspect < 1) {
          // Portrait: crop top/bottom to fit square
          tex.repeat.set(1, aspect);
          tex.offset.set(0, (1 - aspect) / 2);
        }
      }
    });
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
  }, [business.image]);

  // Smooth scale animation for active face
  useFrame((state, delta) => {
    const targetScale = isActive ? 1.03 : 1;
    scaleRef.current.value += (targetScale - scaleRef.current.value) * delta * 8;

    if (groupRef.current) {
      const s = scaleRef.current.value;
      groupRef.current.scale.set(s, s, 1);
    }
  });

  const halfSize = cubeSize / 2;
  const zPos = FACE_THICKNESS / 2 + 0.012;

  return (
    <group
      ref={groupRef}
      position={position}
      rotation={rotation}
      onClick={(e) => { e.stopPropagation(); onClick(business); }}
    >
      {/* Main face background */}
      <mesh>
        <boxGeometry args={[cubeSize, cubeSize, FACE_THICKNESS]} />
        <meshBasicMaterial color="#000000" />
      </mesh>

      {/* Image panel */}
      <mesh position={[0, 0, zPos]}>
        <planeGeometry args={[cubeSize, cubeSize]} />
        <meshBasicMaterial
          map={texture}
          transparent
          opacity={isActive ? 1 : 0.85}
        />
      </mesh>

      {/* Glow border on active */}
      {isActive && (
        <mesh position={[0, 0, zPos - 0.001]}>
          <planeGeometry args={[cubeSize * 0.98, cubeSize * 0.98]} />
          <meshBasicMaterial
            color={accentColor}
            transparent
            opacity={0.4}
          />
        </mesh>
      )}

      {/* Icon - top left */}
      <Text
        position={[-halfSize + 0.1, halfSize - 0.1, zPos + 0.005]}
        fontSize={0.065}
        color={isActive ? business.color : '#555555'}
        anchorX="left"
        anchorY="top"
      >
        {business.icon}
      </Text>

      {/* Coming Soon indicator - top right */}
      {business.isComingSoon && (
        <Text
          position={[halfSize - 0.08, halfSize - 0.1, zPos + 0.005]}
          fontSize={0.05}
          color={isActive ? business.color : '#555555'}
          anchorX="right"
          anchorY="top"
        >
          {'SOON'}
        </Text>
      )}

      {/* External link indicator - top right */}
      {business.isExternal && (
        <Text
          position={[halfSize - 0.12, halfSize - 0.1, zPos + 0.005]}
          fontSize={0.08}
          color={isActive ? business.color : '#555555'}
          anchorX="right"
          anchorY="top"
        >
          {'↗'}
        </Text>
      )}

      {/* Main title */}
      <Text
        position={[0, 0, zPos + 0.005]}
        fontSize={business.shortTitle.length > 10 ? cubeSize * 0.09 : cubeSize * 0.14}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
        letterSpacing={0.03}
      >
        {business.shortTitle}
      </Text>

      {/* Accent line */}
      <mesh position={[0, -halfSize * 0.25, zPos + 0.005]}>
        <planeGeometry args={[isActive ? 0.45 : 0.2, 0.002]} />
        <meshBasicMaterial color={isActive ? business.color : '#333333'} />
      </mesh>

      {/* Corner accents */}
      <CornerAccents size={cubeSize} isActive={isActive} accent={business.color} />
    </group>
  );
}

export function CornerAccents({ size, isActive, accent }) {
  const cornerSize = 0.1;
  const thickness = 0.012;
  const offset = size / 2 - 0.06;
  const zPos = FACE_THICKNESS / 2 + 0.018;

  const corners = [
    { pos: [-offset, offset, zPos], hDir: 1, vDir: -1 },
    { pos: [offset, offset, zPos], hDir: -1, vDir: -1 },
    { pos: [offset, -offset, zPos], hDir: -1, vDir: 1 },
    { pos: [-offset, -offset, zPos], hDir: 1, vDir: 1 },
  ];

  const activeOpacity = isActive ? 0.9 : 0.25;
  const activeColor = isActive ? accent : '#555';

  return (
    <group>
      {corners.map((corner, i) => (
        <group key={i} position={corner.pos}>
          <mesh position={[cornerSize / 2 * corner.hDir, 0, 0]}>
            <planeGeometry args={[cornerSize, thickness]} />
            <meshBasicMaterial color={activeColor} transparent opacity={activeOpacity} />
          </mesh>
          <mesh position={[0, cornerSize / 2 * corner.vDir, 0]}>
            <planeGeometry args={[thickness, cornerSize]} />
            <meshBasicMaterial color={activeColor} transparent opacity={activeOpacity} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

function BusinessCube3DInner({ activeFaceIndex, onNavigate, cubeSize, prefersReducedMotion, hasInteracted, cubeWarpRef }) {
  const cubeRef = useRef();
  const animRef = useRef({
    startQuat: new THREE.Quaternion(),
    endQuat: new THREE.Quaternion(),
    progress: 1, // Start at 1 = animation complete
    duration: ANIMATION_DURATION,
  });
  // 初期角度: アイソメトリック（正六面体が見える角度）
  // Y=π/4 (45°) で2つの垂直面が見え、X tilt で上面も見える
  const idleRotation = useRef({ y: Math.PI / 4 });
  const prevIndexRef = useRef(activeFaceIndex);
  const prevHasInteracted = useRef(hasInteracted);
  const wasInteractedRef = useRef(false); // Track interacted→idle transition in useFrame
  const idleBlendRef = useRef({ blending: false, progress: 0, startX: 0 }); // Smooth blend back to idle
  const tempEuler = useMemo(() => new THREE.Euler(), []);
  const tempQuat = useMemo(() => new THREE.Quaternion(), []);

  // When activeFaceIndex changes, start SLERP animation
  useEffect(() => {
    if (!hasInteracted) return; // Skip while idle-rotating
    if (prevIndexRef.current === activeFaceIndex && prevHasInteracted.current === hasInteracted) return;
    prevIndexRef.current = activeFaceIndex;
    prevHasInteracted.current = hasInteracted;

    const target = FACE_ROTATIONS[activeFaceIndex];
    tempEuler.set(target.x, target.y, 0, 'YXZ');
    const endQuat = new THREE.Quaternion().setFromEuler(tempEuler);

    if (prefersReducedMotion) {
      if (cubeRef.current) {
        cubeRef.current.quaternion.copy(endQuat);
      }
      return;
    }

    // Start SLERP from current rotation (including idle rotation)
    if (cubeRef.current) {
      animRef.current.startQuat.copy(cubeRef.current.quaternion);
    }
    animRef.current.endQuat.copy(endQuat);
    animRef.current.progress = 0;
  }, [activeFaceIndex, hasInteracted, prefersReducedMotion, tempEuler]);

  useFrame((state, delta) => {
    if (!cubeRef.current) return;

    // Clamp delta to prevent first-frame spike (Canvas init / page return)
    const dt = Math.min(delta, 0.05);

    // ---- Warp mode: PlanAApp が GSAP で cubeWarpRef を駆動中 ----
    // Three.js の rotation を直接制御し、本物の3D回転を実現する。
    // CSS rotateX/Y/Z は Canvas の2D投影を歪めるだけでペラペラになるが、
    // ここでは Three.js の Euler rotation なので正しい3D描画になる。
    if (cubeWarpRef?.current?.active) {
      cubeRef.current.rotation.set(
        cubeWarpRef.current.rotX,
        cubeWarpRef.current.rotY,
        cubeWarpRef.current.rotZ
      );
      return;
    }

    // Detect transition from interacted → idle (smooth blend back)
    if (wasInteractedRef.current && !hasInteracted) {
      // Read rotation directly (auto-synced from quaternion by Three.js)
      idleRotation.current.y = cubeRef.current.rotation.y;
      idleBlendRef.current = { blending: true, progress: 0, startX: cubeRef.current.rotation.x };
    }
    wasInteractedRef.current = hasInteracted;

    // Idle: 正六面体が常に見える3D回転
    // baseXTilt で上面を見せつつ、Y軸回転で各面を順番に表示
    if (!hasInteracted) {
      idleRotation.current.y += dt * 0.12;
      const baseXTilt = 0.55; // ~31.5° — 上面が見える角度
      const targetXWobble = baseXTilt + Math.sin(state.clock.elapsedTime * 0.3) * 0.08;

      // Smooth blend from snapped orientation to idle wobble
      if (idleBlendRef.current.blending) {
        idleBlendRef.current.progress = Math.min(1, idleBlendRef.current.progress + dt * 2); // ~0.5s blend
        const t = idleBlendRef.current.progress;
        const eased = t * t * (3 - 2 * t); // smoothstep
        const blendedX = idleBlendRef.current.startX * (1 - eased) + targetXWobble * eased;
        cubeRef.current.rotation.set(blendedX, idleRotation.current.y, 0);
        if (t >= 1) idleBlendRef.current.blending = false;
      } else {
        cubeRef.current.rotation.set(targetXWobble, idleRotation.current.y, 0);
      }
    } else {
      // Snap animation (SLERP)
      const anim = animRef.current;
      if (anim.progress < 1) {
        anim.progress = Math.min(1, anim.progress + dt / anim.duration);
        const t = anim.progress;
        const eased = t < 0.5
          ? 4 * t * t * t
          : 1 - Math.pow(-2 * t + 2, 3) / 2;

        tempQuat.slerpQuaternions(anim.startQuat, anim.endQuat, eased);
        cubeRef.current.quaternion.copy(tempQuat);
      }
    }

    // 現在の回転を共有refに報告 — ワープ開始時の初期値として使われる
    if (cubeWarpRef?.current) {
      cubeWarpRef.current.rotX = cubeRef.current.rotation.x;
      cubeWarpRef.current.rotY = cubeRef.current.rotation.y;
      cubeWarpRef.current.rotZ = cubeRef.current.rotation.z;
    }
  });

  return (
    <group ref={cubeRef}>
      {corporateBusinesses.map((business, index) => (
        <BusinessFace
          key={business.id}
          business={business}
          index={index}
          isActive={hasInteracted && index === activeFaceIndex}
          onClick={onNavigate}
          cubeSize={cubeSize}
        />
      ))}

      {/* Inner core */}
      <mesh>
        <boxGeometry args={[cubeSize - 0.06, cubeSize - 0.06, cubeSize - 0.06]} />
        <meshBasicMaterial color="#050508" />
      </mesh>
    </group>
  );
}

export function Scene({ activeFaceIndex, onNavigate, cubeSize, showParticles, prefersReducedMotion, hasInteracted, cubeWarpRef }) {
  return (
    <>
      <ambientLight intensity={0.3} />
      <directionalLight position={[5, 5, 5]} intensity={0.4} color="#ffffff" />
      <pointLight position={[0, 0, 6]} intensity={0.2} color="#d4af37" distance={12} decay={2} />

      {showParticles && (
        <ParticleSystem
          count={30}
          color="#d4af37"
          size={0.012}
          spread={5}
          speed={0.25}
          opacity={0.4}
        />
      )}

      <BusinessCube3DInner
        activeFaceIndex={activeFaceIndex}
        onNavigate={onNavigate}
        cubeSize={cubeSize}
        prefersReducedMotion={prefersReducedMotion}
        hasInteracted={hasInteracted}
        cubeWarpRef={cubeWarpRef}
      />
    </>
  );
}
