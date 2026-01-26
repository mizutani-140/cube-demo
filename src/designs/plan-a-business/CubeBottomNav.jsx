/**
 * CubeBottomNav - Bottom dot indicators and arrow navigation
 * Extracted from BusinessCube.jsx
 */

import React from 'react';

// ============================================
// CubeBottomNav Component
// ============================================

export function CubeBottomNav({ businesses, activeIndex, onSelectFace, onNavigateSequential, isDark, isMobile }) {
  const arrowColor = isDark ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.4)';
  const arrowHoverColor = isDark ? 'rgba(255,255,255,0.85)' : 'rgba(0,0,0,0.75)';
  const arrowStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '28px',
    height: '28px',
    borderRadius: '50%',
    border: 'none',
    background: 'transparent',
    cursor: 'pointer',
    padding: 0,
    transition: 'all 0.25s ease',
    flexShrink: 0,
  };

  return (
    <nav
      role="tablist"
      aria-label="Cube face navigation"
      style={{
        position: 'absolute',
        bottom: isMobile ? '6%' : '95px',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 200,
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        padding: '6px 10px',
        background: isDark ? 'rgba(0,0,0,0.4)' : 'rgba(255,255,255,0.6)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        borderRadius: '20px',
        border: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)'}`,
      }}
    >
      {/* Left Arrow */}
      <button
        aria-label="Previous"
        onClick={() => onNavigateSequential(-1)}
        style={{ ...arrowStyle, color: arrowColor }}
        onMouseEnter={(e) => { e.currentTarget.style.color = arrowHoverColor; e.currentTarget.style.background = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)'; }}
        onMouseLeave={(e) => { e.currentTarget.style.color = arrowColor; e.currentTarget.style.background = 'transparent'; }}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="15 18 9 12 15 6" />
        </svg>
      </button>

      {/* Dots */}
      {businesses.map((business, i) => {
        const isActive = i === activeIndex;
        return (
          <button
            key={business.id}
            role="tab"
            aria-selected={isActive}
            aria-label={business.shortTitle}
            onClick={() => onSelectFace(i)}
            style={{
              width: isActive ? '24px' : '8px',
              height: '8px',
              borderRadius: '4px',
              background: isActive ? business.color : (isDark ? 'rgba(255,255,255,0.25)' : 'rgba(0,0,0,0.2)'),
              border: 'none',
              cursor: 'pointer',
              padding: 0,
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              boxShadow: isActive ? `0 0 8px ${business.color}60` : 'none',
            }}
          />
        );
      })}

      {/* Right Arrow */}
      <button
        aria-label="Next"
        onClick={() => onNavigateSequential(1)}
        style={{ ...arrowStyle, color: arrowColor }}
        onMouseEnter={(e) => { e.currentTarget.style.color = arrowHoverColor; e.currentTarget.style.background = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)'; }}
        onMouseLeave={(e) => { e.currentTarget.style.color = arrowColor; e.currentTarget.style.background = 'transparent'; }}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="9 18 15 12 9 6" />
        </svg>
      </button>
    </nav>
  );
}
