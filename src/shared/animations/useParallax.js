/**
 * useParallax - Multi-layer parallax hook
 *
 * Applies scroll-driven parallax movement based on data-parallax-speed attribute.
 * Uses GSAP ScrollTrigger scrub for smooth following.
 */

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { prefersReducedMotion, isMobileDevice } from './gsapSetup';

gsap.registerPlugin(ScrollTrigger);

/**
 * Apply parallax to a single element
 *
 * @param {Object} options
 * @param {number} options.speed - Parallax speed multiplier (default: 0.2)
 * @param {number} options.scrub - ScrollTrigger scrub value (default: 0.5)
 * @param {string} options.start - ScrollTrigger start
 * @param {string} options.end - ScrollTrigger end
 * @returns {{ ref: React.RefObject }}
 */
export function useParallax(options = {}) {
  const {
    speed = 0.2,
    scrub = 0.5,
    start = 'top bottom',
    end = 'bottom top',
  } = options;

  const ref = useRef(null);

  useEffect(() => {
    if (!ref.current || prefersReducedMotion() || isMobileDevice()) return;

    const ctx = gsap.context(() => {
      gsap.to(ref.current, {
        yPercent: -100 * speed,
        ease: 'none',
        scrollTrigger: {
          trigger: ref.current,
          start,
          end,
          scrub,
        },
      });
    }, ref);

    return () => ctx.revert();
  }, [speed, scrub, start, end]);

  return { ref };
}

/**
 * Apply parallax to all children with data-parallax-speed attribute
 *
 * @param {Object} options
 * @param {number} options.scrub - ScrollTrigger scrub value
 * @returns {{ containerRef: React.RefObject }}
 */
export function useParallaxContainer(options = {}) {
  const { scrub = 0.5 } = options;
  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current || prefersReducedMotion() || isMobileDevice()) return;

    const ctx = gsap.context(() => {
      const elements = containerRef.current.querySelectorAll('[data-parallax-speed]');
      elements.forEach((el) => {
        const speed = parseFloat(el.dataset.parallaxSpeed) || 0.2;
        gsap.to(el, {
          yPercent: -100 * speed,
          ease: 'none',
          scrollTrigger: {
            trigger: el,
            start: 'top bottom',
            end: 'bottom top',
            scrub,
          },
        });
      });
    }, containerRef);

    return () => ctx.revert();
  }, [scrub]);

  return { containerRef };
}

export default useParallax;
