/**
 * Plan A: Business-focused Cube Navigation
 * 株式会社CUBE - LIFE × ART × BUILD
 *
 * Each face represents a business unit:
 * - Interior Design / Build (内装設計)
 * - LambCHAN (飲食事業)
 * - Life Nostalgia (ギャラリー)
 * - Kitchen Car (移動型店舗)
 * - Agriculture (有機農業)
 * - About CUBE (会社概要)
 */

import React, { useState, useRef, useEffect, useCallback, useMemo, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Text, OrbitControls, Float } from '@react-three/drei';
import { gsap } from 'gsap';
import * as THREE from 'three';

// Import shared components
import { ParticleSystem } from '../../shared/components/3d';
import { useBreakpoints, useHoverState } from '../../shared/hooks';
import { colors } from '../../shared/tokens';
import { brand, company, businesses as corporateBusinesses, vision } from '../../shared/data/corporate';

// Cube configuration
const CUBE_SIZE = 2.2;
const CUBE_SIZE_MOBILE = 1.6;
const FACE_THICKNESS = 0.02;

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
// 3D Components
// ============================================

function BusinessFace({ business, index, isHovered, onClick, onHover, onLeave, cubeSize }) {
  const groupRef = useRef();
  const glowRef = useRef();
  const scaleRef = useRef({ value: 1 });
  const positions = facePositions(cubeSize);
  const { position, rotation } = positions[index];

  const bgColor = useMemo(() => new THREE.Color('#1a1a2e'), []);
  const accentColor = useMemo(() => new THREE.Color(business.color), [business.color]);
  const isMainBusiness = business.id === 'interior';

  // Load texture with CORS support
  const texture = useMemo(() => {
    const loader = new THREE.TextureLoader();
    loader.crossOrigin = 'anonymous';
    const tex = loader.load(business.image);
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
  }, [business.image]);

  // Smooth hover animations
  useFrame((state, delta) => {
    // Scale animation with easing
    const targetScale = isHovered ? 1.03 : 1;
    scaleRef.current.value += (targetScale - scaleRef.current.value) * delta * 8;

    if (groupRef.current) {
      const s = scaleRef.current.value;
      groupRef.current.scale.set(s, s, 1);
    }

    // Glow pulse
    if (glowRef.current) {
      const baseOpacity = isHovered ? 0.35 : 0;
      const pulse = isHovered ? Math.sin(state.clock.elapsedTime * 3) * 0.1 : 0;
      glowRef.current.material.opacity = baseOpacity + pulse;
    }
  });

  // Simple layout - English only for 3D text
  const halfSize = cubeSize / 2;
  const zPos = FACE_THICKNESS / 2 + 0.012;

  return (
    <group
      ref={groupRef}
      position={position}
      rotation={rotation}
      onClick={(e) => { e.stopPropagation(); onClick(business); }}
      onPointerEnter={(e) => { e.stopPropagation(); onHover(business.id); }}
      onPointerLeave={(e) => { e.stopPropagation(); onLeave(); }}
    >
      {/* Main face background - dark matte */}
      <mesh>
        <boxGeometry args={[cubeSize, cubeSize, FACE_THICKNESS]} />
        <meshBasicMaterial color="#0a0a12" />
      </mesh>

      {/* Image panel - upper 55% */}
      <mesh position={[0, halfSize * 0.2, zPos]}>
        <planeGeometry args={[cubeSize * 0.88, cubeSize * 0.52]} />
        <meshBasicMaterial
          map={texture}
          transparent
          opacity={isHovered ? 0.95 : 0.75}
        />
      </mesh>

      {/* Dark text background - lower area */}
      <mesh position={[0, -halfSize * 0.5, zPos + 0.001]}>
        <planeGeometry args={[cubeSize * 0.92, cubeSize * 0.35]} />
        <meshBasicMaterial color="#000000" transparent opacity={0.85} />
      </mesh>

      {/* Glow border on hover */}
      {isHovered && (
        <mesh position={[0, 0, zPos - 0.001]}>
          <planeGeometry args={[cubeSize * 0.98, cubeSize * 0.98]} />
          <meshBasicMaterial
            color={accentColor}
            transparent
            opacity={0.15}
          />
        </mesh>
      )}

      {/* Icon - top left */}
      <Text
        position={[-halfSize + 0.1, halfSize - 0.1, zPos + 0.005]}
        fontSize={0.065}
        color={isHovered ? business.color : '#555555'}
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
          color={isHovered ? business.color : '#555555'}
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
          color={isHovered ? business.color : '#555555'}
          anchorX="right"
          anchorY="top"
        >
          {'↗'}
        </Text>
      )}

      {/* Main title - English only */}
      <Text
        position={[0, -halfSize * 0.42, zPos + 0.005]}
        fontSize={isMainBusiness ? 0.11 : 0.09}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
        letterSpacing={0.03}
      >
        {business.shortTitle}
      </Text>

      {/* Accent line */}
      <mesh position={[0, -halfSize * 0.58, zPos + 0.005]}>
        <planeGeometry args={[isHovered ? 0.45 : 0.2, 0.002]} />
        <meshBasicMaterial color={isHovered ? business.color : '#333333'} />
      </mesh>

      {/* Corner accents */}
      <CornerAccents size={cubeSize} isHovered={isHovered} accent={business.color} />
    </group>
  );
}

function CornerAccents({ size, isHovered, accent }) {
  const cornerSize = 0.1;
  const thickness = 0.012;
  const offset = size / 2 - 0.06;
  const zPos = FACE_THICKNESS / 2 + 0.018;

  // 各コーナーの位置と線の向き（内側に向かう）
  const corners = [
    { pos: [-offset, offset, zPos], hDir: 1, vDir: -1 },   // 左上: 右、下
    { pos: [offset, offset, zPos], hDir: -1, vDir: -1 },   // 右上: 左、下
    { pos: [offset, -offset, zPos], hDir: -1, vDir: 1 },   // 右下: 左、上
    { pos: [-offset, -offset, zPos], hDir: 1, vDir: 1 },   // 左下: 右、上
  ];

  const activeOpacity = isHovered ? 0.9 : 0.25;
  const activeColor = isHovered ? accent : '#555';

  return (
    <group>
      {corners.map((corner, i) => (
        <group key={i} position={corner.pos}>
          {/* 水平線 */}
          <mesh position={[cornerSize / 2 * corner.hDir, 0, 0]}>
            <planeGeometry args={[cornerSize, thickness]} />
            <meshBasicMaterial color={activeColor} transparent opacity={activeOpacity} />
          </mesh>
          {/* 垂直線 */}
          <mesh position={[0, cornerSize / 2 * corner.vDir, 0]}>
            <planeGeometry args={[thickness, cornerSize]} />
            <meshBasicMaterial color={activeColor} transparent opacity={activeOpacity} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

function BusinessCube3D({ onNavigate, hoveredId, onHover, onLeave, cubeSize }) {
  const cubeRef = useRef();
  const targetRotationRef = useRef({ x: 0, y: 0 });

  useFrame((state, delta) => {
    if (!cubeRef.current) return;

    // Auto-rotate when not hovered (with momentum)
    if (!hoveredId) {
      targetRotationRef.current.y += delta * 0.12;
      targetRotationRef.current.x = Math.sin(state.clock.elapsedTime * 0.3) * 0.08;
    }

    // Apply smooth rotation with easing
    const lerpFactor = 0.08;
    cubeRef.current.rotation.x += (targetRotationRef.current.x - cubeRef.current.rotation.x) * lerpFactor;
    cubeRef.current.rotation.y += (targetRotationRef.current.y - cubeRef.current.rotation.y) * lerpFactor;
  });

  return (
    <Float speed={1.2} rotationIntensity={0.12} floatIntensity={0.18}>
      <group ref={cubeRef}>
        {corporateBusinesses.map((business, index) => (
          <BusinessFace
            key={business.id}
            business={business}
            index={index}
            isHovered={hoveredId === business.id}
            onClick={onNavigate}
            onHover={onHover}
            onLeave={onLeave}
            cubeSize={cubeSize}
          />
        ))}

        {/* Inner dark core */}
        <mesh>
          <boxGeometry args={[cubeSize - 0.06, cubeSize - 0.06, cubeSize - 0.06]} />
          <meshBasicMaterial color="#050508" />
        </mesh>
      </group>
    </Float>
  );
}

function Scene({ onNavigate, hoveredId, onHover, onLeave, cubeSize, showParticles }) {
  return (
    <>
      {/* Minimal lighting for meshBasicMaterial visibility */}
      <ambientLight intensity={0.3} />
      <directionalLight position={[5, 5, 5]} intensity={0.4} color="#ffffff" />
      <pointLight position={[0, 0, 6]} intensity={0.2} color="#d4af37" distance={12} decay={2} />

      {/* Floating particles */}
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

      <BusinessCube3D
        onNavigate={onNavigate}
        hoveredId={hoveredId}
        onHover={onHover}
        onLeave={onLeave}
        cubeSize={cubeSize}
      />

      <OrbitControls
        enableZoom={false}
        enablePan={false}
        rotateSpeed={0.5}
        enableDamping
        dampingFactor={0.08}
      />
    </>
  );
}

// ============================================
// UI Components
// ============================================

function HamburgerButton({ isOpen, onClick, isMobile }) {
  const size = 36;

  return (
    <button
      onClick={onClick}
      aria-label={isOpen ? 'メニューを閉じる' : 'メニューを開く'}
      aria-expanded={isOpen}
      style={{
        position: 'absolute',
        top: isMobile ? '20px' : '35px',
        right: isMobile ? '20px' : '35px',
        zIndex: 1001,
        width: '52px',
        height: '52px',
        background: 'transparent',
        border: 'none',
        cursor: 'pointer',
        padding: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        style={{
          transition: 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
          transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
          filter: isOpen ? 'none' : 'drop-shadow(0 0 3px rgba(212, 175, 55, 0.4))',
        }}
      >
        {isOpen ? (
          <>
            {/* X mark */}
            <line x1="6" y1="6" x2="18" y2="18" stroke={colors.gold} strokeWidth="2.5" strokeLinecap="round" />
            <line x1="18" y1="6" x2="6" y2="18" stroke={colors.gold} strokeWidth="2.5" strokeLinecap="round" />
          </>
        ) : (
          <>
            {/* 3D Cube - proper isometric proportions */}
            {/*
              Isometric cube vertices (centered at 12,12):
              Top: (12, 4)
              Front-left: (5, 8)
              Front-right: (19, 8)
              Center: (12, 12)
              Back-left: (5, 16)
              Back-right: (19, 16)
              Bottom: (12, 20)
            */}

            {/* Top face - brightest */}
            <path
              d="M 12 4 L 19 8 L 12 12 L 5 8 Z"
              stroke={colors.gold}
              strokeWidth="1.8"
              strokeLinejoin="round"
              fill="rgba(212, 175, 55, 0.15)"
            />

            {/* Left face - medium */}
            <path
              d="M 5 8 L 12 12 L 12 20 L 5 16 Z"
              stroke={colors.gold}
              strokeWidth="1.5"
              strokeLinejoin="round"
              strokeOpacity="0.8"
              fill="rgba(212, 175, 55, 0.06)"
            />

            {/* Right face - darker for depth */}
            <path
              d="M 19 8 L 12 12 L 12 20 L 19 16 Z"
              stroke={colors.gold}
              strokeWidth="1.5"
              strokeLinejoin="round"
              strokeOpacity="0.5"
              fill="rgba(212, 175, 55, 0.03)"
            />
          </>
        )}
      </svg>
    </button>
  );
}

function MobileMenuOverlay({ isOpen, businesses, onNavigate, onClose, prefersReducedMotion }) {
  const overlayRef = useRef(null);
  const itemsRef = useRef([]);

  // Escape key handler
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // GSAP stagger animation
  useEffect(() => {
    if (isOpen && !prefersReducedMotion) {
      gsap.fromTo(
        itemsRef.current,
        { opacity: 0, x: -30 },
        {
          opacity: 1,
          x: 0,
          duration: 0.4,
          stagger: 0.06,
          ease: 'power2.out',
        }
      );
    }
  }, [isOpen, prefersReducedMotion]);

  if (!isOpen) return null;

  return (
    <div
      ref={overlayRef}
      role="dialog"
      aria-modal="true"
      aria-label="事業案内メニュー"
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1000,
        background: 'rgba(6, 6, 10, 0.98)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '60px 20px',
      }}
    >
      {/* 縦書きデコレーション */}
      <div
        style={{
          position: 'absolute',
          left: '30px',
          top: '50%',
          transform: 'translateY(-50%)',
          writingMode: 'vertical-rl',
          color: 'rgba(212, 175, 55, 0.15)',
          fontSize: '14px',
          letterSpacing: '8px',
          fontWeight: 300,
          pointerEvents: 'none',
        }}
      >
        事業案内
      </div>

      {/* Menu items */}
      <nav
        onClick={(e) => e.stopPropagation()}
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
          width: '100%',
          maxWidth: '320px',
        }}
      >
        {businesses.map((business, index) => (
          <button
            key={business.id}
            ref={(el) => (itemsRef.current[index] = el)}
            onClick={() => {
              onNavigate(business);
              onClose();
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
              padding: '16px 20px',
              background: 'rgba(255, 255, 255, 0.03)',
              border: `1px solid rgba(255, 255, 255, 0.08)`,
              borderRadius: '8px',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              textAlign: 'left',
              opacity: prefersReducedMotion ? 1 : 0,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = `${business.color}20`;
              e.currentTarget.style.borderColor = `${business.color}50`;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)';
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)';
            }}
            onFocus={(e) => {
              e.currentTarget.style.background = `${business.color}20`;
              e.currentTarget.style.borderColor = `${business.color}50`;
            }}
            onBlur={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)';
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)';
            }}
          >
            <span
              style={{
                width: '32px',
                height: '32px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: `${business.color}20`,
                borderRadius: '6px',
                color: business.color,
                fontSize: '14px',
              }}
            >
              {business.icon}
            </span>
            <div style={{ flex: 1 }}>
              <div
                style={{
                  color: '#ffffff',
                  fontSize: '14px',
                  fontWeight: 600,
                  letterSpacing: '1px',
                  marginBottom: '2px',
                }}
              >
                {business.shortTitle}
              </div>
              <div
                style={{
                  color: 'rgba(255, 255, 255, 0.5)',
                  fontSize: '10px',
                  letterSpacing: '1px',
                }}
              >
                {business.titleJa.split('｜')[0]}
              </div>
            </div>
            <span
              style={{
                color: 'rgba(255, 255, 255, 0.3)',
                fontSize: '16px',
              }}
            >
              {business.isExternal ? '↗' : '→'}
            </span>
          </button>
        ))}
      </nav>

      {/* Close hint */}
      <div
        style={{
          position: 'absolute',
          bottom: '40px',
          left: '50%',
          transform: 'translateX(-50%)',
          color: 'rgba(255, 255, 255, 0.25)',
          fontSize: '10px',
          letterSpacing: '3px',
          pointerEvents: 'none',
        }}
      >
        TAP ANYWHERE TO CLOSE
      </div>
    </div>
  );
}

function BusinessInfoPanel({ hoveredBusiness, defaultBusiness, isMobile }) {
  const panelRef = useRef();
  const displayBusiness = hoveredBusiness || defaultBusiness;

  useEffect(() => {
    if (panelRef.current && hoveredBusiness) {
      gsap.fromTo(panelRef.current,
        { opacity: 0.5, x: isMobile ? 0 : -15, y: isMobile ? 10 : 0 },
        { opacity: 1, x: 0, y: 0, duration: 0.35, ease: 'power2.out' }
      );
    }
  }, [hoveredBusiness?.id, isMobile]);

  // Mobile: Compact bottom panel
  if (isMobile) {
    return (
      <div
        ref={panelRef}
        style={{
          position: 'absolute',
          bottom: '70px',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 100,
          width: 'calc(100% - 40px)',
          maxWidth: '320px',
          pointerEvents: 'none',
          opacity: hoveredBusiness ? 1 : 0,
          transition: 'opacity 0.3s ease',
          textAlign: 'center',
          background: 'rgba(0, 0, 0, 0.6)',
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
          borderRadius: '12px',
          padding: '12px 16px',
          border: `1px solid ${displayBusiness.color}30`,
        }}
      >
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '10px',
          marginBottom: '6px',
        }}>
          <span style={{
            color: displayBusiness.color,
            fontSize: '12px',
          }}>
            {displayBusiness.icon}
          </span>
          <span style={{
            color: '#ffffff',
            fontSize: '16px',
            fontWeight: 600,
            letterSpacing: '1px',
          }}>
            {displayBusiness.shortTitle}
          </span>
        </div>
        <div style={{
          color: 'rgba(255,255,255,0.6)',
          fontSize: '10px',
          letterSpacing: '1px',
        }}>
          {displayBusiness.titleJa.split('｜')[0]}
        </div>
      </div>
    );
  }

  // Desktop: Full left panel
  return (
    <div
      ref={panelRef}
      style={{
        position: 'absolute',
        top: '50%',
        left: '60px',
        transform: 'translateY(-50%)',
        zIndex: 100,
        maxWidth: '340px',
        pointerEvents: 'none',
        opacity: hoveredBusiness ? 1 : 0.6,
        transition: 'opacity 0.3s ease',
      }}
    >
      {/* Icon */}
      <div style={{
        color: displayBusiness.color,
        fontSize: '11px',
        letterSpacing: '4px',
        marginBottom: '8px',
        fontWeight: 500,
      }}>
        {displayBusiness.icon}
      </div>

      {/* Japanese title */}
      <div style={{
        color: 'rgba(255,255,255,0.5)',
        fontSize: '12px',
        letterSpacing: '2px',
        marginBottom: '6px',
      }}>
        {displayBusiness.titleJa}
      </div>

      {/* English title */}
      <div style={{
        color: '#ffffff',
        fontSize: '32px',
        fontWeight: 700,
        letterSpacing: '1px',
        lineHeight: 1.1,
        marginBottom: '16px',
        textShadow: '0 2px 20px rgba(0,0,0,0.5)',
      }}>
        {displayBusiness.titleEn}
      </div>

      {/* Description */}
      <div style={{
        color: 'rgba(255,255,255,0.6)',
        fontSize: '13px',
        lineHeight: 1.8,
        marginBottom: '20px',
      }}>
        {displayBusiness.description}
      </div>

      {/* Points */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '8px',
        marginBottom: '20px',
      }}>
        {displayBusiness.points.slice(0, 3).map((point, i) => (
          <span
            key={i}
            style={{
              background: `${displayBusiness.color}20`,
              border: `1px solid ${displayBusiness.color}40`,
              color: displayBusiness.color,
              fontSize: '10px',
              padding: '4px 10px',
              borderRadius: '12px',
              letterSpacing: '1px',
            }}
          >
            {point}
          </span>
        ))}
      </div>

      {/* Click hint */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        opacity: hoveredBusiness ? 1 : 0,
        transition: 'opacity 0.3s ease',
      }}>
        <div style={{
          width: '28px',
          height: '28px',
          border: `1px solid ${displayBusiness.color}`,
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <span style={{ color: displayBusiness.color, fontSize: '12px' }}>
            {displayBusiness.isExternal ? '↗' : '→'}
          </span>
        </div>
        <span style={{
          color: 'rgba(255,255,255,0.45)',
          fontSize: '10px',
          letterSpacing: '2px',
        }}>
          {displayBusiness.isExternal ? 'OPEN EXTERNAL SITE' : displayBusiness.isComingSoon ? 'VIEW COMING SOON' : 'CLICK TO EXPLORE'}
        </span>
      </div>
    </div>
  );
}

function SideNavigation({ businesses, hoveredId, onHover, onLeave, onNavigate, isVisible }) {
  if (!isVisible) return null;

  return (
    <nav
      aria-label="Business navigation"
      style={{
        position: 'absolute',
        right: '50px',
        top: '50%',
        transform: 'translateY(-50%)',
        zIndex: 100,
      }}
    >
      {businesses.map((business, i) => {
        const isActive = hoveredId === business.id;
        return (
          <button
            key={business.id}
            onClick={() => onNavigate(business)}
            aria-label={`Navigate to ${business.shortTitle}`}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              marginBottom: '12px',
              padding: '8px 12px',
              opacity: isActive ? 1 : 0.6,
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              cursor: 'pointer',
              background: isActive ? `${business.color}15` : 'transparent',
              borderRadius: '6px',
              border: isActive ? `1px solid ${business.color}40` : '1px solid transparent',
              width: '100%',
              textAlign: 'left',
              transform: isActive ? 'translateX(-4px)' : 'translateX(0)',
            }}
            onMouseEnter={() => onHover(business.id)}
            onMouseLeave={onLeave}
            onFocus={() => onHover(business.id)}
            onBlur={onLeave}
          >
            <span style={{
              width: '20px',
              textAlign: 'right',
              color: isActive ? business.color : 'rgba(255,255,255,0.3)',
              fontSize: '9px',
              fontFamily: 'monospace',
              transition: 'color 0.3s ease',
            }}>
              {String(i + 1).padStart(2, '0')}
            </span>
            <span style={{
              width: isActive ? '32px' : '16px',
              height: '2px',
              background: isActive ? business.color : `${business.color}60`,
              transition: 'all 0.3s ease',
              borderRadius: '1px',
              boxShadow: isActive ? `0 0 8px ${business.color}60` : 'none',
            }} />
            <span style={{
              color: isActive ? business.color : 'rgba(255,255,255,0.7)',
              fontSize: '10px',
              letterSpacing: '1.5px',
              fontWeight: isActive ? 600 : 400,
              transition: 'all 0.3s ease',
              textShadow: isActive ? `0 0 20px ${business.color}40` : 'none',
            }}>
              {business.shortTitle}
            </span>
          </button>
        );
      })}
    </nav>
  );
}

function MobileGrid({ businesses, onNavigate }) {
  useEffect(() => {
    gsap.fromTo('.mobile-card',
      { opacity: 0, y: 30, scale: 0.95 },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.5,
        stagger: 0.08,
        ease: 'back.out(1.4)'
      }
    );
  }, []);

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(2, 1fr)',
      gap: '12px',
      padding: '16px',
      maxWidth: '400px',
      margin: '0 auto',
    }}>
      {businesses.map((business, i) => (
        <button
          key={business.id}
          className="mobile-card"
          onClick={() => onNavigate(business)}
          style={{
            aspectRatio: '1',
            background: `linear-gradient(135deg, ${business.color}30 0%, #0f0f1a 100%)`,
            border: `1px solid ${business.color}50`,
            borderRadius: '12px',
            padding: '14px',
            cursor: 'pointer',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            textAlign: 'center',
            transition: 'all 0.3s ease',
            position: 'relative',
          }}
        >
          <span style={{
            position: 'absolute',
            top: '10px',
            left: '10px',
            fontSize: '9px',
            color: business.color,
            letterSpacing: '1px',
          }}>
            {business.icon}
          </span>
          <span style={{
            fontSize: '13px',
            fontWeight: 700,
            color: '#ffffff',
            letterSpacing: '1px',
            marginBottom: '4px',
          }}>
            {business.shortTitle}
          </span>
          <span style={{
            fontSize: '9px',
            color: 'rgba(255,255,255,0.6)',
          }}>
            {business.titleJa.split('｜')[0]}
          </span>
        </button>
      ))}
    </div>
  );
}

// ============================================
// Main Component
// ============================================

export default function BusinessCubeDesign({ onNavigate }) {
  const { isMobile, isTablet, prefersReducedMotion } = useBreakpoints();
  const { hoveredId, handleHover, handleLeave } = useHoverState();
  const [menuOpen, setMenuOpen] = useState(false);

  const hoveredBusiness = useMemo(() =>
    corporateBusinesses.find(b => b.id === hoveredId),
    [hoveredId]
  );

  const handleNavigate = useCallback((business) => {
    console.log('Navigating to:', business.id);
    if (onNavigate) {
      onNavigate(business);
    }
  }, [onNavigate]);

  const handleMenuToggle = useCallback(() => {
    setMenuOpen(prev => !prev);
  }, []);

  const handleMenuClose = useCallback(() => {
    setMenuOpen(false);
  }, []);

  const cubeSize = isMobile ? CUBE_SIZE_MOBILE : isTablet ? 2.0 : CUBE_SIZE;
  const showParticles = !isMobile && !prefersReducedMotion;

  // Responsive display logic
  const showHamburger = isMobile || isTablet;
  const showSideNav = !isMobile && !isTablet; // Desktop only

  const backgroundGradient = useMemo(() => {
    if (hoveredBusiness) {
      return `radial-gradient(ellipse at 30% 50%, ${hoveredBusiness.color}25 0%, #0a0a12 55%)`;
    }
    return 'radial-gradient(ellipse at 30% 50%, #1a1a2e15 0%, #0a0a12 100%)';
  }, [hoveredBusiness]);

  return (
    <div
      style={{
        width: '100vw',
        height: '100vh',
        background: backgroundGradient,
        position: 'relative',
        overflow: 'hidden',
        fontFamily: "'Helvetica Neue', Arial, sans-serif",
        transition: 'background 0.8s ease',
      }}
    >
      {/* Hamburger Button (Mobile & Tablet) */}
      {showHamburger && (
        <HamburgerButton
          isOpen={menuOpen}
          onClick={handleMenuToggle}
          isMobile={isMobile}
        />
      )}

      {/* Mobile Menu Overlay */}
      <MobileMenuOverlay
        isOpen={menuOpen}
        businesses={corporateBusinesses}
        onNavigate={handleNavigate}
        onClose={handleMenuClose}
        prefersReducedMotion={prefersReducedMotion}
      />

      {/* Header */}
      <header
        style={{
          position: 'absolute',
          top: isMobile ? '20px' : '35px',
          left: isMobile ? '20px' : '60px',
          zIndex: 100,
          pointerEvents: 'none',
        }}
      >
        <h1 style={{
          color: colors.gold,
          fontSize: isMobile ? '16px' : '20px',
          letterSpacing: isMobile ? '4px' : '6px',
          fontWeight: 600,
          margin: 0,
        }}>
          CUBE
        </h1>
        <p style={{
          color: 'rgba(255,255,255,0.5)',
          fontSize: '10px',
          letterSpacing: '3px',
          marginTop: '6px',
        }}>
          {brand.concept}
        </p>
      </header>

      {/* Tagline (Desktop only - hidden when hamburger menu visible) */}
      {!showHamburger && (
        <div style={{
          position: 'absolute',
          top: '35px',
          right: '60px',
          zIndex: 100,
          textAlign: 'right',
          pointerEvents: 'none',
        }}>
          <p style={{
            color: 'rgba(255,255,255,0.35)',
            fontSize: '11px',
            letterSpacing: '2px',
            fontStyle: 'italic',
          }}>
            {brand.tagline}
          </p>
          <p style={{
            color: 'rgba(255,255,255,0.25)',
            fontSize: '9px',
            letterSpacing: '1px',
            marginTop: '4px',
          }}>
            {brand.subTagline}
          </p>
        </div>
      )}

      {/* Business Info Panel (Desktop) */}
      <BusinessInfoPanel
        hoveredBusiness={hoveredBusiness}
        defaultBusiness={corporateBusinesses[0]}
        isMobile={isMobile}
      />

      {/* 3D Cube - All viewports */}
      <Canvas
        camera={{ position: [0, 0, isMobile ? 5.5 : 6], fov: isMobile ? 50 : 45 }}
        style={{ position: 'absolute', inset: 0 }}
        eventPrefix="client"
      >
        <Suspense fallback={null}>
          <Scene
            onNavigate={handleNavigate}
            hoveredId={hoveredId}
            onHover={handleHover}
            onLeave={handleLeave}
            cubeSize={cubeSize}
            showParticles={showParticles}
          />
        </Suspense>
      </Canvas>

      {/* Side Navigation (Desktop only) */}
      <SideNavigation
        businesses={corporateBusinesses}
        hoveredId={hoveredId}
        onHover={handleHover}
        onLeave={handleLeave}
        onNavigate={handleNavigate}
        isVisible={showSideNav}
      />

      {/* Footer */}
      <footer
        style={{
          position: 'absolute',
          bottom: isMobile ? '20px' : '35px',
          left: isMobile ? '20px' : '60px',
          right: isMobile ? '20px' : '60px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          zIndex: 100,
          pointerEvents: 'none',
        }}
      >
        <div>
          <p style={{
            color: 'rgba(255,255,255,0.28)',
            fontSize: '10px',
            letterSpacing: '2px',
          }}>
            {isMobile ? 'SWIPE TO ROTATE / TAP TO SELECT' : 'DRAG TO ROTATE / CLICK TO ENTER'}
          </p>
        </div>
        <div style={{ textAlign: 'right' }}>
          <p style={{
            color: 'rgba(255,255,255,0.4)',
            fontSize: '9px',
            letterSpacing: '1px',
          }}>
            {company.headquarters.address.split('区')[0]}区
          </p>
          <p style={{
            color: 'rgba(255,255,255,0.28)',
            fontSize: '10px',
            letterSpacing: '2px',
            marginTop: '2px',
          }}>
            EST. 2013
          </p>
        </div>
      </footer>

      {/* Vision (Desktop only) */}
      {!isMobile && (
        <div style={{
          position: 'absolute',
          bottom: '35px',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 100,
          textAlign: 'center',
          pointerEvents: 'none',
        }}>
          <p style={{
            color: 'rgba(255,255,255,0.2)',
            fontSize: '10px',
            letterSpacing: '3px',
          }}>
            {vision.vision}
          </p>
        </div>
      )}

      {/* Decorative line (Desktop) */}
      {!isMobile && (
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '30px',
          width: '1px',
          height: '180px',
          background: 'linear-gradient(to bottom, transparent, rgba(212,175,55,0.25), transparent)',
          transform: 'translateY(-50%)',
        }} />
      )}

      <style>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        html {
          color-scheme: dark;
        }

        body {
          overflow: hidden;
        }

        /* Focus visible styles for accessibility */
        button:focus-visible,
        a:focus-visible,
        [tabindex]:focus-visible {
          outline: 2px solid ${colors.gold};
          outline-offset: 2px;
        }

        /* Remove default focus for mouse users */
        button:focus:not(:focus-visible),
        a:focus:not(:focus-visible) {
          outline: none;
        }

        .mobile-card {
          position: relative;
          touch-action: manipulation;
          -webkit-tap-highlight-color: transparent;
        }

        .mobile-card:focus-visible {
          outline: 2px solid ${colors.gold};
          outline-offset: 2px;
        }

        .mobile-card:active {
          transform: scale(0.97);
        }

        /* Menu overlay item hover effect enhancement */
        [role="dialog"] button:hover span:first-child,
        [role="dialog"] button:focus span:first-child {
          transform: scale(1.05);
        }

        @media (prefers-reduced-motion: reduce) {
          *, *::before, *::after {
            animation-duration: 0.01ms !important;
            transition-duration: 0.01ms !important;
          }
        }
      `}</style>
    </div>
  );
}
