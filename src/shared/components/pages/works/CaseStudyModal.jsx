/**
 * CaseStudyModal - Case Study Detail Modal
 *
 * Full-screen overlay modal with Anime.js entrance/exit animations.
 * Displays project details with image gallery, metadata, and tags.
 */

import React, { useRef, useEffect, useCallback, useState } from 'react';
import { useBreakpoints } from '../../../hooks/useBreakpoints';
import { colors as defaultColors, typography, zIndex } from '../../../tokens';
import { useWorksAnimations } from './useWorksAnimations';
import { useTheme } from '../../../contexts';
import { useSEO, getProjectSEO } from '../../../hooks/useSEO';

export function CaseStudyModal({ project, isOpen, onClose }) {
  const { isMobile } = useBreakpoints();
  const { colors, isDark } = useTheme();
  const modalRef = useRef();
  const { animateModalOpen, animateModalClose } = useWorksAnimations();
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  // SEO: プロジェクト詳細ページのメタ情報を動的に更新
  useSEO(isOpen && project ? getProjectSEO(project) : {});

  // Theme-aware backdrop
  const backdropBg = isDark ? 'rgba(6, 6, 10, 0.95)' : 'rgba(245, 242, 235, 0.95)';

  // Reset active image when project changes
  useEffect(() => {
    setActiveImageIndex(0);
  }, [project?.id]);

  // Handle ESC key to close
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        handleClose();
      }
      // Arrow keys to navigate gallery
      if (isOpen && project?.gallery?.length > 1) {
        if (e.key === 'ArrowLeft') {
          setActiveImageIndex((prev) =>
            prev === 0 ? project.gallery.length - 1 : prev - 1
          );
        }
        if (e.key === 'ArrowRight') {
          setActiveImageIndex((prev) =>
            prev === project.gallery.length - 1 ? 0 : prev + 1
          );
        }
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, project?.gallery?.length]);

  // Animate on open
  useEffect(() => {
    if (isOpen && modalRef.current) {
      animateModalOpen(modalRef.current);
    }
  }, [isOpen, animateModalOpen]);

  // Handle close with animation
  const handleClose = useCallback(async () => {
    if (modalRef.current) {
      await animateModalClose(modalRef.current);
    }
    onClose();
  }, [onClose, animateModalClose]);

  // Handle backdrop click
  const handleBackdropClick = useCallback((e) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  }, [handleClose]);

  if (!isOpen || !project) return null;

  const gallery = project.gallery || [project.image];
  const activeImage = gallery[activeImageIndex];

  return (
    <div
      ref={modalRef}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: zIndex.modal,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: isMobile ? '20px' : '40px',
      }}
    >
      {/* Backdrop */}
      <div
        className="modal-backdrop"
        onClick={handleBackdropClick}
        style={{
          position: 'absolute',
          inset: 0,
          background: backdropBg,
          backdropFilter: 'blur(12px)',
          opacity: 0,
        }}
      />


      {/* Modal content */}
      <div
        className="modal-content"
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: '1100px',
          maxHeight: '90vh',
          background: colors.bg.primary,
          borderRadius: isMobile ? '8px' : '12px',
          overflow: 'hidden',
          overflowY: 'auto',
          opacity: 0,
          boxShadow: '0 32px 64px rgba(0, 0, 0, 0.6)',
        }}
        role="dialog"
        aria-labelledby="modal-title"
        aria-modal="true"
      >
        {/* Back button - inside modal */}
        <button
          onClick={handleClose}
          aria-label="戻る"
          className="modal-close-btn"
          style={{
            position: 'sticky',
            top: 0,
            left: 0,
            width: '100%',
            padding: isMobile ? '14px 20px' : '16px 24px',
            background: colors.bg.secondary,
            border: 'none',
            borderBottom: `1px solid ${colors.ui.divider}`,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            zIndex: 10,
            transition: 'all 0.3s ease',
            touchAction: 'manipulation',
            WebkitTapHighlightColor: 'transparent',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = colors.bg.tertiary || colors.bg.secondary;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = colors.bg.secondary;
          }}
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path
              d="M12 5L7 10L12 15"
              stroke={colors.gold}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span style={{
            fontFamily: typography.fontFamily.condensed,
            fontSize: isMobile ? '14px' : '13px',
            color: colors.gold,
            letterSpacing: '0.1em',
            fontWeight: 600,
          }}>
            {isMobile ? '一覧に戻る' : 'BACK TO LIST'}
          </span>
        </button>

        {/* Main image viewer */}
        <div
          className="case-study-element"
          style={{
            position: 'relative',
            width: '100%',
            aspectRatio: '16 / 9',
            overflow: 'hidden',
            opacity: 0,
            background: colors.bg.secondary,
          }}
        >
          {activeImage && (
            <img
              src={activeImage}
              alt={`${project.title} - Image ${activeImageIndex + 1}`}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                transition: 'opacity 0.3s ease',
              }}
            />
          )}

          {/* Gradient overlay */}
          <div style={{
            position: 'absolute',
            inset: 0,
            background: `linear-gradient(to top, ${colors.bg.primary} 0%, transparent 30%)`,
            pointerEvents: 'none',
          }} />

          {/* Navigation arrows */}
          {gallery.length > 1 && (
            <>
              <button
                onClick={() => setActiveImageIndex((prev) =>
                  prev === 0 ? gallery.length - 1 : prev - 1
                )}
                aria-label="Previous image"
                style={{
                  position: 'absolute',
                  left: isMobile ? '12px' : '24px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  width: isMobile ? '36px' : '48px',
                  height: isMobile ? '36px' : '48px',
                  background: 'rgba(0, 0, 0, 0.5)',
                  border: `1px solid ${colors.ui.border}`,
                  borderRadius: '50%',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.3s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(0, 0, 0, 0.8)';
                  e.currentTarget.style.borderColor = colors.gold;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(0, 0, 0, 0.5)';
                  e.currentTarget.style.borderColor = colors.ui.border;
                }}
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M10 4L6 8L10 12" stroke={colors.text.primary} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>

              <button
                onClick={() => setActiveImageIndex((prev) =>
                  prev === gallery.length - 1 ? 0 : prev + 1
                )}
                aria-label="Next image"
                style={{
                  position: 'absolute',
                  right: isMobile ? '12px' : '24px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  width: isMobile ? '36px' : '48px',
                  height: isMobile ? '36px' : '48px',
                  background: 'rgba(0, 0, 0, 0.5)',
                  border: `1px solid ${colors.ui.border}`,
                  borderRadius: '50%',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.3s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(0, 0, 0, 0.8)';
                  e.currentTarget.style.borderColor = colors.gold;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(0, 0, 0, 0.5)';
                  e.currentTarget.style.borderColor = colors.ui.border;
                }}
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M6 4L10 8L6 12" stroke={colors.text.primary} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </>
          )}

          {/* Image counter */}
          {gallery.length > 1 && (
            <div style={{
              position: 'absolute',
              bottom: isMobile ? '16px' : '24px',
              left: '50%',
              transform: 'translateX(-50%)',
              fontFamily: typography.fontFamily.mono,
              fontSize: '11px',
              color: colors.text.secondary,
              background: 'rgba(0, 0, 0, 0.6)',
              padding: '6px 12px',
              borderRadius: '20px',
              letterSpacing: '0.1em',
            }}>
              {activeImageIndex + 1} / {gallery.length}
            </div>
          )}
        </div>

        {/* Thumbnail gallery */}
        {gallery.length > 1 && (
          <div
            className="case-study-element"
            style={{
              padding: isMobile ? '16px 20px' : '20px 48px',
              background: colors.bg.secondary,
              borderBottom: `1px solid ${colors.ui.divider}`,
              opacity: 0,
            }}
          >
            <div style={{
              display: 'flex',
              gap: isMobile ? '8px' : '12px',
              overflowX: 'auto',
              paddingBottom: '4px',
            }}>
              {gallery.map((img, index) => (
                <button
                  key={index}
                  onClick={() => setActiveImageIndex(index)}
                  aria-label={`View image ${index + 1}`}
                  style={{
                    flexShrink: 0,
                    width: isMobile ? '60px' : '80px',
                    height: isMobile ? '45px' : '60px',
                    borderRadius: '4px',
                    overflow: 'hidden',
                    cursor: 'pointer',
                    border: index === activeImageIndex
                      ? `2px solid ${colors.gold}`
                      : `2px solid transparent`,
                    opacity: index === activeImageIndex ? 1 : 0.6,
                    transition: 'all 0.3s ease',
                    padding: 0,
                    background: 'none',
                  }}
                  onMouseEnter={(e) => {
                    if (index !== activeImageIndex) {
                      e.currentTarget.style.opacity = '1';
                      e.currentTarget.style.borderColor = colors.ui.borderHover;
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (index !== activeImageIndex) {
                      e.currentTarget.style.opacity = '0.6';
                      e.currentTarget.style.borderColor = 'transparent';
                    }
                  }}
                >
                  <img
                    src={img}
                    alt={`Thumbnail ${index + 1}`}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                    }}
                  />
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Content */}
        <div style={{
          padding: isMobile ? '24px 20px 32px' : '40px 48px 56px',
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : '200px 1fr',
          gap: isMobile ? '32px' : '48px',
        }}>
          {/* Meta sidebar */}
          <div
            className="case-study-element"
            style={{ opacity: 0 }}
          >
            {/* Year */}
            <div style={{ marginBottom: '24px' }}>
              <p style={{
                fontFamily: typography.fontFamily.mono,
                fontSize: '10px',
                color: colors.text.muted,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                marginBottom: '6px',
              }}>
                Year
              </p>
              <p style={{
                fontFamily: typography.fontFamily.condensed,
                fontSize: '24px',
                color: colors.text.primary,
                letterSpacing: '0.05em',
              }}>
                {project.year}
              </p>
            </div>

            {/* Location */}
            <div style={{ marginBottom: '24px' }}>
              <p style={{
                fontFamily: typography.fontFamily.mono,
                fontSize: '10px',
                color: colors.text.muted,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                marginBottom: '6px',
              }}>
                Location
              </p>
              <p style={{
                fontFamily: typography.fontFamily.body,
                fontSize: '14px',
                color: colors.text.primary,
                lineHeight: 1.6,
              }}>
                {project.location}
              </p>
            </div>

            {/* Category */}
            <div>
              <p style={{
                fontFamily: typography.fontFamily.mono,
                fontSize: '10px',
                color: colors.text.muted,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                marginBottom: '6px',
              }}>
                Category
              </p>
              <p style={{
                fontFamily: typography.fontFamily.condensed,
                fontSize: '13px',
                color: project.color,
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
              }}>
                {project.category}
              </p>
            </div>
          </div>

          {/* Main content */}
          <div>
            {/* Title */}
            <div
              className="case-study-element"
              style={{ marginBottom: '24px', opacity: 0 }}
            >
              <h2
                id="modal-title"
                style={{
                  fontFamily: typography.fontFamily.japanese,
                  fontSize: isMobile ? '28px' : '40px',
                  fontWeight: 500,
                  color: colors.text.primary,
                  letterSpacing: '0.05em',
                  lineHeight: 1.2,
                  marginBottom: '12px',
                }}
              >
                {project.title}
              </h2>

              {project.titleEn && (
                <p style={{
                  fontFamily: typography.fontFamily.display,
                  fontSize: typography.fontSize.lg,
                  fontWeight: 300,
                  fontStyle: 'italic',
                  color: colors.text.tertiary,
                  letterSpacing: '0.02em',
                }}>
                  {project.titleEn}
                </p>
              )}
            </div>

            {/* Description */}
            <div
              className="case-study-element"
              style={{ marginBottom: '32px', opacity: 0 }}
            >
              <p style={{
                fontFamily: typography.fontFamily.body,
                fontSize: typography.fontSize.base,
                color: colors.text.secondary,
                lineHeight: 1.9,
                maxWidth: '560px',
              }}>
                {project.description}
              </p>
            </div>

            {/* Tags */}
            {project.tags && project.tags.length > 0 && (
              <div
                className="case-study-element"
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: '8px',
                  opacity: 0,
                }}
              >
                {project.tags.map((tag, i) => (
                  <span
                    key={i}
                    style={{
                      fontFamily: typography.fontFamily.body,
                      fontSize: '11px',
                      color: colors.text.tertiary,
                      padding: '8px 16px',
                      border: `1px solid ${colors.ui.border}`,
                      borderRadius: '20px',
                      transition: 'all 0.3s ease',
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {/* Divider */}
            <div style={{
              width: '60px',
              height: '1px',
              background: colors.ui.border,
              margin: '40px 0',
            }} />

            {/* Call to action */}
            <div
              className="case-study-element"
              style={{ opacity: 0 }}
            >
              <p style={{
                fontFamily: typography.fontFamily.body,
                fontSize: '13px',
                color: colors.text.muted,
                marginBottom: '12px',
              }}>
                このプロジェクトについてのお問い合わせ
              </p>
              <button
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '12px 24px',
                  background: 'transparent',
                  border: `1px solid ${colors.gold}`,
                  borderRadius: '4px',
                  color: colors.gold,
                  fontFamily: typography.fontFamily.condensed,
                  fontSize: '12px',
                  letterSpacing: '0.15em',
                  textTransform: 'uppercase',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = colors.gold;
                  e.currentTarget.style.color = colors.bg.primary;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.color = colors.gold;
                }}
              >
                Contact Us
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path
                    d="M2 6H10M10 6L7 3M10 6L7 9"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
