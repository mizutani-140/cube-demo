/**
 * BusinessInfoPanel - Overlay panel showing business information
 * Extracted from BusinessCube.jsx
 */

import React, { useRef, useEffect } from 'react';
import { gsap } from 'gsap';

// ============================================
// BusinessInfoPanel Component
// ============================================

export function BusinessInfoPanel({ activeBusiness, isMobile, isDark, themeColors, onExplore }) {
  const panelRef = useRef();
  const prevIdRef = useRef(null);

  // Theme-aware colors
  const textWhite = isDark ? '#ffffff' : themeColors?.text?.primary || '#1a1814';
  const textLight = isDark ? 'rgba(255,255,255,0.6)' : themeColors?.text?.secondary || 'rgba(26,24,20,0.7)';
  const textMuted = isDark ? 'rgba(255,255,255,0.5)' : themeColors?.text?.tertiary || 'rgba(26,24,20,0.6)';
  const textSubtle = isDark ? 'rgba(255,255,255,0.45)' : themeColors?.text?.muted || 'rgba(26,24,20,0.5)';
  const panelBg = isDark ? 'rgba(0, 0, 0, 0.6)' : 'rgba(255, 255, 255, 0.85)';

  useEffect(() => {
    if (panelRef.current && activeBusiness && prevIdRef.current !== activeBusiness.id) {
      prevIdRef.current = activeBusiness.id;
      gsap.fromTo(panelRef.current,
        { opacity: 0.5, x: isMobile ? 0 : -15, y: isMobile ? 10 : 0 },
        { opacity: 1, x: 0, y: 0, duration: 0.35, ease: 'power2.out' }
      );
    }
  }, [activeBusiness?.id, isMobile]);

  if (!activeBusiness) return null;

  // Mobile: Split into top and bottom panels around the cube
  if (isMobile) {
    return (
      <>
        {/* Top Panel: Title & Icon */}
        <div
          ref={panelRef}
          style={{
            position: 'absolute',
            top: '9%',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 100,
            width: 'calc(100% - 48px)',
            maxWidth: '320px',
            pointerEvents: 'none',
            textAlign: 'center',
          }}
        >
          <div style={{
            color: activeBusiness.color,
            fontSize: '10px',
            letterSpacing: '4px',
            marginBottom: '4px',
            fontWeight: 500,
          }}>
            {activeBusiness.icon}
          </div>
          <div style={{
            color: textWhite,
            fontSize: '18px',
            fontWeight: 700,
            letterSpacing: '1px',
            lineHeight: 1.2,
            textShadow: isDark ? '0 2px 16px rgba(0,0,0,0.5)' : '0 2px 16px rgba(0,0,0,0.08)',
          }}>
            {activeBusiness.titleEn}
          </div>
          <div style={{
            color: textMuted,
            fontSize: '9px',
            letterSpacing: '2px',
            marginTop: '3px',
          }}>
            {activeBusiness.titleJa.split('｜')[0]}
          </div>
        </div>

        {/* Bottom Panel: Description & CTA */}
        <div
          style={{
            position: 'absolute',
            bottom: '14%',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 100,
            width: 'calc(100% - 40px)',
            maxWidth: '320px',
            pointerEvents: 'auto',
            textAlign: 'center',
            background: isDark ? 'rgba(6,6,10,0.65)' : 'rgba(245,242,235,0.7)',
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
            borderRadius: '12px',
            padding: '12px 16px',
          }}
        >
          <div style={{
            color: textLight,
            fontSize: '10px',
            lineHeight: 1.6,
            marginBottom: '8px',
          }}>
            {activeBusiness.description}
          </div>
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: '5px',
            marginBottom: '10px',
          }}>
            {activeBusiness.points.slice(0, 3).map((point, i) => (
              <span
                key={i}
                style={{
                  background: `${activeBusiness.color}${isDark ? '18' : '12'}`,
                  border: `1px solid ${activeBusiness.color}${isDark ? '35' : '25'}`,
                  color: activeBusiness.color,
                  fontSize: '8px',
                  padding: '2px 7px',
                  borderRadius: '10px',
                  letterSpacing: '0.5px',
                }}
              >
                {point}
              </span>
            ))}
          </div>
          <button
            onClick={() => onExplore && onExplore(activeBusiness)}
            style={{
              background: `${activeBusiness.color}20`,
              border: `1px solid ${activeBusiness.color}60`,
              color: activeBusiness.color,
              fontSize: '9px',
              letterSpacing: '2px',
              fontWeight: 600,
              padding: '7px 22px',
              borderRadius: '20px',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
            }}
          >
            {activeBusiness.isExternal ? 'OPEN' : 'EXPLORE'}
          </button>
        </div>
      </>
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
        pointerEvents: 'auto',
      }}
    >
      {/* Icon */}
      <div style={{
        color: activeBusiness.color,
        fontSize: '11px',
        letterSpacing: '4px',
        marginBottom: '8px',
        fontWeight: 500,
      }}>
        {activeBusiness.icon}
      </div>

      {/* Japanese title */}
      <div style={{
        color: textMuted,
        fontSize: '12px',
        letterSpacing: '2px',
        marginBottom: '6px',
      }}>
        {activeBusiness.titleJa}
      </div>

      {/* English title */}
      <div style={{
        color: textWhite,
        fontSize: '32px',
        fontWeight: 700,
        letterSpacing: '1px',
        lineHeight: 1.1,
        marginBottom: '16px',
        textShadow: isDark ? '0 2px 20px rgba(0,0,0,0.5)' : '0 2px 20px rgba(0,0,0,0.1)',
      }}>
        {activeBusiness.titleEn}
      </div>

      {/* Description */}
      <div style={{
        color: textLight,
        fontSize: '13px',
        lineHeight: 1.8,
        marginBottom: '20px',
      }}>
        {activeBusiness.description}
      </div>

      {/* Points */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '8px',
        marginBottom: '20px',
      }}>
        {activeBusiness.points.slice(0, 3).map((point, i) => (
          <span
            key={i}
            style={{
              background: `${activeBusiness.color}${isDark ? '20' : '15'}`,
              border: `1px solid ${activeBusiness.color}${isDark ? '40' : '30'}`,
              color: activeBusiness.color,
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

      {/* CTA Button */}
      <button
        onClick={() => onExplore && onExplore(activeBusiness)}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          background: 'transparent',
          border: 'none',
          cursor: 'pointer',
          padding: 0,
        }}
      >
        <div style={{
          width: '28px',
          height: '28px',
          border: `1px solid ${activeBusiness.color}`,
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <span style={{ color: activeBusiness.color, fontSize: '12px' }}>
            {activeBusiness.isExternal ? '↗' : '→'}
          </span>
        </div>
        <span style={{
          color: textSubtle,
          fontSize: '10px',
          letterSpacing: '2px',
        }}>
          {activeBusiness.isExternal ? 'OPEN EXTERNAL SITE' : activeBusiness.isComingSoon ? 'VIEW COMING SOON' : 'EXPLORE'}
        </span>
      </button>
    </div>
  );
}
