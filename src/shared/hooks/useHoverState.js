/**
 * Hover state management with debouncing
 */

import { useState, useCallback, useRef, useEffect } from 'react';

/**
 * Hover state hook with debounce to prevent flicker
 * @param {any} initialState - Initial hover ID
 * @param {number} debounceMs - Debounce delay in ms
 * @returns {Object} - Hover state and handlers
 */
export function useHoverState(initialState = null, debounceMs = 50) {
  const [hoveredId, setHoveredId] = useState(initialState);
  const timeoutRef = useRef(null);

  const handleHover = useCallback((id) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setHoveredId(id);
  }, []);

  const handleLeave = useCallback(() => {
    // Debounce leave to prevent flicker when moving between elements
    timeoutRef.current = setTimeout(() => {
      setHoveredId(null);
    }, debounceMs);
  }, [debounceMs]);

  const clearHover = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setHoveredId(null);
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return {
    hoveredId,
    handleHover,
    handleLeave,
    clearHover,
    isHovered: (id) => hoveredId === id,
  };
}

/**
 * Multi-hover state for managing multiple hover zones
 * @returns {Object} - Multi-hover state and handlers
 */
export function useMultiHoverState() {
  const [hoveredIds, setHoveredIds] = useState(new Set());

  const addHover = useCallback((id) => {
    setHoveredIds((prev) => new Set([...prev, id]));
  }, []);

  const removeHover = useCallback((id) => {
    setHoveredIds((prev) => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
  }, []);

  const clearAll = useCallback(() => {
    setHoveredIds(new Set());
  }, []);

  return {
    hoveredIds,
    addHover,
    removeHover,
    clearAll,
    isHovered: (id) => hoveredIds.has(id),
    count: hoveredIds.size,
  };
}
