/**
 * Gravitational Field Background
 * Three.jsによる高度な3D空間座標と重力場の表現
 * 非ユークリッド幾何学的な時空の歪み - 強化版
 *
 * transitionIntensityRef: ページ遷移時の重力場強度 (0〜1)
 */

import React, { useRef, useMemo, createContext, useContext } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// Simple theme context for 3D scene (receives theme from parent)
const SceneThemeContext = createContext({ isDark: true });

// Transition intensity context (ref-based for R3F performance)
const TransitionContext = createContext({ current: { value: 0 } });

// 重力で歪むグリッドメッシュ - 強化版
function WarpedGrid({ position = [0, 0, 0], rotation = [0, 0, 0], size = 40, divisions = 40, color = '#f0c830', opacity = 0.15 }) {
  const meshRef = useRef();
  const geometryRef = useRef();
  const intensityRef = useContext(TransitionContext);

  // グリッドの頂点を生成
  const { positions, indices, originalPositions } = useMemo(() => {
    const pos = [];
    const orig = [];
    const idx = [];
    const half = size / 2;
    const step = size / divisions;

    // 頂点を生成
    for (let i = 0; i <= divisions; i++) {
      for (let j = 0; j <= divisions; j++) {
        const x = -half + i * step;
        const z = -half + j * step;
        pos.push(x, 0, z);
        orig.push(x, 0, z);
      }
    }

    // ライン用のインデックス
    for (let i = 0; i <= divisions; i++) {
      for (let j = 0; j < divisions; j++) {
        // 横方向のライン
        idx.push(i * (divisions + 1) + j, i * (divisions + 1) + j + 1);
      }
    }
    for (let j = 0; j <= divisions; j++) {
      for (let i = 0; i < divisions; i++) {
        // 縦方向のライン
        idx.push(i * (divisions + 1) + j, (i + 1) * (divisions + 1) + j);
      }
    }

    return {
      positions: new Float32Array(pos),
      indices: new Uint16Array(idx),
      originalPositions: orig,
    };
  }, [size, divisions]);

  // 重力による歪みをアニメーション - 強化版
  useFrame(({ clock }) => {
    if (!geometryRef.current) return;

    const time = clock.getElapsedTime();
    const posArray = geometryRef.current.attributes.position.array;
    const t = intensityRef.current.value;

    // 遷移強度に応じたパラメータ補間（穴を浅めに）
    const gravityStrength = 20 + t * 15;  // 20→35
    const eventHorizon = 3.5 - t * 1.0;    // 3.5→2.5
    const maxDepth = -12 - t * 8;           // -12→-20

    for (let i = 0; i < originalPositions.length; i += 3) {
      const ox = originalPositions[i];
      const oy = originalPositions[i + 1];
      const oz = originalPositions[i + 2];

      // 中心からの距離
      const dist = Math.sqrt(ox * ox + oz * oz);

      if (dist > 2.0) {
        // 強化された重力による下方向への歪み（深い漏斗状）
        const warp = gravityStrength / (dist + eventHorizon);

        // 指数関数的な凹み（中心に近いほど急激に深くなる）- 控えめに
        const displacement = Math.max(maxDepth, -Math.pow(warp, 1.8) * 0.4);

        // フレームドラッギング（回転効果）- 遷移時に強化
        const rotationAmount = warp * (0.04 + t * 0.06) * Math.sin(time * (0.3 + t * 0.5));
        const cos = Math.cos(rotationAmount);
        const sin = Math.sin(rotationAmount);

        // 螺旋状の引き込み効果 - 遷移時に強化
        const spiralPull = Math.sin(time * (0.2 + t * 0.4) + dist * 0.3) * (warp * (0.1 + t * 0.15));

        posArray[i] = (ox * cos - oz * sin) * (1 - spiralPull * 0.02);
        posArray[i + 1] = displacement + Math.sin(time * 0.2 + dist * 0.4) * 0.08;
        posArray[i + 2] = (ox * sin + oz * cos) * (1 - spiralPull * 0.02);
      } else {
        // 事象の地平線（最深部）- より大きな中心領域
        posArray[i] = ox * 0.5;
        posArray[i + 1] = maxDepth;
        posArray[i + 2] = oz * 0.5;
      }
    }

    geometryRef.current.attributes.position.needsUpdate = true;
  });

  return (
    <lineSegments position={position} rotation={rotation} ref={meshRef}>
      <bufferGeometry ref={geometryRef}>
        <bufferAttribute
          attach="attributes-position"
          count={positions.length / 3}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="index"
          count={indices.length}
          array={indices}
          itemSize={1}
        />
      </bufferGeometry>
      <lineBasicMaterial color={color} transparent opacity={opacity} />
    </lineSegments>
  );
}

// 同心円状のリング（重力場の等高線）- 強化版
function GravityRings({ count = 15, maxRadius = 18, color = '#f0c830' }) {
  const ringsRef = useRef([]);
  const intensityRef = useContext(TransitionContext);

  useFrame(({ clock }) => {
    const time = clock.getElapsedTime();
    const t = intensityRef.current.value;
    const gravityStrength = 20 + t * 15;
    const eventHorizon = 3.5 - t * 1.0;

    ringsRef.current.forEach((ring, i) => {
      if (ring) {
        const baseRadius = (i + 1) * (maxRadius / count);
        const warp = gravityStrength / (baseRadius + eventHorizon);

        // 浅めの凹み
        const depth = -Math.pow(warp, 2.0) * 0.6;
        ring.position.y = depth + Math.sin(time * (0.2 + t * 0.3) + i * 0.4) * 0.05;

        // 傾き（控えめ）
        ring.rotation.x = Math.PI / 2 + warp * (0.08 + t * 0.06);

        // スケールも歪める（中心に近いほど縮小）
        const scale = 1 - warp * (0.02 + t * 0.01);
        ring.scale.set(scale, scale, 1);
      }
    });
  });

  return (
    <group>
      {Array.from({ length: count }).map((_, i) => {
        const radius = (i + 1) * (maxRadius / count);
        const opacity = 0.55 * (1 - i / count) + 0.15;
        return (
          <mesh key={i} ref={(el) => (ringsRef.current[i] = el)} rotation={[Math.PI / 2, 0, 0]}>
            <ringGeometry args={[radius - 0.06, radius + 0.06, 80]} />
            <meshBasicMaterial color={color} transparent opacity={opacity} side={THREE.DoubleSide} />
          </mesh>
        );
      })}
    </group>
  );
}

// 放射状のライン（座標軸）- 強化版
function RadialLines({ count = 24, length = 22, color = '#f0c830' }) {
  const linesRef = useRef();
  const intensityRef = useContext(TransitionContext);
  const segments = 55; // より細かいセグメント

  const geometry = useMemo(() => {
    const positions = [];
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2;
      // セグメント化された線
      for (let s = 0; s < segments; s++) {
        const t1 = s / segments;
        const t2 = (s + 1) / segments;
        positions.push(
          Math.cos(angle) * length * t1, 0, Math.sin(angle) * length * t1,
          Math.cos(angle) * length * t2, 0, Math.sin(angle) * length * t2
        );
      }
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    return geo;
  }, [count, length, segments]);

  useFrame(({ clock }) => {
    if (!linesRef.current) return;
    const time = clock.getElapsedTime();
    const posArray = linesRef.current.geometry.attributes.position.array;
    const ti = intensityRef.current.value;

    const gravityStrength = 20 + ti * 15;
    const eventHorizon = 3.5 - ti * 1.0;
    const maxDepth = -12 - ti * 8;

    let idx = 0;
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2;

      for (let s = 0; s < segments; s++) {
        for (let p = 0; p < 2; p++) {
          const t = (s + p) / segments;
          const x = Math.cos(angle) * length * t;
          const z = Math.sin(angle) * length * t;
          const dist = Math.sqrt(x * x + z * z);

          let y;
          if (dist > 2.0) {
            const warp = gravityStrength / (dist + eventHorizon);
            y = -Math.pow(warp, 2.0) * 0.6 + Math.sin(time * 0.2 + dist * 0.4) * 0.08;
          } else {
            y = maxDepth;
          }

          posArray[idx] = x;
          posArray[idx + 1] = y;
          posArray[idx + 2] = z;
          idx += 3;
        }
      }
    }

    linesRef.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <lineSegments ref={linesRef} geometry={geometry}>
      <lineBasicMaterial color={color} transparent opacity={0.4} />
    </lineSegments>
  );
}

// 素粒子パーティクル - 極微細な量子レベル粒子
function FloatingParticles({ count = 250, color = '#ffd740' }) {
  const particlesRef = useRef();
  const dustRef = useRef();
  const intensityRef = useContext(TransitionContext);

  // メイン粒子（重力に引かれる素粒子）
  const { positions, velocities } = useMemo(() => {
    const pos = [];
    const vel = [];
    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2;
      const radius = 3 + Math.random() * 65;
      const height = (Math.random() - 0.5) * 35;
      pos.push(
        Math.cos(theta) * radius,
        height,
        Math.sin(theta) * radius
      );
      vel.push(
        (Math.random() - 0.5) * 0.008,
        (Math.random() - 0.5) * 0.005,
        (Math.random() - 0.5) * 0.008
      );
    }
    return {
      positions: new Float32Array(pos),
      velocities: vel,
    };
  }, [count]);

  // 量子ダスト（静的な微粒子の場）
  const dustCount = count * 3;
  const dustPositions = useMemo(() => {
    const pos = [];
    for (let i = 0; i < dustCount; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = (Math.random() - 0.5) * Math.PI;
      const radius = 2 + Math.random() * 68;
      pos.push(
        Math.cos(theta) * Math.cos(phi) * radius,
        Math.sin(phi) * radius * 0.4 + (Math.random() - 0.5) * 15,
        Math.sin(theta) * Math.cos(phi) * radius
      );
    }
    return new Float32Array(pos);
  }, [dustCount]);

  useFrame(({ clock }) => {
    if (!particlesRef.current) return;
    const posArray = particlesRef.current.geometry.attributes.position.array;
    const time = clock.getElapsedTime();
    const ti = intensityRef.current.value;

    // 遷移時の重力倍率: 0.8→2.8
    const gravityMult = 0.8 + ti * 2.0;

    for (let i = 0; i < count; i++) {
      const idx = i * 3;
      const x = posArray[idx];
      const y = posArray[idx + 1];
      const z = posArray[idx + 2];

      const dist = Math.sqrt(x * x + z * z);
      if (dist > 0.5) {
        const gravity = gravityMult / (dist * dist);
        velocities[idx] -= (x / dist) * gravity;
        velocities[idx + 2] -= (z / dist) * gravity;

        const verticalPull = (0.2 + ti * 0.4) / (dist + 2);
        velocities[idx + 1] -= verticalPull * 0.08;
      }

      // 量子揺らぎ（不確定性原理的な微振動）
      const jitter = 0.003 + ti * 0.005;
      velocities[idx] += (Math.random() - 0.5) * jitter;
      velocities[idx + 1] += (Math.random() - 0.5) * jitter * 0.5;
      velocities[idx + 2] += (Math.random() - 0.5) * jitter;

      posArray[idx] += velocities[idx];
      posArray[idx + 1] += velocities[idx + 1];
      posArray[idx + 2] += velocities[idx + 2];

      const newDist = Math.sqrt(posArray[idx] ** 2 + posArray[idx + 2] ** 2);
      if (newDist < 3.0 || newDist > 72 || posArray[idx + 1] < -40) {
        const theta = Math.random() * Math.PI * 2;
        const radius = 18 + Math.random() * 48;
        posArray[idx] = Math.cos(theta) * radius;
        posArray[idx + 1] = 8 + Math.random() * 20;
        posArray[idx + 2] = Math.sin(theta) * radius;
        velocities[idx] = (Math.random() - 0.5) * 0.008;
        velocities[idx + 1] = -Math.random() * 0.005;
        velocities[idx + 2] = (Math.random() - 0.5) * 0.008;
      }
    }

    particlesRef.current.geometry.attributes.position.needsUpdate = true;

    // 量子ダストの微細な揺らぎ
    if (dustRef.current) {
      const dArray = dustRef.current.geometry.attributes.position.array;
      for (let i = 0; i < dustCount; i++) {
        const idx = i * 3;
        dArray[idx] += Math.sin(time * 0.5 + i * 0.1) * 0.002;
        dArray[idx + 1] += Math.cos(time * 0.3 + i * 0.07) * 0.001;
        dArray[idx + 2] += Math.sin(time * 0.4 + i * 0.13) * 0.002;
      }
      dustRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <group>
      {/* メイン素粒子 - 重力に引かれる */}
      <points ref={particlesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={positions.length / 3}
            array={positions}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial color={color} size={0.045} transparent opacity={0.85} sizeAttenuation />
      </points>
      {/* 量子ダスト - 空間を満たす微粒子場 */}
      <points ref={dustRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={dustPositions.length / 3}
            array={dustPositions}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial color={color} size={0.025} transparent opacity={0.5} sizeAttenuation />
      </points>
    </group>
  );
}

// 事象の地平線エフェクト（中心の光るリング）
function EventHorizon({ color = '#ffd740' }) {
  const ringRef = useRef();
  const glowRef = useRef();
  const intensityRef = useContext(TransitionContext);

  useFrame(({ clock }) => {
    const time = clock.getElapsedTime();
    const t = intensityRef.current.value;

    if (ringRef.current) {
      // 遷移時にリング回転加速: 0.5→5.0
      ringRef.current.rotation.z = time * (0.5 + t * 4.5);
      ringRef.current.material.opacity = (0.25 + t * 0.15) + Math.sin(time * 2) * 0.08;
    }
    if (glowRef.current) {
      // 遷移時にグロー拡大・不透明度増加
      const glowScale = (1 + t * 0.5) + Math.sin(time * 1.5) * 0.05;
      glowRef.current.scale.setScalar(glowScale);
      glowRef.current.material.opacity = (0.1 + t * 0.15) + Math.sin(time * 2) * 0.04;
    }
  });

  return (
    <group position={[0, -12, 0]} rotation={[Math.PI / 2, 0, 0]}>
      {/* メインリング */}
      <mesh ref={ringRef}>
        <ringGeometry args={[1.5, 2.8, 64]} />
        <meshBasicMaterial color={color} transparent opacity={0.2} side={THREE.DoubleSide} />
      </mesh>
      {/* グローエフェクト */}
      <mesh ref={glowRef}>
        <ringGeometry args={[2.5, 4.5, 64]} />
        <meshBasicMaterial color={color} transparent opacity={0.08} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
}

// 垂直グリッド（壁面）- 歪み追加
function VerticalGrid({ position, rotation, size = 30, divisions = 30, color = '#f0c830', opacity = 0.05 }) {
  return (
    <group position={position} rotation={rotation}>
      <gridHelper args={[size, divisions, color, color]} material-opacity={opacity} material-transparent />
    </group>
  );
}

// コンテナの視覚強調（opacity のみ — CSS filter は GPU 負荷が高いため不使用）
function ContainerFilterUpdater({ containerRef }) {
  const intensityRef = useContext(TransitionContext);

  useFrame(() => {
    if (!containerRef.current) return;
    const t = intensityRef.current.value;
    // 遷移中に重力場を少し明るく見せる（opacity 操作のみ）
    containerRef.current.style.opacity = t > 0.001 ? String(1 + t * 0.15) : '';
  });

  return null;
}

// メインシーン
function Scene() {
  const groupRef = useRef();
  const { isDark } = useContext(SceneThemeContext);
  const intensityRef = useContext(TransitionContext);

  // Adjust opacity based on theme
  const baseOpacity = isDark ? 1 : 0.7;

  useFrame(({ clock }) => {
    if (groupRef.current) {
      const t = intensityRef.current.value;
      // 遷移時に回転速度10倍加速: 0.015→0.15
      const rotSpeed = 0.015 + Math.pow(t, 1.5) * 0.135;
      groupRef.current.rotation.y = clock.getElapsedTime() * rotSpeed;
    }
  });

  // Theme-aware colors - vivid and clearly visible
  const gridColor = isDark ? '#f0c830' : '#c49a20';
  const particleColor = isDark ? '#ffd740' : '#d4a820';

  return (
    <group ref={groupRef}>
      {/* メインの歪んだグリッド（水平面） - 画面全体をカバー */}
      <WarpedGrid size={140} divisions={70} opacity={0.5 * baseOpacity} color={gridColor} />

      {/* 第2水平グリッド（上層） - ユークリッド平面構造 */}
      <WarpedGrid position={[0, 20, 0]} size={140} divisions={50} opacity={0.12 * baseOpacity} color={gridColor} />

      {/* 重力場の等高線 */}
      <GravityRings count={30} maxRadius={65} color={gridColor} />

      {/* 放射状ライン */}
      <RadialLines count={42} length={68} color={gridColor} />

      {/* 素粒子パーティクル */}
      <FloatingParticles count={1000} color={particleColor} />

      {/* 事象の地平線 */}
      <EventHorizon color={particleColor} />

      {/* 垂直グリッド（4面 + 対角面でユークリッド空間を構成） */}
      <VerticalGrid position={[0, 0, -65]} rotation={[0, 0, 0]} size={130} divisions={35} opacity={0.14 * baseOpacity} color={gridColor} />
      <VerticalGrid position={[0, 0, 65]} rotation={[0, 0, 0]} size={130} divisions={35} opacity={0.1 * baseOpacity} color={gridColor} />
      <VerticalGrid position={[-65, 0, 0]} rotation={[0, Math.PI / 2, 0]} size={130} divisions={35} opacity={0.14 * baseOpacity} color={gridColor} />
      <VerticalGrid position={[65, 0, 0]} rotation={[0, Math.PI / 2, 0]} size={130} divisions={35} opacity={0.14 * baseOpacity} color={gridColor} />
      {/* 対角面（45度回転）- 空間の奥行き感を強化 */}
      <VerticalGrid position={[0, 0, 0]} rotation={[0, Math.PI / 4, 0]} size={130} divisions={30} opacity={0.07 * baseOpacity} color={gridColor} />
      <VerticalGrid position={[0, 0, 0]} rotation={[0, -Math.PI / 4, 0]} size={130} divisions={30} opacity={0.07 * baseOpacity} color={gridColor} />
    </group>
  );
}

// メインコンポーネント
export function GravitationalField({ style = {}, isDark = true, transitionIntensityRef }) {
  const containerRef = useRef(null);
  const defaultRef = useRef({ value: 0 });
  const activeRef = transitionIntensityRef || defaultRef;

  return (
    <div
      ref={containerRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 0,
        pointerEvents: 'none',
        transition: 'opacity 0.4s ease',
        ...style,
      }}
    >
      <Canvas
        camera={{ position: [0, 45, 25], fov: 85, near: 0.1, far: 500 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent' }}
      >
        <TransitionContext.Provider value={activeRef}>
          <SceneThemeContext.Provider value={{ isDark }}>
            <Scene />
            <ContainerFilterUpdater containerRef={containerRef} />
          </SceneThemeContext.Provider>
        </TransitionContext.Provider>
      </Canvas>
    </div>
  );
}

export default GravitationalField;
