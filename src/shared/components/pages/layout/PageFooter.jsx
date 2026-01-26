/**
 * PageFooter - Editorial Design System
 * Footer component with navigation, services, and contact info
 */

import React, { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useBreakpoints } from '../../../hooks/useBreakpoints';
import { typography } from '../../../tokens';
import { brand, company } from '../../../data/corporate';
import { navigation } from '../../../data/navigation';
import { useTheme } from '../../../contexts';

gsap.registerPlugin(ScrollTrigger);

export function PageFooter({ onNavigate }) {
  const { isMobile, isTablet } = useBreakpoints();
  const { colors, isDark } = useTheme();
  const footerRef = useRef();
  const [hoveredItem, setHoveredItem] = useState(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Stagger each footer column for depth
      gsap.fromTo('.footer-column',
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          stagger: 0.1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: footerRef.current,
            start: 'top 85%',
          },
        }
      );

      // Bottom bar fades in after columns
      gsap.fromTo('.footer-bottom',
        { opacity: 0 },
        {
          opacity: 1,
          duration: 0.6,
          delay: 0.4,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: footerRef.current,
            start: 'top 85%',
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
        transition: 'background 0.4s ease',
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
          color: colors.gold,
          opacity: 0.15,
          lineHeight: 0.8,
          pointerEvents: 'none',
        }}
        aria-hidden="true"
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
          <div className="footer-column">
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
          <div className="footer-column">
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
          <div className="footer-column">
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
          <div className="footer-column">
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
          className="footer-bottom"
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
            &copy; 2013-2026 株式会社CUBE. All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
