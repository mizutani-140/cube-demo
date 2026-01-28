/**
 * PageSideNavigation - Editorial Design System
 * Fixed right-side navigation for desktop
 *
 * - Glassmorphism backdrop panel for readability
 * - Collapses to dot indicators while scrolling, expands on idle / hover
 */

import React, { useState, useRef, useEffect } from 'react';
import { useBreakpoints } from '../../../hooks/useBreakpoints';
import { typography } from '../../../tokens';
import { navigation } from '../../../data/navigation';
import { useTheme } from '../../../contexts';

const TRANSITION = 'all 0.45s cubic-bezier(0.16, 1, 0.3, 1)';

export function PageSideNavigation({ currentPage, onNavigate }) {
  const { isMobile, isTablet } = useBreakpoints();
  const { colors, isDark } = useTheme();
  const [hoveredId, setHoveredId] = useState(null);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isNavHovered, setIsNavHovered] = useState(false);
  const scrollTimerRef = useRef(null);

  // Scroll detection: collapse while scrolling, expand when idle
  useEffect(() => {
    if (isMobile || isTablet) return;

    const handleScroll = () => {
      setIsCollapsed(true);
      clearTimeout(scrollTimerRef.current);
      scrollTimerRef.current = setTimeout(() => {
        setIsCollapsed(false);
      }, 900);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(scrollTimerRef.current);
    };
  }, [isMobile, isTablet]);

  if (isMobile || isTablet) return null;

  // Expand when nav is hovered, even while scrolling
  const showExpanded = !isCollapsed || isNavHovered;

  // Color definitions
  const navColors = isDark ? {
    works: '#C7B99A',
    about: '#8A9BAD',
    access: '#5BA4C9',
    contact: '#C8CDD5',
    lambchan: '#e74c3c',
    lifenostalgia: '#5FAD8B',
  } : {
    works: '#6a5a3a',
    about: '#3a4b5d',
    access: '#1a5a7a',
    contact: '#4a4f57',
    lambchan: '#8a1a1a',
    lifenostalgia: '#1a6a4a',
  };

  const numberColor = isDark ? 'rgba(255,255,255,0.25)' : 'rgba(26,24,20,0.45)';
  const defaultTextColor = isDark ? 'rgba(255,255,255,0.65)' : 'rgba(26,24,20,0.75)';
  const hoverTextColor = isDark ? '#fff' : colors.text.primary;
  const hoverBg = isDark ? 'rgba(255,255,255,0.04)' : 'rgba(26,24,20,0.06)';
  const subtitleColor = isDark ? 'rgba(255,255,255,0.3)' : 'rgba(26,24,20,0.4)';

  // Glass panel
  const panelBg = isDark ? 'rgba(6, 6, 10, 0.55)' : 'rgba(245, 242, 235, 0.6)';
  const panelBorder = isDark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.07)';

  return (
    <nav
      aria-label="Page navigation"
      onMouseEnter={() => setIsNavHovered(true)}
      onMouseLeave={() => { setIsNavHovered(false); setHoveredId(null); }}
      style={{
        position: 'fixed',
        right: '32px',
        top: '50%',
        transform: 'translateY(-50%)',
        zIndex: 100,
        // Glass panel
        background: panelBg,
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        border: `1px solid ${panelBorder}`,
        borderRadius: showExpanded ? '14px' : '20px',
        padding: showExpanded ? '6px' : '6px 5px',
        transition: TRANSITION,
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
              gap: showExpanded ? '12px' : '0px',
              marginBottom: '2px',
              padding: showExpanded ? '9px 14px' : '9px 7px',
              opacity: isActive || isHovered ? 1 : (isDark ? 0.55 : 0.7),
              transition: TRANSITION,
              cursor: 'pointer',
              background: (isActive || isHovered) && showExpanded ? hoverBg : 'transparent',
              borderRadius: '6px',
              border: 'none',
              textAlign: 'right',
              position: 'relative',
              whiteSpace: 'nowrap',
            }}
            onMouseEnter={() => setHoveredId(item.id)}
            onMouseLeave={() => setHoveredId(null)}
            onFocus={() => setHoveredId(item.id)}
            onBlur={() => setHoveredId(null)}
          >
            {/* Dot indicator — always visible */}
            <span style={{
              width: isActive ? '7px' : '5px',
              height: isActive ? '7px' : '5px',
              borderRadius: '50%',
              background: isActive
                ? itemColor
                : (isHovered ? itemColor : (isDark ? 'rgba(255,255,255,0.25)' : 'rgba(26,24,20,0.2)')),
              flexShrink: 0,
              transition: 'all 0.3s ease',
              boxShadow: isActive ? `0 0 6px ${itemColor}60` : 'none',
            }} />

            {/* Expandable label section */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              overflow: 'hidden',
              maxWidth: showExpanded ? '220px' : '0px',
              opacity: showExpanded ? 1 : 0,
              transition: TRANSITION,
            }}>
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

              {/* Title block */}
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
            </div>

            {/* Accent line (bottom) — expanded only */}
            {showExpanded && (
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
            )}
          </button>
        );
      })}

      {/* Back to cube link */}
      <button
        onClick={() => onNavigate('cube')}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: showExpanded ? '12px' : '0px',
          marginTop: showExpanded ? '10px' : '4px',
          padding: showExpanded ? '9px 14px' : '9px 7px',
          opacity: hoveredId === 'cube' ? 1 : (isDark ? 0.4 : 0.6),
          transition: TRANSITION,
          cursor: 'pointer',
          background: hoveredId === 'cube' && showExpanded ? hoverBg : 'transparent',
          borderRadius: '6px',
          border: 'none',
          textAlign: 'right',
          whiteSpace: 'nowrap',
          borderTop: `1px solid ${panelBorder}`,
        }}
        onMouseEnter={() => setHoveredId('cube')}
        onMouseLeave={() => setHoveredId(null)}
        onFocus={() => setHoveredId('cube')}
        onBlur={() => setHoveredId(null)}
      >
        {/* Dot — always visible */}
        <span style={{
          width: '5px',
          height: '5px',
          borderRadius: '50%',
          background: colors.gold,
          opacity: 0.5,
          flexShrink: 0,
          transition: 'all 0.3s ease',
        }} />

        {/* Expandable label */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          overflow: 'hidden',
          maxWidth: showExpanded ? '220px' : '0px',
          opacity: showExpanded ? 1 : 0,
          transition: TRANSITION,
        }}>
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
        </div>
      </button>
    </nav>
  );
}
