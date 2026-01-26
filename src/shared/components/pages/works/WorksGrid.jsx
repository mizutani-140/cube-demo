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

gsap.registerPlugin(ScrollTrigger);

export function WorksGrid({ projects, onProjectClick, activeFilter }) {
  const { isMobile } = useBreakpoints();
  const { colors } = useTheme();
  const gridRef = useRef();
  const { animateFilterAppear, setupScrollReveal } = useWorksAnimations();
  const [isTransitioning, setIsTransitioning] = useState(false);
  const prevFilterRef = useRef(activeFilter);
  const hasAnimated = useRef(false);

  // Initial 3D perspective stagger entry on first mount
  useEffect(() => {
    if (!gridRef.current || hasAnimated.current || prefersReducedMotion()) return;

    const cards = gridRef.current.querySelectorAll('.works-card');
    if (cards.length === 0) return;

    hasAnimated.current = true;

    gsap.fromTo(cards,
      {
        opacity: 0,
        y: 80,
        rotationY: (i) => (i % 2 === 0 ? 10 : -10),
        scale: 0.92,
      },
      {
        opacity: 1,
        y: 0,
        rotationY: 0,
        scale: 1,
        duration: 0.8,
        stagger: 0.08,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: gridRef.current,
          start: 'top 85%',
        },
      }
    );
  }, [projects]);

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

  // Animate new cards after filter transition completes
  useEffect(() => {
    if (!isTransitioning && gridRef.current && prevFilterRef.current === activeFilter) {
      const cards = gridRef.current.querySelectorAll('.works-card');
      if (cards.length > 0 && !prefersReducedMotion()) {
        gsap.fromTo(cards,
          {
            opacity: 0,
            y: 40,
            scale: 0.9,
          },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.5,
            stagger: {
              each: 0.06,
              from: 'center',
            },
            ease: 'power3.out',
            delay: 0.05,
          }
        );
      }
    }
  }, [isTransitioning, activeFilter, projects]);

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
          perspective: isMobile ? 'none' : '1000px',
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
