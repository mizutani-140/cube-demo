/**
 * Plan B: 無限の回廊 (Infinite Corridor)
 *
 * コンセプト: Intellectual / Structure
 * - 10x10x10 の立方体グリッドが中央に向かってトンネル効果を形成
 * - カメラはグリッドの中心を覗き込む視点
 * - 遷移時はカメラがグリッド内を指数関数的に加速して突き抜ける
 *
 * カラー: 純黒 × 白/ライトグレー（細いライン）
 * 印象: 知的、構造的、洗練、没入感
 */

import React, { useRef, useEffect, useState, useCallback } from 'react';

// Configuration
const CONFIG = {
  cubeSize: 8, // Size of each small cube
  gridSize: 10, // Number of cubes per axis (10x10x10)
  spacing: 18, // Space between cubes
  fov: 400,
  rotationSpeed: 0.00015,
  loadDuration: 3000,

  // Camera position - looking into the grid
  cameraZ: -180, // Initial camera Z position

  colors: {
    background: '#000000',
    line: 'rgba(180, 180, 180, 0.4)',
    vertex: 'rgba(255, 255, 255, 0.6)',
    text: '#FFFFFF',
  },
};

// Cube edges
const CUBE_EDGES = [
  [0, 1], [1, 2], [2, 3], [3, 0], // front face
  [4, 5], [5, 6], [6, 7], [7, 4], // back face
  [0, 4], [1, 5], [2, 6], [3, 7], // connecting edges
];

// Get cube vertices
function getCubeVertices(size) {
  const h = size / 2;
  return [
    [-h, -h, h], [h, -h, h], [h, h, h], [-h, h, h],
    [-h, -h, -h], [h, -h, -h], [h, h, -h], [-h, h, -h],
  ];
}

// 3D rotations
function rotateX(x, y, z, angle) {
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);
  return { x, y: y * cos - z * sin, z: y * sin + z * cos };
}

function rotateY(x, y, z, angle) {
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);
  return { x: x * cos + z * sin, y, z: -x * sin + z * cos };
}

// Project 3D to 2D with camera position
function project(x, y, z, fov, centerX, centerY, cameraZ) {
  const relZ = z - cameraZ; // Z relative to camera
  if (relZ < 5) return null; // Behind camera or too close
  const perspective = fov / relZ;
  return {
    x: centerX + x * perspective,
    y: centerY + y * perspective,
    scale: perspective,
    z: relZ,
  };
}

function easeOutExpo(t) {
  return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
}

function easeInCubic(t) {
  return t * t * t;
}

// Stronger acceleration curve
function easeInQuint(t) {
  return t * t * t * t * t;
}

// Exponential acceleration for dramatic effect
function easeInExpo(t) {
  return t === 0 ? 0 : Math.pow(2, 10 * t - 10);
}

export default function InfiniteCorridorAnimation({ onReady, onTransition }) {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const rotationRef = useRef({ x: 0.25, y: 0.15 });
  const phaseRef = useRef('loading');
  const [phase, setPhase] = useState('loading');
  const loadProgressRef = useRef(0);
  const [displayProgress, setDisplayProgress] = useState(0);
  const startTimeRef = useRef(null);
  const readyTriggeredRef = useRef(false);
  const onReadyRef = useRef(onReady);
  const transitionRef = useRef({ active: false, progress: 0 });
  const cubesRef = useRef([]);

  useEffect(() => {
    onReadyRef.current = onReady;
  }, [onReady]);

  useEffect(() => {
    phaseRef.current = phase;
  }, [phase]);

  // Initialize cubes - full 3D cube structure with tunnel perspective
  useEffect(() => {
    const cubes = [];
    const n = CONFIG.gridSize;
    const half = (n - 1) * CONFIG.spacing / 2;

    for (let iz = 0; iz < n; iz++) {
      for (let iy = 0; iy < n; iy++) {
        for (let ix = 0; ix < n; ix++) {
          const baseX = ix * CONFIG.spacing - half;
          const baseY = iy * CONFIG.spacing - half;
          const baseZ = iz * CONFIG.spacing - half;

          // Calculate distance from center axis for alpha variation
          const distFromCenter = Math.sqrt(baseX * baseX + baseY * baseY);
          const maxDist = half * Math.sqrt(2);
          const depthFactor = (iz + 1) / n;

          cubes.push({
            baseX,
            baseY,
            baseZ,
            x: baseX,
            y: baseY,
            z: baseZ,
            size: CONFIG.cubeSize,
            alpha: 1,
            distFromCenter,
            depthFactor,
          });
        }
      }
    }
    // Sort by Z for proper rendering (back to front)
    cubes.sort((a, b) => a.baseZ - b.baseZ);
    cubesRef.current = cubes;
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let width = window.innerWidth;
    let height = window.innerHeight;

    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    let lastDisplayProgress = 0;

    const animate = (currentTime) => {
      if (startTimeRef.current === null) {
        startTimeRef.current = currentTime;
      }
      const elapsed = currentTime - startTimeRef.current;
      const centerX = width / 2;
      const centerY = height / 2;
      const currentPhase = phaseRef.current;

      // Clear
      ctx.fillStyle = CONFIG.colors.background;
      ctx.fillRect(0, 0, width, height);

      // Update loading progress
      if (currentPhase === 'loading') {
        const newProgress = Math.min(elapsed / CONFIG.loadDuration, 1);
        loadProgressRef.current = newProgress;

        if (Math.floor(newProgress * 20) !== Math.floor(lastDisplayProgress * 20)) {
          lastDisplayProgress = newProgress;
          setDisplayProgress(newProgress);
        }

        if (newProgress >= 1 && !readyTriggeredRef.current) {
          readyTriggeredRef.current = true;
          setTimeout(() => {
            setPhase('ready');
            if (onReadyRef.current) onReadyRef.current();
          }, 300);
        }
      }

      // Very slow rotation for subtle movement
      rotationRef.current.y += CONFIG.rotationSpeed * 16;
      rotationRef.current.x = 0.25 + Math.sin(elapsed * 0.00008) * 0.03;

      // Update transition - camera accelerates dramatically toward center
      if (transitionRef.current.active) {
        transitionRef.current.progress += 0.01;

        const t = transitionRef.current.progress;
        // Use exponential easing for dramatic acceleration
        const easedT = easeInExpo(t);

        // Move camera forward - starts slow, then RUSHES through
        // Start at -260, accelerate through to +180
        CONFIG.cameraZ = -260 + easedT * 440;

        // Reduce rotation during rush for focus
        if (t > 0.3) {
          rotationRef.current.y *= 0.95;
          rotationRef.current.x *= 0.95;
        }

        if (transitionRef.current.progress >= 1) {
          // Reset camera
          CONFIG.cameraZ = -260;
          transitionRef.current.active = false;
          transitionRef.current.progress = 0;
          onTransition();
        }
      }

      // Draw cubes
      const progress = currentPhase === 'loading' ? easeOutExpo(loadProgressRef.current) : 1;
      drawCubeGrid(ctx, centerX, centerY, elapsed, progress);

      // Draw logo when ready
      if ((currentPhase === 'ready' || currentPhase === 'transition') && !transitionRef.current.active) {
        drawLogo(ctx, centerX, height - 100, elapsed);
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    function drawCubeGrid(ctx, centerX, centerY, time, progress) {
      const rx = rotationRef.current.x;
      const ry = rotationRef.current.y;
      const cameraZ = CONFIG.cameraZ;

      // Collect all cube data for depth sorting
      const cubeData = [];

      const visibleCount = Math.floor(cubesRef.current.length * progress);

      cubesRef.current.slice(0, visibleCount).forEach((cube, index) => {
        // Apply rotation to cube center
        let rotated = rotateY(cube.x, cube.y, cube.z, ry);
        rotated = rotateX(rotated.x, rotated.y, rotated.z, rx);

        const projected = project(rotated.x, rotated.y, rotated.z, CONFIG.fov, centerX, centerY, cameraZ);
        if (!projected || projected.scale < 0.02 || projected.scale > 5) return;

        cubeData.push({
          cube,
          centerX: rotated.x,
          centerY: rotated.y,
          centerZ: rotated.z,
          projected,
          rx, ry,
          cameraZ,
        });
      });

      // Sort by depth (far to near)
      cubeData.sort((a, b) => b.projected.z - a.projected.z);

      // Draw cubes
      cubeData.forEach(data => {
        drawSingleCube(ctx, data, centerX, centerY);
      });
    }

    function drawSingleCube(ctx, data, screenCenterX, screenCenterY) {
      const { cube, centerX, centerY, centerZ, projected, rx, ry, cameraZ } = data;

      const vertices = getCubeVertices(cube.size);

      // Transform vertices
      const transformedVerts = vertices.map(v => {
        // Rotate vertex around cube center
        let rotated = rotateY(v[0], v[1], v[2], ry);
        rotated = rotateX(rotated.x, rotated.y, rotated.z, rx);

        // Add cube position
        return {
          x: rotated.x + centerX,
          y: rotated.y + centerY,
          z: rotated.z + centerZ,
        };
      });

      // Project vertices
      const projectedVerts = transformedVerts.map(v =>
        project(v.x, v.y, v.z, CONFIG.fov, screenCenterX, screenCenterY, cameraZ)
      );

      // Calculate alpha based on depth from camera - deeper = more transparent
      const depthAlpha = Math.max(0.15, Math.min(0.8, projected.z / 400));
      const alpha = depthAlpha * (cube.alpha || 1);

      if (alpha < 0.05) return;

      // Draw edges - thin lines for corridor effect
      ctx.strokeStyle = `rgba(160, 160, 160, ${alpha * 0.5})`;
      ctx.lineWidth = Math.max(0.5, Math.min(1.2, projected.scale * 0.8));

      CUBE_EDGES.forEach(([i, j]) => {
        const v1 = projectedVerts[i];
        const v2 = projectedVerts[j];
        if (!v1 || !v2) return;

        ctx.beginPath();
        ctx.moveTo(v1.x, v1.y);
        ctx.lineTo(v2.x, v2.y);
        ctx.stroke();
      });

      // Draw vertices as very small dots
      ctx.fillStyle = `rgba(200, 200, 200, ${alpha * 0.7})`;
      projectedVerts.forEach(v => {
        if (!v) return;
        const dotSize = Math.max(0.3, Math.min(1.5, v.scale * 1.2));
        ctx.beginPath();
        ctx.arc(v.x, v.y, dotSize, 0, Math.PI * 2);
        ctx.fill();
      });
    }

    function drawLogo(ctx, x, y, time) {
      const opacity = Math.min(1, (time - CONFIG.loadDuration) / 600);
      if (opacity <= 0) return;

      ctx.save();
      ctx.globalAlpha = opacity;

      ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
      ctx.font = '300 32px "Helvetica Neue", Arial, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('CUBE', x, y);

      ctx.font = '300 10px "Helvetica Neue", Arial, sans-serif';
      ctx.fillStyle = 'rgba(255, 255, 255, 0.35)';
      ctx.letterSpacing = '4px';
      ctx.fillText('LIFE × ART × BUILD', x, y + 28);

      ctx.font = '300 9px "Helvetica Neue", Arial, sans-serif';
      ctx.fillStyle = 'rgba(255, 255, 255, 0.25)';
      ctx.fillText('CLICK TO ENTER', x, y + 52);

      ctx.restore();
    }

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [onTransition]);

  const handleClick = useCallback(() => {
    if (phase === 'ready' && onTransition && !transitionRef.current.active) {
      setPhase('transition');
      transitionRef.current.active = true;
      transitionRef.current.progress = 0;
    }
  }, [phase, onTransition]);

  return (
    <div
      onClick={handleClick}
      style={{
        position: 'fixed',
        inset: 0,
        cursor: phase === 'ready' ? 'pointer' : 'default',
        background: CONFIG.colors.background,
      }}
    >
      <canvas
        ref={canvasRef}
        style={{
          display: 'block',
          width: '100%',
          height: '100%',
        }}
      />

      {/* Header */}
      <header style={{
        position: 'absolute',
        top: '40px',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 10,
        textAlign: 'center',
      }}>
        <p style={{
          color: 'rgba(255, 255, 255, 0.3)',
          fontSize: '11px',
          letterSpacing: '6px',
          fontFamily: '"Helvetica Neue", Arial, sans-serif',
        }}>
          INFINITE CORRIDOR
        </p>
      </header>

      {/* Loading progress */}
      {phase === 'loading' && (
        <div style={{
          position: 'absolute',
          bottom: '80px',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 10,
          textAlign: 'center',
        }}>
          <div style={{
            width: '160px',
            height: '1px',
            background: 'rgba(255, 255, 255, 0.08)',
            overflow: 'hidden',
            marginBottom: '12px',
          }}>
            <div style={{
              width: `${displayProgress * 100}%`,
              height: '100%',
              background: 'rgba(150, 150, 150, 0.5)',
              transition: 'width 0.1s ease',
            }} />
          </div>
          <p style={{
            color: 'rgba(255, 255, 255, 0.25)',
            fontSize: '9px',
            letterSpacing: '3px',
            fontFamily: '"Helvetica Neue", Arial, sans-serif',
          }}>
            {displayProgress < 0.5 ? 'BUILDING' : 'STRUCTURING'}
          </p>
        </div>
      )}

      {/* Status */}
      <div style={{
        position: 'absolute',
        bottom: '40px',
        left: '50%',
        transform: 'translateX(-50%)',
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
      }}>
        <div style={{
          width: '30px',
          height: '1px',
          background: 'linear-gradient(to right, transparent, rgba(255,255,255,0.15))',
        }} />
        <p style={{
          color: 'rgba(255, 255, 255, 0.2)',
          fontSize: '9px',
          letterSpacing: '4px',
          fontFamily: '"Helvetica Neue", Arial, sans-serif',
        }}>
          {phase === 'loading' && `${Math.floor(displayProgress * 100)}%`}
          {phase === 'ready' && 'READY'}
          {phase === 'transition' && 'ENTERING'}
        </p>
        <div style={{
          width: '30px',
          height: '1px',
          background: 'linear-gradient(to left, transparent, rgba(255,255,255,0.15))',
        }} />
      </div>

      {/* Corner accents - more subtle */}
      {['top-left', 'top-right', 'bottom-left', 'bottom-right'].map(corner => {
        const isTop = corner.includes('top');
        const isLeft = corner.includes('left');
        return (
          <div
            key={corner}
            style={{
              position: 'absolute',
              [isTop ? 'top' : 'bottom']: '30px',
              [isLeft ? 'left' : 'right']: '30px',
              width: '30px',
              height: '30px',
              [isLeft ? 'borderLeft' : 'borderRight']: '1px solid rgba(255,255,255,0.1)',
              [isTop ? 'borderTop' : 'borderBottom']: '1px solid rgba(255,255,255,0.1)',
            }}
          />
        );
      })}

      <style>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        body {
          overflow: hidden;
        }
      `}</style>
    </div>
  );
}
