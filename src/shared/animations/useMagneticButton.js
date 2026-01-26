/**
 * useMagneticButton - Magnetic cursor attraction effect
 *
 * When cursor approaches the button, the button subtly moves toward the cursor.
 * On mouse leave, bounces back with elastic easing.
 * Disabled on mobile and when prefers-reduced-motion is active.
 */

import { useEffect, useRef, useCallback } from 'react';
import { gsap } from 'gsap';
import { prefersReducedMotion, isMobileDevice } from './gsapSetup';

/**
 * @param {Object} options
 * @param {number} options.strength - Attraction strength (default: 0.3)
 * @param {number} options.radius - Activation radius in px (default: 100)
 * @param {boolean} options.enabled - Whether effect is active
 * @returns {{ ref: React.RefObject }}
 */
export function useMagneticButton(options = {}) {
  const {
    strength = 0.3,
    radius = 100,
    enabled = true,
  } = options;

  const ref = useRef(null);
  const bounds = useRef(null);

  const handleMouseMove = useCallback((e) => {
    if (!ref.current || !bounds.current) return;

    const { left, top, width, height } = bounds.current;
    const centerX = left + width / 2;
    const centerY = top + height / 2;

    const dx = e.clientX - centerX;
    const dy = e.clientY - centerY;
    const dist = Math.sqrt(dx * dx + dy * dy);

    if (dist < radius) {
      const moveX = dx * strength;
      const moveY = dy * strength;

      gsap.to(ref.current, {
        x: moveX,
        y: moveY,
        duration: 0.3,
        ease: 'power2.out',
      });
    }
  }, [strength, radius]);

  const handleMouseLeave = useCallback(() => {
    if (!ref.current) return;

    gsap.to(ref.current, {
      x: 0,
      y: 0,
      duration: 0.7,
      ease: 'elastic.out(1, 0.4)',
    });
  }, []);

  const handleMouseEnter = useCallback(() => {
    if (!ref.current) return;
    bounds.current = ref.current.getBoundingClientRect();
  }, []);

  useEffect(() => {
    if (!enabled || !ref.current || prefersReducedMotion() || isMobileDevice()) return;

    const el = ref.current;
    el.addEventListener('mouseenter', handleMouseEnter);
    el.addEventListener('mousemove', handleMouseMove);
    el.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      el.removeEventListener('mouseenter', handleMouseEnter);
      el.removeEventListener('mousemove', handleMouseMove);
      el.removeEventListener('mouseleave', handleMouseLeave);
      gsap.set(el, { clearProps: 'x,y' });
    };
  }, [enabled, handleMouseEnter, handleMouseMove, handleMouseLeave]);

  return { ref };
}

export default useMagneticButton;
