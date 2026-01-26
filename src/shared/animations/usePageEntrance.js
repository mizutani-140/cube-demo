/**
 * usePageEntrance - Page entrance animation sequence hook
 *
 * Orchestrates staggered entrance of page sections on mount.
 * Handles hero, sections, and child element stagger reveals.
 */

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { prefersReducedMotion } from './gsapSetup';

gsap.registerPlugin(ScrollTrigger);

/**
 * @param {Object} options
 * @param {number} options.delay - Initial delay before sequence starts
 * @param {boolean} options.enabled - Whether to run the animation
 * @returns {{ containerRef: React.RefObject }}
 */
export function usePageEntrance(options = {}) {
  const { delay = 0.1, enabled = true } = options;
  const containerRef = useRef(null);

  useEffect(() => {
    if (!enabled || !containerRef.current) return;

    const ctx = gsap.context(() => {
      if (prefersReducedMotion()) {
        // Simple fade for reduced motion
        gsap.fromTo(containerRef.current,
          { opacity: 0 },
          { opacity: 1, duration: 0.3 }
        );
        return;
      }

      // Animate sections that enter viewport
      const sections = containerRef.current.querySelectorAll('[data-animate-section]');
      sections.forEach((section) => {
        const children = section.querySelectorAll('.section-animate');
        if (children.length > 0) {
          gsap.fromTo(children,
            { opacity: 0, y: 40 },
            {
              opacity: 1,
              y: 0,
              duration: 0.7,
              stagger: 0.1,
              ease: 'power3.out',
              scrollTrigger: {
                trigger: section,
                start: 'top 80%',
              },
            }
          );
        }
      });
    }, containerRef);

    return () => ctx.revert();
  }, [delay, enabled]);

  return { containerRef };
}

/**
 * useSectionReveal - Scroll-triggered section reveal
 *
 * Applies fade-up + stagger animation to a section's children
 * when the section enters the viewport.
 */
export function useSectionReveal(options = {}) {
  const {
    start = 'top 80%',
    stagger = 0.1,
    y = 40,
    duration = 0.7,
  } = options;

  const ref = useRef(null);

  useEffect(() => {
    if (!ref.current) return;

    if (prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      const children = ref.current.querySelectorAll('.section-animate');
      if (children.length === 0) return;

      gsap.fromTo(children,
        { opacity: 0, y },
        {
          opacity: 1,
          y: 0,
          duration,
          stagger,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: ref.current,
            start,
          },
        }
      );
    }, ref);

    return () => ctx.revert();
  }, [start, stagger, y, duration]);

  return { ref };
}

export { usePageEntrance as default };
