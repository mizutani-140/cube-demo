/**
 * WorksCard - Project Card Component
 *
 * Individual project card with Anime.js hover effects.
 * Image zoom, color overlay, and corner accents.
 */

import React, { useRef, useState, useCallback } from 'react';
import { useBreakpoints } from '../../../hooks/useBreakpoints';
import { colors, typography } from '../../../tokens';
import { useWorksAnimations } from './useWorksAnimations';

export function WorksCard({ project, index, style, onClick }) {
  const { isMobile } = useBreakpoints();
  const cardRef = useRef();
  const [isHovered, setIsHovered] = useState(false);
  const { animateCardEnter, animateCardLeave } = useWorksAnimations();

  const handleMouseEnter = useCallback(() => {
    setIsHovered(true);
    animateCardEnter(cardRef.current);
  }, [animateCardEnter]);

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
    animateCardLeave(cardRef.current);
  }, [animateCardLeave]);

  const handleClick = useCallback(() => {
    if (onClick) {
      onClick(project);
    }
  }, [onClick, project]);

  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleClick();
    }
  }, [handleClick]);

  // Determine if this is a featured (large) card
  const isFeatured = style?.gridRow === 'span 2';

  return (
    <article
      ref={cardRef}
      className="works-card"
      role="button"
      tabIndex={0}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        ...style,
        position: 'relative',
        overflow: 'hidden',
        cursor: 'pointer',
        background: colors.bg.card,
        minHeight: isMobile ? '300px' : (isFeatured ? '500px' : '280px'),
        outline: 'none',
      }}
      aria-label={`View project: ${project.title}`}
    >
      {/* Image */}
      {project.image && (
        <img
          className="card-image"
          src={project.image}
          alt={project.title}
          width={800}
          height={600}
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
          }}
          loading="lazy"
        />
      )}

      {/* Overlay */}
      <div
        className="card-overlay"
        style={{
          position: 'absolute',
          inset: 0,
          background: isHovered
            ? `linear-gradient(to top, ${project.color}e6 0%, rgba(6,6,10,0.4) 100%)`
            : 'linear-gradient(to top, rgba(6,6,10,0.9) 0%, rgba(6,6,10,0.3) 100%)',
          transition: 'background 0.4s ease',
        }}
      />

      {/* Content */}
      <div
        className="card-content"
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          padding: isMobile ? '24px' : '32px',
          transform: isHovered ? 'translateY(0)' : 'translateY(10px)',
          transition: 'transform 0.4s ease',
        }}
      >
        {/* Number */}
        <span style={{
          fontFamily: typography.fontFamily.condensed,
          fontSize: '11px',
          color: 'rgba(255,255,255,0.5)',
          letterSpacing: '0.1em',
        }}>
          {String(index + 1).padStart(2, '0')}
        </span>

        {/* Category */}
        <p style={{
          fontFamily: typography.fontFamily.condensed,
          fontSize: '10px',
          color: isHovered ? '#fff' : project.color,
          letterSpacing: '0.15em',
          textTransform: 'uppercase',
          marginBottom: '8px',
          transition: 'color 0.3s ease',
        }}>
          {project.category}
        </p>

        {/* Title */}
        <h3 style={{
          fontFamily: typography.fontFamily.japanese,
          fontSize: isMobile ? '20px' : (isFeatured ? '28px' : '22px'),
          fontWeight: 500,
          color: '#fff',
          letterSpacing: '0.05em',
          lineHeight: 1.3,
          marginBottom: '8px',
        }}>
          {project.title}
        </h3>

        {/* Year */}
        <p style={{
          fontFamily: typography.fontFamily.mono,
          fontSize: '11px',
          color: 'rgba(255,255,255,0.6)',
        }}>
          {project.year}
        </p>

        {/* Hover indicator - "View Details" */}
        <div style={{
          marginTop: '16px',
          opacity: isHovered ? 1 : 0,
          transform: isHovered ? 'translateY(0)' : 'translateY(10px)',
          transition: 'all 0.3s ease 0.1s',
        }}>
          <span style={{
            fontFamily: typography.fontFamily.condensed,
            fontSize: '10px',
            color: '#fff',
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}>
            View Details
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path
                d="M2 6H10M10 6L7 3M10 6L7 9"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
        </div>
      </div>

      {/* Corner accent */}
      <div style={{
        position: 'absolute',
        top: '20px',
        right: '20px',
        width: '40px',
        height: '40px',
        borderTop: `1px solid ${isHovered ? '#fff' : 'rgba(255,255,255,0.2)'}`,
        borderRight: `1px solid ${isHovered ? '#fff' : 'rgba(255,255,255,0.2)'}`,
        transition: 'border-color 0.3s ease',
      }} />

      {/* Focus ring for accessibility */}
      <style>{`
        .works-card:focus-visible {
          outline: 2px solid ${colors.gold};
          outline-offset: 2px;
        }
      `}</style>
    </article>
  );
}

export default WorksCard;
