/**
 * TimelineSection - Scroll-Driven Line Draw & Timeline Items
 *
 * Extracted from AboutPage for modularity.
 */

import React, { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useBreakpoints } from '../../../hooks/useBreakpoints';
import { typography } from '../../../tokens';
import { timeline } from '../../../data/corporate';
import { useTheme } from '../../../contexts';

gsap.registerPlugin(ScrollTrigger);

export function TimelineSection() {
  const { isMobile, prefersReducedMotion: reducedMotion } = useBreakpoints();
  const { colors } = useTheme();
  const sectionRef = useRef();
  const lineRef = useRef();
  const dotRefs = useRef([]);
  const itemRefs = useRef([]);

  useEffect(() => {
    if (!sectionRef.current || reducedMotion) return;

    const ctx = gsap.context(() => {
      // Center line draws on scroll
      if (lineRef.current) {
        gsap.fromTo(lineRef.current,
          { scaleY: 0 },
          {
            scaleY: 1,
            ease: 'none',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top 60%',
              end: 'bottom 80%',
              scrub: true,
            },
          }
        );
      }

      // Each timeline item reveals on scroll
      itemRefs.current.forEach((item, i) => {
        if (!item) return;

        const dot = dotRefs.current[i];
        const year = item.querySelector('.timeline-year');
        const content = item.querySelector('.timeline-content');

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: item,
            start: 'top 80%',
          },
        });

        // Dot pops in
        if (dot) {
          tl.fromTo(dot,
            { scale: 0, opacity: 0 },
            { scale: 1, opacity: 1, duration: 0.4, ease: 'back.out(2)' },
            0
          );
        }

        // Year slides in from left
        if (year) {
          tl.fromTo(year,
            { opacity: 0, x: isMobile ? 20 : (i % 2 === 0 ? 30 : -30) },
            { opacity: 1, x: 0, duration: 0.6, ease: 'power3.out' },
            0.1
          );
        }

        // Content slides in from right
        if (content) {
          tl.fromTo(content,
            { opacity: 0, x: isMobile ? 20 : (i % 2 === 0 ? -30 : 30) },
            { opacity: 1, x: 0, duration: 0.6, ease: 'power3.out' },
            0.2
          );
        }
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [isMobile, reducedMotion]);

  return (
    <section
      ref={sectionRef}
      style={{
        padding: isMobile ? '80px 24px' : '160px 80px',
        background: colors.bg.primary,
        position: 'relative',
      }}
    >
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
        {/* Center line — scroll-drawn */}
        <div
          ref={lineRef}
          style={{
            position: 'absolute',
            left: isMobile ? '20px' : '50%',
            top: 0,
            bottom: 0,
            width: '1px',
            background: `linear-gradient(to bottom, ${colors.gold}, ${colors.ui.border})`,
            transformOrigin: 'top center',
          }}
        />

        {timeline.map((item, i) => (
          <div
            key={i}
            ref={el => itemRefs.current[i] = el}
            style={{
              display: 'grid',
              gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
              gap: isMobile ? '0' : '80px',
              marginBottom: '60px',
              position: 'relative',
            }}
          >
            {/* Dot */}
            <div
              ref={el => dotRefs.current[i] = el}
              style={{
                position: 'absolute',
                left: isMobile ? '16px' : 'calc(50% - 4px)',
                top: '8px',
                width: '9px',
                height: '9px',
                borderRadius: '50%',
                background: i === 0 ? colors.gold : colors.bg.primary,
                border: `2px solid ${colors.gold}`,
              }}
            />

            {/* Year - left side on desktop */}
            <div
              className="timeline-year"
              style={{
                textAlign: isMobile ? 'left' : 'right',
                paddingLeft: isMobile ? '50px' : '0',
                paddingRight: isMobile ? '0' : '40px',
              }}
            >
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
            <div
              className="timeline-content"
              style={{
                paddingLeft: isMobile ? '50px' : '40px',
                paddingTop: isMobile ? '16px' : '0',
              }}
            >
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
