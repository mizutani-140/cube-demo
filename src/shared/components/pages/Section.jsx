/**
 * Section - Editorial Design System
 * Reusable section wrapper with scroll-triggered animations
 */

import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useBreakpoints } from '../../hooks/useBreakpoints';

gsap.registerPlugin(ScrollTrigger);

export function Section({ children, background = 'transparent', padding = 'default', animate = true }) {
  const { isMobile, prefersReducedMotion } = useBreakpoints();
  const sectionRef = useRef();

  const paddingMap = {
    default: isMobile ? '60px 24px' : '100px 80px',
    small: isMobile ? '40px 24px' : '60px 80px',
    large: isMobile ? '80px 24px' : '140px 80px',
  };

  useEffect(() => {
    if (!animate || !sectionRef.current || prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      const animateEls = sectionRef.current.querySelectorAll('.section-animate');
      if (animateEls.length > 0) {
        gsap.fromTo(animateEls,
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
            stagger: 0.1,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top 80%',
            },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, [animate, prefersReducedMotion]);

  return (
    <section
      ref={sectionRef}
      data-animate-section
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
