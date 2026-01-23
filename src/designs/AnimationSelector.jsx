/**
 * Animation Selector / Preview Component
 *
 * 3つのアニメーションデザインを切り替えて
 * プレビューできるセレクタコンポーネント
 */

import React, { useState, useCallback } from 'react';
import RetroTerminalAnimation from './plan-a-business/RetroTerminalAnimation';
import { InfiniteCorridorAnimation } from './plan-b-corridor';
import { DataConstructionAnimation } from './plan-c-matrix';

// Plan configurations
const PLANS = [
  {
    id: 'plan-a',
    name: 'Plan A',
    title: 'レトロターミナル',
    titleEn: 'Retro Terminal',
    concept: 'Retro / Nostalgic',
    description: 'レトロコンピュータ風のCRT画面にタイピングアニメーションでCUBEの理念を表示。スキャンラインとグローエフェクトで懐かしさを演出。',
    keywords: ['ターミナル', 'タイピング', 'CRT'],
    colors: {
      primary: '#00ff41',
      background: '#0a150a',
      accent: 'rgba(0, 255, 65, 0.6)',
    },
    impression: 'レトロ・ノスタルジック・テック',
    interaction: 'タイピングアニメーション',
    Component: RetroTerminalAnimation,
  },
  {
    id: 'plan-b',
    name: 'Plan B',
    title: '無限の回廊',
    titleEn: 'Infinite Corridor',
    concept: 'Intellectual / Structure',
    description: '12×12×12のワイヤーフレーム立方体が3D空間に浮遊。クリック時、カメラが指数関数的に加速しグリッド内を突き抜ける没入体験。',
    keywords: ['立方体グリッド', '没入感', 'カメラワーク'],
    colors: {
      primary: '#FFFFFF',
      background: '#000000',
      accent: 'rgba(255, 255, 255, 0.6)',
    },
    impression: '知的・構造的・洗練・没入',
    interaction: 'カメラ加速トランジション',
    Component: InfiniteCorridorAnimation,
  },
  {
    id: 'plan-c',
    name: 'Plan C',
    title: 'デジタルネイチャー',
    titleEn: 'Digital Nature',
    concept: 'Digital Nature / Colorful Life',
    description: '虹色のアイソメトリック立方体が高速で組み立てられ、巨大なキューブ構造を形成。完成後は微細な呼吸アニメーションで生命感を表現。',
    keywords: ['アイソメトリック', 'カラフル', '組み立て'],
    colors: {
      primary: '#FF6B6B',
      background: '#08080f',
      accent: 'linear-gradient(90deg, #FF6B6B, #4ECDC4, #A55EEA)',
    },
    impression: '生命力・多様性・デジタルネイチャー',
    interaction: '高速組み立てアニメーション',
    Component: DataConstructionAnimation,
  },
];

export default function AnimationSelector({ onSelect }) {
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [hoveredPlan, setHoveredPlan] = useState(null);

  const handlePlanSelect = useCallback((plan) => {
    setSelectedPlan(plan);
    setIsAnimating(true);
  }, []);

  const handleAnimationReady = useCallback(() => {
    console.log('Animation ready');
  }, []);

  const handleTransition = useCallback(() => {
    setIsAnimating(false);
    if (onSelect) {
      onSelect(selectedPlan);
    }
  }, [selectedPlan, onSelect]);

  const handleBack = useCallback(() => {
    setSelectedPlan(null);
    setIsAnimating(false);
  }, []);

  // Show selected animation
  if (selectedPlan && isAnimating) {
    const { Component } = selectedPlan;
    return (
      <div style={{ position: 'relative' }}>
        <Component
          onReady={handleAnimationReady}
          onTransition={handleTransition}
        />

        {/* Back button */}
        <button
          onClick={handleBack}
          style={{
            position: 'fixed',
            top: '20px',
            left: '20px',
            zIndex: 1000,
            background: 'rgba(255, 255, 255, 0.1)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            borderRadius: '4px',
            padding: '8px 16px',
            color: '#fff',
            fontSize: '12px',
            letterSpacing: '2px',
            cursor: 'pointer',
            fontFamily: '"Helvetica Neue", Arial, sans-serif',
            transition: 'all 0.3s ease',
          }}
          onMouseEnter={(e) => {
            e.target.style.background = 'rgba(255, 255, 255, 0.2)';
          }}
          onMouseLeave={(e) => {
            e.target.style.background = 'rgba(255, 255, 255, 0.1)';
          }}
        >
          ← BACK
        </button>
      </div>
    );
  }

  // Show selector UI
  return (
    <div
      style={{
        width: '100vw',
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0a0a12 0%, #1a1a2e 100%)',
        fontFamily: '"Helvetica Neue", Arial, sans-serif',
        color: '#fff',
        padding: '60px 40px',
        boxSizing: 'border-box',
      }}
    >
      {/* Header */}
      <header style={{ textAlign: 'center', marginBottom: '60px' }}>
        <h1 style={{
          fontSize: '14px',
          letterSpacing: '8px',
          color: 'rgba(255, 255, 255, 0.4)',
          fontWeight: 400,
          marginBottom: '20px',
        }}>
          ANIMATION DESIGN PROPOSALS
        </h1>
        <h2 style={{
          fontSize: '48px',
          fontWeight: 700,
          letterSpacing: '4px',
          marginBottom: '16px',
        }}>
          CUBE
        </h2>
        <p style={{
          fontSize: '14px',
          color: 'rgba(255, 255, 255, 0.5)',
          letterSpacing: '4px',
        }}>
          LIFE × ART × BUILD
        </p>
      </header>

      {/* Plans Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
        gap: '30px',
        maxWidth: '1200px',
        margin: '0 auto',
      }}>
        {PLANS.map((plan, index) => (
          <div
            key={plan.id}
            onClick={() => handlePlanSelect(plan)}
            onMouseEnter={() => setHoveredPlan(plan.id)}
            onMouseLeave={() => setHoveredPlan(null)}
            style={{
              background: hoveredPlan === plan.id
                ? `linear-gradient(135deg, ${plan.colors.background} 0%, rgba(26, 26, 46, 0.8) 100%)`
                : 'rgba(255, 255, 255, 0.03)',
              border: `1px solid ${hoveredPlan === plan.id ? plan.colors.primary : 'rgba(255, 255, 255, 0.1)'}`,
              borderRadius: '12px',
              padding: '30px',
              cursor: 'pointer',
              transition: 'all 0.4s ease',
              transform: hoveredPlan === plan.id ? 'translateY(-4px)' : 'none',
              boxShadow: hoveredPlan === plan.id
                ? `0 20px 40px rgba(0, 0, 0, 0.3), 0 0 30px ${plan.colors.accent}`
                : 'none',
            }}
          >
            {/* Plan header */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              marginBottom: '20px',
            }}>
              <div>
                <span style={{
                  fontSize: '11px',
                  color: plan.colors.primary,
                  letterSpacing: '3px',
                  opacity: 0.8,
                }}>
                  {plan.name.toUpperCase()}
                </span>
                <h3 style={{
                  fontSize: '28px',
                  fontWeight: 700,
                  margin: '8px 0 4px',
                  color: '#fff',
                }}>
                  {plan.title}
                </h3>
                <p style={{
                  fontSize: '12px',
                  color: 'rgba(255, 255, 255, 0.5)',
                  letterSpacing: '2px',
                }}>
                  {plan.titleEn}
                </p>
              </div>
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '50%',
                background: `${plan.colors.primary}20`,
                border: `1px solid ${plan.colors.primary}40`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '16px',
                fontWeight: 700,
                color: plan.colors.primary,
              }}>
                {String.fromCharCode(65 + index)}
              </div>
            </div>

            {/* Concept badge */}
            <div style={{
              display: 'inline-block',
              background: `${plan.colors.primary}15`,
              border: `1px solid ${plan.colors.primary}30`,
              borderRadius: '20px',
              padding: '6px 14px',
              marginBottom: '16px',
            }}>
              <span style={{
                fontSize: '10px',
                letterSpacing: '2px',
                color: plan.colors.primary,
              }}>
                {plan.concept}
              </span>
            </div>

            {/* Description */}
            <p style={{
              fontSize: '13px',
              lineHeight: 1.8,
              color: 'rgba(255, 255, 255, 0.7)',
              marginBottom: '20px',
            }}>
              {plan.description}
            </p>

            {/* Keywords */}
            <div style={{
              display: 'flex',
              gap: '8px',
              flexWrap: 'wrap',
              marginBottom: '20px',
            }}>
              {plan.keywords.map((keyword, i) => (
                <span
                  key={i}
                  style={{
                    fontSize: '10px',
                    color: 'rgba(255, 255, 255, 0.5)',
                    background: 'rgba(255, 255, 255, 0.05)',
                    padding: '4px 10px',
                    borderRadius: '4px',
                    letterSpacing: '1px',
                  }}
                >
                  {keyword}
                </span>
              ))}
            </div>

            {/* Details */}
            <div style={{
              borderTop: '1px solid rgba(255, 255, 255, 0.1)',
              paddingTop: '16px',
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '12px',
            }}>
              <div>
                <p style={{
                  fontSize: '9px',
                  color: 'rgba(255, 255, 255, 0.4)',
                  letterSpacing: '2px',
                  marginBottom: '4px',
                }}>
                  IMPRESSION
                </p>
                <p style={{
                  fontSize: '11px',
                  color: 'rgba(255, 255, 255, 0.7)',
                }}>
                  {plan.impression}
                </p>
              </div>
              <div>
                <p style={{
                  fontSize: '9px',
                  color: 'rgba(255, 255, 255, 0.4)',
                  letterSpacing: '2px',
                  marginBottom: '4px',
                }}>
                  INTERACTION
                </p>
                <p style={{
                  fontSize: '11px',
                  color: 'rgba(255, 255, 255, 0.7)',
                }}>
                  {plan.interaction}
                </p>
              </div>
            </div>

            {/* Preview button */}
            <div style={{
              marginTop: '20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              padding: '12px',
              background: hoveredPlan === plan.id ? `${plan.colors.primary}20` : 'transparent',
              border: `1px solid ${hoveredPlan === plan.id ? plan.colors.primary : 'rgba(255, 255, 255, 0.1)'}`,
              borderRadius: '6px',
              transition: 'all 0.3s ease',
            }}>
              <span style={{
                fontSize: '11px',
                letterSpacing: '3px',
                color: hoveredPlan === plan.id ? plan.colors.primary : 'rgba(255, 255, 255, 0.5)',
              }}>
                PREVIEW
              </span>
              <span style={{
                color: hoveredPlan === plan.id ? plan.colors.primary : 'rgba(255, 255, 255, 0.3)',
              }}>
                →
              </span>
            </div>

            {/* Color preview bar */}
            <div style={{
              marginTop: '16px',
              height: '3px',
              borderRadius: '2px',
              background: `linear-gradient(to right, ${plan.colors.background}, ${plan.colors.primary})`,
              opacity: hoveredPlan === plan.id ? 1 : 0.5,
              transition: 'opacity 0.3s ease',
            }} />
          </div>
        ))}
      </div>

      {/* Comparison table */}
      <div style={{
        maxWidth: '1200px',
        margin: '80px auto 0',
        padding: '30px',
        background: 'rgba(255, 255, 255, 0.02)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        borderRadius: '12px',
      }}>
        <h3 style={{
          fontSize: '12px',
          letterSpacing: '4px',
          color: 'rgba(255, 255, 255, 0.5)',
          marginBottom: '24px',
          textAlign: 'center',
        }}>
          COMPARISON
        </h3>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '1px',
          background: 'rgba(255, 255, 255, 0.1)',
          borderRadius: '8px',
          overflow: 'hidden',
        }}>
          {/* Header row */}
          {['', 'Plan A', 'Plan B', 'Plan C'].map((header, i) => (
            <div
              key={i}
              style={{
                padding: '14px',
                background: '#0a0a12',
                fontSize: '11px',
                letterSpacing: '2px',
                color: i === 0 ? 'rgba(255, 255, 255, 0.4)' : PLANS[i - 1]?.colors.primary || '#fff',
                fontWeight: i === 0 ? 400 : 600,
              }}
            >
              {header}
            </div>
          ))}

          {/* Data rows */}
          {[
            { label: 'コンセプト', values: PLANS.map(p => p.concept) },
            { label: '印象', values: PLANS.map(p => p.impression) },
            { label: 'インタラクション', values: PLANS.map(p => p.interaction) },
          ].map((row, rowIndex) => (
            <React.Fragment key={rowIndex}>
              <div style={{
                padding: '12px 14px',
                background: '#0a0a12',
                fontSize: '10px',
                color: 'rgba(255, 255, 255, 0.4)',
                letterSpacing: '1px',
              }}>
                {row.label}
              </div>
              {row.values.map((value, i) => (
                <div
                  key={i}
                  style={{
                    padding: '12px 14px',
                    background: '#0a0a12',
                    fontSize: '11px',
                    color: 'rgba(255, 255, 255, 0.7)',
                  }}
                >
                  {value}
                </div>
              ))}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer style={{
        textAlign: 'center',
        marginTop: '60px',
        padding: '20px',
      }}>
        <p style={{
          fontSize: '10px',
          color: 'rgba(255, 255, 255, 0.3)',
          letterSpacing: '2px',
        }}>
          2026 CUBE ANIMATION DESIGN PROPOSALS
        </p>
      </footer>

      <style>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        html {
          color-scheme: dark;
        }
        body {
          background: #0a0a12;
        }
      `}</style>
    </div>
  );
}
