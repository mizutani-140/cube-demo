/**
 * Shared Mobile Menu Components
 * メインページ・子ページ共通のモバイルメニュー
 *
 * GSAPによるリッチなアニメーション付きフルスクリーンオーバーレイ
 */

import React, { useRef, useEffect, useCallback } from 'react';
import { gsap } from 'gsap';
import { typography, zIndex } from '../tokens';
import { company } from '../data/corporate';
import { useTheme } from '../contexts';
import { useBreakpoints } from '../hooks/useBreakpoints';

// ============================================
// Hamburger Button
// ============================================

export function HamburgerButton({ isOpen, onClick, isMobile, style: styleProp }) {
  const { colors, isDark } = useTheme();
  const lineColor = colors.text.primary;
  const bgColor = isDark ? 'rgba(0,0,0,0.3)' : 'rgba(255,255,255,0.75)';
  const borderColor = isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)';

  const svgTransition = 'all 0.5s cubic-bezier(0.76, 0, 0.24, 1)';

  return (
    <button
      onClick={onClick}
      aria-label={isOpen ? 'メニューを閉じる' : 'メニューを開く'}
      aria-expanded={isOpen}
      style={{
        background: bgColor,
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        border: `1px solid ${borderColor}`,
        borderRadius: '20px',
        cursor: 'pointer',
        padding: isMobile ? '10px 14px' : '12px 16px',
        display: 'flex',
        alignItems: 'center',
        gap: isMobile ? '8px' : '10px',
        transition: 'all 0.3s ease',
        ...styleProp,
      }}
    >
      <svg
        width={18}
        height={18}
        viewBox="0 0 24 24"
        fill="none"
        stroke={lineColor}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{
          display: 'block',
          transition: `transform 0.5s cubic-bezier(0.76, 0, 0.24, 1)`,
          transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
        }}
      >
        {/* Cube wireframe (isometric) — visible when closed */}
        <g style={{ opacity: isOpen ? 0 : 1, transition: svgTransition }}>
          {/* Outer hexagonal outline (regular isometric: width = height × √3/2) */}
          <polygon points="12,2 20.7,7 20.7,17 12,22 3.3,17 3.3,7" />
          {/* Three internal edges radiating from center */}
          <line x1="12" y1="12" x2="12" y2="2" />
          <line x1="12" y1="12" x2="3.3" y2="17" />
          <line x1="12" y1="12" x2="20.7" y2="17" />
        </g>

        {/* X icon — visible when open */}
        <g style={{ opacity: isOpen ? 1 : 0, transition: svgTransition }}>
          <line x1="6" y1="6" x2="18" y2="18" />
          <line x1="18" y1="6" x2="6" y2="18" />
        </g>
      </svg>
      <span style={{
        fontFamily: typography.fontFamily.condensed,
        fontSize: '11px',
        color: lineColor,
        letterSpacing: '0.12em',
        lineHeight: 1,
        fontWeight: 500,
      }}>
        {isOpen ? 'CLOSE' : 'MENU'}
      </span>
    </button>
  );
}

// ============================================
// Mobile Menu Overlay
// ============================================

export function MobileMenuOverlay({
  isOpen,
  items,       // [{ id, label|shortTitle, labelJa|titleJa, color?, icon?, isExternal? }]
  activeId,    // current page/face id for highlighting
  onSelect,    // (item) => void
  onClose,     // () => void
}) {
  const { colors, isDark } = useTheme();
  const { isMobile } = useBreakpoints();
  const overlayRef = useRef(null);
  const contentRef = useRef(null);
  const itemsRef = useRef([]);
  const linesRef = useRef([]);
  const tlRef = useRef(null);

  // Fully opaque on mobile to avoid expensive compositing; semi-transparent on desktop
  const menuBg = isMobile
    ? (isDark ? 'rgb(6, 6, 10)' : 'rgb(245, 242, 235)')
    : (isDark ? 'rgba(6, 6, 10, 0.97)' : 'rgba(245, 242, 235, 0.97)');

  // Lock body scroll
  useEffect(() => {
    if (!isOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prev; };
  }, [isOpen]);

  // ESC key
  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isOpen, onClose]);

  // GSAP entrance animation
  useEffect(() => {
    if (!isOpen || !overlayRef.current) return;

    // Kill previous timeline
    if (tlRef.current) tlRef.current.kill();

    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
    tlRef.current = tl;

    if (isMobile) {
      // Mobile: lightweight opacity + translateY (no clip-path, no skew)
      tl.fromTo(overlayRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.35, ease: 'power2.out' }
      );

      const validItems = itemsRef.current.filter(Boolean);
      if (validItems.length) {
        tl.fromTo(validItems,
          { opacity: 0, y: 24 },
          { opacity: 1, y: 0, duration: 0.4, stagger: 0.05, force3D: true },
          0.15
        );
      }

      const validLines = linesRef.current.filter(Boolean);
      if (validLines.length) {
        tl.fromTo(validLines,
          { scaleX: 0, transformOrigin: 'right center' },
          { scaleX: 1, duration: 0.35, stagger: 0.04, force3D: true },
          0.2
        );
      }

      const bottomInfo = overlayRef.current.querySelector('.menu-bottom-info');
      if (bottomInfo) {
        tl.fromTo(bottomInfo,
          { opacity: 0 },
          { opacity: 1, duration: 0.3 },
          0.35
        );
      }
    } else {
      // Desktop: full clip-path circle reveal
      tl.fromTo(overlayRef.current,
        { clipPath: 'circle(0% at calc(100% - 40px) 40px)', opacity: 1 },
        { clipPath: 'circle(150% at calc(100% - 40px) 40px)', duration: 0.8, ease: 'power3.inOut' }
      );

      const topLine = overlayRef.current.querySelector('.menu-accent-line');
      if (topLine) {
        tl.fromTo(topLine,
          { scaleX: 0, transformOrigin: 'left center' },
          { scaleX: 1, duration: 0.6, ease: 'power2.inOut' },
          0.3
        );
      }

      const verticalText = overlayRef.current.querySelector('.menu-vertical-text');
      if (verticalText) {
        tl.fromTo(verticalText,
          { opacity: 0, y: 30 },
          { opacity: 0.08, y: 0, duration: 0.8 },
          0.4
        );
      }

      const validItems = itemsRef.current.filter(Boolean);
      if (validItems.length) {
        tl.fromTo(validItems,
          { opacity: 0, x: 60, skewX: -3 },
          { opacity: 1, x: 0, skewX: 0, duration: 0.6, stagger: 0.06 },
          0.35
        );
      }

      const validLines = linesRef.current.filter(Boolean);
      if (validLines.length) {
        tl.fromTo(validLines,
          { scaleX: 0, transformOrigin: 'right center' },
          { scaleX: 1, duration: 0.5, stagger: 0.06 },
          0.4
        );
      }

      const bottomInfo = overlayRef.current.querySelector('.menu-bottom-info');
      if (bottomInfo) {
        tl.fromTo(bottomInfo,
          { opacity: 0, y: 10 },
          { opacity: 1, y: 0, duration: 0.5 },
          0.6
        );
      }
    }

    return () => {
      tl.kill();
    };
  }, [isOpen, isMobile]);

  const handleItemClick = useCallback((item) => {
    // Exit animation then navigate
    if (tlRef.current) tlRef.current.kill();

    const tl = gsap.timeline({
      defaults: { ease: 'power2.in' },
      onComplete: () => {
        onSelect(item);
        onClose();
      },
    });

    const validItems = itemsRef.current.filter(Boolean);

    if (isMobile) {
      // Mobile: simple fast fade-out
      if (validItems.length) {
        tl.to(validItems, {
          opacity: 0, y: -16, duration: 0.2, stagger: 0.02, force3D: true,
        });
      }
      if (overlayRef.current) {
        tl.to(overlayRef.current, { opacity: 0, duration: 0.25 }, 0.1);
      }
    } else {
      // Desktop: slide + clip-path collapse
      if (validItems.length) {
        tl.to(validItems, {
          opacity: 0, x: -30, duration: 0.25, stagger: 0.02,
        });
      }
      if (overlayRef.current) {
        tl.to(overlayRef.current, {
          clipPath: 'circle(0% at calc(100% - 40px) 40px)',
          duration: 0.5,
          ease: 'power3.inOut',
        }, 0.15);
      }
    }
  }, [onSelect, onClose, isMobile]);

  if (!isOpen) return null;

  return (
    <div
      ref={overlayRef}
      role="dialog"
      aria-modal="true"
      aria-label="メニュー"
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: zIndex.overlay,
        background: menuBg,
        // backdrop-filter only on desktop; too expensive on mobile
        ...(isMobile ? {} : {
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
        }),
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        // Mobile uses opacity animation; desktop uses clip-path
        ...(isMobile
          ? { opacity: 0 }
          : { clipPath: 'circle(0% at calc(100% - 40px) 40px)' }
        ),
      }}
    >
      {/* Top accent line */}
      <div
        className="menu-accent-line"
        style={{
          position: 'absolute',
          top: '80px',
          left: '40px',
          right: '40px',
          height: '1px',
          background: `linear-gradient(to right, ${colors.gold}, ${colors.gold}40, transparent)`,
          transformOrigin: 'left center',
        }}
      />

      {/* Decorative vertical text */}
      <div
        className="menu-vertical-text"
        style={{
          position: 'absolute',
          left: '28px',
          top: '50%',
          transform: 'translateY(-50%)',
          writingMode: 'vertical-rl',
          fontFamily: typography.fontFamily.japanese,
          fontSize: '16px',
          letterSpacing: '0.6em',
          color: colors.text.primary,
          opacity: 0,
          userSelect: 'none',
          pointerEvents: 'none',
        }}
      >
        ナビゲーション
      </div>

      {/* Navigation items */}
      <nav
        ref={contentRef}
        onClick={(e) => e.stopPropagation()}
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-end',
          width: '100%',
          maxWidth: '500px',
          paddingRight: '40px',
          paddingLeft: '80px',
        }}
      >
        {items.map((item, index) => {
          const isActive = item.id === activeId;
          const accentColor = item.color || colors.gold;

          return (
            <div
              key={item.id}
              style={{ width: '100%' }}
            >
              {/* Separator line */}
              {index > 0 && (
                <div
                  ref={(el) => (linesRef.current[index - 1] = el)}
                  style={{
                    height: '1px',
                    background: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)',
                    marginLeft: 'auto',
                    width: '100%',
                  }}
                />
              )}
              <button
                ref={(el) => (itemsRef.current[index] = el)}
                onClick={() => handleItemClick(item)}
                style={{
                  width: '100%',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '18px 0',
                  textAlign: 'right',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px',
                  opacity: 0,
                  position: 'relative',
                  transition: 'transform 0.3s ease',
                }}
                onMouseEnter={(e) => {
                  gsap.to(e.currentTarget, { x: -8, duration: 0.3, ease: 'power2.out' });
                  const title = e.currentTarget.querySelector('.item-title');
                  if (title) title.style.color = accentColor;
                  const accent = e.currentTarget.querySelector('.item-accent');
                  if (accent) gsap.to(accent, { scaleX: 1, opacity: 1, duration: 0.3 });
                }}
                onMouseLeave={(e) => {
                  gsap.to(e.currentTarget, { x: 0, duration: 0.3, ease: 'power2.out' });
                  const title = e.currentTarget.querySelector('.item-title');
                  if (title) title.style.color = isActive ? accentColor : colors.text.primary;
                  const accent = e.currentTarget.querySelector('.item-accent');
                  if (accent && !isActive) gsap.to(accent, { scaleX: 0, opacity: 0, duration: 0.3 });
                }}
              >
                {/* Number index */}
                <span style={{
                  fontFamily: typography.fontFamily.mono,
                  fontSize: '10px',
                  color: accentColor,
                  opacity: isActive ? 1 : 0.6,
                  letterSpacing: '0.1em',
                  minWidth: '22px',
                  textAlign: 'right',
                  transition: 'opacity 0.3s ease',
                }}>
                  {String(index + 1).padStart(2, '0')}
                </span>

                {/* Title block */}
                <div style={{ flex: 1, textAlign: 'right' }}>
                  <span
                    className="item-title"
                    style={{
                      display: 'block',
                      fontFamily: typography.fontFamily.display,
                      fontSize: '28px',
                      fontWeight: 300,
                      letterSpacing: '0.06em',
                      color: isActive ? accentColor : colors.text.primary,
                      transition: 'color 0.3s ease',
                      lineHeight: 1.1,
                    }}
                  >
                    {item.label || item.shortTitle}
                  </span>
                  <span style={{
                    display: 'block',
                    fontFamily: typography.fontFamily.japanese,
                    fontSize: '10px',
                    color: isActive ? accentColor : colors.text.tertiary,
                    opacity: isActive ? 0.7 : 1,
                    marginTop: '4px',
                    letterSpacing: '0.2em',
                    transition: 'color 0.3s ease',
                  }}>
                    {item.labelJa || (item.titleJa && item.titleJa.split('｜')[0])}
                  </span>
                </div>

                {/* Arrow / external indicator */}
                <span style={{
                  color: accentColor,
                  opacity: isActive ? 1 : 0.5,
                  fontSize: '14px',
                  transition: 'opacity 0.3s ease',
                  minWidth: '16px',
                  textAlign: 'center',
                }}>
                  {item.isExternal ? '↗' : '→'}
                </span>

                {/* Hover accent line */}
                <div
                  className="item-accent"
                  style={{
                    position: 'absolute',
                    bottom: 0,
                    right: 0,
                    width: '100%',
                    height: '2px',
                    background: `linear-gradient(to left, ${accentColor}, transparent)`,
                    transformOrigin: 'right center',
                    transform: isActive ? 'scaleX(1)' : 'scaleX(0)',
                    opacity: isActive ? 0.6 : 0,
                  }}
                />
              </button>
            </div>
          );
        })}
      </nav>

      {/* Bottom info */}
      <div
        className="menu-bottom-info"
        style={{
          position: 'absolute',
          bottom: '36px',
          left: '40px',
          right: '40px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          opacity: 0,
          pointerEvents: 'none',
        }}
      >
        <p style={{
          fontFamily: typography.fontFamily.mono,
          fontSize: '10px',
          color: colors.text.muted,
          letterSpacing: '0.1em',
        }}>
          {company.tel}
        </p>
        <p style={{
          fontFamily: typography.fontFamily.mono,
          fontSize: '9px',
          color: colors.text.muted,
          letterSpacing: '0.08em',
        }}>
          TAP ANYWHERE TO CLOSE
        </p>
      </div>
    </div>
  );
}
