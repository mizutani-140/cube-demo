/**
 * Plan A: Complete Corporate Site Application
 * 株式会社CUBE - LIFE × ART × BUILD
 *
 * キューブナビゲーション + 各ページ
 */

import React, { useState, useCallback, useEffect, useRef } from 'react';
import { gsap } from 'gsap';

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
// Main Application
// ============================================

export default function PlanAApp({ initialPage = 'home' }) {
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const containerRef = useRef(null);

  // Handle navigation from cube faces
  const handleCubeNavigate = useCallback((business) => {
    if (isTransitioning) return;

    // Handle external links (lambchan, lifenostalgia)
    if (business.isExternal) {
      if (business.externalUrl) {
        window.open(business.externalUrl, '_blank', 'noopener,noreferrer');
      } else {
        // Placeholder: show alert if URL not set yet
        console.log(`External link for ${business.shortTitle} not configured yet`);
      }
      return;
    }

    const targetPage = PAGE_MAPPING[business.id] || 'works';

    setIsTransitioning(true);

    // Fade out transition
    gsap.to('.plan-a-container', {
      opacity: 0,
      duration: 0.4,
      ease: 'power2.inOut',
      onComplete: () => {
        setCurrentPage(targetPage);
        // Fade in
        gsap.to('.plan-a-container', {
          opacity: 1,
          duration: 0.4,
          ease: 'power2.out',
          onComplete: () => setIsTransitioning(false),
        });
      },
    });
  }, [isTransitioning]);

  // Handle navigation from pages
  const handlePageNavigate = useCallback((page) => {
    if (isTransitioning) return;

    setIsTransitioning(true);

    gsap.to('.plan-a-container', {
      opacity: 0,
      duration: 0.4,
      ease: 'power2.inOut',
      onComplete: () => {
        setCurrentPage(page);
        gsap.to('.plan-a-container', {
          opacity: 1,
          duration: 0.4,
          ease: 'power2.out',
          onComplete: () => setIsTransitioning(false),
        });
      },
    });
  }, [isTransitioning]);

  // Scroll to top on page change
  useEffect(() => {
    window.scrollTo(0, 0);
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

  // Handle navigation from retro terminal
  const handleTerminalNavigate = useCallback(() => {
    if (isTransitioning) return;

    setIsTransitioning(true);

    gsap.to('.plan-a-container', {
      opacity: 0,
      duration: 0.6,
      ease: 'power2.inOut',
      onComplete: () => {
        setCurrentPage('cube');
        gsap.to('.plan-a-container', {
          opacity: 1,
          duration: 0.6,
          ease: 'power2.out',
          onComplete: () => setIsTransitioning(false),
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
        return <BusinessCubeDesign onNavigate={handleCubeNavigate} />;
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

  return (
    <div
      ref={containerRef}
      style={{
        width: '100vw',
        minHeight: '100vh',
        background: '#0a0a12',
        position: 'relative',
      }}
    >
      {/* Gravitational Field - Three.jsによる重力場の3D表現 */}
      <GravitationalField />

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

      {/* Global styles */}
      <style>{`
        html, body {
          margin: 0;
          padding: 0;
          background: #0a0a12;
          overflow-x: hidden;
        }

        * {
          box-sizing: border-box;
        }

        /* Scrollbar styling */
        ::-webkit-scrollbar {
          width: 8px;
        }

        ::-webkit-scrollbar-track {
          background: #0a0a12;
        }

        ::-webkit-scrollbar-thumb {
          background: rgba(212, 175, 55, 0.3);
          border-radius: 4px;
        }

        ::-webkit-scrollbar-thumb:hover {
          background: rgba(212, 175, 55, 0.5);
        }
      `}</style>
    </div>
  );
}
