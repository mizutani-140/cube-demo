/**
 * Responsive breakpoint hooks
 */

import { useState, useEffect } from 'react';
import { breakpoints } from '../tokens';

/**
 * Media query hook
 * @param {string} query - CSS media query string
 * @returns {boolean} - Whether the query matches
 */
export function useMediaQuery(query) {
  // Initialize with actual value to prevent flash
  const [matches, setMatches] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.matchMedia(query).matches;
    }
    return false;
  });

  useEffect(() => {
    const media = window.matchMedia(query);
    setMatches(media.matches);

    const listener = (e) => setMatches(e.matches);
    media.addEventListener('change', listener);
    return () => media.removeEventListener('change', listener);
  }, [query]);

  return matches;
}

/**
 * Breakpoint detection hook
 * @returns {Object} - Breakpoint flags
 */
export function useBreakpoints() {
  const isMobile = useMediaQuery(`(max-width: ${breakpoints.mobile}px)`);
  const isTablet = useMediaQuery(
    `(min-width: ${breakpoints.mobile + 1}px) and (max-width: ${breakpoints.tablet}px)`
  );
  const isDesktop = useMediaQuery(`(min-width: ${breakpoints.tablet + 1}px)`);
  const isWide = useMediaQuery(`(min-width: ${breakpoints.wide}px)`);

  // Reduced motion preference
  const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');

  return {
    isMobile,
    isTablet,
    isDesktop,
    isWide,
    prefersReducedMotion,
    // Helper for current breakpoint name
    current: isMobile ? 'mobile' : isTablet ? 'tablet' : 'desktop',
  };
}

/**
 * Window size hook
 * @returns {Object} - Window dimensions
 */
export function useWindowSize() {
  const [size, setSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
    height: typeof window !== 'undefined' ? window.innerHeight : 0,
  });

  useEffect(() => {
    const handleResize = () => {
      setSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return size;
}
