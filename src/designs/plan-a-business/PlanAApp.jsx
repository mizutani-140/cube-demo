/**
 * Plan A: Complete Corporate Site Application
 * 株式会社CUBE - LIFE × ART × BUILD
 *
 * キューブナビゲーション + 各ページ
 * 重力場吸い込み遷移演出付き
 */

import React, { useState, useCallback, useEffect, useRef } from 'react';
import { gsap } from 'gsap';

// Theme system
import { ThemeProvider, useTheme } from '../../shared/contexts';

// Responsive hooks
import { useBreakpoints } from '../../shared/hooks';

// Smooth scroll
import { useSmoothScroll } from '../../shared/animations';

// Main cube navigation
import BusinessCubeDesign from './BusinessCube';
// Retro terminal animation
import RetroTerminalAnimation from './RetroTerminalAnimation';
// Gravitational field background (Three.js)
import { GravitationalField } from '../../shared/components/backgrounds';

// Page components
import {
  WorksPage,
  AboutPage,
  NewsPage,
  ContactPage,
  AccessPage,
  ComingSoonPage,
} from '../../shared/components/pages';

// Navigation mapping
const PAGE_MAPPING = {
  works: 'works',
  about: 'about',
  access: 'access',
  contact: 'contact',
  lambchan: 'lambchan',
  lifenostalgia: 'lifenostalgia',
};

// ============================================
// Main Application Content (with theme access)
// ============================================

function PlanAContent({ initialPage = 'home' }) {
  const { colors, isDark } = useTheme();
  const { isMobile, prefersReducedMotion } = useBreakpoints();
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const containerRef = useRef(null);
  const flashOverlayRef = useRef(null);
  const gravityIntensityRef = useRef({ value: 0 });
  const cubeWarpRef = useRef({ active: false, rotX: 0, rotY: 0, rotZ: 0 });

  // Smooth scroll — only on content pages that scroll
  const isScrollPage = currentPage !== 'home' && currentPage !== 'cube';
  useSmoothScroll({ enabled: isScrollPage });

  // Theme-aware background color
  const bgColor = isDark ? '#0a0a12' : colors.bg.primary;

  // Handle navigation from cube faces - gravity warp transition
  const handleCubeNavigate = useCallback((business) => {
    if (isTransitioning) return;

    // Handle external links (lambchan, lifenostalgia)
    if (business.isExternal) {
      if (business.externalUrl) {
        window.open(business.externalUrl, '_blank', 'noopener,noreferrer');
      } else {
        console.log(`External link for ${business.shortTitle} not configured yet`);
      }
      return;
    }

    const targetPage = PAGE_MAPPING[business.id] || 'works';

    setIsTransitioning(true);
    document.body.style.pointerEvents = 'none';

    const container = document.querySelector('.plan-a-container');
    const cubeWrapper = document.querySelector('.cube-3d-wrapper');
    const cubeViewport = document.querySelector('.cube-viewport');
    const flashOverlay = flashOverlayRef.current;

    // prefers-reduced-motion: simple 0.3s opacity fade
    if (prefersReducedMotion) {
      gsap.to(container, {
        opacity: 0,
        duration: 0.3,
        ease: 'power2.inOut',
        onComplete: () => {
          setCurrentPage(targetPage);
          gsap.fromTo(container,
            { opacity: 0 },
            {
              opacity: 1,
              duration: 0.3,
              ease: 'power2.out',
              onComplete: () => {
                document.body.style.pointerEvents = '';
                setIsTransitioning(false);
              },
            }
          );
        },
      });
      return;
    }

    // ========================================================
    // Mobile version
    // 提示(0.5s) → 崩壊(0.75s) → ページ遷移
    // Three.js内部の立方体を直接回転させて本物の3D感を演出
    // CSS回転はCanvasの2D投影を歪めるだけでペラペラになるため、
    // 共有refを介してThree.jsのcubeRef.rotation を制御する。
    // ========================================================
    if (isMobile) {
      const hold = 0.5;
      const pull = 0.75;
      const dur = hold + pull;

      // Three.js立方体の現在の回転を取得（useFrameが毎フレーム書き込んでいる）
      const startRotX = cubeWarpRef.current.rotX;
      const startRotY = cubeWarpRef.current.rotY;
      const startRotZ = cubeWarpRef.current.rotZ;
      cubeWarpRef.current.active = true;

      const DEG = Math.PI / 180;
      const tl = gsap.timeline();

      // 穴の位置に収束するよう transformOrigin を設定
      // GravitationalField: camera=[0,45,25] fov=85, 事象の地平線=[0,-12,0]
      // → 画面上の投影位置 ≈ 50% 56%
      tl.set(cubeWrapper, { transformOrigin: '50% 56%' })

      // --- Three.js回転: 提示タンブル ---

      // 第1タンブル: 手前右に傾く（上面・右面が見える）
      .to(cubeWarpRef.current, {
        rotX: startRotX + (-15 * DEG),
        rotY: startRotY + (25 * DEG),
        rotZ: startRotZ + (5 * DEG),
        duration: hold * 0.5,
        ease: 'sine.inOut',
      }, 0)
      // 第2タンブル: 揺り返し（底面・左面が見える）
      .to(cubeWarpRef.current, {
        rotX: startRotX + (10 * DEG),
        rotY: startRotY + (-15 * DEG),
        rotZ: startRotZ + (-3 * DEG),
        duration: hold * 0.5,
        ease: 'sine.inOut',
      }, hold * 0.5)

      // --- Three.js回転: 崩壊スパイラル ---
      .to(cubeWarpRef.current, {
        rotX: `+=${270 * DEG}`,
        rotY: `-=${360 * DEG}`,
        rotZ: `+=${540 * DEG}`,
        duration: pull,
        ease: 'power4.in',
      }, hold)

      // --- CSS: スケール・位置 (cubeWrapper) ---
      // ※ scale と y はCanvasの2D変形で問題ない

      // 呼吸スケール
      .to(cubeWrapper, {
        scale: 1.05,
        duration: hold * 0.55,
        ease: 'sine.inOut',
      }, 0)
      .to(cubeWrapper, {
        scale: 1.0,
        duration: hold * 0.45,
        ease: 'sine.inOut',
      }, hold * 0.55)

      // 浮遊
      .to(cubeWrapper, {
        y: '-1vh',
        duration: hold,
        ease: 'sine.inOut',
      }, 0)

      // 重力場: かすかな予兆
      .to(gravityIntensityRef.current, {
        value: 0.03,
        duration: hold,
        ease: 'power1.in',
      }, 0)

      // 穴に向かって収束（transformOrigin='50% 56%' でスケール原点が穴の位置）
      .to(cubeWrapper, {
        scale: 0,
        y: '3vh',
        duration: pull,
        ease: 'power4.in',
      }, hold)

      // 立方体は scale:0 + transformOrigin で穴の位置に消滅する
      // opacity は変えない — 不透明のまま穴に吸い込まれる

      .to(gravityIntensityRef.current, {
        value: 0.65,
        duration: pull,
        ease: 'power2.in',
      }, hold)

      // フラッシュ
      .to(flashOverlay, {
        opacity: 0.5,
        duration: 0.08,
        ease: 'power2.in',
      }, dur - 0.04)
      .to(flashOverlay, {
        opacity: 0,
        duration: 0.12,
        ease: 'power2.out',
      }, dur + 0.04)

      // ページ切替
      .set(container, { opacity: 0 }, dur + 0.08)
      .call(() => {
        cubeWarpRef.current.active = false;
        cubeWarpRef.current.rotX = 0;
        cubeWarpRef.current.rotY = 0;
        cubeWarpRef.current.rotZ = 0;
        setCurrentPage(targetPage);
      }, null, dur + 0.08)
      .to(gravityIntensityRef.current, {
        value: 0,
        duration: 0.4,
        ease: 'power2.out',
      }, dur + 0.04)
      .to(container, {
        opacity: 1,
        duration: 0.3,
        ease: 'power3.out',
        onComplete: () => {
          gsap.set(container, { clearProps: 'all' });
          document.body.style.pointerEvents = '';
          setIsTransitioning(false);
        },
      }, dur + 0.12);

      return;
    }

    // ========================================================
    // Desktop animation
    // 提示(0.6s) → 崩壊(0.9s) → ページ遷移
    //
    // Three.js内部の立方体を直接回転 — 本物の3D立方体として見せる
    //
    // 提示: サイコロのように多軸でタンブルさせて立方体の形を見せる。
    //   第1タンブル(0.3s): 手前右に傾く → 上面・右面が露出
    //   第2タンブル(0.3s): 揺り返し → 底面・左面が露出
    //   キビキビと傾けて立方体であることを素早く認識させる。
    //
    // 崩壊: 各軸で異なる回転速度の暴力的スパイラル。
    //   X軸: 1回転(360°) — 縦の転がり
    //   Y軸: 1.5回転(540°) — 横の旋回
    //   Z軸: 2回転(720°) — 正面のスピン
    //   じわじわと引きずり込まれる感覚を長めに演出。
    //
    // ========================================================
    const hold = 0.6;
    const pull = 0.9;
    const dur = hold + pull;

    // Three.js立方体の現在の回転を取得（useFrameが毎フレーム書き込んでいる）
    const startRotX = cubeWarpRef.current.rotX;
    const startRotY = cubeWarpRef.current.rotY;
    const startRotZ = cubeWarpRef.current.rotZ;
    cubeWarpRef.current.active = true;

    const DEG = Math.PI / 180;
    const tl = gsap.timeline();

    // 穴の位置に収束するよう transformOrigin を設定
    // GravitationalField: camera=[0,45,25] fov=85, 事象の地平線=[0,-12,0]
    // → 画面上の投影位置 ≈ 50% 56%
    tl.set(cubeWrapper, { transformOrigin: '50% 56%' })

    // --- Three.js回転: 提示タンブル ---

    // 第1タンブル(0-0.3s): 手前右に傾く（上面・右面が露出）
    .to(cubeWarpRef.current, {
      rotX: startRotX + (-20 * DEG),
      rotY: startRotY + (30 * DEG),
      rotZ: startRotZ + (8 * DEG),
      duration: hold * 0.5,
      ease: 'sine.inOut',
    }, 0)
    // 第2タンブル(0.4-0.8s): 揺り返し（底面・左面が露出）
    .to(cubeWarpRef.current, {
      rotX: startRotX + (15 * DEG),
      rotY: startRotY + (-20 * DEG),
      rotZ: startRotZ + (-5 * DEG),
      duration: hold * 0.5,
      ease: 'sine.inOut',
    }, hold * 0.5)

    // --- Three.js回転: 崩壊スパイラル ---
    .to(cubeWarpRef.current, {
      rotX: `+=${360 * DEG}`,
      rotY: `-=${540 * DEG}`,
      rotZ: `+=${720 * DEG}`,
      duration: pull,
      ease: 'power4.in',
    }, hold)

    // --- CSS: スケール・位置 (cubeWrapper) ---
    // ※ scale と y はCanvasの2D変形で問題ない（ペラペラにならない）

    // 呼吸するスケール
    .to(cubeWrapper, {
      scale: 1.05,
      duration: hold * 0.55,
      ease: 'sine.inOut',
    }, 0)
    .to(cubeWrapper, {
      scale: 1.0,
      duration: hold * 0.45,
      ease: 'sine.inOut',
    }, hold * 0.55)

    // 浮遊 — 重力に抗う最後の瞬間
    .to(cubeWrapper, {
      y: '-1.2vh',
      duration: hold,
      ease: 'sine.inOut',
    }, 0)

    // 重力場: かすかな予兆
    .to(gravityIntensityRef.current, {
      value: 0.03,
      duration: hold,
      ease: 'power1.in',
    }, 0)

    // 穴に向かって収束（transformOrigin='50% 56%' でスケール原点が穴の位置）
    .to(cubeWrapper, {
      scale: 0,
      y: '3vh',
      duration: pull,
      ease: 'power4.in',
    }, hold)

    // 立方体は scale:0 + transformOrigin で穴の位置に消滅する
    // opacity は変えない — 不透明のまま穴に吸い込まれる

    // 重力場: 一気に増大
    .to(gravityIntensityRef.current, {
      value: 0.65,
      duration: pull,
      ease: 'power2.in',
    }, hold)

    // Flash — 崩壊完了の瞬間
    .to(flashOverlay, {
      opacity: 0.55,
      duration: 0.08,
      ease: 'power2.in',
    }, dur - 0.04)
    .to(flashOverlay, {
      opacity: 0,
      duration: 0.15,
      ease: 'power2.out',
    }, dur + 0.04)

    // Hide container, switch page
    .set(container, { opacity: 0 }, dur + 0.08)
    .call(() => {
      cubeWarpRef.current.active = false;
      cubeWarpRef.current.rotX = 0;
      cubeWarpRef.current.rotY = 0;
      cubeWarpRef.current.rotZ = 0;
      setCurrentPage(targetPage);
    }, null, dur + 0.12)

    // 重力正規化
    .to(gravityIntensityRef.current, {
      value: 0,
      duration: 0.5,
      ease: 'power2.out',
    }, dur + 0.04)

    // 新ページ着地
    .to(container, {
      opacity: 1,
      duration: 0.4,
      ease: 'power3.out',
      onComplete: () => {
        gsap.set(container, { clearProps: 'all' });
        document.body.style.pointerEvents = '';
        setIsTransitioning(false);
      },
    }, dur + 0.12);
  }, [isTransitioning, isMobile, prefersReducedMotion]);

  // Handle navigation from pages — stagger exit, dramatic entrance
  const handlePageNavigate = useCallback((page) => {
    if (isTransitioning) return;
    // Skip if navigating to the same page
    if (page === currentPage) return;

    setIsTransitioning(true);
    document.body.style.pointerEvents = 'none';

    const container = document.querySelector('.plan-a-container');
    const isPageToPage = page !== 'cube' && page !== 'home'
      && currentPage !== 'cube' && currentPage !== 'home';

    // Micro gravity pulse — environment responds to navigation
    gsap.to(gravityIntensityRef.current, {
      value: isPageToPage ? 0.06 : 0.12,
      duration: 0.2,
      ease: 'power2.in',
      onComplete: () => {
        gsap.to(gravityIntensityRef.current, {
          value: 0,
          duration: 0.6,
          ease: 'power2.out',
        });
      },
    });

    if (isPageToPage && !prefersReducedMotion && !isMobile) {
      // Desktop page-to-page: fluid horizontal slide transition
      // Phase 1: Slide current page out to the left
      gsap.to(container, {
        opacity: 0,
        x: -80,
        duration: 0.35,
        ease: 'power3.in',
        onComplete: () => {
          setCurrentPage(page);
          requestAnimationFrame(() => {
            // Phase 2: Slide new page in from the right
            gsap.fromTo(container,
              { opacity: 0, x: 80 },
              {
                opacity: 1,
                x: 0,
                duration: 0.45,
                ease: 'power3.out',
                onComplete: () => {
                  gsap.set(container, { clearProps: 'all' });
                  document.body.style.pointerEvents = '';
                  setIsTransitioning(false);
                },
              }
            );
          });
        },
      });

      // Subtle flash overlay during the swap for continuity
      gsap.to(flashOverlayRef.current, {
        opacity: 0.12,
        duration: 0.25,
        ease: 'power2.in',
        onComplete: () => {
          gsap.to(flashOverlayRef.current, {
            opacity: 0,
            duration: 0.4,
            ease: 'power2.out',
          });
        },
      });

    } else {
      // Page-to-cube / home navigation, or mobile / reduced motion
      // Gather page sections for stagger exit (bottom→top order)
      const sections = container
        ? Array.from(container.querySelectorAll('[data-animate-section], section'))
        : [];
      const reversedSections = [...sections].reverse(); // bottom→top

      if (reversedSections.length > 1 && !prefersReducedMotion) {
        // Stagger sections out from bottom to top
        gsap.to(reversedSections, {
          opacity: 0,
          y: -30,
          scale: 0.97,
          duration: 0.3,
          stagger: 0.04,
          ease: 'power2.in',
          onComplete: () => {
            setCurrentPage(page);
            requestAnimationFrame(() => {
              // Entrance: slide up from y: 30
              gsap.fromTo(container,
                { opacity: 0, y: 30 },
                {
                  opacity: 1,
                  y: 0,
                  duration: 0.5,
                  ease: 'power3.out',
                  onComplete: () => {
                    gsap.set(container, { clearProps: 'all' });
                    document.body.style.pointerEvents = '';
                    setIsTransitioning(false);
                  },
                }
              );
            });
          },
        });
      } else {
        // Fallback: simple container transition
        gsap.to(container, {
          opacity: 0,
          scale: 0.97,
          duration: 0.3,
          ease: 'power2.in',
          onComplete: () => {
            setCurrentPage(page);
            requestAnimationFrame(() => {
              gsap.fromTo(container,
                { opacity: 0, y: 30 },
                {
                  opacity: 1,
                  y: 0,
                  duration: 0.45,
                  ease: 'power3.out',
                  onComplete: () => {
                    gsap.set(container, { clearProps: 'all' });
                    document.body.style.pointerEvents = '';
                    setIsTransitioning(false);
                  },
                }
              );
            });
          },
        });
      }
    }
  }, [isTransitioning, currentPage, prefersReducedMotion, isMobile]);

  // Scroll to top on page change
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [currentPage]);

  // Keyboard navigation (Escape to go back)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        if (currentPage !== 'home' && currentPage !== 'cube') {
          // From any page, go back to cube
          handlePageNavigate('cube');
        } else if (currentPage === 'cube') {
          // From cube, go back to terminal
          handlePageNavigate('home');
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentPage, handlePageNavigate]);

  // Handle navigation from retro terminal — quick exit, lingering cube entrance
  const handleTerminalNavigate = useCallback(() => {
    if (isTransitioning) return;

    setIsTransitioning(true);
    document.body.style.pointerEvents = 'none';

    gsap.to('.plan-a-container', {
      opacity: 0,
      duration: 0.5,
      ease: 'power2.in',
      onComplete: () => {
        setCurrentPage('cube');
        gsap.to('.plan-a-container', {
          opacity: 1,
          duration: 0.7,
          ease: 'power3.out',
          onComplete: () => {
            document.body.style.pointerEvents = '';
            setIsTransitioning(false);
          },
        });
      },
    });
  }, [isTransitioning]);

  // Render current page
  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <RetroTerminalAnimation onNavigate={handleTerminalNavigate} />;
      case 'cube':
        return <BusinessCubeDesign onNavigate={handleCubeNavigate} cubeWarpRef={cubeWarpRef} />;
      case 'works':
        return <WorksPage onNavigate={handlePageNavigate} />;
      case 'about':
        return <AboutPage onNavigate={handlePageNavigate} />;
      case 'news':
        return <NewsPage onNavigate={handlePageNavigate} />;
      case 'contact':
        return <ContactPage onNavigate={handlePageNavigate} />;
      case 'access':
        return <AccessPage onNavigate={handlePageNavigate} />;
      case 'lambchan':
        return <ComingSoonPage businessId="lambchan" onNavigate={handlePageNavigate} />;
      case 'lifenostalgia':
        return <ComingSoonPage businessId="lifenostalgia" onNavigate={handlePageNavigate} />;
      default:
        return <RetroTerminalAnimation onNavigate={handleTerminalNavigate} />;
    }
  };

  // Scrollbar colors based on theme
  const scrollbarTrack = isDark ? '#0a0a12' : colors.bg.secondary;
  const scrollbarThumb = isDark ? 'rgba(212, 175, 55, 0.3)' : 'rgba(154, 122, 24, 0.3)';
  const scrollbarThumbHover = isDark ? 'rgba(212, 175, 55, 0.5)' : 'rgba(154, 122, 24, 0.5)';

  return (
    <div
      ref={containerRef}
      style={{
        width: '100vw',
        minHeight: '100vh',
        background: bgColor,
        position: 'relative',
        transition: 'background 0.4s ease',
      }}
    >
      {/* Gravitational Field - Three.jsによる重力場の3D表現 */}
      <GravitationalField
        isDark={isDark}
        transitionIntensityRef={gravityIntensityRef}
      />

      {/* Main Content */}
      <div
        className="plan-a-container"
        style={{
          width: '100%',
          minHeight: '100vh',
          position: 'relative',
          zIndex: 1,
        }}
      >
        {renderPage()}
      </div>

      {/* Flash overlay for absorption effect — theme-aware gradient */}
      <div
        ref={flashOverlayRef}
        style={{
          position: 'fixed',
          inset: 0,
          background: isDark
            ? 'radial-gradient(circle, rgba(212,175,55,0.8) 0%, rgba(255,200,50,0.4) 40%, transparent 70%)'
            : 'radial-gradient(circle, rgba(154,122,24,0.85) 0%, rgba(184,148,31,0.5) 40%, transparent 70%)',
          zIndex: 2,
          pointerEvents: 'none',
          opacity: 0,
        }}
      />

      {/* Global styles */}
      <style>{`
        html, body {
          margin: 0;
          padding: 0;
          background: ${bgColor};
          overflow-x: hidden;
          transition: background 0.4s ease;
        }

        * {
          box-sizing: border-box;
        }

        /* Scrollbar styling */
        ::-webkit-scrollbar {
          width: 8px;
        }

        ::-webkit-scrollbar-track {
          background: ${scrollbarTrack};
        }

        ::-webkit-scrollbar-thumb {
          background: ${scrollbarThumb};
          border-radius: 4px;
        }

        ::-webkit-scrollbar-thumb:hover {
          background: ${scrollbarThumbHover};
        }
      `}</style>
    </div>
  );
}

// ============================================
// Main Application (with ThemeProvider)
// ============================================

export default function PlanAApp({ initialPage = 'home' }) {
  return (
    <ThemeProvider>
      <PlanAContent initialPage={initialPage} />
    </ThemeProvider>
  );
}
