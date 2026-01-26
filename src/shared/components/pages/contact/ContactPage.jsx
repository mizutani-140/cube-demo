/**
 * CONTACT Page - Editorial Design
 * 一緒につくるところから、始めませんか。
 *
 * Aesthetic: Japanese spatial harmony meets editorial form design
 * Vertical text accents, asymmetric layout, refined typography
 */

import React from 'react';
import { useBreakpoints } from '../../../hooks/useBreakpoints';
import { useSEO, SEO_PRESETS } from '../../../hooks';
import { typography } from '../../../tokens';
import { useTheme } from '../../../contexts';
import { PageLayout } from '../PageLayout';
import { ContactHero } from './ContactHero';
import { ContactForm } from './ContactForm';
import { ContactSidebar } from './ContactSidebar';
import { FAQSection } from './FAQSection';
import { CtaSection } from './CtaSection';

export default function ContactPage({ onNavigate }) {
  const { isMobile, isTablet } = useBreakpoints();
  const { colors } = useTheme();

  // SEO設定
  useSEO(SEO_PRESETS.contact);

  return (
    <PageLayout currentPage="contact" onNavigate={onNavigate}>
      <ContactHero />

      {/* Main Form Section */}
      <section
        style={{
          padding: isMobile ? '60px 20px' : '100px 80px',
          background: colors.bg.primary,
        }}
      >
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : isTablet ? '1fr' : '350px 1fr',
            gap: isMobile ? '60px' : '80px',
            maxWidth: '1400px',
            margin: '0 auto',
          }}
        >
          {/* Sidebar */}
          <ContactSidebar onNavigate={onNavigate} />

          {/* Form */}
          <div
            style={{
              position: 'relative',
              padding: isMobile ? '40px 24px' : '60px',
              background: colors.bg.tertiary,
              border: `1px solid ${colors.ui.border}`,
            }}
          >
            {/* Form header */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '48px',
              }}
            >
              <h3
                style={{
                  fontFamily: typography.fontFamily.mono,
                  fontSize: '10px',
                  letterSpacing: '0.2em',
                  color: colors.gold,
                }}
              >
                INQUIRY FORM
              </h3>
              <div
                style={{
                  width: '60px',
                  height: '1px',
                  background: colors.ui.border,
                }}
              />
            </div>
            <ContactForm />
          </div>
        </div>
      </section>

      <FAQSection />

      <CtaSection />
    </PageLayout>
  );
}
