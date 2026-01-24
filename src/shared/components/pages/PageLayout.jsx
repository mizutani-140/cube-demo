/**
 * Page Layout - Editorial Design System
 * 全ページ共通のレイアウト（Header, Footer, Navigation）
 *
 * Aesthetic: Japanese spatial harmony meets editorial precision
 * 「間」- The beauty of intentional space
 */

import React, { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { useBreakpoints } from '../../hooks/useBreakpoints';
import { colors, typography, animation, globalStyles } from '../../tokens';
import { brand, company, navigation } from '../../data/corporate';

// ============================================
// Header Component - Editorial Style
// ============================================

export function PageHeader({ currentPage, onNavigate, variant = 'default' }) {
  const { isMobile, isTablet } = useBreakpoints();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const headerRef = useRef();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    gsap.fromTo(headerRef.current,
      { opacity: 0, y: -20 },
      { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }
    );
  }, []);

  const isTransparent = variant === 'transparent' && !scrolled;

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
          zIndex: 1000,
          background: isTransparent
            ? 'transparent'
            : scrolled
              ? 'rgba(6, 6, 10, 0.95)'
              : 'transparent',
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


        {/* Right side - Menu */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          {/* Mobile/Tablet Menu Button */}
          {(isMobile || isTablet) && (
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: '8px',
                display: 'flex',
                flexDirection: 'column',
                gap: '6px',
                alignItems: 'flex-end',
              }}
            >
              <span
                style={{
                  display: 'block',
                  width: menuOpen ? '24px' : '24px',
                  height: '1px',
                  background: colors.gold,
                  transition: 'all 0.3s ease',
                  transform: menuOpen ? 'rotate(45deg) translateY(5px)' : 'none',
                }}
              />
              <span
                style={{
                  display: 'block',
                  width: menuOpen ? '0' : '16px',
                  height: '1px',
                  background: colors.gold,
                  transition: 'all 0.3s ease',
                  opacity: menuOpen ? 0 : 1,
                }}
              />
              <span
                style={{
                  display: 'block',
                  width: '24px',
                  height: '1px',
                  background: colors.gold,
                  transition: 'all 0.3s ease',
                  transform: menuOpen ? 'rotate(-45deg) translateY(-5px)' : 'none',
                }}
              />
            </button>
          )}
        </div>
      </header>

      {/* Mobile/Tablet Menu */}
      {(isMobile || isTablet) && menuOpen && (
        <MobileMenu
          currentPage={currentPage}
          onNavigate={(page) => {
            onNavigate(page);
            setMenuOpen(false);
          }}
          onClose={() => setMenuOpen(false)}
        />
      )}
    </>
  );
}

function MobileMenu({ currentPage, onNavigate, onClose }) {
  const menuRef = useRef();

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(menuRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.4, ease: 'power2.out' }
      );

      gsap.fromTo('.menu-item',
        { opacity: 0, x: 40 },
        { opacity: 1, x: 0, duration: 0.5, stagger: 0.06, delay: 0.1, ease: 'power2.out' }
      );

      gsap.fromTo('.menu-vertical',
        { opacity: 0 },
        { opacity: 0.1, duration: 0.8, delay: 0.3, ease: 'power2.out' }
      );
    }, menuRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={menuRef}
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(6, 6, 10, 0.98)',
        backdropFilter: 'blur(20px)',
        zIndex: 999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {/* Vertical decorative text */}
      <div
        className="menu-vertical"
        style={{
          position: 'absolute',
          left: '40px',
          top: '50%',
          transform: 'translateY(-50%)',
          writingMode: 'vertical-rl',
          fontFamily: typography.fontFamily.japanese,
          fontSize: '14px',
          letterSpacing: '0.5em',
          color: colors.text.primary,
          opacity: 0.1,
        }}
      >
        メニュー
      </div>

      {/* Navigation items */}
      <nav
        onClick={(e) => e.stopPropagation()}
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-end',
          gap: '8px',
          paddingRight: '40px',
        }}
      >
        {navigation.filter(item => item.id !== 'news').map((item, index) => (
          <button
            key={item.id}
            className="menu-item"
            onClick={() => onNavigate(item.id)}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '16px 0',
              textAlign: 'right',
              display: 'flex',
              alignItems: 'center',
              gap: '20px',
            }}
          >
            <span
              style={{
                fontFamily: typography.fontFamily.mono,
                fontSize: '10px',
                color: colors.text.tertiary,
                letterSpacing: '0.1em',
              }}
            >
              {String(index + 1).padStart(2, '0')}
            </span>
            <div>
              <span
                style={{
                  display: 'block',
                  fontFamily: typography.fontFamily.display,
                  fontSize: '32px',
                  fontWeight: 300,
                  letterSpacing: '0.05em',
                  color: currentPage === item.id ? colors.gold : colors.text.primary,
                  transition: 'color 0.3s ease',
                }}
              >
                {item.label}
              </span>
              <span
                style={{
                  display: 'block',
                  fontFamily: typography.fontFamily.japanese,
                  fontSize: '11px',
                  color: colors.text.tertiary,
                  marginTop: '4px',
                  letterSpacing: '0.15em',
                }}
              >
                {item.labelJa}
              </span>
            </div>
          </button>
        ))}
      </nav>

      {/* Bottom info */}
      <div
        style={{
          position: 'absolute',
          bottom: '40px',
          left: '40px',
          right: '40px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
        }}
      >
        <p
          style={{
            fontFamily: typography.fontFamily.mono,
            fontSize: '10px',
            color: colors.text.muted,
            letterSpacing: '0.1em',
          }}
        >
          {company.tel}
        </p>
        <p
          style={{
            fontFamily: typography.fontFamily.mono,
            fontSize: '9px',
            color: colors.text.muted,
            letterSpacing: '0.05em',
          }}
        >
          TAP ANYWHERE TO CLOSE
        </p>
      </div>
    </div>
  );
}

// ============================================
// Footer Component - Editorial Style
// ============================================

export function PageFooter({ onNavigate }) {
  const { isMobile, isTablet } = useBreakpoints();
  const footerRef = useRef();
  const [hoveredItem, setHoveredItem] = useState(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.footer-content',
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: footerRef.current,
            start: 'top 90%',
          },
        }
      );
    }, footerRef);
    return () => ctx.revert();
  }, []);

  return (
    <footer
      ref={footerRef}
      style={{
        padding: isMobile ? '80px 24px 40px' : '120px 80px 60px',
        background: colors.bg.secondary,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Large decorative text */}
      <div
        style={{
          position: 'absolute',
          right: isMobile ? '-20%' : '5%',
          bottom: isMobile ? '10%' : '20%',
          fontFamily: typography.fontFamily.display,
          fontSize: isMobile ? '30vw' : '20vw',
          fontWeight: 200,
          color: colors.text.primary,
          opacity: 0.02,
          lineHeight: 0.8,
          pointerEvents: 'none',
        }}
      >
        CUBE
      </div>

      {/* Main content */}
      <div
        className="footer-content"
        style={{
          position: 'relative',
          zIndex: 1,
          maxWidth: '1400px',
          margin: '0 auto',
        }}
      >
        {/* Top section */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : isTablet ? '1fr 1fr' : '1.5fr 1fr 1fr 1fr',
            gap: isMobile ? '48px' : '60px',
            paddingBottom: '60px',
            borderBottom: `1px solid ${colors.ui.border}`,
          }}
        >
          {/* Brand column */}
          <div>
            <div style={{ marginBottom: '32px' }}>
              <h3
                style={{
                  fontFamily: typography.fontFamily.display,
                  fontSize: '28px',
                  fontWeight: 400,
                  color: colors.text.primary,
                  letterSpacing: '0.1em',
                  margin: '0 0 8px 0',
                }}
              >
                CUBE
              </h3>
              <p
                style={{
                  fontFamily: typography.fontFamily.japanese,
                  fontSize: '11px',
                  color: colors.text.tertiary,
                  letterSpacing: '0.15em',
                }}
              >
                株式会社CUBE
              </p>
            </div>
            <p
              style={{
                fontFamily: typography.fontFamily.japanese,
                fontSize: '14px',
                color: colors.text.secondary,
                lineHeight: 2,
                maxWidth: '280px',
              }}
            >
              暮らしと、食と、空間と。
              <br />
              すべてを繋ぐ、多面的な創造集団。
            </p>
          </div>

          {/* Navigation column */}
          <div>
            <h4
              style={{
                fontFamily: typography.fontFamily.mono,
                fontSize: '10px',
                letterSpacing: '0.2em',
                color: colors.gold,
                marginBottom: '24px',
              }}
            >
              NAVIGATE
            </h4>
            <nav style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {navigation.filter(item => item.id !== 'news').map((item) => (
                <button
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  onMouseEnter={() => setHoveredItem(item.id)}
                  onMouseLeave={() => setHoveredItem(null)}
                  style={{
                    background: 'none',
                    border: 'none',
                    textAlign: 'left',
                    cursor: 'pointer',
                    padding: 0,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                  }}
                >
                  <span
                    style={{
                      width: hoveredItem === item.id ? '24px' : '0',
                      height: '1px',
                      background: colors.gold,
                      transition: 'width 0.3s ease',
                    }}
                  />
                  <span
                    style={{
                      fontFamily: typography.fontFamily.nav,
                      fontSize: '13px',
                      color: hoveredItem === item.id ? colors.text.primary : colors.text.tertiary,
                      transition: 'color 0.3s ease',
                    }}
                  >
                    {item.label}
                  </span>
                </button>
              ))}
            </nav>
          </div>

          {/* Services column */}
          <div>
            <h4
              style={{
                fontFamily: typography.fontFamily.mono,
                fontSize: '10px',
                letterSpacing: '0.2em',
                color: colors.gold,
                marginBottom: '24px',
              }}
            >
              SERVICES
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {['Interior Design', 'Restaurant', 'Food Truck', 'Gallery'].map((service) => (
                <li
                  key={service}
                  style={{
                    fontFamily: typography.fontFamily.body,
                    fontSize: '12px',
                    color: colors.text.tertiary,
                    marginBottom: '12px',
                    letterSpacing: '0.02em',
                  }}
                >
                  {service}
                </li>
              ))}
            </ul>
          </div>

          {/* Contact column */}
          <div>
            <h4
              style={{
                fontFamily: typography.fontFamily.mono,
                fontSize: '10px',
                letterSpacing: '0.2em',
                color: colors.gold,
                marginBottom: '24px',
              }}
            >
              CONTACT
            </h4>
            <div style={{ marginBottom: '24px' }}>
              <p
                style={{
                  fontFamily: typography.fontFamily.display,
                  fontSize: '18px',
                  color: colors.text.primary,
                  letterSpacing: '0.05em',
                  marginBottom: '8px',
                }}
              >
                {company.tel}
              </p>
              <p
                style={{
                  fontFamily: typography.fontFamily.body,
                  fontSize: '11px',
                  color: colors.text.tertiary,
                }}
              >
                平日 10:00 - 18:00
              </p>
            </div>
            <p
              style={{
                fontFamily: typography.fontFamily.body,
                fontSize: '12px',
                color: colors.text.tertiary,
                lineHeight: 1.8,
              }}
            >
              {company.headquarters.address}
            </p>
          </div>
        </div>

        {/* Bottom section */}
        <div
          style={{
            display: 'flex',
            flexDirection: isMobile ? 'column' : 'row',
            justifyContent: 'space-between',
            alignItems: isMobile ? 'flex-start' : 'center',
            gap: '20px',
            paddingTop: '40px',
          }}
        >
          {/* Tagline */}
          <p
            style={{
              fontFamily: typography.fontFamily.japanese,
              fontSize: '12px',
              color: colors.text.muted,
              letterSpacing: '0.1em',
            }}
          >
            "{brand.tagline}"
          </p>

          {/* Copyright */}
          <p
            style={{
              fontFamily: typography.fontFamily.mono,
              fontSize: '10px',
              color: colors.text.muted,
              letterSpacing: '0.05em',
            }}
          >
            © 2013-2026 株式会社CUBE. All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

// ============================================
// Side Navigation Component (Right Side)
// ============================================

function SideNavigation({ currentPage, onNavigate }) {
  const { isMobile, isTablet } = useBreakpoints();
  const [hoveredId, setHoveredId] = useState(null);

  if (isMobile || isTablet) return null;

  // Define colors for each nav item
  const navColors = {
    works: '#C7B99A',       // ペールゴールド
    about: '#8A9BAD',       // ライトスチール
    access: '#5BA4C9',      // スカイブルー
    contact: '#C8CDD5',     // ライトグレー
    lambchan: '#e74c3c',    // レッド
    lifenostalgia: '#5FAD8B', // セージグリーン
  };

  return (
    <nav
      aria-label="Page navigation"
      style={{
        position: 'fixed',
        right: '50px',
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
              gap: '10px',
              marginBottom: '12px',
              padding: '6px 10px',
              opacity: isActive || isHovered ? 1 : 0.45,
              transition: 'opacity 0.3s ease, background 0.3s ease',
              cursor: 'pointer',
              background: isActive || isHovered ? 'rgba(255,255,255,0.04)' : 'transparent',
              borderRadius: '4px',
              border: 'none',
              width: '100%',
              textAlign: 'left',
            }}
            onMouseEnter={() => setHoveredId(item.id)}
            onMouseLeave={() => setHoveredId(null)}
            onFocus={() => setHoveredId(item.id)}
            onBlur={() => setHoveredId(null)}
          >
            <span style={{
              width: '20px',
              textAlign: 'right',
              color: 'rgba(255,255,255,0.25)',
              fontSize: '9px',
              fontFamily: typography.fontFamily.mono,
            }}>
              {String(i + 1).padStart(2, '0')}
            </span>
            <span style={{
              width: isActive || isHovered ? '28px' : '14px',
              height: '1px',
              background: itemColor,
              transition: 'width 0.3s ease',
            }} />
            <span style={{
              color: isActive ? itemColor : (isHovered ? '#fff' : 'rgba(255,255,255,0.65)'),
              fontSize: '10px',
              letterSpacing: '1.5px',
              fontFamily: typography.fontFamily.nav,
              transition: 'color 0.3s ease',
            }}>
              {item.label}
            </span>
          </button>
        );
      })}

      {/* Back to cube link */}
      <button
        onClick={() => onNavigate('cube')}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          marginTop: '20px',
          padding: '6px 10px',
          opacity: hoveredId === 'cube' ? 1 : 0.35,
          transition: 'opacity 0.3s ease',
          cursor: 'pointer',
          background: 'transparent',
          borderRadius: '4px',
          border: 'none',
          width: '100%',
          textAlign: 'left',
        }}
        onMouseEnter={() => setHoveredId('cube')}
        onMouseLeave={() => setHoveredId(null)}
        onFocus={() => setHoveredId('cube')}
        onBlur={() => setHoveredId(null)}
      >
        <span style={{
          width: '20px',
          textAlign: 'right',
          color: colors.gold,
          fontSize: '12px',
        }}>
          ←
        </span>
        <span style={{
          color: colors.gold,
          fontSize: '10px',
          letterSpacing: '1.5px',
          fontFamily: typography.fontFamily.mono,
        }}>
          BACK TO CUBE
        </span>
      </button>
    </nav>
  );
}

// ============================================
// Page Layout Wrapper
// ============================================

export function PageLayout({ children, currentPage, onNavigate, headerVariant = 'default' }) {
  return (
    <div
      style={{
        minHeight: '100vh',
        background: colors.bg.primary,
        fontFamily: typography.fontFamily.body,
      }}
    >
      <PageHeader
        currentPage={currentPage}
        onNavigate={onNavigate}
        variant={headerVariant}
      />
      <main style={{ paddingTop: '80px' }}>
        {children}
      </main>
      <PageFooter onNavigate={onNavigate} />

      {/* Side Navigation for Desktop */}
      <SideNavigation
        currentPage={currentPage}
        onNavigate={onNavigate}
      />

      <style>{globalStyles}</style>
    </div>
  );
}

// ============================================
// Page Hero Section - Editorial Style
// ============================================

export function PageHero({ title, titleJa, subtitle, backgroundAccent = colors.gold }) {
  const { isMobile, isTablet } = useBreakpoints();
  const heroRef = useRef();

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.hero-label',
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }
      );
      gsap.fromTo('.hero-title',
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 0.8, delay: 0.1, ease: 'power2.out' }
      );
      gsap.fromTo('.hero-subtitle',
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8, delay: 0.2, ease: 'power2.out' }
      );
      gsap.fromTo('.hero-line',
        { scaleX: 0 },
        { scaleX: 1, duration: 0.8, delay: 0.4, ease: 'power2.out' }
      );
    }, heroRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={heroRef}
      style={{
        padding: isMobile ? '60px 24px 50px' : '100px 80px 80px',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Subtle gradient background */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: `radial-gradient(ellipse at 30% 0%, ${backgroundAccent}08 0%, transparent 60%)`,
          pointerEvents: 'none',
        }}
      />

      {/* Large decorative letter */}
      <div
        style={{
          position: 'absolute',
          right: isMobile ? '-15%' : '10%',
          top: '50%',
          transform: 'translateY(-50%)',
          fontFamily: typography.fontFamily.display,
          fontSize: isMobile ? '40vw' : '25vw',
          fontWeight: 200,
          color: colors.text.primary,
          opacity: 0.02,
          lineHeight: 0.8,
          pointerEvents: 'none',
        }}
      >
        {title?.charAt(0) || 'C'}
      </div>

      {/* Content */}
      <div style={{ position: 'relative', maxWidth: '800px' }}>
        {/* Label */}
        {titleJa && (
          <p
            className="hero-label"
            style={{
              fontFamily: typography.fontFamily.mono,
              fontSize: '10px',
              letterSpacing: '0.2em',
              color: backgroundAccent,
              marginBottom: '20px',
              textTransform: 'uppercase',
            }}
          >
            {title}
          </p>
        )}

        {/* Japanese Title */}
        <h1
          className="hero-title"
          style={{
            fontFamily: typography.fontFamily.japanese,
            fontSize: isMobile ? '28px' : isTablet ? '36px' : '44px',
            fontWeight: 400,
            color: colors.text.primary,
            letterSpacing: '0.05em',
            lineHeight: 1.3,
            margin: '0 0 24px 0',
          }}
        >
          {titleJa || title}
        </h1>

        {/* Subtitle */}
        {subtitle && (
          <p
            className="hero-subtitle"
            style={{
              fontFamily: typography.fontFamily.body,
              fontSize: isMobile ? '13px' : '15px',
              color: colors.text.secondary,
              lineHeight: 2,
              maxWidth: '500px',
            }}
          >
            {subtitle}
          </p>
        )}

        {/* Decorative line */}
        <div
          className="hero-line"
          style={{
            width: '60px',
            height: '1px',
            background: backgroundAccent,
            marginTop: '40px',
            transformOrigin: 'left',
          }}
        />
      </div>
    </section>
  );
}

// ============================================
// Section Component
// ============================================

export function Section({ children, background = 'transparent', padding = 'default' }) {
  const { isMobile } = useBreakpoints();

  const paddingMap = {
    default: isMobile ? '60px 24px' : '100px 80px',
    small: isMobile ? '40px 24px' : '60px 80px',
    large: isMobile ? '80px 24px' : '140px 80px',
  };

  return (
    <section
      style={{
        padding: paddingMap[padding] || paddingMap.default,
        background,
      }}
    >
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        {children}
      </div>
    </section>
  );
}

// ============================================
// Section Title - Editorial Style
// ============================================

export function SectionTitle({ title, titleJa, subtitle, align = 'left', accent = colors.gold }) {
  const { isMobile, isTablet } = useBreakpoints();
  const titleRef = useRef();

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(titleRef.current,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: titleRef.current,
            start: 'top 85%',
          },
        }
      );
    }, titleRef);
    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={titleRef}
      style={{
        textAlign: align,
        marginBottom: isMobile ? '48px' : '72px',
      }}
    >
      {titleJa && (
        <p
          style={{
            fontFamily: typography.fontFamily.mono,
            fontSize: '10px',
            letterSpacing: '0.2em',
            color: accent,
            marginBottom: '16px',
            textTransform: 'uppercase',
          }}
        >
          {titleJa}
        </p>
      )}
      <h2
        style={{
          fontFamily: typography.fontFamily.display,
          fontSize: isMobile ? '28px' : isTablet ? '36px' : '44px',
          fontWeight: 300,
          color: colors.text.primary,
          letterSpacing: '-0.02em',
          lineHeight: 1.1,
          margin: '0 0 20px 0',
        }}
      >
        {title}
      </h2>
      {subtitle && (
        <p
          style={{
            fontFamily: typography.fontFamily.body,
            fontSize: '14px',
            color: colors.text.secondary,
            lineHeight: 1.8,
            maxWidth: align === 'center' ? '520px' : '600px',
            margin: align === 'center' ? '0 auto' : 0,
          }}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}

// Default export
export default PageLayout;
