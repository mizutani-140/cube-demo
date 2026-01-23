/**
 * Particle System Component
 * Floating particles for ambient visual effects
 */

import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export function ParticleSystem({
  count = 50,
  color = '#d4af37',
  size = 0.02,
  spread = 5,
  speed = 0.5,
  opacity = 0.6,
  enabled = true,
}) {
  const particlesRef = useRef();

  const { positions, velocities, phases } = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const vel = [];
    const ph = [];

    for (let i = 0; i < count; i++) {
      // Random starting position within spread
      pos[i * 3] = (Math.random() - 0.5) * spread;
      pos[i * 3 + 1] = (Math.random() - 0.5) * spread;
      pos[i * 3 + 2] = (Math.random() - 0.5) * spread;

      // Random velocity
      vel.push({
        x: (Math.random() - 0.5) * speed * 0.5,
        y: (Math.random() - 0.5) * speed * 0.5,
        z: (Math.random() - 0.5) * speed * 0.5,
      });

      // Random phase for size pulsing
      ph.push(Math.random() * Math.PI * 2);
    }

    return { positions: pos, velocities: vel, phases: ph };
  }, [count, spread, speed]);

  useFrame((state) => {
    if (!particlesRef.current || !enabled) return;

    const posArray = particlesRef.current.geometry.attributes.position.array;
    const time = state.clock.elapsedTime;

    for (let i = 0; i < count; i++) {
      // Update position with velocity
      posArray[i * 3] += velocities[i].x * 0.01;
      posArray[i * 3 + 1] += velocities[i].y * 0.01;
      posArray[i * 3 + 2] += velocities[i].z * 0.01;

      // Add gentle floating motion
      posArray[i * 3 + 1] += Math.sin(time * 0.5 + phases[i]) * 0.002;

      // Wrap around boundaries
      const halfSpread = spread / 2;
      for (let j = 0; j < 3; j++) {
        if (posArray[i * 3 + j] > halfSpread) {
          posArray[i * 3 + j] = -halfSpread;
        }
        if (posArray[i * 3 + j] < -halfSpread) {
          posArray[i * 3 + j] = halfSpread;
        }
      }
    }

    particlesRef.current.geometry.attributes.position.needsUpdate = true;

    // Pulse opacity
    particlesRef.current.material.opacity =
      opacity * (0.8 + Math.sin(time * 0.5) * 0.2);
  });

  if (!enabled) return null;

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={size}
        color={color}
        transparent
        opacity={opacity}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}

export default ParticleSystem;
