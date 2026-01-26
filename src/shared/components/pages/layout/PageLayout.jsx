/**
 * Page Layout - Editorial Design System
 * 全ページ共通のレイアウト（Header, Footer, Navigation）
 *
 * Aesthetic: Japanese spatial harmony meets editorial precision
 * 「間」- The beauty of intentional space
 */

import React from 'react';
import { typography, globalStyles } from '../../../tokens';
import { useTheme } from '../../../contexts';
import { PageHeader } from './PageHeader';
import { PageFooter } from './PageFooter';
import { PageSideNavigation } from './PageSideNavigation';

export function PageLayout({ children, currentPage, onNavigate, headerVariant = 'default', hideFooter = false }) {
  const { colors, isDark } = useTheme();

  // Generate theme-aware global styles
  const themeGlobalStyles = `
    body {
      background: ${colors.bg.primary};
      color: ${colors.text.primary};
      transition: background 0.4s ease, color 0.4s ease;
    }

    ::selection {
      background: ${colors.gold};
      color: ${isDark ? colors.bg.primary : colors.text.inverse};
    }

    ::-webkit-scrollbar-track {
      background: ${colors.bg.secondary};
    }

    ::-webkit-scrollbar-thumb {
      background: ${colors.goldMuted};
    }

    ::-webkit-scrollbar-thumb:hover {
      background: ${colors.gold};
    }
  `;

  return (
    <div
      style={{
        minHeight: '100vh',
        background: colors.bg.primary,
        fontFamily: typography.fontFamily.body,
        transition: 'background 0.4s ease',
      }}
    >
      <PageHeader
        currentPage={currentPage}
        onNavigate={onNavigate}
        variant={headerVariant}
      />
      <main style={{ paddingTop: '80px' }}>
        {children}
      </main>
      {!hideFooter && <PageFooter onNavigate={onNavigate} />}

      {/* Side Navigation for Desktop */}
      <PageSideNavigation
        currentPage={currentPage}
        onNavigate={onNavigate}
      />

      <style>{globalStyles}</style>
      <style>{themeGlobalStyles}</style>
    </div>
  );
}

// Default export
export default PageLayout;
