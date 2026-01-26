/**
 * CtaSection - Bottom CTA Section
 * Extracted from ContactPage.jsx
 */

import React from 'react';
import { useBreakpoints } from '../../../hooks/useBreakpoints';
import { typography } from '../../../tokens';
import { useTheme } from '../../../contexts';

export function CtaSection() {
  const { isMobile } = useBreakpoints();
  const { colors } = useTheme();

  return (
    <section
      style={{
        padding: isMobile ? '80px 20px' : '120px 80px',
        background: colors.bg.primary,
        textAlign: 'center',
        position: 'relative',
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: '50%',
          transform: 'translateX(-50%)',
          width: '1px',
          height: '60px',
          background: colors.gold,
        }}
      />
      <p
        style={{
          fontFamily: typography.fontFamily.japanese,
          fontSize: isMobile ? '16px' : '20px',
          color: colors.text.secondary,
          letterSpacing: '0.1em',
          lineHeight: 2,
          marginTop: '40px',
        }}
      >
        暮らしと、食と、空間を。
        <br />
        CUBEと一緒に、つくりませんか。
      </p>
    </section>
  );
}
