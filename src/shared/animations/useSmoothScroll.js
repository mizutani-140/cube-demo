/**
 * useSmoothScroll - Lenis smooth scroll integration
 *
 * Provides buttery-smooth scrolling via Lenis, synced with GSAP ScrollTrigger.
 * Automatically disabled for prefers-reduced-motion.
 */

import { useEffect, useRef } from 'react';
import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { prefersReducedMotion } from './gsapSetup';

gsap.registerPlugin(ScrollTrigger);

/**
 * @param {Object} options
 * @param {boolean} options.enabled - Enable smooth scroll (default: true)
 * @param {number} options.lerp - Smoothing factor (default: 0.1)
 * @param {number} options.duration - Scroll duration (default: 1.2)
 * @param {'vertical'|'horizontal'} options.orientation - Scroll direction
 * @returns {{ lenis: Lenis|null }}
 */
export function useSmoothScroll(options = {}) {
  const {
    enabled = true,
    lerp = 0.1,
    duration = 1.2,
    orientation = 'vertical',
  } = options;

  const lenisRef = useRef(null);

  useEffect(() => {
    // Skip if disabled or reduced motion
    if (!enabled || prefersReducedMotion()) return;

    const lenis = new Lenis({
      lerp,
      duration,
      orientation,
      gestureOrientation: 'vertical',
      smoothWheel: true,
      touchMultiplier: 2,
    });

    lenisRef.current = lenis;

    // Sync Lenis with GSAP ScrollTrigger
    lenis.on('scroll', ScrollTrigger.update);

    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });

    gsap.ticker.lagSmoothing(0);

    return () => {
      lenis.destroy();
      lenisRef.current = null;
    };
  }, [enabled, lerp, duration, orientation]);

  return { lenis: lenisRef };
}

export default useSmoothScroll;
