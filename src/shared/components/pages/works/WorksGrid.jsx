/**
 * WorksGrid - Card Grid Component
 *
 * Masonry-style grid with Anime.js scroll animations and filter transitions.
 * Asymmetric layout with featured cards and responsive design.
 */

import React, { useRef, useEffect, useCallback, useState } from 'react';
import { useBreakpoints } from '../../../hooks/useBreakpoints';
import { colors } from '../../../tokens';
import { WorksCard } from './WorksCard';
import { useWorksAnimations } from './useWorksAnimations';

export function WorksGrid({ projects, onProjectClick, activeFilter }) {
  const { isMobile } = useBreakpoints();
  const gridRef = useRef();
  const { animateFilterAppear, setupScrollReveal } = useWorksAnimations();
  const [isTransitioning, setIsTransitioning] = useState(false);
  const prevFilterRef = useRef(activeFilter);

  // Handle filter change animation
  useEffect(() => {
    if (prevFilterRef.current !== activeFilter) {
      setIsTransitioning(true);

      // Short delay for transition
      const timer = setTimeout(() => {
        setIsTransitioning(false);
        if (gridRef.current) {
          animateFilterAppear(gridRef.current);
        }
      }, 50);

      prevFilterRef.current = activeFilter;
      return () => clearTimeout(timer);
    }
  }, [activeFilter, animateFilterAppear]);

  // Setup scroll reveal on mount
  useEffect(() => {
    if (gridRef.current && !isTransitioning) {
      const cleanup = setupScrollReveal(gridRef.current);
      return cleanup;
    }
  }, [setupScrollReveal, isTransitioning, projects]);

  // Asymmetric grid placement patterns
  const getGridStyle = useCallback((index) => {
    if (isMobile) return {};

    // Create varied grid patterns
    const patterns = [
      { gridColumn: 'span 7', gridRow: 'span 2' },  // Featured large
      { gridColumn: 'span 5', gridRow: 'span 1' },  // Standard
      { gridColumn: 'span 5', gridRow: 'span 1' },  // Standard
      { gridColumn: 'span 6', gridRow: 'span 1' },  // Wide
      { gridColumn: 'span 6', gridRow: 'span 1' },  // Wide
      { gridColumn: 'span 4', gridRow: 'span 1' },  // Compact
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
      {/* Grid */}
      <div
        ref={gridRef}
        style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : 'repeat(12, 1fr)',
          gap: isMobile ? '24px' : '24px',
          opacity: isTransitioning ? 0 : 1,
          transition: 'opacity 0.2s ease',
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

export default WorksGrid;
