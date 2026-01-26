/**
 * PageSideNavigation - Editorial Design System
 * Fixed right-side navigation for desktop
 */

import React, { useState } from 'react';
import { useBreakpoints } from '../../../hooks/useBreakpoints';
import { typography } from '../../../tokens';
import { navigation } from '../../../data/navigation';
import { useTheme } from '../../../contexts';

export function PageSideNavigation({ currentPage, onNavigate }) {
  const { isMobile, isTablet } = useBreakpoints();
  const { colors, isDark } = useTheme();
  const [hoveredId, setHoveredId] = useState(null);

  if (isMobile || isTablet) return null;

  // Define colors for each nav item (slightly adjusted for light mode)
  const navColors = isDark ? {
    works: '#C7B99A',
    about: '#8A9BAD',
    access: '#5BA4C9',
    contact: '#C8CDD5',
    lambchan: '#e74c3c',
    lifenostalgia: '#5FAD8B',
  } : {
    // ライトモード: より濃い色でコントラストを確保
    works: '#6a5a3a',        // ダークブラウン
    about: '#3a4b5d',        // ダークスチール
    access: '#1a5a7a',       // ダークブルー
    contact: '#4a4f57',      // ダークグレー
    lambchan: '#8a1a1a',     // ダークレッド
    lifenostalgia: '#1a6a4a', // ダークグリーン
  };

  // Theme-aware colors - ライトモードではより濃く
  const numberColor = isDark ? 'rgba(255,255,255,0.25)' : 'rgba(26,24,20,0.45)';
  const defaultTextColor = isDark ? 'rgba(255,255,255,0.65)' : 'rgba(26,24,20,0.75)';
  const hoverTextColor = isDark ? '#fff' : colors.text.primary;
  const hoverBg = isDark ? 'rgba(255,255,255,0.04)' : 'rgba(26,24,20,0.06)';

  // Japanese subtitle color
  const subtitleColor = isDark ? 'rgba(255,255,255,0.3)' : 'rgba(26,24,20,0.4)';

  return (
    <nav
      aria-label="Page navigation"
      style={{
        position: 'fixed',
        right: '40px',
        top: '50%',
        transform: 'translateY(-50%)',
        zIndex: 100,
      }}
    >
      {navigation.filter(item => item.id !== 'news').map((item, i) => {
        const itemColor = navColors[item.id] || colors.gold;
        const isActive = currentPage === item.id;
        const isHovered = hoveredId === item.id;

        return (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            aria-label={`Navigate to ${item.label}`}
            aria-current={isActive ? 'page' : undefined}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '14px',
              marginBottom: '4px',
              padding: '10px 14px',
              opacity: isActive || isHovered ? 1 : (isDark ? 0.5 : 0.7),
              transition: 'all 0.3s ease',
              cursor: 'pointer',
              background: isActive || isHovered ? hoverBg : 'transparent',
              borderRadius: '6px',
              border: 'none',
              width: '100%',
              textAlign: 'right',
              position: 'relative',
            }}
            onMouseEnter={() => setHoveredId(item.id)}
            onMouseLeave={() => setHoveredId(null)}
            onFocus={() => setHoveredId(item.id)}
            onBlur={() => setHoveredId(null)}
          >
            {/* Number index */}
            <span style={{
              fontFamily: typography.fontFamily.mono,
              fontSize: '10px',
              color: isActive ? itemColor : numberColor,
              opacity: isActive ? 1 : 0.6,
              letterSpacing: '0.1em',
              minWidth: '22px',
              textAlign: 'right',
              transition: 'color 0.3s ease',
            }}>
              {String(i + 1).padStart(2, '0')}
            </span>

            {/* Title block - right aligned like mobile */}
            <div style={{ flex: 1, textAlign: 'right' }}>
              <span style={{
                display: 'block',
                fontFamily: typography.fontFamily.display,
                fontSize: '16px',
                fontWeight: 300,
                letterSpacing: '0.06em',
                color: isActive ? itemColor : (isHovered ? hoverTextColor : defaultTextColor),
                transition: 'color 0.3s ease',
                lineHeight: 1.2,
              }}>
                {item.label}
              </span>
              <span style={{
                display: 'block',
                fontFamily: typography.fontFamily.japanese,
                fontSize: '9px',
                color: isActive ? itemColor : subtitleColor,
                marginTop: '3px',
                letterSpacing: '0.15em',
                transition: 'color 0.3s ease',
                opacity: isActive ? 0.7 : 1,
              }}>
                {item.labelJa}
              </span>
            </div>

            {/* Arrow indicator */}
            <span style={{
              color: itemColor,
              opacity: isActive || isHovered ? 1 : 0.3,
              fontSize: '12px',
              transition: 'opacity 0.3s ease',
            }}>
              →
            </span>

            {/* Accent line (bottom) */}
            <div style={{
              position: 'absolute',
              bottom: 0,
              right: 0,
              width: '100%',
              height: '1px',
              background: `linear-gradient(to left, ${itemColor}, transparent)`,
              transformOrigin: 'right center',
              transform: isActive ? 'scaleX(1)' : (isHovered ? 'scaleX(0.6)' : 'scaleX(0)'),
              opacity: isActive ? 0.5 : (isHovered ? 0.35 : 0),
              transition: 'transform 0.3s ease, opacity 0.3s ease',
            }} />
          </button>
        );
      })}

      {/* Back to cube link */}
      <button
        onClick={() => onNavigate('cube')}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '14px',
          marginTop: '16px',
          padding: '10px 14px',
          opacity: hoveredId === 'cube' ? 1 : (isDark ? 0.4 : 0.6),
          transition: 'all 0.3s ease',
          cursor: 'pointer',
          background: hoveredId === 'cube' ? hoverBg : 'transparent',
          borderRadius: '6px',
          border: 'none',
          width: '100%',
          textAlign: 'right',
        }}
        onMouseEnter={() => setHoveredId('cube')}
        onMouseLeave={() => setHoveredId(null)}
        onFocus={() => setHoveredId('cube')}
        onBlur={() => setHoveredId(null)}
      >
        <span style={{
          minWidth: '22px',
          textAlign: 'right',
          color: colors.gold,
          fontSize: '14px',
        }}>
          ←
        </span>
        <div style={{ flex: 1, textAlign: 'right' }}>
          <span style={{
            display: 'block',
            color: colors.gold,
            fontSize: '12px',
            letterSpacing: '0.1em',
            fontFamily: typography.fontFamily.mono,
          }}>
            BACK TO CUBE
          </span>
        </div>
      </button>
    </nav>
  );
}
