/**
 * ThemeToggleButton - Shared theme toggle component
 * Cycles through dark -> light -> system modes
 */

import React from 'react';
import { useTheme } from '../contexts';

function ThemeToggleIcon({ mode, size = 18 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ transition: 'transform 0.3s ease' }}
    >
      {mode === 'dark' ? (
        // Moon icon
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
      ) : mode === 'light' ? (
        // Sun icon
        <>
          <circle cx="12" cy="12" r="5" />
          <line x1="12" y1="1" x2="12" y2="3" />
          <line x1="12" y1="21" x2="12" y2="23" />
          <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
          <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
          <line x1="1" y1="12" x2="3" y2="12" />
          <line x1="21" y1="12" x2="23" y2="12" />
          <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
          <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
        </>
      ) : (
        // Monitor icon (system mode)
        <>
          <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
          <line x1="8" y1="21" x2="16" y2="21" />
          <line x1="12" y1="17" x2="12" y2="21" />
        </>
      )}
    </svg>
  );
}

export function ThemeToggleButton({ size = 16, style }) {
  const { colors, isDark, mode, cycleTheme } = useTheme();

  const bg = isDark ? 'rgba(0, 0, 0, 0.4)' : 'rgba(255, 255, 255, 0.6)';
  const border = isDark ? 'rgba(255,255,255,0.2)' : 'rgba(26, 24, 20, 0.15)';

  return (
    <button
      onClick={cycleTheme}
      aria-label={
        mode === 'dark' ? 'Dark mode - click for light mode' :
        mode === 'light' ? 'Light mode - click for system' :
        'System mode - click for dark mode'
      }
      title={
        mode === 'dark' ? 'Dark' :
        mode === 'light' ? 'Light' :
        'System'
      }
      style={{
        background: bg,
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        border: `1px solid ${border}`,
        borderRadius: '50%',
        cursor: 'pointer',
        padding: '10px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: colors.text.primary,
        transition: 'all 0.3s ease',
        ...style,
      }}
    >
      <ThemeToggleIcon mode={mode} size={size} />
    </button>
  );
}
