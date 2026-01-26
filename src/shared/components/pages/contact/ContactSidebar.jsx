/**
 * ContactSidebar - Contact Sidebar Info
 * Extracted from ContactPage.jsx
 */

import React, { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { useBreakpoints } from '../../../hooks/useBreakpoints';
import { typography } from '../../../tokens';
import { company, contactCategories } from '../../../data/corporate';
import { useTheme } from '../../../contexts';
import { useMagneticButton } from '../../../animations';

export function ContactSidebar({ onNavigate }) {
  const { colors } = useTheme();
  const { isMobile } = useBreakpoints();
  const sidebarRef = useRef();
  const { ref: accessMapRef } = useMagneticButton({ strength: 0.35, radius: 80 });

  useEffect(() => {
    gsap.fromTo(sidebarRef.current?.children || [],
      { opacity: 0, x: -30 },
      { opacity: 1, x: 0, duration: 0.6, stagger: 0.1, ease: 'power2.out' }
    );
  }, []);

  return (
    <div ref={sidebarRef}>
      {/* Categories */}
      <div style={{ marginBottom: '60px' }}>
        <h3
          style={{
            fontFamily: typography.fontFamily.mono,
            fontSize: '10px',
            letterSpacing: '0.2em',
            color: colors.gold,
            marginBottom: '32px',
          }}
        >
          WHAT WE DO
        </h3>
        {contactCategories.map((cat, i) => (
          <div key={i} style={{ marginBottom: '32px' }}>
            <h4
              style={{
                fontFamily: typography.fontFamily.japanese,
                fontSize: '14px',
                color: colors.text.primary,
                marginBottom: '16px',
                letterSpacing: '0.05em',
              }}
            >
              {cat.title}
            </h4>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {cat.items.map((item, j) => (
                <span
                  key={j}
                  style={{
                    fontFamily: typography.fontFamily.body,
                    fontSize: '11px',
                    color: colors.text.tertiary,
                    padding: '6px 14px',
                    border: `1px solid ${colors.ui.border}`,
                    borderRadius: '2px',
                  }}
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Contact Info Card */}
      <div
        style={{
          position: 'relative',
          padding: '40px',
          background: colors.bg.secondary,
          border: `1px solid ${colors.ui.border}`,
        }}
      >
        {/* Decorative corner */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            right: 0,
            width: '60px',
            height: '60px',
            borderRight: `1px solid ${colors.gold}`,
            borderTop: `1px solid ${colors.gold}`,
          }}
        />

        <p
          style={{
            fontFamily: typography.fontFamily.mono,
            fontSize: '10px',
            letterSpacing: '0.2em',
            color: colors.text.tertiary,
            marginBottom: '16px',
          }}
        >
          PHONE
        </p>
        <p
          style={{
            fontFamily: typography.fontFamily.display,
            fontSize: '24px',
            color: colors.text.primary,
            letterSpacing: '0.05em',
            marginBottom: '24px',
          }}
        >
          {company.tel}
        </p>
        <p
          style={{
            fontFamily: typography.fontFamily.body,
            fontSize: '12px',
            color: colors.text.tertiary,
            lineHeight: 1.8,
            marginBottom: '32px',
          }}
        >
          平日 10:00 - 18:00
          <br />
          ※土日祝・年末年始を除く
        </p>

        <button
          ref={accessMapRef}
          onClick={() => onNavigate('access')}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '12px',
            background: 'transparent',
            border: 'none',
            color: colors.gold,
            fontFamily: typography.fontFamily.mono,
            fontSize: '11px',
            letterSpacing: '0.15em',
            cursor: 'pointer',
            padding: 0,
          }}
        >
          <span>ACCESS MAP</span>
          <span style={{ fontSize: '14px' }}>→</span>
        </button>
      </div>
    </div>
  );
}
