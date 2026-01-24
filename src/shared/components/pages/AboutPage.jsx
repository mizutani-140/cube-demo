/**
 * ABOUT Page - Architectural Narrative
 *
 * 「LIFE × ART × BUILD」
 *
 * Aesthetic: Japanese spatial harmony with editorial boldness
 * - Vertical text elements (縦書き)
 * - Asymmetric layouts with intentional space (間)
 * - Large dramatic typography
 * - Story-driven sections
 */

import React, { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { useBreakpoints } from '../../hooks/useBreakpoints';
import { useSEO, SEO_PRESETS } from '../../hooks';
import { colors, typography, animation } from '../../tokens';
import { brand, company, vision, timeline } from '../../data/corporate';
import { PageLayout } from './PageLayout';

// Hero images
const HERO_IMAGE = '/about.jpg';

// ============================================
// Hero Section - Full Impact
// ============================================

function AboutHero() {
  const { isMobile } = useBreakpoints();
  const heroRef = useRef();

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.about-hero-text',
        { opacity: 0, y: 60 },
        { opacity: 1, y: 0, duration: 1, ease: 'power3.out', stagger: 0.12, delay: 0.2 }
      );
      gsap.fromTo('.about-hero-line',
        { scaleX: 0 },
        { scaleX: 1, duration: 1.5, ease: 'power3.inOut', delay: 0.5 }
      );
    }, heroRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={heroRef}
      style={{
        minHeight: '100vh',
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
        paddingRight: isMobile ? '0' : '120px', // Space for side navigation
        position: 'relative',
      }}
    >
      {/* Left - Image */}
      <div style={{
        position: 'relative',
        minHeight: isMobile ? '50vh' : '100vh',
        overflow: 'hidden',
        order: isMobile ? 2 : 1,
      }}>
        <img
          src={HERO_IMAGE}
          alt="CUBEの建築空間 - 内装設計の作品例"
          width={800}
          height={600}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          }}
          loading="eager"
          fetchpriority="high"
        />

        {/* Overlay */}
        <div style={{
          position: 'absolute',
          inset: 0,
          background: isMobile
            ? 'linear-gradient(to bottom, rgba(6,6,10,0.3), rgba(6,6,10,0.6))'
            : 'linear-gradient(to left, rgba(6,6,10,0.95), transparent 30%)',
        }} />

        {/* Year badge */}
        <div style={{
          position: 'absolute',
          bottom: '40px',
          left: '40px',
          textAlign: 'left',
        }}>
          <p style={{
            fontFamily: typography.fontFamily.condensed,
            fontSize: '12px',
            color: 'rgba(255,255,255,0.4)',
            letterSpacing: '0.15em',
            marginBottom: '4px',
          }}>
            ESTABLISHED
          </p>
          <p style={{
            fontFamily: typography.fontFamily.condensed,
            fontSize: '48px',
            fontWeight: 700,
            color: 'rgba(255,255,255,0.15)',
            lineHeight: 1,
          }}>
            2013
          </p>
        </div>
      </div>

      {/* Right - Content */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: isMobile ? '140px 24px 80px' : '0 60px 0 80px',
        position: 'relative',
        zIndex: 2,
        order: isMobile ? 1 : 2,
      }}>
        {/* Decorative line */}
        <div
          className="about-hero-line"
          style={{
            width: '80px',
            height: '1px',
            background: colors.gold,
            marginBottom: '40px',
            transformOrigin: 'left',
          }}
        />

        {/* Label */}
        <p
          className="about-hero-text"
          style={{
            fontFamily: typography.fontFamily.condensed,
            fontSize: typography.fontSize.xs,
            color: colors.gold,
            letterSpacing: typography.letterSpacing.display,
            textTransform: 'uppercase',
            marginBottom: '20px',
          }}
        >
          About CUBE
        </p>

        {/* Main concept */}
        <h1
          className="about-hero-text"
          style={{
            fontFamily: typography.fontFamily.display,
            fontSize: isMobile ? '11vw' : '4.5vw',
            fontWeight: 200,
            color: colors.text.primary,
            letterSpacing: '-0.02em',
            lineHeight: 1,
            marginBottom: '32px',
          }}
        >
          LIFE
          <span style={{ color: colors.gold, margin: '0 0.03em', fontFamily: typography.fontFamily.japanese }}>×</span>
          ART
          <span style={{ color: colors.gold, margin: '0 0.03em', fontFamily: typography.fontFamily.japanese }}>×</span>
          BUILD
        </h1>

        {/* Japanese tagline */}
        <p
          className="about-hero-text"
          style={{
            fontFamily: typography.fontFamily.japanese,
            fontSize: isMobile ? '18px' : '20px',
            color: colors.text.secondary,
            letterSpacing: '0.2em',
            marginBottom: '40px',
          }}
        >
          暮らしを、空間から編集する。
        </p>

        {/* Description */}
        <p
          className="about-hero-text"
          style={{
            fontFamily: typography.fontFamily.body,
            fontSize: typography.fontSize.base,
            color: colors.text.tertiary,
            lineHeight: 2,
            maxWidth: '400px',
          }}
        >
          {brand.description}
        </p>
      </div>
    </section>
  );
}

// ============================================
// Philosophy Section - Split Layout
// ============================================

function PhilosophySection() {
  const { isMobile } = useBreakpoints();

  const philosophies = [
    {
      number: '01',
      title: '空間は、体験になる',
      titleEn: 'Space becomes Experience',
      desc: '私たちがつくるのは「箱」ではなく、そこで過ごす時間のすべて。光、音、温度、記憶——すべてが空間の一部です。',
    },
    {
      number: '02',
      title: 'つくる人と、使う人の間に立つ',
      titleEn: 'Standing Between Creator and User',
      desc: '設計者の意図と、使う人の暮らし。その間に立ち、両者を結ぶことが私たちの役割です。',
    },
    {
      number: '03',
      title: '100年先を見据えて',
      titleEn: 'Building for the Next Century',
      desc: '流行を追うのではなく、100年後も価値を持ち続ける空間を。時間に耐える本質を追求します。',
    },
  ];

  return (
    <section style={{
      padding: isMobile ? '80px 24px' : '160px 0',
      background: colors.bg.secondary,
      position: 'relative',
    }}>
      {/* Background decorative text */}
      {!isMobile && (
        <div style={{
          position: 'absolute',
          top: '80px',
          left: '-5%',
          fontFamily: typography.fontFamily.condensed,
          fontSize: '20vw',
          fontWeight: 700,
          color: colors.ui.divider,
          lineHeight: 0.8,
          userSelect: 'none',
          pointerEvents: 'none',
        }}>
          哲学
        </div>
      )}

      <div style={{
        maxWidth: '1400px',
        margin: '0 auto',
        padding: isMobile ? '0' : '0 80px',
        position: 'relative',
        zIndex: 2,
      }}>
        {/* Section header */}
        <div style={{
          marginBottom: isMobile ? '60px' : '100px',
        }}>
          <p style={{
            fontFamily: typography.fontFamily.condensed,
            fontSize: typography.fontSize.xs,
            color: colors.gold,
            letterSpacing: typography.letterSpacing.display,
            textTransform: 'uppercase',
            marginBottom: '16px',
          }}>
            Philosophy
          </p>
          <h2 style={{
            fontFamily: typography.fontFamily.display,
            fontSize: isMobile ? '36px' : '56px',
            fontWeight: 200,
            color: colors.text.primary,
            letterSpacing: '-0.02em',
          }}>
            私たちの哲学
          </h2>
        </div>

        {/* Philosophy items */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: isMobile ? '60px' : '100px',
        }}>
          {philosophies.map((item, i) => (
            <div
              key={i}
              style={{
                display: 'grid',
                gridTemplateColumns: isMobile ? '1fr' : i % 2 === 0 ? '1fr 1.5fr' : '1.5fr 1fr',
                gap: isMobile ? '24px' : '80px',
                alignItems: 'center',
              }}
            >
              {/* Number & Title */}
              <div style={{ order: isMobile ? 1 : (i % 2 === 0 ? 1 : 2) }}>
                <span style={{
                  fontFamily: typography.fontFamily.condensed,
                  fontSize: '72px',
                  fontWeight: 700,
                  color: colors.ui.border,
                  display: 'block',
                  lineHeight: 1,
                  marginBottom: '16px',
                }}>
                  {item.number}
                </span>
                <h3 style={{
                  fontFamily: typography.fontFamily.japanese,
                  fontSize: isMobile ? '24px' : '32px',
                  fontWeight: 500,
                  color: colors.text.primary,
                  letterSpacing: '0.05em',
                  lineHeight: 1.4,
                  marginBottom: '8px',
                }}>
                  {item.title}
                </h3>
                <p style={{
                  fontFamily: typography.fontFamily.display,
                  fontSize: typography.fontSize.sm,
                  fontStyle: 'italic',
                  color: colors.gold,
                  letterSpacing: '0.02em',
                }}>
                  {item.titleEn}
                </p>
              </div>

              {/* Description */}
              <div style={{ order: isMobile ? 2 : (i % 2 === 0 ? 2 : 1) }}>
                <p style={{
                  fontFamily: typography.fontFamily.body,
                  fontSize: typography.fontSize.base,
                  color: colors.text.secondary,
                  lineHeight: 2.2,
                  paddingLeft: isMobile ? '0' : (i % 2 === 0 ? '40px' : '0'),
                  paddingRight: isMobile ? '0' : (i % 2 === 0 ? '0' : '40px'),
                  borderLeft: isMobile ? 'none' : (i % 2 === 0 ? `1px solid ${colors.ui.border}` : 'none'),
                  borderRight: isMobile ? 'none' : (i % 2 === 0 ? 'none' : `1px solid ${colors.ui.border}`),
                }}>
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ============================================
// Timeline Section - Vertical Flow
// ============================================

function TimelineSection() {
  const { isMobile } = useBreakpoints();

  return (
    <section style={{
      padding: isMobile ? '80px 24px' : '160px 80px',
      background: colors.bg.primary,
      position: 'relative',
    }}>
      {/* Section header */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr' : '1fr 2fr',
        gap: '60px',
        marginBottom: isMobile ? '60px' : '100px',
        maxWidth: '1200px',
        margin: '0 auto 100px',
      }}>
        <div>
          <p style={{
            fontFamily: typography.fontFamily.condensed,
            fontSize: typography.fontSize.xs,
            color: colors.gold,
            letterSpacing: typography.letterSpacing.display,
            textTransform: 'uppercase',
            marginBottom: '16px',
          }}>
            100 Year Vision
          </p>
          <h2 style={{
            fontFamily: typography.fontFamily.display,
            fontSize: isMobile ? '36px' : '52px',
            fontWeight: 200,
            color: colors.text.primary,
            letterSpacing: '-0.02em',
          }}>
            成長の軌跡
          </h2>
        </div>
        <p style={{
          fontFamily: typography.fontFamily.body,
          fontSize: typography.fontSize.base,
          color: colors.text.tertiary,
          lineHeight: 2,
          alignSelf: 'end',
        }}>
          2013年の創業から、一歩ずつ。<br />
          100年先の未来へ向けて、私たちは歩み続けます。
        </p>
      </div>

      {/* Timeline */}
      <div style={{
        maxWidth: '900px',
        margin: '0 auto',
        paddingTop: '60px',
        position: 'relative',
      }}>
        {/* Center line */}
        <div style={{
          position: 'absolute',
          left: isMobile ? '20px' : '50%',
          top: 0,
          bottom: 0,
          width: '1px',
          background: `linear-gradient(to bottom, ${colors.gold}, ${colors.ui.border})`,
        }} />

        {timeline.map((item, i) => (
          <div
            key={i}
            style={{
              display: 'grid',
              gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
              gap: isMobile ? '0' : '80px',
              marginBottom: '60px',
              position: 'relative',
            }}
          >
            {/* Dot */}
            <div style={{
              position: 'absolute',
              left: isMobile ? '16px' : 'calc(50% - 4px)',
              top: '8px',
              width: '9px',
              height: '9px',
              borderRadius: '50%',
              background: i === 0 ? colors.gold : colors.bg.primary,
              border: `2px solid ${colors.gold}`,
            }} />

            {/* Year - left side on desktop */}
            <div style={{
              textAlign: isMobile ? 'left' : 'right',
              paddingLeft: isMobile ? '50px' : '0',
              paddingRight: isMobile ? '0' : '40px',
            }}>
              <span style={{
                fontFamily: typography.fontFamily.condensed,
                fontSize: isMobile ? '32px' : '48px',
                fontWeight: 700,
                color: colors.gold,
                lineHeight: 1,
              }}>
                {item.year}
              </span>
            </div>

            {/* Content - right side on desktop */}
            <div style={{
              paddingLeft: isMobile ? '50px' : '40px',
              paddingTop: isMobile ? '16px' : '0',
            }}>
              <h4 style={{
                fontFamily: typography.fontFamily.japanese,
                fontSize: '18px',
                fontWeight: 500,
                color: colors.text.primary,
                letterSpacing: '0.05em',
                marginBottom: '8px',
              }}>
                {item.title}
              </h4>
              <p style={{
                fontFamily: typography.fontFamily.body,
                fontSize: typography.fontSize.sm,
                color: colors.text.tertiary,
                lineHeight: 1.8,
              }}>
                {item.desc}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

// ============================================
// Company Info - Minimal Grid
// ============================================

function CompanyInfoSection() {
  const { isMobile } = useBreakpoints();

  const infoItems = [
    { label: '会社名', value: brand.name },
    { label: '設立', value: company.founded },
    { label: '資本金', value: company.capital },
    { label: '代表者', value: `${company.ceoTitle} ${company.ceo}` },
    { label: 'TEL', value: company.tel },
    { label: '本社所在地', value: company.headquarters.address },
    { label: '営業所', value: company.office.address },
  ];

  return (
    <section style={{
      padding: isMobile ? '80px 24px' : '160px 80px',
      background: colors.bg.warm,
    }}>
      <div style={{
        maxWidth: '1000px',
        margin: '0 auto',
      }}>
        {/* Header */}
        <div style={{ marginBottom: '60px' }}>
          <p style={{
            fontFamily: typography.fontFamily.condensed,
            fontSize: typography.fontSize.xs,
            color: colors.gold,
            letterSpacing: typography.letterSpacing.display,
            textTransform: 'uppercase',
            marginBottom: '16px',
          }}>
            Company
          </p>
          <h2 style={{
            fontFamily: typography.fontFamily.display,
            fontSize: isMobile ? '36px' : '48px',
            fontWeight: 200,
            color: colors.text.primary,
            letterSpacing: '-0.02em',
          }}>
            会社概要
          </h2>
        </div>

        {/* Info grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)',
          gap: '0',
          borderTop: `1px solid ${colors.ui.border}`,
        }}>
          {infoItems.map((item, i) => (
            <div
              key={i}
              style={{
                padding: isMobile ? '24px 0' : '32px 0',
                borderBottom: `1px solid ${colors.ui.border}`,
                borderRight: isMobile ? 'none' : (i % 2 === 0 ? `1px solid ${colors.ui.border}` : 'none'),
                paddingRight: isMobile ? '0' : (i % 2 === 0 ? '40px' : '0'),
                paddingLeft: isMobile ? '0' : (i % 2 === 0 ? '0' : '40px'),
              }}
            >
              <p style={{
                fontFamily: typography.fontFamily.condensed,
                fontSize: '11px',
                color: colors.text.muted,
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                marginBottom: '8px',
              }}>
                {item.label}
              </p>
              <p style={{
                fontFamily: typography.fontFamily.body,
                fontSize: typography.fontSize.base,
                color: colors.text.primary,
                lineHeight: 1.6,
              }}>
                {item.value}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ============================================
// Main About Page
// ============================================

export default function AboutPage({ onNavigate }) {
  // SEO設定
  useSEO(SEO_PRESETS.about);

  return (
    <PageLayout currentPage="about" onNavigate={onNavigate}>
      <AboutHero />
      <PhilosophySection />
      <TimelineSection />
      <CompanyInfoSection />
    </PageLayout>
  );
}
