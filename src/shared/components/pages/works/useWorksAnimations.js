/**
 * Works Animations - Anime.js v4 Custom Hook
 *
 * Provides animation utilities for the Works page using Anime.js v4 API.
 * Handles timeline animations, scroll-based reveals, and layout transitions.
 */

import { useCallback, useRef, useEffect } from 'react';
import { animate, Timeline, stagger } from 'animejs';

/**
 * Hook for managing Works page animations
 */
export function useWorksAnimations() {
  const animationsRef = useRef([]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      animationsRef.current.forEach(anim => {
        if (anim && anim.pause) {
          anim.pause();
        }
      });
      animationsRef.current = [];
    };
  }, []);

  /**
   * Hero section timeline animation
   */
  const animateHero = useCallback((containerRef) => {
    if (!containerRef?.current) return;

    const tl = new Timeline({
      defaults: {
        ease: 'outQuint',
      }
    });

    tl.add(containerRef.current.querySelectorAll('.hero-line'), {
      scaleX: [0, 1],
      duration: 1200,
    })
    .add(containerRef.current.querySelectorAll('.hero-text'), {
      opacity: [0, 1],
      translateY: [60, 0],
      duration: 1000,
      delay: stagger(120),
    }, '-=600')
    .add(containerRef.current.querySelectorAll('.hero-decoration'), {
      opacity: [0, 1],
      translateX: [-50, 0],
      duration: 1200,
    }, '-=800');

    animationsRef.current.push(tl);
    return tl;
  }, []);

  /**
   * Filter button click animation
   */
  const animateFilterClick = useCallback((element) => {
    if (!element) return;

    const anim = animate(element, {
      scale: [1, 0.95, 1],
      duration: 300,
      ease: 'outQuint',
    });

    animationsRef.current.push(anim);
    return anim;
  }, []);

  /**
   * Card hover animation - enter
   */
  const animateCardEnter = useCallback((cardElement) => {
    if (!cardElement) return;

    const image = cardElement.querySelector('.card-image');
    const overlay = cardElement.querySelector('.card-overlay');
    const content = cardElement.querySelector('.card-content');

    const anims = [];

    if (image) {
      anims.push(animate(image, {
        scale: 1.08,
        duration: 600,
        ease: 'outQuint',
      }));
    }

    if (overlay) {
      anims.push(animate(overlay, {
        opacity: [null, 1],
        duration: 400,
        ease: 'outQuint',
      }));
    }

    if (content) {
      anims.push(animate(content, {
        translateY: [null, 0],
        duration: 400,
        ease: 'outQuint',
      }));
    }

    animationsRef.current.push(...anims);
    return anims;
  }, []);

  /**
   * Card hover animation - leave
   */
  const animateCardLeave = useCallback((cardElement) => {
    if (!cardElement) return;

    const image = cardElement.querySelector('.card-image');
    const content = cardElement.querySelector('.card-content');

    const anims = [];

    if (image) {
      anims.push(animate(image, {
        scale: 1,
        duration: 500,
        ease: 'outQuint',
      }));
    }

    if (content) {
      anims.push(animate(content, {
        translateY: 10,
        duration: 400,
        ease: 'outQuint',
      }));
    }

    animationsRef.current.push(...anims);
    return anims;
  }, []);

  /**
   * Grid cards stagger animation
   */
  const animateGridCards = useCallback((containerElement, options = {}) => {
    if (!containerElement) return;

    const cards = containerElement.querySelectorAll('.works-card');
    if (!cards.length) return;

    const anim = animate(cards, {
      opacity: [0, 1],
      translateY: [60, 0],
      duration: 800,
      delay: stagger(100, { from: options.from || 'first' }),
      ease: 'outQuint',
    });

    animationsRef.current.push(anim);
    return anim;
  }, []);

  /**
   * Modal open animation
   */
  const animateModalOpen = useCallback((modalElement) => {
    if (!modalElement) return;

    const backdrop = modalElement.querySelector('.modal-backdrop');
    const content = modalElement.querySelector('.modal-content');
    const closeBtn = modalElement.querySelector('.modal-close-btn');
    const elements = modalElement.querySelectorAll('.case-study-element');

    // Show close button immediately (no animation delay)
    if (closeBtn) {
      closeBtn.style.opacity = '1';
    }

    const tl = new Timeline({
      defaults: { ease: 'outQuint' }
    });

    if (backdrop) {
      tl.add(backdrop, {
        opacity: [0, 1],
        duration: 300,
      });
    }

    if (content) {
      tl.add(content, {
        scale: [0.92, 1],
        opacity: [0, 1],
        duration: 500,
      }, '-=200');
    }

    if (elements.length) {
      tl.add(elements, {
        translateY: [20, 0],
        opacity: [0, 1],
        duration: 600,
        delay: stagger(60),
      }, '-=300');
    }

    animationsRef.current.push(tl);
    return tl;
  }, []);

  /**
   * Modal close animation
   */
  const animateModalClose = useCallback(async (modalElement) => {
    if (!modalElement) return;

    const content = modalElement.querySelector('.modal-content');
    const closeBtn = modalElement.querySelector('.modal-close-btn');
    const backdrop = modalElement.querySelector('.modal-backdrop');

    // Animate close button and content together
    const promises = [];

    if (closeBtn) {
      promises.push(animate(closeBtn, {
        opacity: [1, 0],
        translateY: [0, -20],
        duration: 200,
        ease: 'inQuint',
      }).finished);
    }

    if (content) {
      promises.push(animate(content, {
        opacity: [1, 0],
        scale: [1, 0.95],
        duration: 300,
        ease: 'inQuint',
      }).finished);
    }

    await Promise.all(promises);

    if (backdrop) {
      await animate(backdrop, {
        opacity: [1, 0],
        duration: 200,
        ease: 'inQuint',
      }).finished;
    }
  }, []);

  /**
   * Filter grid layout transition
   */
  const animateFilterTransition = useCallback((containerElement) => {
    if (!containerElement) return;

    const cards = containerElement.querySelectorAll('.works-card');
    if (!cards.length) return;

    // First, fade out existing cards
    const fadeOut = animate(cards, {
      opacity: 0,
      scale: 0.95,
      duration: 200,
      ease: 'inQuint',
    });

    animationsRef.current.push(fadeOut);
    return fadeOut;
  }, []);

  /**
   * Filter grid layout appear
   */
  const animateFilterAppear = useCallback((containerElement) => {
    if (!containerElement) return;

    const cards = containerElement.querySelectorAll('.works-card');
    if (!cards.length) return;

    const anim = animate(cards, {
      opacity: [0, 1],
      scale: [0.95, 1],
      translateY: [20, 0],
      duration: 500,
      delay: stagger(40, { from: 'center' }),
      ease: 'outQuint',
    });

    animationsRef.current.push(anim);
    return anim;
  }, []);

  /**
   * Scroll-based reveal for cards
   */
  const setupScrollReveal = useCallback((containerElement) => {
    if (!containerElement) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const card = entry.target;
            animate(card, {
              opacity: [0, 1],
              translateY: [60, 0],
              duration: 800,
              ease: 'outQuint',
            });
            observer.unobserve(card);
          }
        });
      },
      {
        threshold: 0.15,
        rootMargin: '0px 0px -10% 0px',
      }
    );

    const cards = containerElement.querySelectorAll('.works-card');
    cards.forEach((card) => {
      card.style.opacity = '0';
      observer.observe(card);
    });

    return () => observer.disconnect();
  }, []);

  return {
    animateHero,
    animateFilterClick,
    animateCardEnter,
    animateCardLeave,
    animateGridCards,
    animateModalOpen,
    animateModalClose,
    animateFilterTransition,
    animateFilterAppear,
    setupScrollReveal,
  };
}

/**
 * Hook for reduced motion preference
 */
export function usePrefersReducedMotion() {
  const query = '(prefers-reduced-motion: reduce)';

  if (typeof window === 'undefined') return false;

  return window.matchMedia(query).matches;
}
