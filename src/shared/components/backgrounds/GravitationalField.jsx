/**
 * Gravitational Field Background
 * Three.jsによる高度な3D空間座標と重力場の表現
 * 非ユークリッド幾何学的な時空の歪み - 強化版
 */

import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// 重力で歪むグリッドメッシュ - 強化版
function WarpedGrid({ position = [0, 0, 0], rotation = [0, 0, 0], size = 40, divisions = 40, color = '#b8941f', opacity = 0.15 }) {
  const meshRef = useRef();
  const geometryRef = useRef();

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

    // 強化されたパラメータ - 穴を大きく
    const gravityStrength = 35; // より強い重力
    const eventHorizon = 2.5;   // より広い事象の地平線
    const maxDepth = -25;       // より深い凹み

    for (let i = 0; i < originalPositions.length; i += 3) {
      const ox = originalPositions[i];
      const oy = originalPositions[i + 1];
      const oz = originalPositions[i + 2];

      // 中心からの距離
      const dist = Math.sqrt(ox * ox + oz * oz);

      if (dist > 2.0) {
        // 強化された重力による下方向への歪み（深い漏斗状）
        const warp = gravityStrength / (dist + eventHorizon);

        // 指数関数的な凹み（中心に近いほど急激に深くなる）
        const displacement = Math.max(maxDepth, -Math.pow(warp, 2.2) * 0.8);

        // フレームドラッギング（回転効果）- 強化
        const rotationAmount = warp * 0.04 * Math.sin(time * 0.3);
        const cos = Math.cos(rotationAmount);
        const sin = Math.sin(rotationAmount);

        // 螺旋状の引き込み効果
        const spiralPull = Math.sin(time * 0.2 + dist * 0.3) * (warp * 0.1);

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
function GravityRings({ count = 15, maxRadius = 18, color = '#b8941f' }) {
  const ringsRef = useRef([]);

  useFrame(({ clock }) => {
    const time = clock.getElapsedTime();
    const gravityStrength = 35;
    const eventHorizon = 2.5;

    ringsRef.current.forEach((ring, i) => {
      if (ring) {
        const baseRadius = (i + 1) * (maxRadius / count);
        const warp = gravityStrength / (baseRadius + eventHorizon);

        // より深い凹み
        const depth = -Math.pow(warp, 2.0) * 1.2;
        ring.position.y = depth + Math.sin(time * 0.2 + i * 0.4) * 0.05;

        // 傾きも強化
        ring.rotation.x = Math.PI / 2 + warp * 0.15;

        // スケールも歪める（中心に近いほど縮小）
        const scale = 1 - warp * 0.02;
        ring.scale.set(scale, scale, 1);
      }
    });
  });

  return (
    <group>
      {Array.from({ length: count }).map((_, i) => {
        const radius = (i + 1) * (maxRadius / count);
        const opacity = 0.2 * (1 - i / count) + 0.05;
        return (
          <mesh key={i} ref={(el) => (ringsRef.current[i] = el)} rotation={[Math.PI / 2, 0, 0]}>
            <ringGeometry args={[radius - 0.03, radius + 0.03, 80]} />
            <meshBasicMaterial color={color} transparent opacity={opacity} side={THREE.DoubleSide} />
          </mesh>
        );
      })}
    </group>
  );
}

// 放射状のライン（座標軸）- 強化版
function RadialLines({ count = 24, length = 22, color = '#b8941f' }) {
  const linesRef = useRef();
  const segments = 40; // より細かいセグメント

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

    const gravityStrength = 35;
    const eventHorizon = 2.5;

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
            y = -Math.pow(warp, 2.0) * 1.2 + Math.sin(time * 0.2 + dist * 0.4) * 0.08;
          } else {
            y = -25;
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
      <lineBasicMaterial color={color} transparent opacity={0.12} />
    </lineSegments>
  );
}

// 浮遊するパーティクル（星/光子）- 強化版
function FloatingParticles({ count = 250, color = '#d4af37' }) {
  const particlesRef = useRef();

  const { positions, velocities } = useMemo(() => {
    const pos = [];
    const vel = [];
    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2;
      const radius = 4 + Math.random() * 22;
      pos.push(
        Math.cos(theta) * radius,
        (Math.random() - 0.5) * 15,
        Math.sin(theta) * radius
      );
      vel.push(
        (Math.random() - 0.5) * 0.015,
        (Math.random() - 0.5) * 0.01,
        (Math.random() - 0.5) * 0.015
      );
    }
    return {
      positions: new Float32Array(pos),
      velocities: vel,
    };
  }, [count]);

  useFrame(({ clock }) => {
    if (!particlesRef.current) return;
    const posArray = particlesRef.current.geometry.attributes.position.array;
    const time = clock.getElapsedTime();

    for (let i = 0; i < count; i++) {
      const idx = i * 3;
      const x = posArray[idx];
      const y = posArray[idx + 1];
      const z = posArray[idx + 2];

      // 強化された重力による引き込み
      const dist = Math.sqrt(x * x + z * z);
      if (dist > 0.5) {
        const gravity = 1.2 / (dist * dist);
        velocities[idx] -= (x / dist) * gravity;
        velocities[idx + 2] -= (z / dist) * gravity;

        // 下方向への引力も追加
        const verticalPull = 0.3 / (dist + 2);
        velocities[idx + 1] -= verticalPull * 0.1;
      }

      // 位置更新
      posArray[idx] += velocities[idx];
      posArray[idx + 1] += velocities[idx + 1];
      posArray[idx + 2] += velocities[idx + 2];

      // リセット条件を調整（大きな穴に対応）
      const newDist = Math.sqrt(posArray[idx] ** 2 + posArray[idx + 2] ** 2);
      if (newDist < 3.0 || newDist > 28 || posArray[idx + 1] < -28) {
        const theta = Math.random() * Math.PI * 2;
        const radius = 12 + Math.random() * 14;
        posArray[idx] = Math.cos(theta) * radius;
        posArray[idx + 1] = 5 + Math.random() * 8;
        posArray[idx + 2] = Math.sin(theta) * radius;
        velocities[idx] = (Math.random() - 0.5) * 0.015;
        velocities[idx + 1] = -Math.random() * 0.01;
        velocities[idx + 2] = (Math.random() - 0.5) * 0.015;
      }
    }

    particlesRef.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={positions.length / 3}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial color={color} size={0.1} transparent opacity={0.7} sizeAttenuation />
    </points>
  );
}

// 事象の地平線エフェクト（中心の光るリング）
function EventHorizon({ color = '#d4af37' }) {
  const ringRef = useRef();
  const glowRef = useRef();

  useFrame(({ clock }) => {
    const time = clock.getElapsedTime();
    if (ringRef.current) {
      ringRef.current.rotation.z = time * 0.5;
      ringRef.current.material.opacity = 0.4 + Math.sin(time * 2) * 0.15;
    }
    if (glowRef.current) {
      glowRef.current.scale.setScalar(1 + Math.sin(time * 1.5) * 0.1);
      glowRef.current.material.opacity = 0.15 + Math.sin(time * 2) * 0.05;
    }
  });

  return (
    <group position={[0, -25, 0]} rotation={[Math.PI / 2, 0, 0]}>
      {/* 中心の暗い円（ブラックホール） */}
      <mesh>
        <circleGeometry args={[2.5, 64]} />
        <meshBasicMaterial color="#000000" transparent opacity={0.9} side={THREE.DoubleSide} />
      </mesh>
      {/* メインリング */}
      <mesh ref={ringRef}>
        <ringGeometry args={[2.5, 4, 64]} />
        <meshBasicMaterial color={color} transparent opacity={0.6} side={THREE.DoubleSide} />
      </mesh>
      {/* グローエフェクト */}
      <mesh ref={glowRef}>
        <ringGeometry args={[3.5, 7, 64]} />
        <meshBasicMaterial color={color} transparent opacity={0.2} side={THREE.DoubleSide} />
      </mesh>
      {/* 外側のグロー */}
      <mesh>
        <ringGeometry args={[6, 10, 64]} />
        <meshBasicMaterial color={color} transparent opacity={0.08} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
}

// 垂直グリッド（壁面）- 歪み追加
function VerticalGrid({ position, rotation, size = 30, divisions = 30, color = '#b8941f', opacity = 0.05 }) {
  return (
    <group position={position} rotation={rotation}>
      <gridHelper args={[size, divisions, color, color]} material-opacity={opacity} material-transparent />
    </group>
  );
}

// メインシーン
function Scene() {
  const groupRef = useRef();

  useFrame(({ clock }) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = clock.getElapsedTime() * 0.015;
    }
  });

  return (
    <group ref={groupRef}>
      {/* メインの歪んだグリッド（水平面） */}
      <WarpedGrid size={55} divisions={55} opacity={0.15} />

      {/* 重力場の等高線 - 最初のリングを大きく */}
      <GravityRings count={20} maxRadius={26} />

      {/* 放射状ライン */}
      <RadialLines count={32} length={28} />

      {/* 浮遊パーティクル */}
      <FloatingParticles count={200} />

      {/* 事象の地平線 */}
      <EventHorizon />

      {/* 垂直グリッド（XZ平面、YZ平面の表現） */}
      <VerticalGrid position={[0, 0, -25]} rotation={[0, 0, 0]} size={50} divisions={25} opacity={0.03} />
      <VerticalGrid position={[-25, 0, 0]} rotation={[0, Math.PI / 2, 0]} size={50} divisions={25} opacity={0.03} />
    </group>
  );
}

// メインコンポーネント
export function GravitationalField({ style = {} }) {
  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 0,
        pointerEvents: 'none',
        ...style,
      }}
    >
      <Canvas
        camera={{ position: [0, 22, 32], fov: 60, near: 0.1, far: 200 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent' }}
      >
        <Scene />
      </Canvas>
    </div>
  );
}

export default GravitationalField;
