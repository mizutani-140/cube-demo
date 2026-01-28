/**
 * WorksGrid - Card Grid Component
 *
 * Masonry-style grid with GSAP 3D perspective stagger entry,
 * FLIP-style filter transitions, and scroll-triggered reveals.
 */

import React, { useRef, useEffect, useCallback, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useBreakpoints } from '../../../hooks/useBreakpoints';
import { WorksCard } from './WorksCard';
import { useWorksAnimations } from './useWorksAnimations';
import { useTheme } from '../../../contexts';
import { prefersReducedMotion } from '../../../animations/gsapSetup';

export function WorksGrid({ projects, onProjectClick, activeFilter }) {
  const { isMobile } = useBreakpoints();
  const { colors } = useTheme();
  const gridRef = useRef();
  const ctxRef = useRef(null);
  const { animateFilterAppear } = useWorksAnimations();
  const [isTransitioning, setIsTransitioning] = useState(false);
  const prevFilterRef = useRef(activeFilter);

  // Handle filter change with FLIP-style transition
  useEffect(() => {
    if (prevFilterRef.current !== activeFilter) {
      setIsTransitioning(true);

      // Capture current positions (simplified FLIP)
      const cards = gridRef.current?.querySelectorAll('.works-card');
      if (cards && !prefersReducedMotion()) {
        // Fade out current cards
        gsap.to(cards, {
          opacity: 0,
          scale: 0.95,
          y: 20,
          duration: 0.25,
          stagger: 0.02,
          ease: 'power2.in',
          onComplete: () => {
            setIsTransitioning(false);
          },
        });
      } else {
        // Quick transition for reduced motion
        const timer = setTimeout(() => setIsTransitioning(false), 50);
        prevFilterRef.current = activeFilter;
        return () => clearTimeout(timer);
      }

      prevFilterRef.current = activeFilter;
    }
  }, [activeFilter]);

  // Scroll-triggered slide-in, reveal, and horizontal parallax for cards
  useEffect(() => {
    if (isTransitioning || !gridRef.current) return;

    const cards = gridRef.current.querySelectorAll('.works-card');
    if (!cards || cards.length === 0) return;

    if (prefersReducedMotion()) {
      gsap.set(cards, { clearProps: 'all' });
      return;
    }

    // Small delay to let the grid container opacity transition finish
    const timer = setTimeout(() => {
      const vw = window.innerWidth;

      const ctx = gsap.context(() => {
        cards.forEach((card, index) => {
          // Determine slide direction based on grid column pattern
          const pattern = index % 6;
          const isLeftSide = isMobile
            ? index % 2 === 0
            : [0, 3, 5].includes(pattern);

          // Off-screen start position (40-50% of viewport width)
          const offScreenX = isMobile
            ? (isLeftSide ? -(vw * 0.5) : vw * 0.5)
            : (isLeftSide ? -(vw * 0.4) : vw * 0.4);

          // 1. Slide-in from off-screen, scrubbed to scroll
          gsap.fromTo(
            card,
            {
              x: offScreenX,
              y: 60,
              opacity: 0,
            },
            {
              x: 0,
              y: 0,
              opacity: 1,
              ease: 'power2.out',
              scrollTrigger: {
                trigger: card,
                start: 'top bottom',
                end: 'top 55%',
                scrub: 0.6,
              },
            }
          );

          // 2. Horizontal scroll parallax (subtle drift after reveal)
          gsap.fromTo(
            card,
            { xPercent: isLeftSide ? -2 : 2 },
            {
              xPercent: isLeftSide ? 2 : -2,
              ease: 'none',
              scrollTrigger: {
                trigger: card,
                start: 'top 55%',
                end: 'bottom top',
                scrub: 0.8,
              },
            }
          );
        });
      }, gridRef);

      // Store ctx for cleanup
      ctxRef.current = ctx;
    }, 180);

    return () => {
      clearTimeout(timer);
      ctxRef.current?.revert();
    };
  }, [isTransitioning, activeFilter, projects, isMobile]);

  // Asymmetric grid placement patterns
  const getGridStyle = useCallback((index) => {
    if (isMobile) return {};

    const patterns = [
      { gridColumn: 'span 7', gridRow: 'span 2' },
      { gridColumn: 'span 5', gridRow: 'span 1' },
      { gridColumn: 'span 5', gridRow: 'span 1' },
      { gridColumn: 'span 6', gridRow: 'span 1' },
      { gridColumn: 'span 6', gridRow: 'span 1' },
      { gridColumn: 'span 4', gridRow: 'span 1' },
    ];

    return patterns[index % patterns.length];
  }, [isMobile]);

  if (!projects || projects.length === 0) {
    return (
      <section style={{
        padding: isMobile ? '60px 24px' : '80px 80px',
        background: colors.bg.secondary,
        minHeight: '400px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <p style={{
          fontFamily: "'Noto Serif JP', serif",
          fontSize: '18px',
          color: colors.text.tertiary,
          textAlign: 'center',
        }}>
          該当するプロジェクトがありません
        </p>
      </section>
    );
  }

  return (
    <section style={{
      padding: isMobile ? '32px 24px 60px' : '48px 80px 120px',
      background: colors.bg.secondary,
    }}>
      {/* Grid with 3D perspective */}
      <div
        ref={gridRef}
        style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : 'repeat(12, 1fr)',
          gap: isMobile ? '24px' : '24px',
          opacity: isTransitioning ? 0 : 1,
          transition: 'opacity 0.15s ease',
        }}
      >
        {projects.map((project, index) => {
          const gridStyle = getGridStyle(index);

          return (
            <WorksCard
              key={project.id}
              project={project}
              index={index}
              style={gridStyle}
              onClick={onProjectClick}
            />
          );
        })}
      </div>
    </section>
  );
}
