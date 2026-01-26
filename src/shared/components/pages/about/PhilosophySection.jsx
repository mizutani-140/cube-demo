/**
 * PhilosophySection - Scroll-Driven Reveal of Philosophy Items
 *
 * Extracted from AboutPage for modularity.
 */

import React, { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useBreakpoints } from '../../../hooks/useBreakpoints';
import { typography } from '../../../tokens';
import { useTheme } from '../../../contexts';

gsap.registerPlugin(ScrollTrigger);

export function PhilosophySection() {
  const { isMobile, prefersReducedMotion: reducedMotion } = useBreakpoints();
  const { colors } = useTheme();
  const sectionRef = useRef();
  const itemRefs = useRef([]);

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

  useEffect(() => {
    if (!sectionRef.current || reducedMotion) return;

    const ctx = gsap.context(() => {
      // Parallax on decorative background text
      const parallaxEls = sectionRef.current.querySelectorAll('[data-parallax-speed]');
      parallaxEls.forEach((el) => {
        const speed = parseFloat(el.dataset.parallaxSpeed) || 0.2;
        gsap.to(el, {
          yPercent: -100 * speed,
          ease: 'none',
          scrollTrigger: {
            trigger: el,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 0.5,
          },
        });
      });

      // Each philosophy item reveals on scroll
      itemRefs.current.forEach((item, i) => {
        if (!item) return;

        const number = item.querySelector('.phil-number');
        const title = item.querySelector('.phil-title');
        const titleEn = item.querySelector('.phil-title-en');
        const desc = item.querySelector('.phil-desc');

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: item,
            start: 'top 75%',
          },
        });

        // Number pops in with scale
        if (number) {
          tl.fromTo(number,
            { opacity: 0, scale: 0.8 },
            { opacity: 1, scale: 1, duration: 0.6, ease: 'back.out(2)' },
            0
          );
        }

        // Title slides in from alternating direction
        if (title) {
          const xDir = i % 2 === 0 ? -40 : 40;
          tl.fromTo(title,
            { opacity: 0, x: xDir },
            { opacity: 1, x: 0, duration: 0.7, ease: 'power3.out' },
            0.15
          );
        }

        // English title fades
        if (titleEn) {
          tl.fromTo(titleEn,
            { opacity: 0, y: 15 },
            { opacity: 1, y: 0, duration: 0.5 },
            0.3
          );
        }

        // Description fades in
        if (desc) {
          tl.fromTo(desc,
            { opacity: 0, y: 25 },
            { opacity: 1, y: 0, duration: 0.7 },
            0.35
          );
        }
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [reducedMotion]);

  return (
    <section
      ref={sectionRef}
      style={{
        padding: isMobile ? '80px 24px' : '160px 0',
        background: colors.bg.secondary,
        position: 'relative',
      }}
    >
      {/* Background decorative text */}
      {!isMobile && (
        <div
          data-parallax-speed="0.15"
          style={{
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
          }}
          aria-hidden="true"
        >
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
              ref={el => itemRefs.current[i] = el}
              style={{
                display: 'grid',
                gridTemplateColumns: isMobile ? '1fr' : i % 2 === 0 ? '1fr 1.5fr' : '1.5fr 1fr',
                gap: isMobile ? '24px' : '80px',
                alignItems: 'center',
              }}
            >
              {/* Number & Title */}
              <div style={{ order: isMobile ? 1 : (i % 2 === 0 ? 1 : 2) }}>
                <span
                  className="phil-number"
                  style={{
                    fontFamily: typography.fontFamily.condensed,
                    fontSize: '72px',
                    fontWeight: 700,
                    color: colors.ui.border,
                    display: 'block',
                    lineHeight: 1,
                    marginBottom: '16px',
                  }}
                >
                  {item.number}
                </span>
                <h3
                  className="phil-title"
                  style={{
                    fontFamily: typography.fontFamily.japanese,
                    fontSize: isMobile ? '24px' : '32px',
                    fontWeight: 500,
                    color: colors.text.primary,
                    letterSpacing: '0.05em',
                    lineHeight: 1.4,
                    marginBottom: '8px',
                  }}
                >
                  {item.title}
                </h3>
                <p
                  className="phil-title-en"
                  style={{
                    fontFamily: typography.fontFamily.display,
                    fontSize: typography.fontSize.sm,
                    fontStyle: 'italic',
                    color: colors.gold,
                    letterSpacing: '0.02em',
                  }}
                >
                  {item.titleEn}
                </p>
              </div>

              {/* Description */}
              <div style={{ order: isMobile ? 2 : (i % 2 === 0 ? 2 : 1) }}>
                <p
                  className="phil-desc"
                  style={{
                    fontFamily: typography.fontFamily.body,
                    fontSize: typography.fontSize.base,
                    color: colors.text.secondary,
                    lineHeight: 2.2,
                    paddingLeft: isMobile ? '0' : (i % 2 === 0 ? '40px' : '0'),
                    paddingRight: isMobile ? '0' : (i % 2 === 0 ? '0' : '40px'),
                    borderLeft: isMobile ? 'none' : (i % 2 === 0 ? `1px solid ${colors.ui.border}` : 'none'),
                    borderRight: isMobile ? 'none' : (i % 2 === 0 ? 'none' : `1px solid ${colors.ui.border}`),
                  }}
                >
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
