/**
 * Theme Context - Light/Dark/System Mode Management
 * テーマ切り替え機能の状態管理（ライト・ダーク・システム連動）
 */

import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { colors } from '../tokens';

// ライトモード用カラーパレット
// より白ベースの明るい配色
// ゴールドアクセントとの調和を重視
export const lightColors = {
  // Primary brand - Darker gold for better contrast on light bg
  gold: '#8a6a10',
  goldLight: '#a68418',
  goldDark: '#6a5008',
  goldMuted: 'rgba(138, 106, 16, 0.12)',
  goldVibrant: '#b8941f',

  // Background - More white-based (cleaner look)
  bg: {
    primary: '#fafafa',      // メイン背景（ほぼ白）
    secondary: '#f5f5f3',    // セカンダリ背景
    tertiary: '#eeede8',     // ターシャリ背景
    elevated: '#ffffff',     // 浮き上がった要素（カード等）
    card: '#ffffff',         // カード背景
    warm: '#f8f6f2',         // 暖色強め（セクション用）
    paper: '#fafaf8',
    paperDark: '#f0efe9',
    hover: '#f0efea',        // ホバー時の背景
  },

  // Accent colors - Darker for better visibility on light bg
  accents: {
    works: '#7a6a4a',        // ダークベージュ
    about: '#4a5b6d',        // ダークスチール
    access: '#2a6a8a',       // ダークブルー
    contact: '#5a5f67',      // ダークグレー
    food: '#9a2020',         // ダークレッド
    gallery: '#2a7a5a',      // ダークグリーン
  },

  // Text hierarchy - Higher contrast dark colors
  text: {
    primary: '#1a1814',      // メインテキスト（暖色系ダーク）
    secondary: 'rgba(26, 24, 20, 0.80)',
    tertiary: 'rgba(26, 24, 20, 0.65)',
    muted: 'rgba(26, 24, 20, 0.45)',
    accent: '#8a6a10',
    inverse: '#fafafa',
    brushBlack: '#1a1814',
    inkGray: '#3d3a35',
  },

  // UI elements
  ui: {
    border: 'rgba(26, 24, 20, 0.10)',
    borderHover: 'rgba(26, 24, 20, 0.20)',
    borderActive: 'rgba(138, 106, 16, 0.5)',
    divider: 'rgba(26, 24, 20, 0.08)',
    overlay: 'rgba(250, 250, 250, 0.95)',
    overlayLight: 'rgba(250, 250, 250, 0.85)',
    grain: 'rgba(26, 24, 20, 0.02)',
    // ホバー用
    hoverBg: 'rgba(26, 24, 20, 0.04)',
    activeBg: 'rgba(138, 106, 16, 0.08)',
  },
};

// ダークモード用カラーパレット（既存）
export const darkColors = colors;

// システムのカラースキームを取得するヘルパー
function getSystemTheme() {
  if (typeof window !== 'undefined' && window.matchMedia) {
    return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
  }
  return 'light';
}

// テーマコンテキスト
const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  // モード: 'dark' | 'light' | 'system'
  const [mode, setMode] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('cube-theme-mode');
      if (saved === 'dark' || saved === 'light' || saved === 'system') return saved;
      // 旧バージョンとの互換性（'cube-theme' キーから移行）
      const legacy = localStorage.getItem('cube-theme');
      if (legacy === 'dark' || legacy === 'light') return legacy;
    }
    return 'light';
  });

  // システム設定の追跡（system モードの場合に使用）
  const [systemTheme, setSystemTheme] = useState(getSystemTheme);

  // システムのカラースキーム変更を監視
  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const mql = window.matchMedia('(prefers-color-scheme: light)');
    const handler = (e) => {
      setSystemTheme(e.matches ? 'light' : 'dark');
    };
    mql.addEventListener('change', handler);
    return () => mql.removeEventListener('change', handler);
  }, []);

  // 解決済みテーマ（実際に適用されるテーマ）
  const resolvedTheme = mode === 'system' ? systemTheme : mode;

  // テーマに応じたカラーを取得
  const themeColors = useMemo(() => {
    return resolvedTheme === 'light' ? lightColors : darkColors;
  }, [resolvedTheme]);

  // テーマモードを3段階で切り替え: light → dark → system → light
  const cycleTheme = useCallback(() => {
    setMode(prev => {
      if (prev === 'light') return 'dark';
      if (prev === 'dark') return 'system';
      return 'light';
    });
  }, []);

  // 後方互換性のための toggleTheme（cycleTheme のエイリアス）
  const toggleTheme = cycleTheme;

  // ローカルストレージに保存
  useEffect(() => {
    localStorage.setItem('cube-theme-mode', mode);
    // HTML要素にテーマ属性を設定（解決済みテーマ）
    document.documentElement.setAttribute('data-theme', resolvedTheme);
  }, [mode, resolvedTheme]);

  const value = useMemo(() => ({
    theme: resolvedTheme,   // 解決済みテーマ ('dark' | 'light')
    mode,                   // ユーザー選択モード ('dark' | 'light' | 'system')
    setMode,                // モード直接設定
    setTheme: setMode,      // 後方互換性
    toggleTheme,            // 3モード切り替え
    cycleTheme,             // 3モード切り替え（明示的な名前）
    colors: themeColors,
    isDark: resolvedTheme === 'dark',
    isLight: resolvedTheme === 'light',
  }), [resolvedTheme, mode, themeColors, toggleTheme, cycleTheme]);

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

// カスタムフック
export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

export default ThemeContext;
