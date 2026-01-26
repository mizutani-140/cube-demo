/**
 * PageHeader - Editorial Design System
 * Header component with logo, theme toggle, and mobile menu
 */

import React, { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { useBreakpoints } from '../../../hooks/useBreakpoints';
import { typography, zIndex } from '../../../tokens';
import { navigation } from '../../../data/navigation';
import { useTheme } from '../../../contexts';
import { HamburgerButton, MobileMenuOverlay } from '../../MobileMenu';
import { ThemeToggleButton } from '../../ThemeToggleButton';

export function PageHeader({ currentPage, onNavigate, variant = 'default' }) {
  const { isMobile, isTablet } = useBreakpoints();
  const { colors, isDark, mode, cycleTheme } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const headerRef = useRef();
  const hasAnimatedRef = useRef(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (!hasAnimatedRef.current) {
      gsap.fromTo(headerRef.current,
        { opacity: 0, y: -20 },
        { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }
      );
      hasAnimatedRef.current = true;
    }
  }, []);

  const isTransparent = variant === 'transparent' && !scrolled;

  // Theme-aware header background
  const headerBg = isDark
    ? (scrolled ? 'rgba(6, 6, 10, 0.95)' : 'transparent')
    : (scrolled ? 'rgba(245, 242, 235, 0.95)' : 'transparent');

  // Menu button background
  const menuBtnBg = isDark ? 'rgba(0, 0, 0, 0.4)' : 'rgba(255, 255, 255, 0.6)';
  const menuBtnBorder = isDark ? 'rgba(255,255,255,0.2)' : 'rgba(26, 24, 20, 0.15)';

  return (
    <>
      <header
        ref={headerRef}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          padding: isMobile ? '16px 20px' : '20px 60px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          zIndex: zIndex.header,
          background: isTransparent ? 'transparent' : headerBg,
          backdropFilter: scrolled ? 'blur(16px)' : 'none',
          transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        {/* Logo */}
        <button
          onClick={() => onNavigate('cube')}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: 0,
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <div
            style={{
              width: '32px',
              height: '32px',
              border: `1px solid ${colors.gold}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
            }}
          >
            <span
              style={{
                fontFamily: typography.fontFamily.display,
                fontSize: '15px',
                fontWeight: 400,
                color: colors.gold,
                letterSpacing: '-0.02em',
              }}
            >
              C
            </span>
            {/* Corner accent */}
            <div
              style={{
                position: 'absolute',
                top: '-3px',
                right: '-3px',
                width: '5px',
                height: '5px',
                background: colors.gold,
              }}
            />
          </div>
          <div style={{ textAlign: 'left' }}>
            <h1
              style={{
                fontFamily: typography.fontFamily.display,
                color: colors.text.primary,
                fontSize: isMobile ? '15px' : '17px',
                letterSpacing: '0.02em',
                fontWeight: 400,
                margin: 0,
              }}
            >
              CUBE Inc.
            </h1>
            {!isMobile && (
              <p
                style={{
                  fontFamily: typography.fontFamily.japanese,
                  color: colors.text.tertiary,
                  fontSize: '9px',
                  letterSpacing: '0.05em',
                  marginTop: '1px',
                }}
              >
                株式会社CUBE
              </p>
            )}
          </div>
        </button>


        {/* Right side - Theme toggle and Menu */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <ThemeToggleButton size={16} />

          {/* Mobile/Tablet Menu Button */}
          {(isMobile || isTablet) && (
            <HamburgerButton
              isOpen={menuOpen}
              onClick={() => setMenuOpen(!menuOpen)}
              isMobile={isMobile}
              style={{ zIndex: zIndex.overlay + 10 }}
            />
          )}
        </div>
      </header>

      {/* Mobile/Tablet Menu */}
      {(isMobile || isTablet) && (
        <MobileMenuOverlay
          isOpen={menuOpen}
          items={navigation.filter(item => item.id !== 'news')}
          activeId={currentPage}
          onSelect={(item) => {
            onNavigate(item.id);
          }}
          onClose={() => setMenuOpen(false)}
        />
      )}
    </>
  );
}
