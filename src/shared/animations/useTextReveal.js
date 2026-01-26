/**
 * useTextReveal - Text animation hook
 *
 * Splits text into characters/words and animates them with rotation entrance.
 * Supports scroll-triggered or immediate playback.
 */

import { useEffect, useRef, useCallback } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { splitText } from './splitText';
import { prefersReducedMotion } from './gsapSetup';

gsap.registerPlugin(ScrollTrigger);

/**
 * @param {Object} options
 * @param {'chars'|'words'|'auto'} options.type - Split mode
 * @param {boolean} options.scrollTrigger - Use ScrollTrigger (default: false)
 * @param {string} options.start - ScrollTrigger start position
 * @param {number} options.delay - Animation delay
 * @param {number} options.duration - Per-character duration
 * @param {number} options.stagger - Stagger between chars
 * @param {'rotateUp'|'fadeUp'|'slideUp'} options.animation - Animation style
 * @returns {{ ref: React.RefObject, replay: () => void }}
 */
export function useTextReveal(options = {}) {
  const {
    type = 'auto',
    scrollTrigger: useScrollTrigger = false,
    start = 'top 85%',
    delay = 0,
    duration = 0.6,
    stagger = 0.03,
    animation = 'rotateUp',
  } = options;

  const ref = useRef(null);
  const splitRef = useRef(null);
  const tlRef = useRef(null);

  const animate = useCallback(() => {
    if (!ref.current) return;

    // Clean up previous split
    if (splitRef.current) {
      splitRef.current.revert();
    }

    const { chars, revert } = splitText(ref.current, { type });
    splitRef.current = { chars, revert };

    if (chars.length === 0) return;

    // Reduced motion: simple fade
    if (prefersReducedMotion()) {
      gsap.fromTo(ref.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.3 }
      );
      return;
    }

    // Set initial state
    const fromVars = {};
    const toVars = {
      duration,
      stagger,
      ease: 'power3.out',
    };

    switch (animation) {
      case 'rotateUp':
        fromVars.opacity = 0;
        fromVars.rotationX = -90;
        fromVars.y = 20;
        fromVars.transformOrigin = 'bottom center';
        toVars.opacity = 1;
        toVars.rotationX = 0;
        toVars.y = 0;
        break;
      case 'fadeUp':
        fromVars.opacity = 0;
        fromVars.y = 30;
        toVars.opacity = 1;
        toVars.y = 0;
        break;
      case 'slideUp':
        fromVars.opacity = 0;
        fromVars.y = '100%';
        fromVars.clipPath = 'inset(100% 0% 0% 0%)';
        toVars.opacity = 1;
        toVars.y = '0%';
        toVars.clipPath = 'inset(0% 0% 0% 0%)';
        break;
      default:
        fromVars.opacity = 0;
        fromVars.y = 20;
        toVars.opacity = 1;
        toVars.y = 0;
    }

    if (useScrollTrigger) {
      toVars.scrollTrigger = {
        trigger: ref.current,
        start,
      };
    }

    toVars.delay = delay;

    tlRef.current = gsap.fromTo(chars, fromVars, toVars);
  }, [type, useScrollTrigger, start, delay, duration, stagger, animation]);

  useEffect(() => {
    animate();

    return () => {
      if (tlRef.current) {
        tlRef.current.kill();
      }
      if (splitRef.current) {
        splitRef.current.revert();
      }
    };
  }, [animate]);

  const replay = useCallback(() => {
    if (tlRef.current) {
      tlRef.current.kill();
    }
    animate();
  }, [animate]);

  return { ref, replay };
}

export default useTextReveal;
